'use server';

import { auth } from '@clerk/nextjs/server';
import { drizzle } from 'drizzle-orm/neon-http';
import z from 'zod';
import { flashcard, flashcardSet } from '../_db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const db = drizzle(process.env.DATABASE_URL!);

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
    const {userId} = await auth();

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