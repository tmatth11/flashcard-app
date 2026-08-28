import { auth } from "@clerk/nextjs/server";
import { EditSetPageProps } from "../../types";
import { notFound } from "next/navigation";
import FlashcardSetForm from "../../_components/flashcard-form";
import { getFlashcardSetById } from "@/app/_lib/data";

export default async function Page({ params }: EditSetPageProps) {
    const { userId } = await auth.protect();
    const resolvedParams = await params;
    const setId = Number(resolvedParams["set-id"]);

    const setData = await getFlashcardSetById(setId);

    if (!setData || setData.userId !== userId) {
        notFound();
    }

    return <div className="flex flex-col items-center p-2">
        <FlashcardSetForm 
        setId={setId}
        initialData={{
            title: setData.title,
            description: setData.description,
            isPublic: setData.public,
            flashcards: setData.flashcards
        }}/>
    </div>;
}
