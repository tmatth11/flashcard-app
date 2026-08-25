import { drizzle } from 'drizzle-orm/neon-http';
import { flashcard, flashcardSet } from '../_db/schema';
import { count, eq, getTableColumns, and, or } from "drizzle-orm";
import { clerkClient } from '@clerk/nextjs/server';
import { FlashcardSetProps } from '../(sets)/types';

const db = drizzle(process.env.DATABASE_URL!);

export async function getAllFlashcardSets(filters: FlashcardSetProps) {
    const visibilityConditions = [];
    
    if (filters.isPublic) {
        visibilityConditions.push(eq(flashcardSet.public, true));
    }
    if (filters.isPrivate){
        visibilityConditions.push(eq(flashcardSet.public, false));
    }

    const flashcardSets = await db
        .select({
            ...getTableColumns(flashcardSet),
            termCount: count(flashcard.id)
        })
        .from(flashcardSet)
        .leftJoin(flashcard, eq(flashcardSet.id, flashcard.setId))
        .where(visibilityConditions.length > 0 ? or(...visibilityConditions) : undefined)
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

    if (filters.query) {
        const lowerQuery = filters.query.toLowerCase();

        return flashcardSetsAndUsers.filter((set) => {
            const matchesTitle = set.title.toLowerCase().includes(lowerQuery);
            const matchesDescription = set.description?.toLowerCase().includes(lowerQuery);
            const matchesUsername = set.username.toLowerCase().includes(lowerQuery);

            return matchesTitle || matchesDescription || matchesUsername;
        });
    }

    return flashcardSetsAndUsers;
}