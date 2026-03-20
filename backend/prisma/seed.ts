import { Role } from "@prisma/client";
import argon2 from "argon2";
import { prisma } from "../src/infrastructure/db/prisma";

const categorySeeds = [
  { slug: "tops", name: "Tops", description: "Daily staples and layering essentials" },
  { slug: "outerwear", name: "Outerwear", description: "Jackets and seasonal layers" },
  { slug: "denim", name: "Denim", description: "Denim pieces for casual and smart looks" },
  { slug: "accessories", name: "Accessories", description: "Finishing pieces and carry goods" },
] as const;

function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildProductSeed(categorySlug: string, index: number) {
  const categoryName = titleCase(categorySlug);
  const number = String(index + 1).padStart(2, "0");
  const family = index % 3;
  const variantLabel = family === 0 ? "Classic" : family === 1 ? "Relaxed" : "Modern";

  return {
    slug: `${categorySlug}-${variantLabel.toLowerCase()}-${number}`,
    name: `${categoryName} ${variantLabel} ${number}`,
    description: `${categoryName} ${variantLabel.toLowerCase()} piece built for everyday wear and easy styling.`,
    priceCents: 2500 + index * 350,
    inventory: 15 + ((index * 7) % 85),
  };
}

async function seed() {
  const adminEmail = "admin@fashion.local";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await argon2.hash("AdminPass123!");
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
      },
    });
  }

  const categories = await Promise.all(
    categorySeeds.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
          isActive: true,
        },
        create: {
          slug: category.slug,
          name: category.name,
          description: category.description,
          isActive: true,
        },
      }),
    ),
  );

  for (const category of categories) {
    for (let i = 0; i < 30; i += 1) {
      const product = buildProductSeed(category.slug, i);
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          name: product.name,
          description: product.description,
          priceCents: product.priceCents,
          inventory: product.inventory,
          isActive: true,
          categoryId: category.id,
        },
        create: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          priceCents: product.priceCents,
          inventory: product.inventory,
          isActive: true,
          categoryId: category.id,
        },
      });
    }
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
