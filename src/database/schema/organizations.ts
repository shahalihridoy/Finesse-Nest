import { relations } from 'drizzle-orm';
import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { baseFieldsNoOrg } from './base';

export const organizations = pgTable('organizations', {
  ...baseFieldsNoOrg,
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  currency: varchar('currency', { length: 3 }).default('USD'),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  stores: many(stores),
  products: many(products),
  categories: many(categories),
  brands: many(brands),
  suppliers: many(suppliers),
  customers: many(customers),
  orders: many(orders),
  auditLogs: many(auditLogs),
}));

// Types
export type Organization = typeof organizations.$inferSelect;
export type CreateOrganization = typeof organizations.$inferInsert;

// Import other schemas for relations (will be defined later)
import { auditLogs } from './audit-logs';
import { brands } from './brands';
import { categories } from './categories';
import { customers } from './customers';
import { orders } from './orders';
import { products } from './products';
import { stores } from './stores';
import { suppliers } from './suppliers';
import { users } from './users';
