import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import FlashcardSetForm from "../_components/flashcard-form";

export const metadata: Metadata = {
    title: "Create Set",
    description: "Create your own flashcard set",
};

export default async function Page() {
    await auth.protect();

    return (
        <div className="flex flex-col items-center p-2">
            <FlashcardSetForm />
        </div>
    );
}
