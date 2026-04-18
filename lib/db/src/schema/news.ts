import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const newsTable = pgTable("news", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content"),
  type: text("type").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  deadline: timestamp("deadline", { withTimezone: true }),
  source: text("source"),
  isFeatured: boolean("is_featured").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
});

export const insertNewsSchema = createInsertSchema(newsTable).omit({ id: true });
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof newsTable.$inferSelect;
