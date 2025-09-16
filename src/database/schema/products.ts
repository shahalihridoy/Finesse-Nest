import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
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

// Main Products Table
export const mainProducts = pgTable("main_products", {
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
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }).default("0"),
  briefDescription: text("brief_description"),
  description: text("description"),
  images: json("images"),
  isNew: boolean("is_new").default(false),
  isFeatured: boolean("is_featured").default(false),
  isAvailable: boolean("is_available").default(true),
  isArchived: boolean("is_archived").default(false)
});

// Product Variations
export const products = pgTable("products", {
  ...baseFieldsNoOrg,
  mproductId: uuid("mproduct_id")
    .notNull()
    .references(() => mainProducts.id, { onDelete: "cascade" }),
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
    .references(() => mainProducts.id, { onDelete: "cascade" }),
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
    .references(() => mainProducts.id, { onDelete: "cascade" })
});

// Product Variations (for complex product variations)
export const productVariations = pgTable("product_variations", {
  ...baseFieldsNoOrg,
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variationName: varchar("variation_name", { length: 255 }).notNull()
});

export const productVariationValues = pgTable("product_variation_values", {
  ...baseFieldsNoOrg,
  pvariationId: uuid("pvariation_id")
    .notNull()
    .references(() => productVariations.id, { onDelete: "cascade" }),
  value: varchar("value", { length: 255 }).notNull()
});

export const productVariationImages = pgTable("product_variation_images", {
  ...baseFieldsNoOrg,
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
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
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
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
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
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
  mainProducts: many(mainProducts)
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
  mainProducts: many(mainProducts)
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  mainProducts: many(mainProducts),
  products: many(products)
}));

export const mainProductsRelations = relations(
  mainProducts,
  ({ one, many }) => ({
    menu: one(menus, {
      fields: [mainProducts.menuId],
      references: [menus.id]
    }),
    group: one(groups, {
      fields: [mainProducts.groupId],
      references: [groups.id]
    }),
    category: one(categories, {
      fields: [mainProducts.categoryId],
      references: [categories.id]
    }),
    brand: one(brands, {
      fields: [mainProducts.brandId],
      references: [brands.id]
    }),
    products: many(products),
    productImages: many(productImages),
    productTags: many(productTags),
    reviews: many(reviews),
    wishlists: many(wishlists)
  })
);

export const productsRelations = relations(products, ({ one, many }) => ({
  mainProduct: one(mainProducts, {
    fields: [products.mproductId],
    references: [mainProducts.id]
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
  productImages: many(productImages),
  purchases: many(purchases),
  sellings: many(sellings)
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  mainProduct: one(mainProducts, {
    fields: [productImages.productId],
    references: [mainProducts.id]
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
  mainProduct: one(mainProducts, {
    fields: [productTags.productId],
    references: [mainProducts.id]
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id]
  })
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  mainProduct: one(mainProducts, {
    fields: [reviews.productId],
    references: [mainProducts.id]
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id]
  })
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  mainProduct: one(mainProducts, {
    fields: [wishlists.productId],
    references: [mainProducts.id]
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
  product: one(products, {
    fields: [purchases.productId],
    references: [products.id]
  }),
  store: one(stores, {
    fields: [purchases.storeId],
    references: [stores.id]
  })
}));

export const sellingsRelations = relations(sellings, ({ one }) => ({
  product: one(products, {
    fields: [sellings.productId],
    references: [products.id]
  }),
  store: one(stores, {
    fields: [sellings.storeId],
    references: [stores.id]
  })
}));

// Import users for relations
import { users } from "./users";
