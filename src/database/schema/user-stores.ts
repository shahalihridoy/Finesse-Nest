import { pgTable, varchar, jsonb, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseFieldsNoOrg } from './base';
import { users } from './users';
import { stores } from './stores';

export const userStores = pgTable('user_stores', {
  ...baseFieldsNoOrg,
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull().default('cashier'), // admin, manager, cashier
  permissions: jsonb('permissions').default('{}'),
});

// Relations
export const userStoresRelations = relations(userStores, ({ one }) => ({
  user: one(users, {
    fields: [userStores.userId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [userStores.storeId],
    references: [stores.id],
  }),
}));

// Types
export type UserStore = typeof userStores.$inferSelect;
export type CreateUserStore = typeof userStores.$inferInsert;
