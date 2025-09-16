import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { baseFieldsNoOrg } from "./base";

export const users = pgTable("users", {
  ...baseFieldsNoOrg,
  username: varchar("username", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 254 }).notNull().unique(),
  contact: varchar("contact", { length: 20 }).notNull().unique(),
  password: varchar("password", { length: 60 }).notNull(),
  userType: varchar("user_type", { length: 50 }).default("Customer"),
  otpCount: integer("otp_count").default(0)
});

export const customers = pgTable("customers", {
  ...baseFieldsNoOrg,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  customerName: varchar("customer_name", { length: 255 }),
  contact: varchar("contact", { length: 20 }),
  email: varchar("email", { length: 254 }),
  cityId: uuid("city_id"),
  areaId: uuid("area_id"),
  address: text("address")
});

export const tokens = pgTable("tokens", {
  ...baseFieldsNoOrg,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  isRevoked: boolean("is_revoked").default(false)
});

export const passwordResets = pgTable("password_resets", {
  ...baseFieldsNoOrg,
  email: varchar("email", { length: 254 }).notNull(),
  token: varchar("token", { length: 255 }).notNull()
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  customer: one(customers, {
    fields: [users.id],
    references: [customers.userId]
  }),
  tokens: many(tokens),
  reviews: many(reviews)
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id]
  }),
  orders: many(orders),
  wishlists: many(wishlists),
  notifications: many(notifications)
}));

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id]
  })
}));

// Import other schemas for relations
import { notifications } from "./notifications";
import { orders } from "./orders";
import { reviews, wishlists } from "./products";
