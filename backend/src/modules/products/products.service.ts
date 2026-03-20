import { prisma } from "../../infrastructure/db/prisma";
import { AppError } from "../../shared/errors";

type ProductInput = {
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  inventory: number;
  categoryId?: string;
  isActive?: boolean;
  imageUrls?: string[];
};

export async function listProducts(page = 1, pageSize = 20, search?: string, categorySlug?: string) {
  const where = {
    isActive: true,
    ...(categorySlug
      ? {
          category: {
            slug: categorySlug,
            isActive: true,
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    meta: { page, pageSize, total },
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true },
  });

  if (!product || !product.isActive) {
    throw new AppError("Product not found", 404);
  }

  return product;
}

export async function createProduct(input: ProductInput) {
  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category || !category.isActive) {
      throw new AppError("Category not found", 404);
    }
  }

  return prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      priceCents: input.priceCents,
      inventory: input.inventory,
      categoryId: input.categoryId,
      isActive: input.isActive ?? true,
      images: {
        create: (input.imageUrls ?? []).map((url) => ({ url })),
      },
    },
    include: { images: true, category: true },
  });
}

export async function updateProduct(productId: string, input: Partial<ProductInput>) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category || !category.isActive) {
      throw new AppError("Category not found", 404);
    }
  }

  return prisma.product.update({
    where: { id: productId },
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description,
      priceCents: input.priceCents,
      inventory: input.inventory,
      categoryId: input.categoryId,
      isActive: input.isActive,
    },
    include: { images: true, category: true },
  });
}

export async function deleteProduct(productId: string) {
  const result = await prisma.product.deleteMany({ where: { id: productId } });
  if (result.count === 0) {
    throw new AppError("Product not found", 404);
  }
}
