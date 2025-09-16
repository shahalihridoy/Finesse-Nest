import { relations } from "drizzle-orm";
import { decimal, integer, pgTable, uuid } from "drizzle-orm/pg-core";
import { baseFieldsNoOrg } from "./base";
import { orders } from "./orders";
import { products, productVariations } from "./products";

export const orderItems = pgTable("order_items", {
  ...baseFieldsNoOrg,
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id), // Optional for variant products
  variantId: uuid("variant_id").references(() => productVariations.id), // Optional for standard products
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", {
    precision: 10,
    scale: 2
  }).default("0.00"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull()
});

// Relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  }),
  variant: one(productVariations, {
    fields: [orderItems.variantId],
    references: [productVariations.id]
  })
}));

// Types
export type OrderItem = typeof orderItems.$inferSelect;
export type CreateOrderItem = typeof orderItems.$inferInsert;
