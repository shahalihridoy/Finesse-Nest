import { pgTable, varchar, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseFields } from './base';
import { organizations } from './organizations';

export const brands = pgTable('brands', {
  ...baseFields,
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  description: text('description'),
  logoUrl: varchar('logo_url', { length: 500 }),
  website: varchar('website', { length: 500 }),
});

// Relations
export const brandsRelations = relations(brands, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [brands.organizationId],
    references: [organizations.id],
  }),
  products: many(products),
}));

// Types
export type Brand = typeof brands.$inferSelect;
export type CreateBrand = typeof brands.$inferInsert;

// Import other schemas for relations (will be defined later)
import { products } from './products';
