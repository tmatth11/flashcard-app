import { drizzle } from 'drizzle-orm/neon-http';
import { flashcard, flashcardSet } from '../_db/schema';
import { count, eq, getTableColumns } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export async function getAllFlashcardSets(filters: FlashcardSetProps) {
    return db
    .select({
        ...getTableColumns(flashcardSet),
        termCount: count(flashcard.id)
    })
    .from(flashcardSet)
    .leftJoin(flashcard, eq(flashcardSet.id, flashcard.setId))
    .where(eq(flashcardSet.public, filters.isPublic))
    .groupBy(flashcardSet.id);
}