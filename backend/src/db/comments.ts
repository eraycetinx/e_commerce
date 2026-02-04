import { uuid, varchar, date, real, pgTable } from "drizzle-orm/pg-core";

export const commentsTable = pgTable("comments", {
  uuid: uuid().primaryKey().defaultRandom().notNull(),
  content: varchar({ length: 255 }),
  rate: real().default(0.0),
  prodcutUuid: uuid().notNull(),
  userUuid: uuid().notNull(),
  createdAt: date(),
});
