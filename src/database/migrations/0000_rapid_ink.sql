CREATE TABLE IF NOT EXISTS "bonuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"type" varchar(50) NOT NULL,
	"description" text,
	"order_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_us" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(254) NOT NULL,
	"phone" varchar(20),
	"subject" varchar(255),
	"message" text NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "landing_page_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "landing_page_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main_sliders" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"subtitle" varchar(255),
	"image" varchar(500) NOT NULL,
	"link" varchar(500),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menu_main_sliders" (
	"id" serial PRIMARY KEY NOT NULL,
	"menu_id" integer NOT NULL,
	"title" varchar(255),
	"image" varchar(500) NOT NULL,
	"link" varchar(500),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menu_middle_banners" (
	"id" serial PRIMARY KEY NOT NULL,
	"menu_id" integer NOT NULL,
	"title" varchar(255),
	"image" varchar(500) NOT NULL,
	"link" varchar(500),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "middle_banners" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"image" varchar(500) NOT NULL,
	"link" varchar(500),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "middle_promotional_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"subtitle" varchar(255),
	"image" varchar(500) NOT NULL,
	"link" varchar(500),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"type" varchar(50) DEFAULT 'info',
	"seen" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "policy_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"route_name" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "policy_pages_route_name_unique" UNIQUE("route_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "top_promotional_sliders" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"image" varchar(500) NOT NULL,
	"link" varchar(500),
	"order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"mproduct_id" integer,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"product" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"type" varchar(20) NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"min_order_amount" numeric(10, 2),
	"max_discount" numeric(10, 2),
	"usage_limit" integer,
	"used_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"valid_from" timestamp,
	"valid_until" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gift_vouchers" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"is_used" boolean DEFAULT false,
	"used_by" integer,
	"used_at" timestamp,
	"valid_from" timestamp,
	"valid_until" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "gift_vouchers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"order_no" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'Pending',
	"payment_status" varchar(50) DEFAULT 'Pending',
	"payment_method" varchar(50),
	"sub_total" numeric(10, 2) NOT NULL,
	"discount" numeric(10, 2) DEFAULT '0',
	"shipping_cost" numeric(10, 2) DEFAULT '0',
	"grand_total" numeric(10, 2) NOT NULL,
	"shipping_details" json,
	"notes" text,
	"order_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_order_no_unique" UNIQUE("order_no")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_sheets" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" integer NOT NULL,
	"type" varchar(50) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_for" varchar(50) NOT NULL,
	"description" text,
	"date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"preorder_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"transaction_id" varchar(255),
	"status" varchar(50) DEFAULT 'Pending',
	"payment_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "preorder_carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"mproduct_id" integer,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"product" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "preorder_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "preorders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"order_no" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'Pending',
	"payment_status" varchar(50) DEFAULT 'Pending',
	"payment_method" varchar(50),
	"sub_total" numeric(10, 2) NOT NULL,
	"discount" numeric(10, 2) DEFAULT '0',
	"shipping_cost" numeric(10, 2) DEFAULT '0',
	"grand_total" numeric(10, 2) NOT NULL,
	"shipping_details" json,
	"notes" text,
	"order_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "preorders_order_no_unique" UNIQUE("order_no")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"city_id" integer,
	"zone_id" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"zone_id" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"logo" varchar(500),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"menu_id" integer NOT NULL,
	"cat_name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"menu_id" integer NOT NULL,
	"group_name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"menu_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"brand_id" integer,
	"product_name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"product_image" varchar(500),
	"model" varchar(255),
	"selling_price" numeric(10, 2) NOT NULL,
	"discount" numeric(5, 2) DEFAULT '0',
	"brief_description" text,
	"description" text,
	"images" json,
	"is_new" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"is_available" boolean DEFAULT true,
	"is_archived" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menus" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"alt" varchar(255),
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variation_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"alt" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variation_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"pvariation_id" integer NOT NULL,
	"value" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_variations" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"variation_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"mproduct_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"brand_id" integer,
	"product_name" varchar(255) NOT NULL,
	"model" varchar(255),
	"variation" json,
	"selling_price" numeric(10, 2) NOT NULL,
	"discount" numeric(5, 2) DEFAULT '0',
	"stock" integer DEFAULT 0,
	"is_available" boolean DEFAULT true,
	"is_archived" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2),
	"total_price" numeric(10, 2),
	"purchase_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"reviewer_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"images" json,
	"is_approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sellings" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"store_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2),
	"total_price" numeric(10, 2),
	"sale_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text,
	"main_branch" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"customer_name" varchar(255),
	"contact" varchar(20),
	"email" varchar(254),
	"city_id" integer,
	"area_id" integer,
	"address" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_resets" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(254) NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"is_revoked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(80) NOT NULL,
	"name" varchar(255),
	"email" varchar(254) NOT NULL,
	"contact" varchar(20) NOT NULL,
	"password" varchar(60) NOT NULL,
	"user_type" varchar(50) DEFAULT 'Customer',
	"is_active" boolean DEFAULT false,
	"otp_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_contact_unique" UNIQUE("contact")
);
