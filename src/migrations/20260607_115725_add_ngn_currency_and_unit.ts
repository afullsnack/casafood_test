import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_carts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`secret\` text,
  	\`customer_id\` integer,
  	\`purchased_at\` text,
  	\`subtotal\` numeric,
  	\`currency\` text DEFAULT 'NGN',
  	\`page_context\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_carts\`("id", "secret", "customer_id", "purchased_at", "subtotal", "currency", "page_context", "updated_at", "created_at") SELECT "id", "secret", "customer_id", "purchased_at", "subtotal", "currency", "page_context", "updated_at", "created_at" FROM \`carts\`;`)
  await db.run(sql`DROP TABLE \`carts\`;`)
  await db.run(sql`ALTER TABLE \`__new_carts\` RENAME TO \`carts\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`carts_secret_idx\` ON \`carts\` (\`secret\`);`)
  await db.run(sql`CREATE INDEX \`carts_customer_idx\` ON \`carts\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`carts_page_context_idx\` ON \`carts\` (\`page_context\`);`)
  await db.run(sql`CREATE INDEX \`carts_updated_at_idx\` ON \`carts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`carts_created_at_idx\` ON \`carts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`shipping_address_title\` text,
  	\`shipping_address_first_name\` text,
  	\`shipping_address_last_name\` text,
  	\`shipping_address_company\` text,
  	\`shipping_address_address_line1\` text,
  	\`shipping_address_address_line2\` text,
  	\`shipping_address_city\` text,
  	\`shipping_address_state\` text,
  	\`shipping_address_postal_code\` text,
  	\`shipping_address_country\` text,
  	\`shipping_address_phone\` text,
  	\`customer_id\` integer,
  	\`customer_email\` text,
  	\`status\` text DEFAULT 'processing',
  	\`amount\` numeric,
  	\`currency\` text DEFAULT 'NGN',
  	\`access_token\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_orders\`("id", "shipping_address_title", "shipping_address_first_name", "shipping_address_last_name", "shipping_address_company", "shipping_address_address_line1", "shipping_address_address_line2", "shipping_address_city", "shipping_address_state", "shipping_address_postal_code", "shipping_address_country", "shipping_address_phone", "customer_id", "customer_email", "status", "amount", "currency", "access_token", "updated_at", "created_at") SELECT "id", "shipping_address_title", "shipping_address_first_name", "shipping_address_last_name", "shipping_address_company", "shipping_address_address_line1", "shipping_address_address_line2", "shipping_address_city", "shipping_address_state", "shipping_address_postal_code", "shipping_address_country", "shipping_address_phone", "customer_id", "customer_email", "status", "amount", "currency", "access_token", "updated_at", "created_at" FROM \`orders\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`ALTER TABLE \`__new_orders\` RENAME TO \`orders\`;`)
  await db.run(sql`CREATE INDEX \`orders_customer_idx\` ON \`orders\` (\`customer_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`orders_access_token_idx\` ON \`orders\` (\`access_token\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_transactions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`payment_method\` text,
  	\`stripe_customer_i_d\` text,
  	\`stripe_payment_intent_i_d\` text,
  	\`billing_address_title\` text,
  	\`billing_address_first_name\` text,
  	\`billing_address_last_name\` text,
  	\`billing_address_company\` text,
  	\`billing_address_address_line1\` text,
  	\`billing_address_address_line2\` text,
  	\`billing_address_city\` text,
  	\`billing_address_state\` text,
  	\`billing_address_postal_code\` text,
  	\`billing_address_country\` text,
  	\`billing_address_phone\` text,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`customer_id\` integer,
  	\`customer_email\` text,
  	\`order_id\` integer,
  	\`cart_id\` integer,
  	\`amount\` numeric,
  	\`currency\` text DEFAULT 'NGN',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cart_id\`) REFERENCES \`carts\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_transactions\`("id", "payment_method", "stripe_customer_i_d", "stripe_payment_intent_i_d", "billing_address_title", "billing_address_first_name", "billing_address_last_name", "billing_address_company", "billing_address_address_line1", "billing_address_address_line2", "billing_address_city", "billing_address_state", "billing_address_postal_code", "billing_address_country", "billing_address_phone", "status", "customer_id", "customer_email", "order_id", "cart_id", "amount", "currency", "updated_at", "created_at") SELECT "id", "payment_method", "stripe_customer_i_d", "stripe_payment_intent_i_d", "billing_address_title", "billing_address_first_name", "billing_address_last_name", "billing_address_company", "billing_address_address_line1", "billing_address_address_line2", "billing_address_city", "billing_address_state", "billing_address_postal_code", "billing_address_country", "billing_address_phone", "status", "customer_id", "customer_email", "order_id", "cart_id", "amount", "currency", "updated_at", "created_at" FROM \`transactions\`;`)
  await db.run(sql`DROP TABLE \`transactions\`;`)
  await db.run(sql`ALTER TABLE \`__new_transactions\` RENAME TO \`transactions\`;`)
  await db.run(sql`CREATE INDEX \`transactions_customer_idx\` ON \`transactions\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_order_idx\` ON \`transactions\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_cart_idx\` ON \`transactions\` (\`cart_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_updated_at_idx\` ON \`transactions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`transactions_created_at_idx\` ON \`transactions\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`variants\` ADD \`price_in_n_g_n_enabled\` integer;`)
  await db.run(sql`ALTER TABLE \`variants\` ADD \`price_in_n_g_n\` numeric;`)
  await db.run(sql`ALTER TABLE \`_variants_v\` ADD \`version_price_in_n_g_n_enabled\` integer;`)
  await db.run(sql`ALTER TABLE \`_variants_v\` ADD \`version_price_in_n_g_n\` numeric;`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`unit\` text;`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`price_in_n_g_n_enabled\` integer;`)
  await db.run(sql`ALTER TABLE \`products\` ADD \`price_in_n_g_n\` numeric;`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_unit\` text;`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_price_in_n_g_n_enabled\` integer;`)
  await db.run(sql`ALTER TABLE \`_products_v\` ADD \`version_price_in_n_g_n\` numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_carts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`secret\` text,
  	\`customer_id\` integer,
  	\`purchased_at\` text,
  	\`subtotal\` numeric,
  	\`currency\` text DEFAULT 'USD',
  	\`page_context\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_carts\`("id", "secret", "customer_id", "purchased_at", "subtotal", "currency", "page_context", "updated_at", "created_at") SELECT "id", "secret", "customer_id", "purchased_at", "subtotal", "currency", "page_context", "updated_at", "created_at" FROM \`carts\`;`)
  await db.run(sql`DROP TABLE \`carts\`;`)
  await db.run(sql`ALTER TABLE \`__new_carts\` RENAME TO \`carts\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`carts_secret_idx\` ON \`carts\` (\`secret\`);`)
  await db.run(sql`CREATE INDEX \`carts_customer_idx\` ON \`carts\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`carts_page_context_idx\` ON \`carts\` (\`page_context\`);`)
  await db.run(sql`CREATE INDEX \`carts_updated_at_idx\` ON \`carts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`carts_created_at_idx\` ON \`carts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_orders\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`shipping_address_title\` text,
  	\`shipping_address_first_name\` text,
  	\`shipping_address_last_name\` text,
  	\`shipping_address_company\` text,
  	\`shipping_address_address_line1\` text,
  	\`shipping_address_address_line2\` text,
  	\`shipping_address_city\` text,
  	\`shipping_address_state\` text,
  	\`shipping_address_postal_code\` text,
  	\`shipping_address_country\` text,
  	\`shipping_address_phone\` text,
  	\`customer_id\` integer,
  	\`customer_email\` text,
  	\`status\` text DEFAULT 'processing',
  	\`amount\` numeric,
  	\`currency\` text DEFAULT 'USD',
  	\`access_token\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_orders\`("id", "shipping_address_title", "shipping_address_first_name", "shipping_address_last_name", "shipping_address_company", "shipping_address_address_line1", "shipping_address_address_line2", "shipping_address_city", "shipping_address_state", "shipping_address_postal_code", "shipping_address_country", "shipping_address_phone", "customer_id", "customer_email", "status", "amount", "currency", "access_token", "updated_at", "created_at") SELECT "id", "shipping_address_title", "shipping_address_first_name", "shipping_address_last_name", "shipping_address_company", "shipping_address_address_line1", "shipping_address_address_line2", "shipping_address_city", "shipping_address_state", "shipping_address_postal_code", "shipping_address_country", "shipping_address_phone", "customer_id", "customer_email", "status", "amount", "currency", "access_token", "updated_at", "created_at" FROM \`orders\`;`)
  await db.run(sql`DROP TABLE \`orders\`;`)
  await db.run(sql`ALTER TABLE \`__new_orders\` RENAME TO \`orders\`;`)
  await db.run(sql`CREATE INDEX \`orders_customer_idx\` ON \`orders\` (\`customer_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`orders_access_token_idx\` ON \`orders\` (\`access_token\`);`)
  await db.run(sql`CREATE INDEX \`orders_updated_at_idx\` ON \`orders\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`orders_created_at_idx\` ON \`orders\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_transactions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`payment_method\` text,
  	\`stripe_customer_i_d\` text,
  	\`stripe_payment_intent_i_d\` text,
  	\`billing_address_title\` text,
  	\`billing_address_first_name\` text,
  	\`billing_address_last_name\` text,
  	\`billing_address_company\` text,
  	\`billing_address_address_line1\` text,
  	\`billing_address_address_line2\` text,
  	\`billing_address_city\` text,
  	\`billing_address_state\` text,
  	\`billing_address_postal_code\` text,
  	\`billing_address_country\` text,
  	\`billing_address_phone\` text,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`customer_id\` integer,
  	\`customer_email\` text,
  	\`order_id\` integer,
  	\`cart_id\` integer,
  	\`amount\` numeric,
  	\`currency\` text DEFAULT 'USD',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cart_id\`) REFERENCES \`carts\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_transactions\`("id", "payment_method", "stripe_customer_i_d", "stripe_payment_intent_i_d", "billing_address_title", "billing_address_first_name", "billing_address_last_name", "billing_address_company", "billing_address_address_line1", "billing_address_address_line2", "billing_address_city", "billing_address_state", "billing_address_postal_code", "billing_address_country", "billing_address_phone", "status", "customer_id", "customer_email", "order_id", "cart_id", "amount", "currency", "updated_at", "created_at") SELECT "id", "payment_method", "stripe_customer_i_d", "stripe_payment_intent_i_d", "billing_address_title", "billing_address_first_name", "billing_address_last_name", "billing_address_company", "billing_address_address_line1", "billing_address_address_line2", "billing_address_city", "billing_address_state", "billing_address_postal_code", "billing_address_country", "billing_address_phone", "status", "customer_id", "customer_email", "order_id", "cart_id", "amount", "currency", "updated_at", "created_at" FROM \`transactions\`;`)
  await db.run(sql`DROP TABLE \`transactions\`;`)
  await db.run(sql`ALTER TABLE \`__new_transactions\` RENAME TO \`transactions\`;`)
  await db.run(sql`CREATE INDEX \`transactions_customer_idx\` ON \`transactions\` (\`customer_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_order_idx\` ON \`transactions\` (\`order_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_cart_idx\` ON \`transactions\` (\`cart_id\`);`)
  await db.run(sql`CREATE INDEX \`transactions_updated_at_idx\` ON \`transactions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`transactions_created_at_idx\` ON \`transactions\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`variants\` DROP COLUMN \`price_in_n_g_n_enabled\`;`)
  await db.run(sql`ALTER TABLE \`variants\` DROP COLUMN \`price_in_n_g_n\`;`)
  await db.run(sql`ALTER TABLE \`_variants_v\` DROP COLUMN \`version_price_in_n_g_n_enabled\`;`)
  await db.run(sql`ALTER TABLE \`_variants_v\` DROP COLUMN \`version_price_in_n_g_n\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`unit\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`price_in_n_g_n_enabled\`;`)
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`price_in_n_g_n\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_unit\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_price_in_n_g_n_enabled\`;`)
  await db.run(sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_price_in_n_g_n\`;`)
}
