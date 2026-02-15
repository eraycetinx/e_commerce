// burada satıcı mağzası olacak prdoduct oraya eklenecek
// product adet eklenecek her bir order'da store'da product -1 olacak

import { uuid, pgTable, varchar, timestamp, real } from "drizzle-orm/pg-core";

export const storeTable = pgTable("store", {
  uuid: uuid().defaultRandom().primaryKey().unique().notNull(),
  storeName: varchar({ length: 255 }).notNull().unique(),
  ownerUuid: varchar({ length: 255 }).notNull().unique(),
  location: varchar({ length: 255 }).notNull(),
  productCount: real().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
