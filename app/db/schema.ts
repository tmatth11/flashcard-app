import { text, pgTable, serial, timestamp, integer, boolean, uniqueIndex } from "drizzle-orm/pg-core";

export const flashcardSet = pgTable("flashcard_set", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    public: boolean("public").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const flashcard = pgTable("flashcard", {
    id: serial("id").primaryKey(),
    setId: integer("set_id")
        .references(() => flashcardSet.id, { onDelete: "cascade" })
        .notNull(),
    term: text("term").notNull(),
    definition: text("definition").notNull(),
    order: integer("order").notNull()
});

export const flashcardStar = pgTable("flashcard_star", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    flashcardId: integer("flashcard_id")
        .references(() => flashcard.id, { onDelete: "cascade" })
        .notNull(),
    starredAt: timestamp("starred_at").defaultNow().notNull(),
}, (table) => [
    uniqueIndex("flashcard_star_idx").on(table.userId, table.flashcardId)
]);