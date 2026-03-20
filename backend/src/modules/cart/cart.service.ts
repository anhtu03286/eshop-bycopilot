import { prisma } from "../../infrastructure/db/prisma";
import { AppError } from "../../shared/errors";

async function getOrCreateActiveCart(userId: string) {
  const existing = await prisma.cart.findFirst({
    where: { userId, isActive: true },
    include: { items: { include: { product: true } } },
  });

  if (existing) {
    return existing;
  }

  return prisma.cart.create({
    data: { userId, isActive: true },
    include: { items: { include: { product: true } } },
  });
}

function computeTotal(items: Array<{ quantity: number; unitPriceCents: number }>) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
}

export async function getCart(userId: string) {
  const cart = await getOrCreateActiveCart(userId);
  return {
    ...cart,
    totalCents: computeTotal(cart.items),
  };
}

export async function addItem(userId: string, productId: string, quantity: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    throw new AppError("Product not found", 404);
  }

  if (product.inventory < quantity) {
    throw new AppError("Insufficient inventory", 400);
  }

  const cart = await getOrCreateActiveCart(userId);

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: {
      cartId: cart.id,
      productId,
      quantity,
      unitPriceCents: product.priceCents,
    },
    update: {
      quantity: { increment: quantity },
      unitPriceCents: product.priceCents,
    },
  });

  return getCart(userId);
}

export async function updateItem(userId: string, productId: string, quantity: number) {
  if (quantity <= 0) {
    throw new AppError("Quantity must be positive", 400);
  }

  const cart = await getOrCreateActiveCart(userId);
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (!existing) {
    throw new AppError("Cart item not found", 404);
  }

  await prisma.cartItem.update({
    where: { id: existing.id },
    data: { quantity },
  });

  return getCart(userId);
}

export async function removeItem(userId: string, productId: string) {
  const cart = await getOrCreateActiveCart(userId);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId },
  });

  return getCart(userId);
}
