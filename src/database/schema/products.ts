import { relations } from 'drizzle-orm';
import { boolean, decimal, integer, json, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// Menu and Category Tables
export const menus = pgTable('menus', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  menuId: integer('menu_id').notNull(),
  groupName: varchar('group_name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').notNull(),
  menuId: integer('menu_id').notNull(),
  catName: varchar('cat_name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const brands = pgTable('brands', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }),
  logo: varchar('logo', { length: 500 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Main Products Table
export const mainProducts = pgTable('main_products', {
  id: serial('id').primaryKey(),
  menuId: integer('menu_id').notNull(),
  groupId: integer('group_id').notNull(),
  categoryId: integer('category_id').notNull(),
  brandId: integer('brand_id'),
  productName: varchar('product_name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }),
  productImage: varchar('product_image', { length: 500 }),
  model: varchar('model', { length: 255 }),
  sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 5, scale: 2 }).default('0'),
  briefDescription: text('brief_description'),
  description: text('description'),
  images: json('images'),
  isNew: boolean('is_new').default(false),
  isFeatured: boolean('is_featured').default(false),
  isAvailable: boolean('is_available').default(true),
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Product Variations
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  mproductId: integer('mproduct_id').notNull(),
  groupId: integer('group_id').notNull(),
  categoryId: integer('category_id').notNull(),
  brandId: integer('brand_id'),
  productName: varchar('product_name', { length: 255 }).notNull(),
  model: varchar('model', { length: 255 }),
  variation: json('variation'),
  sellingPrice: decimal('selling_price', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 5, scale: 2 }).default('0'),
  stock: integer('stock').default(0),
  isAvailable: boolean('is_available').default(true),
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Product Images
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  alt: varchar('alt', { length: 255 }),
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Product Tags
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productTags = pgTable('product_tags', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  tagId: integer('tag_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Reviews
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  userId: integer('user_id').notNull(),
  reviewerId: integer('reviewer_id').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  images: json('images'),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Wishlists
export const wishlists = pgTable('wishlists', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  productId: integer('product_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Product Variations (for complex product variations)
export const productVariations = pgTable('product_variations', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  variationName: varchar('variation_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productVariationValues = pgTable('product_variation_values', {
  id: serial('id').primaryKey(),
  pvariationId: integer('pvariation_id').notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productVariationImages = pgTable('product_variation_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  alt: varchar('alt', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Stock Management
export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  mainBranch: boolean('main_branch').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  storeId: integer('store_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  purchaseDate: timestamp('purchase_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sellings = pgTable('sellings', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull(),
  storeId: integer('store_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }),
  saleDate: timestamp('sale_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const menusRelations = relations(menus, ({ many }) => ({
  groups: many(groups),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  menu: one(menus, {
    fields: [groups.menuId],
    references: [menus.id],
  }),
  categories: many(categories),
  mainProducts: many(mainProducts),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  group: one(groups, {
    fields: [categories.groupId],
    references: [groups.id],
  }),
  menu: one(menus, {
    fields: [categories.menuId],
    references: [menus.id],
  }),
  mainProducts: many(mainProducts),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  mainProducts: many(mainProducts),
  products: many(products),
}));

export const mainProductsRelations = relations(mainProducts, ({ one, many }) => ({
  menu: one(menus, {
    fields: [mainProducts.menuId],
    references: [menus.id],
  }),
  group: one(groups, {
    fields: [mainProducts.groupId],
    references: [groups.id],
  }),
  category: one(categories, {
    fields: [mainProducts.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [mainProducts.brandId],
    references: [brands.id],
  }),
  products: many(products),
  productImages: many(productImages),
  productTags: many(productTags),
  reviews: many(reviews),
  wishlists: many(wishlists),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  mainProduct: one(mainProducts, {
    fields: [products.mproductId],
    references: [mainProducts.id],
  }),
  group: one(groups, {
    fields: [products.groupId],
    references: [groups.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  productImages: many(productImages),
  purchases: many(purchases),
  sellings: many(sellings),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  mainProduct: one(mainProducts, {
    fields: [productImages.productId],
    references: [mainProducts.id],
  }),
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  productTags: many(productTags),
}));

export const productTagsRelations = relations(productTags, ({ one }) => ({
  mainProduct: one(mainProducts, {
    fields: [productTags.productId],
    references: [mainProducts.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  mainProduct: one(mainProducts, {
    fields: [reviews.productId],
    references: [mainProducts.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  mainProduct: one(mainProducts, {
    fields: [wishlists.productId],
    references: [mainProducts.id],
  }),
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
}));

export const storesRelations = relations(stores, ({ many }) => ({
  purchases: many(purchases),
  sellings: many(sellings),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  product: one(products, {
    fields: [purchases.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [purchases.storeId],
    references: [stores.id],
  }),
}));

export const sellingsRelations = relations(sellings, ({ one }) => ({
  product: one(products, {
    fields: [sellings.productId],
    references: [products.id],
  }),
  store: one(stores, {
    fields: [sellings.storeId],
    references: [stores.id],
  }),
}));

// Import users for relations
import { users } from './users';
