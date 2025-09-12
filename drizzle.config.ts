import { defineConfig } from "drizzle-kit";

// This file used for drizzle migrations, database schema and more
// This is not related to nest application
export default defineConfig({
  schema: "./src/database/schema/*",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432")
  },
  verbose: true,
  strict: true
});
