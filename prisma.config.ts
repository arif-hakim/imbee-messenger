import "dotenv/config";
import { defineConfig } from "prisma/config";

const dbHost = process.env.DB_HOST || "localhost";
const dbName = process.env.DB_NAME || "imbee_messenger";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";

const databaseUrl = `mysql://${dbUser}:${dbPassword}@${dbHost}:3306/${dbName}`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
