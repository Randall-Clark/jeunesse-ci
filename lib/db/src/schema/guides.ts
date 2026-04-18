import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const guidesTable = pgTable("guides", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  stepCount: integer("step_count").notNull().default(0),
  duration: text("duration").notNull(),
  difficulty: text("difficulty").notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
});

export const guideStepsTable = pgTable("guide_steps", {
  id: serial("id").primaryKey(),
  guideId: integer("guide_id").notNull(),
  order: integer("order").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tips: text("tips").array().notNull().default([]),
  documents: text("documents").array().notNull().default([]),
  relatedResourceIds: integer("related_resource_ids").array().notNull().default([]),
});

export const insertGuideSchema = createInsertSchema(guidesTable).omit({ id: true });
export type InsertGuide = z.infer<typeof insertGuideSchema>;
export type Guide = typeof guidesTable.$inferSelect;

export const insertGuideStepSchema = createInsertSchema(guideStepsTable).omit({ id: true });
export type InsertGuideStep = z.infer<typeof insertGuideStepSchema>;
export type GuideStep = typeof guideStepsTable.$inferSelect;
