import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
import { baseFieldsNoOrg } from "./base";

// Menu and Category Tables
export const menus = pgTable("menus", {
  ...baseFieldsNoOrg,
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 })
});

export const groups = pgTable("groups", {
  ...baseFieldsNoOrg,
  menuId: uuid("menu_id")
    .notNull()
    .references(() => menus.id, { onDelete: "cascade" }),
  groupName: varchar("group_name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 })
});

export const categories = pgTable("categories", {
  ...baseFieldsNoOrg,
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  menuId: uuid("menu_id")
    .notNull()
    .references(() => menus.id, { onDelete: "cascade" }),
  catName: varchar("cat_name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }),
  isFeatured: boolean("is_featured").default(false)
});

export const brands = pgTable("brands", {
  ...baseFieldsNoOrg,
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }),
  logo: varchar("logo", { length: 500 })
});

// Products Table
export const products = pgTable(
  "products",
  {
    ...baseFieldsNoOrg,
    menuId: uuid("menu_id")
      .notNull()
      .references(() => menus.id, { onDelete: "cascade" }),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    brandId: uuid("brand_id").references(() => brands.id),
    productName: varchar("product_name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }),
    productImage: varchar("product_image", { length: 500 }),
    model: varchar("model", { length: 255 }),
    sellingPrice: decimal("selling_price", {
      precision: 10,
      scale: 2
    }).notNull(),
    discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
    briefDescription: text("brief_description"),
    description: text("description"),
    images: json("images"),
    isNew: boolean("is_new").default(false),
    isFeatured: boolean("is_featured").default(false),
    isAvailable: boolean("is_available").default(true),
    isArchived: boolean("is_archived").default(false)
  },
  (table) => ({
    // Performance indexes based on query analysis
    categoryIdx: index("products_category_idx").on(table.categoryId),
    brandIdx: index("products_brand_idx").on(table.brandId),
    groupIdx: index("products_group_idx").on(table.groupId),
    availableIdx: index("products_available_idx").on(table.isAvailable),
    priceIdx: index("products_price_idx").on(table.sellingPrice),
    featuredIdx: index("products_featured_idx").on(table.isFeatured),
    nameIdx: index("products_name_idx").on(table.productName),
    // Composite indexes for common query patterns
    categoryAvailableIdx: index("products_category_available_idx").on(
      table.categoryId,
      table.isAvailable
    ),
    brandAvailableIdx: index("products_brand_available_idx").on(
      table.brandId,
      table.isAvailable
    ),
    groupAvailableIdx: index("products_group_available_idx").on(
      table.groupId,
      table.isAvailable
    )
  })
);

// Product Variants
export const variants = pgTable("variants", {
  ...baseFieldsNoOrg,
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  groupId: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  brandId: uuid("brand_id").references(() => brands.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  model: varchar("model", { length: 255 }),
  variation: json("variation"),
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  stock: integer("stock").default(0),
  isAvailable: boolean("is_available").default(true),
  isArchived: boolean("is_archived").default(false)
});

// Product Images
export const productImages = pgTable("product_images", {
  ...baseFieldsNoOrg,
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 500 }).notNull(),
  alt: varchar("alt", { length: 255 }),
  isPrimary: boolean("is_primary").default(false)
});

// Product Tags
export const tags = pgTable("tags", {
  ...baseFieldsNoOrg,
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 })
});

export const productTags = pgTable("product_tags", {
  ...baseFieldsNoOrg,
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" })
});

// Reviews
export const reviews = pgTable("reviews", {
  ...baseFieldsNoOrg,
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  reviewerId: uuid("reviewer_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  images: json("images"),
  isApproved: boolean("is_approved").default(false)
});

// Wishlists
export const wishlists = pgTable("wishlists", {
  ...baseFieldsNoOrg,
  userId: uuid("user_id").notNull(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" })
});

// Variant Attributes (for complex product variations)
export const variantAttributes = pgTable("variant_attributes", {
  ...baseFieldsNoOrg,
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  attributeName: varchar("attribute_name", { length: 255 }).notNull()
});

export const variantAttributeValues = pgTable("variant_attribute_values", {
  ...baseFieldsNoOrg,
  attributeId: uuid("attribute_id")
    .notNull()
    .references(() => variantAttributes.id, { onDelete: "cascade" }),
  value: varchar("value", { length: 255 }).notNull()
});

export const variantImages = pgTable("variant_images", {
  ...baseFieldsNoOrg,
  variantId: uuid("variant_id")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 500 }).notNull(),
  alt: varchar("alt", { length: 255 })
});

// Stock Management
export const stores = pgTable("stores", {
  ...baseFieldsNoOrg,
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  mainBranch: boolean("main_branch").default(false)
});

export const purchases = pgTable("purchases", {
  ...baseFieldsNoOrg,
  variantId: uuid("variant_id")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  purchaseDate: timestamp("purchase_date").defaultNow()
});

export const sellings = pgTable("sellings", {
  ...baseFieldsNoOrg,
  variantId: uuid("variant_id")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  saleDate: timestamp("sale_date").defaultNow()
});

// Relations
export const menusRelations = relations(menus, ({ many }) => ({
  groups: many(groups)
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  menu: one(menus, {
    fields: [groups.menuId],
    references: [menus.id]
  }),
  categories: many(categories),
  products: many(products)
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  group: one(groups, {
    fields: [categories.groupId],
    references: [groups.id]
  }),
  menu: one(menus, {
    fields: [categories.menuId],
    references: [menus.id]
  }),
  products: many(products)
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
  variants: many(variants)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  menu: one(menus, {
    fields: [products.menuId],
    references: [menus.id]
  }),
  group: one(groups, {
    fields: [products.groupId],
    references: [groups.id]
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id]
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id]
  }),
  variants: many(variants),
  productImages: many(productImages),
  productTags: many(productTags),
  reviews: many(reviews),
  wishlists: many(wishlists)
}));

export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id]
  }),
  group: one(groups, {
    fields: [variants.groupId],
    references: [groups.id]
  }),
  category: one(categories, {
    fields: [variants.categoryId],
    references: [categories.id]
  }),
  brand: one(brands, {
    fields: [variants.brandId],
    references: [brands.id]
  }),
  productImages: many(productImages),
  purchases: many(purchases),
  sellings: many(sellings)
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  mainProduct: one(products, {
    fields: [productImages.productId],
    references: [products.id]
  }),
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id]
  })
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  productTags: many(productTags)
}));

export const productTagsRelations = relations(productTags, ({ one }) => ({
  mainProduct: one(products, {
    fields: [productTags.productId],
    references: [products.id]
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id]
  })
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  mainProduct: one(products, {
    fields: [reviews.productId],
    references: [products.id]
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  })
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  mainProduct: one(products, {
    fields: [wishlists.productId],
    references: [products.id]
  }),
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id]
  })
}));

export const storesRelations = relations(stores, ({ many }) => ({
  purchases: many(purchases),
  sellings: many(sellings)
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  variant: one(variants, {
    fields: [purchases.variantId],
    references: [variants.id]
  }),
  store: one(stores, {
    fields: [purchases.storeId],
    references: [stores.id]
  })
}));

export const sellingsRelations = relations(sellings, ({ one }) => ({
  variant: one(variants, {
    fields: [sellings.variantId],
    references: [variants.id]
  }),
  store: one(stores, {
    fields: [sellings.storeId],
    references: [stores.id]
  })
}));

// Import users for relations
import { users } from "./users";
