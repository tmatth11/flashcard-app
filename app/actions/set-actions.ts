'use server';

import { auth } from '@clerk/nextjs/server';
import z from 'zod';
import { flashcard, flashcardSet, flashcardStar } from '../_db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, asc, count, eq } from 'drizzle-orm';
import { FlashcardSetFilters, FlashcardSetState, FlashcardState } from '../(sets)/types';
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
    let redirectPath = "/my-sets";

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

        redirectPath = `/set/${newSet.id}`;

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

    revalidatePath(redirectPath);
    redirect(redirectPath);
};

export async function deleteFlashcardSet(id: number, username: string, filters?: FlashcardSetFilters) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const set = await db.query.flashcardSet.findFirst({
        where: eq(flashcardSet.id, id),
        columns: { userId: true }
    });

    if (!set || set.userId !== userId) {
        throw new Error("Forbidden");
    }

    await db.delete(flashcardSet).where(eq(flashcardSet.id, id));

    if (filters === undefined) {
        revalidatePath(`/sets/${username}`);
        redirect(`/sets/${username}`);
    }

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

export async function deleteFlashcard(
    cardId: number,
    setId: number,
    currentCard: number,
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const set = await db.query.flashcardSet.findFirst({
        where: eq(flashcardSet.id, setId),
        columns: { userId: true },
    });

    if (!set || set.userId !== userId) {
        throw new Error("Forbidden: You do not own this flashcard set");
    }

    const [{ value: totalCards }] = await db
        .select({ value: count() })
        .from(flashcard)
        .where(eq(flashcard.setId, setId));

    if (totalCards <= 1) {
        throw new Error("A set must have at least 1 card.");
    }

    await db.transaction(async (tx) => {
        await tx.delete(flashcard).where(eq(flashcard.id, cardId));

        const remainingCards = await tx.query.flashcard.findMany({
            where: eq(flashcard.setId, setId),
            orderBy: [asc(flashcard.order), asc(flashcard.id)],
        });

        for (let i = 0; i < remainingCards.length; i++) {
            await tx
                .update(flashcard)
                .set({ order: i })
                .where(eq(flashcard.id, remainingCards[i].id))
        }
    });

    const newTotalCards = totalCards - 1;

    if (currentCard && currentCard >= newTotalCards) {
        redirect(`/set/${setId}?page=${newTotalCards}`)
    }

    revalidatePath(`/set/${setId}`);
}

export async function updateFlashcard(
    prevState: FlashcardState,
    formData: FormData
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const cardId = Number(formData.get("cardId"));
    const setId = Number(formData.get("setId"));
    const term = (formData.get("term") as string)?.trim();
    const definition = (formData.get("definition") as string)?.trim();

    if (!term || !definition) {
        return {
            error: "Validation failed",
            errors: {
                term: !term ? ["Term is required."] : undefined,
                definition: !definition ? ["Definition is required."] : undefined,
            }
        };
    }

    const set = await db.query.flashcardSet.findFirst({
        where: eq(flashcardSet.id, setId),
        columns: { userId: true }
    });

    if (!set || set.userId !== userId) {
        return { error: "Forbidden: You do not own this flashcard set" };
    }

    await db
        .update(flashcard)
        .set({ term, definition })
        .where(eq(flashcard.id, cardId));

    revalidatePath(`/sets/${setId}`);

    return { success: true };
}

export async function toggleStarFlashcard(flashcardId: number, setId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const existingStar = await db.query.flashcardStar.findFirst({
        where: and(
            eq(flashcardStar.userId, userId),
            eq(flashcardStar.flashcardId, flashcardId)
        ),
    });

    // User has flashcard already starred
    if (existingStar) {
        await db
            .delete(flashcardStar)
            .where(
                and(
                    eq(flashcardStar.userId, userId),
                    eq(flashcardStar.flashcardId, flashcardId)
                )
            );
    }
    // User has not yet starred flashcard
    else {
        await db.insert(flashcardStar).values({
            userId,
            flashcardId
        });
    }

    revalidatePath(`/set/${setId}`);
}