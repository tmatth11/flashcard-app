import { flashcard, flashcardSet } from '../_db/schema';
import { asc, count, desc, eq, getTableColumns, or } from "drizzle-orm";
import { clerkClient } from '@clerk/nextjs/server';
import { FlashcardSetFilters } from '../types';
import { db } from '../_db/drizzle';

const ITEMS_PER_PAGE = 5;

// Get flashcard sets with user filters applied
export async function getFilteredFlashcardSets(filters: FlashcardSetFilters) {
    const visibilityConditions = [];

    // Optionally filter public/non-public sets
    if (filters.visibility === "public") {
        visibilityConditions.push(eq(flashcardSet.public, true));
    }
    if (filters.visibility === "private") {
        visibilityConditions.push(eq(flashcardSet.public, false));
    }

    // Optionally sort flashcards according to user preferences
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

    // Get flashcard sets with number of terms
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

    // Include username and image URL with flashcard sets
    const flashcardSetsAndUsers = await Promise.all(
        flashcardSets.map(async (set) => {
            try {
                const user = await client.users.getUser(set.userId);
                return {
                    ...set,
                    username: user.username || "Unknown User",
                    imageUrl: user.imageUrl,
                };
            } catch {
                return {
                    ...set,
                    username: "Unknown User",
                    imageUrl: "/blank-user.png",
                };
            }
        })
    );

    // Optionally filter by username
    let results = flashcardSetsAndUsers;
    if (filters.targetUsername) {
        results = results.filter(
            (set) => set.username.toLowerCase() === filters.targetUsername?.toLowerCase()
        )
    }

    // Optionally filter by title, description, or username
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

// Get all the flashcard sets in the current page
export async function getFlashcardSetsInPage(filters: FlashcardSetFilters) {
    const page = Math.max(1, Number(filters.currentPage) || 1);
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const allFilteredSets = await getFilteredFlashcardSets(filters);

    return allFilteredSets.slice(offset, offset + ITEMS_PER_PAGE);
}

// Get the total number of pages of flashcard sets
export async function fetchFlashcardSetsPages(filters: FlashcardSetFilters) {
    const allFilteredSets = await getFilteredFlashcardSets(filters);
    
    return Math.ceil(Number(allFilteredSets.length) / ITEMS_PER_PAGE);
}

// Get the flashcard set by the specified ID, along with the stars by the currently logged in user
export async function getFlashcardSetById(id: number, currentUserId?: string | null) {
    return await db.query.flashcardSet.findFirst({
        where: (set, { eq }) => eq(set.id, id),
        with: {
            flashcards: {
                orderBy: (cards, { asc }) => [asc(cards.order), asc(cards.id)],
                with: {
                    stars: currentUserId
                        ? {
                            where: (star, { eq }) => eq(star.userId, currentUserId),
                        } : undefined,
                },
            },
        }
    });
}

// Get all flashcard set IDs
export async function getPublicFlashcardSetIds() {
    return await db
        .select({ id: flashcardSet.id })
        .from(flashcardSet)
        .where(eq(flashcardSet.public, true));
}

// Get usernames of all users who have made public flashcard sets
export async function getPublicUsernames() {
    // Get list of distinct users who have made public flashcard sets
    const distinctUsers = await db
        .selectDistinct({ userId: flashcardSet.userId })
        .from(flashcardSet)
        .where(eq(flashcardSet.public, true));

    if (distinctUsers.length === 0) return [];

    const client = await clerkClient();

    // Get the user IDs of users who have made public flashcard sets
    const usernames = await Promise.all(
        distinctUsers.map(async ({ userId }) => {
            try {
                const user = await client.users.getUser(userId);
                return user.username || null;
            } 
            catch {
                return null;
            }
        })
    );

    // Filter out unknown users
    return [...new Set(
        usernames.filter(
            (name): name is string =>
                Boolean(name) && name !== "Unknown User"
        )
    )];
}