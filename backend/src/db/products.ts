import { uuid, pgTable, varchar, timestamp, real } from "drizzle-orm/pg-core";

export const productTable = pgTable("products", {
  uuid: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar({ length: 64 }).notNull(),
  description: varchar({ length: 255 }).default(""),
  price: real().notNull().default(0.0),
  discount: real().default(0.0),
  rating: real().default(0),
  sellerUuid: uuid().notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
