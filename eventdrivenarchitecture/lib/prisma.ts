import { PrismaClient } from "@/app/generated/prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({} as any);
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

type prismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
