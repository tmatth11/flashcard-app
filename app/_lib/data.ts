import { drizzle } from 'drizzle-orm/neon-http';
import { flashcard, flashcardSet } from '../_db/schema';
import { count, eq, getTableColumns } from "drizzle-orm";
import { clerkClient } from '@clerk/nextjs/server';
import { FlashcardSetProps } from '../(sets)/types';

const db = drizzle(process.env.DATABASE_URL!);

export async function getAllFlashcardSets(filters: FlashcardSetProps) {
    const flashcardSets = await db
        .select({
            ...getTableColumns(flashcardSet),
            termCount: count(flashcard.id)
        })
        .from(flashcardSet)
        .leftJoin(flashcard, eq(flashcardSet.id, flashcard.setId))
        .where(eq(flashcardSet.public, filters.isPublic))
        .groupBy(flashcardSet.id);

    const client = await clerkClient();

    const flashcardSetsAndUsers = await Promise.all(
        flashcardSets.map(async (set) => {
            try {
                const user = await client.users.getUser(set.userId);
                return {
                    ...set,
                    username: user.username || "Unknown User",
                    imageUrl: user.imageUrl,
                };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                return {
                    ...set,
                    username: "Unknown User",
                    imageUrl: "/blank-user.png",
                };
            }
        })
    );

    return flashcardSetsAndUsers;
}