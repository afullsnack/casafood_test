import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add `page` column to products
  await db.run(sql`ALTER TABLE "products" ADD COLUMN "page" text DEFAULT 'food-hub';`)

  // Add `page_context` column to carts
  await db.run(sql`ALTER TABLE "carts" ADD COLUMN "page_context" text;`)

  // Add `page_context` column to carts versions
  await db.run(sql`ALTER TABLE "_carts_v" ADD COLUMN "version_page_context" text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE "products" DROP COLUMN "page";`)
  await db.run(sql`ALTER TABLE "carts" DROP COLUMN "page_context";`)
  await db.run(sql`ALTER TABLE "_carts_v" DROP COLUMN "version_page_context";`)
}
