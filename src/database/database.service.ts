import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private db!: NodePgDatabase<typeof schema>;
  private pool!: Pool;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    try {
      // Construct database URL from environment variables
      const dbUrl =
        this.configService.get<string>("DB_URL") ||
        `postgresql://${this.configService.get<string>("DB_USER", "postgres")}:${this.configService.get<string>("DB_PASSWORD", "")}@${this.configService.get<string>("DB_HOST", "localhost")}:${this.configService.get<string>("DB_PORT", "5432")}/${this.configService.get<string>("DB_DATABASE", "finesse_db")}`;

      console.log("Attempting to connect to database...");
      console.log("Database URL:", dbUrl.replace(/\/\/.*@/, "//***:***@")); // Hide credentials in logs

      this.pool = new Pool({
        connectionString: dbUrl,
        ssl:
          this.configService.get<string>("NODE_ENV") === "production"
            ? { rejectUnauthorized: false }
            : false
      });

      this.db = drizzle(this.pool, { schema });

      console.log("Database connection established successfully");
      console.log("Database instance created:", !!this.db);
    } catch (error) {
      console.error("Failed to initialize database connection:", error);
      throw error;
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error(
        "Database not initialized. Make sure DatabaseService is properly configured."
      );
    }
    return this.db;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
