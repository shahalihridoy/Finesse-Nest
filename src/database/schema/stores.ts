import { pgTable, varchar, text, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseFields } from './base';
import { organizations } from './organizations';

export const stores = pgTable('stores', {
  ...baseFields,
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  description: text('description'),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  taxRate: decimal('tax_rate', { precision: 5, scale: 4 }).default('0.0000'),
  currency: varchar('currency', { length: 3 }).default('USD'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
});

// Relations
export const storesRelations = relations(stores, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [stores.organizationId],
    references: [organizations.id],
  }),
  userStores: many(userStores),
  storeInventory: many(storeInventory),
  orders: many(orders),
}));

// Types
export type Store = typeof stores.$inferSelect;
export type CreateStore = typeof stores.$inferInsert;

// Import other schemas for relations (will be defined later)
import { userStores } from './user-stores';
import { storeInventory } from './inventory';
import { orders } from './orders';
