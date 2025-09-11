import { relations } from 'drizzle-orm';
import { boolean, decimal, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).default('info'), // 'info', 'success', 'warning', 'error'
  seen: boolean('seen').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Settings
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// FAQ
export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Contact Us
export const contactUs = pgTable('contact_us', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'replied', 'closed'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Reports
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'bug', 'feature', 'other'
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'in_progress', 'resolved'
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Policy Pages
export const policyPages = pgTable('policy_pages', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  routeName: varchar('route_name', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Landing Page Components
export const mainSliders = pgTable('main_sliders', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  subtitle: varchar('subtitle', { length: 255 }),
  image: varchar('image', { length: 500 }).notNull(),
  link: varchar('link', { length: 500 }),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const topPromotionalSliders = pgTable('top_promotional_sliders', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  image: varchar('image', { length: 500 }).notNull(),
  link: varchar('link', { length: 500 }),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const middleBanners = pgTable('middle_banners', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  image: varchar('image', { length: 500 }).notNull(),
  link: varchar('link', { length: 500 }),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const middlePromotionalCards = pgTable('middle_promotional_cards', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  subtitle: varchar('subtitle', { length: 255 }),
  image: varchar('image', { length: 500 }).notNull(),
  link: varchar('link', { length: 500 }),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const landingPageSettings = pgTable('landing_page_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Menu specific sliders and banners
export const menuMainSliders = pgTable('menu_main_sliders', {
  id: serial('id').primaryKey(),
  menuId: integer('menu_id').notNull(),
  title: varchar('title', { length: 255 }),
  image: varchar('image', { length: 500 }).notNull(),
  link: varchar('link', { length: 500 }),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const menuMiddleBanners = pgTable('menu_middle_banners', {
  id: serial('id').primaryKey(),
  menuId: integer('menu_id').notNull(),
  title: varchar('title', { length: 255 }),
  image: varchar('image', { length: 500 }).notNull(),
  link: varchar('link', { length: 500 }),
  order: integer('order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Bonus system
export const bonuses = pgTable('bonuses', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'earned', 'redeemed', 'expired'
  description: text('description'),
  orderId: integer('order_id'), // Reference to order if bonus is from purchase
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));

export const menuMainSlidersRelations = relations(menuMainSliders, ({ one }) => ({
  menu: one(menus, {
    fields: [menuMainSliders.menuId],
    references: [menus.id],
  }),
}));

export const menuMiddleBannersRelations = relations(menuMiddleBanners, ({ one }) => ({
  menu: one(menus, {
    fields: [menuMiddleBanners.menuId],
    references: [menus.id],
  }),
}));

export const bonusesRelations = relations(bonuses, ({ one }) => ({
  customer: one(customers, {
    fields: [bonuses.customerId],
    references: [customers.id],
  }),
}));

// Import other schemas for relations
import { menus } from './products';
import { customers, users } from './users';

