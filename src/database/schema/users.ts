import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 80 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 254 }).notNull().unique(),
  contact: varchar('contact', { length: 20 }).notNull().unique(),
  password: varchar('password', { length: 60 }).notNull(),
  userType: varchar('user_type', { length: 50 }).default('Customer'),
  isActive: boolean('is_active').default(false),
  otpCount: integer('otp_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  customerName: varchar('customer_name', { length: 255 }),
  contact: varchar('contact', { length: 20 }),
  email: varchar('email', { length: 254 }),
  cityId: integer('city_id'),
  areaId: integer('area_id'),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tokens = pgTable('tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  isRevoked: boolean('is_revoked').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const passwordResets = pgTable('password_resets', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 254 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  customer: one(customers, {
    fields: [users.id],
    references: [customers.userId],
  }),
  tokens: many(tokens),
  reviews: many(reviews),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  orders: many(orders),
  wishlists: many(wishlists),
  notifications: many(notifications),
}));

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));

// Import other schemas for relations
import { notifications } from './notifications';
import { orders } from './orders';
import { reviews, wishlists } from './products';

