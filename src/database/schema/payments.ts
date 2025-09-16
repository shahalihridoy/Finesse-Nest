import { pgTable, decimal, varchar, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseFieldsNoOrg } from './base';
import { orders } from './orders';

export const payments = pgTable('payments', {
  ...baseFieldsNoOrg,
  orderId: uuid('order_id').notNull().references(() => orders.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // cash, card, bank_transfer, etc.
  paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('pending'), // pending, completed, failed, refunded
  transactionId: varchar('transaction_id', { length: 255 }),
  gatewayResponse: jsonb('gateway_response'),
  processedAt: timestamp('processed_at'),
});

// Relations
export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

// Types
export type Payment = typeof payments.$inferSelect;
export type CreatePayment = typeof payments.$inferInsert;
