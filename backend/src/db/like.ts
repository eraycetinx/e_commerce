import { uuid, pgTable, date } from "drizzle-orm/pg-core";

export const likeTable = pgTable("likes", {
  uuid: uuid().notNull().defaultRandom().primaryKey(),
  commentUuid: uuid().notNull(),
  userUuid: uuid().notNull(),
  date: date(),
});
