'use server';

import { auth } from "@clerk/nextjs/server";
import { db } from "../_db/drizzle";
import { flashcardStar } from "../_db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Toggle the star the current user has applied to the flashcard
export async function toggleStarFlashcard(flashcardId: number, setId: number) {
    const { userId } = await auth();

    // Only allow logged in users to star flashcards
    if (!userId) throw new Error("Unauthorized");

    // Determine if user has already starred flashcard
    const existingStar = await db.query.flashcardStar.findFirst({
        where: and(
            eq(flashcardStar.userId, userId),
            eq(flashcardStar.flashcardId, flashcardId)
        ),
    });

    // User has flashcard already starred
    if (existingStar) {
        // Delete existing star
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
        // Add new star
        await db.insert(flashcardStar).values({
            userId,
            flashcardId
        });
    }

    revalidatePath(`/set/${setId}`);
}