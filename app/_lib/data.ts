import { drizzle } from 'drizzle-orm/neon-http';
import { flashcardSet } from '../_db/schema';
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export async function getAllFlashcardSets(filters: FlashcardSetProps) {
    return db.select().from(flashcardSet).where(eq(flashcardSet.public, filters.isPublic));
}