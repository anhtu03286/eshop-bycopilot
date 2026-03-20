import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "../../infrastructure/db/prisma";
import { AppError } from "../../shared/errors";

export async function createOrderFromCart(userId: string) {
  const activeCart = await prisma.cart.findFirst({
    where: { userId, isActive: true },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!activeCart || activeCart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  const totalCents = activeCart.items.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);

  const order = await prisma.$transaction(async (tx) => {
    for (const item of activeCart.items) {
      if (!item.product.isActive || item.product.inventory < item.quantity) {
        throw new AppError(`Insufficient inventory for ${item.product.name}`, 400);
      }

      await tx.product.update({
        where: { id: item.productId },
        data: { inventory: { decrement: item.quantity } },
      });
    }

    const created = await tx.order.create({
      data: {
        userId,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        totalCents,
        items: {
          create: activeCart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
          })),
        },
      },
      include: { items: true },
    });

    await tx.cart.update({
      where: { id: activeCart.id },
      data: { isActive: false },
    });

    return created;
  });

  return order;
}

export async function listOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function listAllOrders() {
  return prisma.order.findMany({
    include: {
      items: true,
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true, paymentRecords: true },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
}

export async function getOrderAsAdmin(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      paymentRecords: true,
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      items: true,
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
    },
  });
}
