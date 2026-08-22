import { auth } from "@clerk/nextjs/server";
import FlashcardSetForm from "./_components/flashcard-form";

export default async function Page() {
    await auth.protect();

    return (
        <div className="flex flex-col items-center p-2">
            <FlashcardSetForm />
        </div>
    );
}
