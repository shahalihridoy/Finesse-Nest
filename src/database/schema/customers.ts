import { pgTable, varchar, text, decimal, date, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseFields } from './base';
import { organizations } from './organizations';

export const customers = pgTable('customers', {
  ...baseFields,
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  postalCode: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 100 }),
  dateOfBirth: date('date_of_birth'),
  loyaltyPoints: integer('loyalty_points').default(0),
  totalSpent: decimal('total_spent', { precision: 12, scale: 2 }).default('0.00'),
  lastPurchaseAt: timestamp('last_purchase_at'),
});

// Relations
export const customersRelations = relations(customers, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [customers.organizationId],
    references: [organizations.id],
  }),
  orders: many(orders),
}));

// Types
export type Customer = typeof customers.$inferSelect;
export type CreateCustomer = typeof customers.$inferInsert;

// Import other schemas for relations (will be defined later)
import { orders } from './orders';
