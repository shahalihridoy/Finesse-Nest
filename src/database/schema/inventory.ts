import { pgTable, integer, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseFieldsNoOrg } from './base';
import { stores } from './stores';
import { products } from './products';

export const storeInventory = pgTable('store_inventory', {
  ...baseFieldsNoOrg,
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(0),
  reservedQuantity: integer('reserved_quantity').default(0),
  lastRestockedAt: timestamp('last_restocked_at'),
});

// Relations
export const storeInventoryRelations = relations(storeInventory, ({ one }) => ({
  store: one(stores, {
    fields: [storeInventory.storeId],
    references: [stores.id],
  }),
  product: one(products, {
    fields: [storeInventory.productId],
    references: [products.id],
  }),
}));

// Types
export type StoreInventory = typeof storeInventory.$inferSelect;
export type CreateStoreInventory = typeof storeInventory.$inferInsert;
