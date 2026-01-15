import { PrismaClient } from "./generated/client/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import config from "../config/index.js";

if (!config.DB_HOST || config.DB_HOST.trim() === "") {
	throw new Error("DATABASE_URL environment variable is not set");
}

console.log({ config });

const adapter = new PrismaMariaDb({
	host: config.DB_HOST,
	port: config.DB_PORT,
	user: config.DB_USER,
	password: config.DB_PASSWORD,
	database: config.DB_NAME,
	allowPublicKeyRetrieval: true,
});

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
	// To survive hot reload during development
	globalForPrisma.prisma = prisma;
}

export default prisma;
