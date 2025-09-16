import { pgTable, varchar, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseFields } from './base';
import { organizations } from './organizations';

export const suppliers = pgTable('suppliers', {
  ...baseFields,
  name: varchar('name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  website: varchar('website', { length: 500 }),
  paymentTerms: varchar('payment_terms', { length: 100 }),
});

// Relations
export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [suppliers.organizationId],
    references: [organizations.id],
  }),
  products: many(products),
}));

// Types
export type Supplier = typeof suppliers.$inferSelect;
export type CreateSupplier = typeof suppliers.$inferInsert;

// Import other schemas for relations (will be defined later)
import { products } from './products';
