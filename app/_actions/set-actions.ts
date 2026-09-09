'use server';

import { auth } from '@clerk/nextjs/server';
import z from 'zod';
import { flashcard, flashcardSet } from '../_db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { FlashcardSetFilters, FlashcardSetState } from '../types';
import { fetchFlashcardSetsPages } from '../_lib/data';
import { db } from '../_db/drizzle';

const FlashcardSetSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z.string().max(200, "Description is too long").optional(),
    public: z.boolean().default(true),
    cards: z.array(
        z.object({
            term: z.string().min(1, "Term is required").max(300, "Term is too long"),
            definition: z.string().min(1, "Definition is required").max(500, "Definition is too long"),
        })
    ).min(1, "At least one flashcard is required")
});

// Insert user-created flashcard set into database
export async function createFlashcardSet(prevState: FlashcardSetState, formData: FormData) {
    const { userId } = await auth();

    // Only allow logged in users to create flashcard sets
    if (!userId) {
        return {
            message: "Unauthorized. Please sign in to create flashcards sets.",
            success: false,
        };
    }

    // Get form elements
    const rawTitle = formData.get("title");
    const rawDescription = formData.get("description")?.toString().trim() || undefined;
    const rawPublic = formData.get("public");
    const terms = formData.getAll("term") as string[];
    const definitions = formData.getAll("definition") as string[];

    // Combine terms with definitions
    const rawCards = terms.map((term, i) => ({
        term: term || "",
        definition: definitions[i] || ""
    }));

    // Validate necessary fields
    const validatedFields = FlashcardSetSchema.safeParse({
        title: rawTitle,
        description: rawDescription || undefined,
        public: rawPublic === "on",
        cards: rawCards,
    });

    // Return errors if present
    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error),
            message: "Missing or invalid fields. Please check your inputs.",
            success: false,
        };
    }

    const data = validatedFields.data;
    let redirectPath = "/my-sets";

    try {
        // Insert new entry into flashcardSet table
        const [newSet] = await db
            .insert(flashcardSet)
            .values({
                title: data.title,
                description: data.description,
                public: data.public,
                userId: userId
            })
            .returning();

        redirectPath = `/set/${newSet.id}`;

        // Gather cards that the user created
        const cardsToInsert = data.cards.map((card, index) => ({
            setId: newSet.id,
            term: card.term,
            definition: card.definition,
            order: index,
        }));

        // Insert the cards into the cards table
        await db.insert(flashcard).values(cardsToInsert);
    }
    catch (error) {
        console.error("Database Error:", error);
        return {
            message: "Database error: Failed to create flashcard set.",
            success: false,
        };
    }

    revalidatePath(redirectPath);
    redirect(redirectPath);
};

// Delete flashcard set and maintain search parameters
export async function deleteFlashcardSet(id: number, username: string, filters?: FlashcardSetFilters) {
    const { userId } = await auth();

    // Only allow logged in users to delete flashcard sets
    if (!userId) throw new Error("Unauthorized");

    // Find user ID specified flashcard set 
    const set = await db.query.flashcardSet.findFirst({
        where: eq(flashcardSet.id, id),
        columns: { userId: true }
    });

    // Protect against users deleting each other's flashcard sets
    if (!set || set.userId !== userId) {
        throw new Error("Forbidden");
    }

    // Delete flashcard set
    await db.delete(flashcardSet).where(eq(flashcardSet.id, id));

    revalidatePath(`/sets/${username}`);

    // Redirect to sets page if no filters are applied
    if (filters === undefined) {
        redirect(`/sets/${username}`);
    }

    const totalPages = await fetchFlashcardSetsPages(filters);
    const currentPage = filters.currentPage || 1;

    // Reset filters and update page count if on invalid page
    if (currentPage > totalPages && totalPages > 0) {
        const params = new URLSearchParams();
        if (filters.query) params.set("query", filters.query);
        if (filters.sortBy) params.set("sort", filters.sortBy);
        if (filters.visibility) params.set("visibility", filters.visibility);
        params.set("page", totalPages.toString());

        redirect(`/sets/${username}?${params.toString()}`);
    }
}

export async function updateFlashcardSet(prevState: FlashcardSetState, formData: FormData) {
    const { userId } = await auth();

    // Only allow logged in users to edit flashcard sets
    if (!userId) {
        return {
            message: "Unauthorized. Please sign in to edit flashcards sets.",
            success: false,
        };
    }

    // Get necessary form elements
    const rawSetId = formData.get("setId");
    const setId = Number(rawSetId);
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const isPublic = formData.get("public") === "on";

    // Prevent user from modfying non-existent flashcard sets
    if (!setId || isNaN(setId)) {
        return { message: "Invalid flashcard set ID.", success: false };
    }

    // Prevent user from not including a title in their set
    if (!title) {
        return { message: "Title is required.", success: false };
    }

    // Get included terms and definitions
    const terms = formData.getAll("term") as string[];
    const definitions = formData.getAll("definition") as string[];


    // Prevent user from providing empty terms/definitions
    if (terms.length === 0 || terms.some((t) => !t.trim()) || definitions.some((d) => !d.trim())) {
        return { message: "All flashcards must have both a term and a definition.", success: false };
    }

    try {
        // Update flashcard set information and flashcards
        await db.transaction(async (tx) => {
            // Update flashcard set if user is the owner
            const updatedSets = await tx
                .update(flashcardSet)
                .set({
                    title,
                    description,
                    public: isPublic,
                    updatedAt: new Date(),
                })
                .where(and(eq(flashcardSet.id, setId), eq(flashcardSet.userId, userId)))
                .returning({ id: flashcardSet.id });

            // Throw error if set was not found or if user doesn't own set
            if (updatedSets.length === 0) {
                throw new Error("Set not found or unauthorized.");
            }

            // Delete all flashcards
            await tx.delete(flashcard).where(eq(flashcard.setId, setId));

            // Gather new and old flashcards
            const cardsToInsert = terms.map((term, index) => ({
                setId,
                term: term.trim(),
                definition: definitions[index].trim(),
                order: index
            }));

            // Insert all flashcards at once
            await tx.insert(flashcard).values(cardsToInsert);
        });
    }
    catch (error) {
        console.error("Failed to update flashcard set:", error);
        return {
            message: "An error occured while updating the set. Please try again",
            success: false,
        };
    }

    revalidatePath(`/edit-set/${setId}`);
    revalidatePath(`/set/${setId}`);
    redirect(`/set/${setId}`)
}