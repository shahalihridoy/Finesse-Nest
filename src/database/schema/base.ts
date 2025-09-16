import { boolean, timestamp, uuid } from "drizzle-orm/pg-core";

// Base fields that are common to most tables
export const baseFields = {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
};

// Base fields without organizationId (for junction tables)
export const baseFieldsNoOrg = {
  id: uuid("id").primaryKey().defaultRandom(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
};

// Utility function to create soft delete condition
export const softDeleteCondition = (table: any) => ({
  isActive: true,
  deletedAt: null
});

// Utility function to create organization condition
export const organizationCondition = (organizationId: string) => ({
  organizationId,
  isActive: true,
  deletedAt: null
});
