import { relations } from 'drizzle-orm';
import { boolean, decimal, integer, json, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  orderNo: varchar('order_no', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).default('Pending'),
  paymentStatus: varchar('payment_status', { length: 50 }).default('Pending'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  subTotal: decimal('sub_total', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  grandTotal: decimal('grand_total', { precision: 10, scale: 2 }).notNull(),
  shippingDetails: json('shipping_details'),
  notes: text('notes'),
  orderDate: timestamp('order_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Order Details
export const orderDetails = pgTable('order_details', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Cart
export const carts = pgTable('carts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  mproductId: integer('mproduct_id'),
  productId: integer('product_id'),
  quantity: integer('quantity').notNull(),
  product: json('product'), // Store product details as JSON
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Pre-orders
export const preorders = pgTable('preorders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  orderNo: varchar('order_no', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).default('Pending'),
  paymentStatus: varchar('payment_status', { length: 50 }).default('Pending'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  subTotal: decimal('sub_total', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0'),
  grandTotal: decimal('grand_total', { precision: 10, scale: 2 }).notNull(),
  shippingDetails: json('shipping_details'),
  notes: text('notes'),
  orderDate: timestamp('order_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Pre-order Details
export const preorderDetails = pgTable('preorder_details', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Pre-order Cart
export const preorderCarts = pgTable('preorder_carts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  mproductId: integer('mproduct_id'),
  productId: integer('product_id'),
  quantity: integer('quantity').notNull(),
  product: json('product'), // Store product details as JSON
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Payments
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id'),
  preorderId: integer('preorder_id'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  transactionId: varchar('transaction_id', { length: 255 }),
  status: varchar('status', { length: 50 }).default('Pending'),
  paymentDate: timestamp('payment_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Payment Sheets (for accounting)
export const paymentSheets = pgTable('payment_sheets', {
  id: serial('id').primaryKey(),
  uid: integer('uid').notNull(), // Customer ID or other entity ID
  type: varchar('type', { length: 50 }).notNull(), // 'due', 'opening', 'dueincoming', etc.
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentFor: varchar('payment_for', { length: 50 }).notNull(), // 'customer', 'supplier', etc.
  description: text('description'),
  date: timestamp('date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Coupons
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  type: varchar('type', { length: 20 }).notNull(), // 'percentage', 'fixed'
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal('min_order_amount', { precision: 10, scale: 2 }),
  maxDiscount: decimal('max_discount', { precision: 10, scale: 2 }),
  usageLimit: integer('usage_limit'),
  usedCount: integer('used_count').default(0),
  isActive: boolean('is_active').default(true),
  validFrom: timestamp('valid_from'),
  validUntil: timestamp('valid_until'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Gift Vouchers
export const giftVouchers = pgTable('gift_vouchers', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  isUsed: boolean('is_used').default(false),
  usedBy: integer('used_by'), // User ID who used the voucher
  usedAt: timestamp('used_at'),
  validFrom: timestamp('valid_from'),
  validUntil: timestamp('valid_until'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Zones and Areas
export const zones = pgTable('zones', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userCities = pgTable('user_cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  zoneId: integer('zone_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userAreas = pgTable('user_areas', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  cityId: integer('city_id'),
  zoneId: integer('zone_id'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderDetails: many(orderDetails),
  payments: many(payments),
}));

export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
  order: one(orders, {
    fields: [orderDetails.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderDetails.productId],
    references: [products.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  mainProduct: one(mainProducts, {
    fields: [carts.mproductId],
    references: [mainProducts.id],
  }),
  product: one(products, {
    fields: [carts.productId],
    references: [products.id],
  }),
}));

export const preordersRelations = relations(preorders, ({ one, many }) => ({
  user: one(users, {
    fields: [preorders.userId],
    references: [users.id],
  }),
  preorderDetails: many(preorderDetails),
  payments: many(payments),
}));

export const preorderDetailsRelations = relations(preorderDetails, ({ one }) => ({
  preorder: one(preorders, {
    fields: [preorderDetails.orderId],
    references: [preorders.id],
  }),
  product: one(products, {
    fields: [preorderDetails.productId],
    references: [products.id],
  }),
}));

export const preorderCartsRelations = relations(preorderCarts, ({ one }) => ({
  user: one(users, {
    fields: [preorderCarts.userId],
    references: [users.id],
  }),
  mainProduct: one(mainProducts, {
    fields: [preorderCarts.mproductId],
    references: [mainProducts.id],
  }),
  product: one(products, {
    fields: [preorderCarts.productId],
    references: [products.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  preorder: one(preorders, {
    fields: [payments.preorderId],
    references: [preorders.id],
  }),
}));

export const zonesRelations = relations(zones, ({ many }) => ({
  userCities: many(userCities),
  userAreas: many(userAreas),
}));

export const userCitiesRelations = relations(userCities, ({ one, many }) => ({
  zone: one(zones, {
    fields: [userCities.zoneId],
    references: [zones.id],
  }),
  userAreas: many(userAreas),
}));

export const userAreasRelations = relations(userAreas, ({ one }) => ({
  city: one(userCities, {
    fields: [userAreas.cityId],
    references: [userCities.id],
  }),
  zone: one(zones, {
    fields: [userAreas.zoneId],
    references: [zones.id],
  }),
}));

// Import other schemas for relations
import { mainProducts, products } from './products';
import { users } from './users';

