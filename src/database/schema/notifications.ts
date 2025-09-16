import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { baseFieldsNoOrg } from "./base";

// Notifications
export const notifications = pgTable("notifications", {
  ...baseFieldsNoOrg,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("info"), // 'info', 'success', 'warning', 'error'
  seen: boolean("seen").default(false)
});

// Settings
export const settings = pgTable("settings", {
  ...baseFieldsNoOrg,
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  description: text("description")
});

// FAQ
export const faqs = pgTable("faqs", {
  ...baseFieldsNoOrg,
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").default(0)
});

// Contact Us
export const contactUs = pgTable("contact_us", {
  ...baseFieldsNoOrg,
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("pending") // 'pending', 'replied', 'closed'
});

// Reports
export const reports = pgTable("reports", {
  ...baseFieldsNoOrg,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // 'bug', 'feature', 'other'
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).default("pending") // 'pending', 'in_progress', 'resolved'
});

// Policy Pages
export const policyPages = pgTable("policy_pages", {
  ...baseFieldsNoOrg,
  title: varchar("title", { length: 255 }).notNull(),
  routeName: varchar("route_name", { length: 255 }).notNull().unique(),
  content: text("content").notNull()
});

// Landing Page Components
export const mainSliders = pgTable("main_sliders", {
  ...baseFieldsNoOrg,
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 255 }),
  image: varchar("image", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }),
  order: integer("order").default(0)
});

export const topPromotionalSliders = pgTable("top_promotional_sliders", {
  ...baseFieldsNoOrg,
  title: varchar("title", { length: 255 }),
  image: varchar("image", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }),
  order: integer("order").default(0)
});

export const middleBanners = pgTable("middle_banners", {
  ...baseFieldsNoOrg,
  title: varchar("title", { length: 255 }),
  image: varchar("image", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }),
  order: integer("order").default(0)
});

export const middlePromotionalCards = pgTable("middle_promotional_cards", {
  ...baseFieldsNoOrg,
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 255 }),
  image: varchar("image", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }),
  order: integer("order").default(0)
});

export const landingPageSettings = pgTable("landing_page_settings", {
  ...baseFieldsNoOrg,
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  description: text("description")
});

// Menu specific sliders and banners
export const menuMainSliders = pgTable("menu_main_sliders", {
  ...baseFieldsNoOrg,
  menuId: uuid("menu_id").notNull(),
  title: varchar("title", { length: 255 }),
  image: varchar("image", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }),
  order: integer("order").default(0)
});

export const menuMiddleBanners = pgTable("menu_middle_banners", {
  ...baseFieldsNoOrg,
  menuId: uuid("menu_id").notNull(),
  title: varchar("title", { length: 255 }),
  image: varchar("image", { length: 500 }).notNull(),
  link: varchar("link", { length: 500 }),
  order: integer("order").default(0)
});

// Bonus system
export const bonuses = pgTable("bonuses", {
  ...baseFieldsNoOrg,
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'earned', 'redeemed', 'expired'
  description: text("description"),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "set null"
  }) // Reference to order if bonus is from purchase
});

// Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id]
  })
}));

export const menuMainSlidersRelations = relations(
  menuMainSliders,
  ({ one }) => ({
    menu: one(menus, {
      fields: [menuMainSliders.menuId],
      references: [menus.id]
    })
  })
);

export const menuMiddleBannersRelations = relations(
  menuMiddleBanners,
  ({ one }) => ({
    menu: one(menus, {
      fields: [menuMiddleBanners.menuId],
      references: [menus.id]
    })
  })
);

export const bonusesRelations = relations(bonuses, ({ one }) => ({
  customer: one(customers, {
    fields: [bonuses.customerId],
    references: [customers.id]
  })
}));

// Import other schemas for relations
import { orders } from "./orders";
import { menus } from "./products";
import { customers, users } from "./users";
