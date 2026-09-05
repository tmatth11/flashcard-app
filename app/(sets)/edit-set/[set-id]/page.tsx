import { auth } from "@clerk/nextjs/server";
import { ViewAndEditSetPageProps } from "../../types";
import { notFound, unauthorized } from "next/navigation";
import FlashcardSetForm from "../../_components/flashcard-form";
import { getFlashcardSetById } from "@/app/_lib/data";
import z from "zod";

const IdParamSchema = z.coerce.number().int().positive()

export default async function Page({ params }: ViewAndEditSetPageProps) {
    const { userId } = await auth.protect();
    const resolvedParams = await params;
    const result = IdParamSchema.safeParse(resolvedParams["set-id"]);
    if (!result.success) {
        notFound();
    }

    const setId: number = result.data;

    const setData = await getFlashcardSetById(setId);
    if (!setData) {
        notFound();
    }
    else if (setData.userId !== userId) {
        console.log("Unauthorized");
        unauthorized();
    }

    return (
        <div className="flex flex-col items-center p-2">
            <FlashcardSetForm
                setId={setId}
                initialData={{
                    title: setData.title,
                    description: setData.description,
                    isPublic: setData.public,
                    flashcards: setData.flashcards,
                }}
            />
        </div>
    );
}
