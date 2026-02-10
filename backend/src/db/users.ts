import {
  uuid,
  pgTable,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  uuid: uuid().defaultRandom().primaryKey().unique().notNull(),
  username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  isSeller: boolean().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});
