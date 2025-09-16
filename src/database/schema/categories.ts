import { relations } from 'drizzle-orm';
import { integer, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { baseFields } from './base';
import { organizations } from './organizations';

export const categories = pgTable('categories', {
  ...baseFields,
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  description: text('description'),
  parentId: uuid('parent_id'),
  sortOrder: integer('sort_order').default(0),
});

// Relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [categories.organizationId],
    references: [organizations.id],
  }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  products: many(products),
}));

// Types
export type Category = typeof categories.$inferSelect;
export type CreateCategory = typeof categories.$inferInsert;

// Import other schemas for relations (will be defined later)
import { products } from './products';
