import { uuid, varchar, timestamp, real, pgTable } from "drizzle-orm/pg-core";

export const commentsTable = pgTable("comments", {
  uuid: uuid().primaryKey().defaultRandom().notNull(),
  content: varchar({ length: 255 }),
  rate: real().default(0.0),
  productUuid: uuid().notNull(),
  likeCount: real().default(0),
  userUuid: uuid().notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
