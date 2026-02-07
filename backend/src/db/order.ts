import { uuid, date, pgTable, boolean, real } from "drizzle-orm/pg-core";

export const orderTable = pgTable("orders", {
  uuid: uuid().defaultRandom().primaryKey().notNull(),
  userUuid: uuid().notNull(),
  productUuid: uuid().notNull(),
  status: boolean().default(false).notNull(),
  price: real().default(0.0),
  createdAt: date(),
});
