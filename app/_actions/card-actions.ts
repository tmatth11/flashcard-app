'use server';

import { auth } from "@clerk/nextjs/server";
import { flashcard, flashcardSet } from "../_db/schema";
import { db } from "../_db/drizzle";
import { asc, count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { FlashcardState } from "../types";

// Delete flashcard from set and update page if necessary
export async function deleteFlashcard(
    cardId: number,
    setId: number,
    currentCard: number,
) {
    const { userId } = await auth();

    // Only allow users who are logged in to delete flashcards
    if (!userId) throw new Error("Unauthorized");

    // Find user ID of flashcard creator
    const set = await db.query.flashcardSet.findFirst({
        where: eq(flashcardSet.id, setId),
        columns: { userId: true },
    });

    // Only let the set owner delete this flashcard
    if (!set || set.userId !== userId) {
        throw new Error("Forbidden: You do not own this flashcard set");
    }

    // Get the total number of cards belonging to this set
    const [{ value: totalCards }] = await db
        .select({ value: count() })
        .from(flashcard)
        .where(eq(flashcard.setId, setId));

    // Prevent user from deleting this flashcard if there is only 1 card in the set
    if (totalCards <= 1) {
        throw new Error("A set must have at least 1 card.");
    }

    await db.transaction(async (tx) => {
        // Delete the flashcard
        await tx.delete(flashcard).where(eq(flashcard.id, cardId));

        // Get the remaining cards in the set
        const remainingCards = await tx.query.flashcard.findMany({
            where: eq(flashcard.setId, setId),
            orderBy: [asc(flashcard.order), asc(flashcard.id)],
        });

        // Update the flashcard order
        for (let i = 0; i < remainingCards.length; i++) {
            await tx
                .update(flashcard)
                .set({ order: i })
                .where(eq(flashcard.id, remainingCards[i].id))
        }
    });

    // Get the new total amount of cards
    const newTotalCards = totalCards - 1;

    // Redirect to next card in set if deleted card is visible
    if (currentCard && currentCard >= newTotalCards) {
        redirect(`/set/${setId}?page=${newTotalCards}`)
    }

    revalidatePath(`/set/${setId}`);
}

// Edit selected flashcard
export async function updateFlashcard(
    prevState: FlashcardState,
    formData: FormData
) {
    const { userId } = await auth();

    // Only allow logged in users to update flashcard
    if (!userId) throw new Error("Unauthorized");

    // Get necessary form elements
    const cardId = Number(formData.get("cardId"));
    const setId = Number(formData.get("setId"));
    const term = (formData.get("term") as string)?.trim();
    const definition = (formData.get("definition") as string)?.trim();

    // Ensure user has included a  term and definition
    if (!term || !definition) {
        return {
            error: "Validation failed",
            errors: {
                term: !term ? ["Term is required."] : undefined,
                definition: !definition ? ["Definition is required."] : undefined,
            }
        };
    }

    // Get user ID of flashcard creator
    const set = await db.query.flashcardSet.findFirst({
        where: eq(flashcardSet.id, setId),
        columns: { userId: true }
    });

    // Prevent users from deleting each other's flashcards
    if (!set || set.userId !== userId) {
        return { success: false, error: "Forbidden: You do not own this flashcard set" };
    }

    // Update the flashcard
    await db
        .update(flashcard)
        .set({ term, definition })
        .where(eq(flashcard.id, cardId));

    revalidatePath(`/sets/${setId}`);

    return { success: true };
}