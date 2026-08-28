'use server';

import { auth } from '@clerk/nextjs/server';
import z from 'zod';
import { flashcard, flashcardSet } from '../_db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { FlashcardSetFilters } from '../(sets)/types';
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

export type FlashcardSetState = {
    message?: string;
    success?: boolean;
    errors?: {
        title?: string[],
        description?: string[];
        public?: string[];
        cards?: string[];
    };
};

export async function createFlashcardSet(prevState: FlashcardSetState, formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        return {
            message: "Unauthorized. Please sign in to create flashcards sets.",
            success: false,
        };
    }

    const rawTitle = formData.get("title");
    const rawDescription = formData.get("description")?.toString().trim() || undefined;
    const rawPublic = formData.get("public");
    const terms = formData.getAll("term") as string[];
    const definitions = formData.getAll("definition") as string[];

    const rawCards = terms.map((term, i) => ({
        term: term || "",
        definition: definitions[i] || ""
    }));

    const validatedFields = FlashcardSetSchema.safeParse({
        title: rawTitle,
        description: rawDescription || undefined,
        public: rawPublic === "on",
        cards: rawCards,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing or invalid fields. Please check your inputs.",
            success: false,
        };
    }

    const data = validatedFields.data;

    try {
        const [newSet] = await db
            .insert(flashcardSet)
            .values({
                title: data.title,
                description: data.description,
                public: data.public,
                userId: userId
            })
            .returning();

        const cardsToInsert = data.cards.map((card, index) => ({
            setId: newSet.id,
            term: card.term,
            definition: card.definition,
            order: index,
        }));

        await db.insert(flashcard).values(cardsToInsert);
    }
    catch (error) {
        console.error("Database Error:", error);
        return {
            message: "Database error: Failed to create flashcard set.",
            success: false,
        };
    }

    const redirectPath = "/my-sets";

    revalidatePath(redirectPath);
    redirect(redirectPath);
};

export async function deleteFlashcardSet(id: number, username: string, filters: FlashcardSetFilters) {
    await db.delete(flashcardSet).where(eq(flashcardSet.id, id));

    const totalPages = await fetchFlashcardSetsPages(filters);
    const currentPage = filters.currentPage || 1;
    revalidatePath(`/sets/${username}`);

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

    if (!userId) {
        return {
            message: "Unauthorized. Please sign in to edit flashcards sets.",
            success: false,
        };
    }

    const rawSetId = formData.get("setId");
    const setId = Number(rawSetId);
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const isPublic = formData.get("public") === "on";

    if (!setId || isNaN(setId)) {
        return { message: "Invalid flashcard set ID.", success: false };
    }

    if (!title) {
        return { message: "Title is required.", success: false };
    }

    const terms = formData.getAll("term") as string[];
    const definitions = formData.getAll("definition") as string[];

    if (terms.length === 0 || terms.some((t) => !t.trim()) || definitions.some((d) => !d.trim())) {
        return { message: "All flashcards must have both a term and a definition.", success: false };
    }

    try {
        await db.transaction(async (tx) => {
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

            if (updatedSets.length === 0) {
                throw new Error("Set not found or unauthorized.");
            }

            await tx.delete(flashcard).where(eq(flashcard.setId, setId));

            const cardsToInsert = terms.map((term, index) => ({
                setId,
                term: term.trim(),
                definition: definitions[index].trim(),
                order: index
            }));

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