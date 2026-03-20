import { PaymentStatus } from "@prisma/client";
import Stripe from "stripe";
import { prisma } from "../../infrastructure/db/prisma";
import { env } from "../../shared/config/env";
import { AppError } from "../../shared/errors";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.paymentStatus === PaymentStatus.SUCCEEDED) {
    throw new AppError("Order already paid", 400);
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: order.currency,
      unit_amount: item.unitPriceCents,
      product_data: {
        name: item.productName,
      },
    },
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${env.CLIENT_ORIGIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.CLIENT_ORIGIN}/checkout/cancel`,
    client_reference_id: order.id,
    metadata: {
      orderId: order.id,
      userId,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return session;
}

export async function handleWebhook(rawBody: Buffer, signature: string) {
  const event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);

  const existingEvent = await prisma.paymentRecord.findUnique({
    where: { stripeEventId: event.id },
  });

  if (existingEvent) {
    return { received: true, duplicate: true };
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId ?? session.client_reference_id;
    if (!orderId) {
      throw new AppError("Missing order reference in session", 400);
    }

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) {
        throw new AppError("Order not found", 404);
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: PaymentStatus.SUCCEEDED,
          status: "PAID",
        },
      });

      await tx.paymentRecord.create({
        data: {
          orderId,
          stripeEventId: event.id,
          stripePaymentIntentId: session.payment_intent?.toString(),
          amountCents: order.totalCents,
          status: PaymentStatus.SUCCEEDED,
        },
      });
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const order = await prisma.order.findFirst({
      where: { stripeSessionId: { not: null } },
      orderBy: { createdAt: "desc" },
    });

    if (order) {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { paymentStatus: PaymentStatus.FAILED },
        });

        await tx.paymentRecord.create({
          data: {
            orderId: order.id,
            stripeEventId: event.id,
            stripePaymentIntentId: intent.id,
            amountCents: order.totalCents,
            status: PaymentStatus.FAILED,
          },
        });
      });
    }
  }

  return { received: true };
}
