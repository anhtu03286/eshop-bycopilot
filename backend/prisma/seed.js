"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const prisma_1 = require("../src/infrastructure/db/prisma");
async function seed() {
    const adminEmail = "admin@fashion.local";
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
        const passwordHash = await argon2_1.default.hash("AdminPass123!");
        await prisma_1.prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash,
                role: client_1.Role.ADMIN,
            },
        });
    }
    await prisma_1.prisma.product.createMany({
        data: [
            {
                name: "Classic White Tee",
                slug: "classic-white-tee",
                description: "Essential cotton t-shirt",
                priceCents: 2500,
                inventory: 100,
            },
            {
                name: "Denim Jacket",
                slug: "denim-jacket",
                description: "Indigo denim jacket",
                priceCents: 8500,
                inventory: 40,
            },
        ],
        skipDuplicates: true,
    });
}
seed()
    .then(async () => {
    await prisma_1.prisma.$disconnect();
})
    .catch(async (err) => {
    console.error(err);
    await prisma_1.prisma.$disconnect();
    process.exit(1);
});
