import { drizzle } from 'drizzle-orm/neon-http';
import { flashcard, flashcardSet } from '../_db/schema';
import { asc, count, desc, eq, getTableColumns, or } from "drizzle-orm";
import { clerkClient } from '@clerk/nextjs/server';
import { FlashcardSetFilters } from '../(sets)/types';

const db = drizzle(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 5;
export async function getFilteredFlashcardSets(filters: FlashcardSetFilters) {
    const visibilityConditions = [];

    if (filters.visibility === "public") {
        visibilityConditions.push(eq(flashcardSet.public, true));
    }
    if (filters.visibility === "private") {
        visibilityConditions.push(eq(flashcardSet.public, false));
    }

    let orderByClause;
    switch (filters.sortBy) {
        case "created-ascending":
            orderByClause = asc(flashcardSet.createdAt);
            break;
        case "modified-descending":
            orderByClause = desc(flashcardSet.updatedAt);
            break;
        case "modified-ascending":
            orderByClause = asc(flashcardSet.updatedAt);
            break;
        case "created-descending":
        default:
            orderByClause = desc(flashcardSet.createdAt);
            break;
    }

    console.log(filters.sortBy);

    const flashcardSets = await db
        .select({
            ...getTableColumns(flashcardSet),
            termCount: count(flashcard.id)
        })
        .from(flashcardSet)
        .leftJoin(flashcard, eq(flashcardSet.id, flashcard.setId))
        .where(visibilityConditions.length > 0 ? or(...visibilityConditions) : undefined)
        .groupBy(flashcardSet.id)
        .orderBy(orderByClause);

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

    let results = flashcardSetsAndUsers;
    if (filters.targetUsername) {
        results = results.filter(
            (set) => set.username.toLowerCase() === filters.targetUsername?.toLowerCase()
        )
    }

    if (filters.query) {
        const lowerQuery = filters.query.toLowerCase();

        results = flashcardSetsAndUsers.filter((set) => {
            const matchesTitle = set.title.toLowerCase().includes(lowerQuery);
            const matchesDescription = set.description?.toLowerCase().includes(lowerQuery);
            const matchesUsername = filters.targetUsername ? false : set.username.toLowerCase().includes(lowerQuery);

            return matchesTitle || matchesDescription || matchesUsername;
        });
    }

    return results;
}

export async function getAllFlashcardSets(filters: FlashcardSetFilters) {
    const page = Math.max(1, Number(filters.currentPage) || 1);
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const allFilteredSets = await getFilteredFlashcardSets(filters);

    return allFilteredSets.slice(offset, offset + ITEMS_PER_PAGE);
}

export async function fetchFlashcardSetsPages(filters: FlashcardSetFilters) {
    try {
        const allFilteredSets = await getFilteredFlashcardSets(filters);

        return Math.ceil(Number(allFilteredSets.length) / ITEMS_PER_PAGE);
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch total number of pages.");
    }
}