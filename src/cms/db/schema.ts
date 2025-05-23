import { relations } from "drizzle-orm";
import { integer, jsonb, pgTable, varchar } from "drizzle-orm/pg-core";

export const taxonomy = pgTable("taxonomy", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  path: varchar({ length: 512 }).notNull()});

export const pages = pgTable("pages", {
  id: integer().notNull().references(() => taxonomy.id).primaryKey(),
  content: integer().array().notNull().default([]),
  iso_language: varchar({ length: 10 }).notNull(),});
  
export const content = pgTable("content", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  key: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 10 }).notNull().default("rich"), // "rich" | "string"
  value: jsonb().notNull(),
  pageId: integer().notNull().references(() => pages.id),
});

export const contentRelations = relations(content, ({ one }) => ({
  page: one(pages, {
    fields: [content.pageId],
    references: [pages.id],
  }),
}));

export const pagesRelations = relations(pages, ({ one }) => ({
  taxonomy: one(taxonomy, {
    fields: [pages.id],
    references: [taxonomy.id],
  }),
}));
export const pagesContentRelations = relations(pages, ({ many }) => ({
  content: many(content),
}));
export const taxonomyPagesRelations = relations(taxonomy, ({ many }) => ({
  pages: many(pages),
}));
