import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schema/*",
  out: "./src/database/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL
    // host: process.env.DB_HOST || "localhost",
    // port: parseInt(process.env.DB_PORT || "5432"),
    // user: process.env.DB_USER || "postgres",
    // password: process.env.DB_PASSWORD || "",
    // database: process.env.DB_DATABASE || "finesse_db",
    // ssl: true
  },
  verbose: true,
  strict: true
});
