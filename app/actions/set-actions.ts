'use server';

import { drizzle } from 'drizzle-orm/neon-http';
import z from 'zod';

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
        cards?: {
            term?: string[];
            definition?: string[]
        }[];
    };
};

export async function createFlashcardSet(prevState: FlashcardSetState, formData: FormData) {

}