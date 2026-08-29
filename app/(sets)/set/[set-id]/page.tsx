import { getFlashcardSetById } from "@/app/_lib/data";
import { ViewAndEditSetPageProps } from "../../types";
import { notFound } from "next/navigation";
import z from "zod";
import { auth } from "@clerk/nextjs/server";

const IdParamSchema = z.coerce.number().int().positive();

export default async function Page({ params }: ViewAndEditSetPageProps) {
    const { userId } = await auth();
    
    const resolvedParams = await params;
    const result = IdParamSchema.safeParse(resolvedParams["set-id"]);
    if (!result.success) {
        notFound();
    }

    const setId: number = result.data;
    const setData = await getFlashcardSetById(setId);

    if (!setData || !setData.public && setData.userId !== userId) {
        notFound();
    }

    return (
        <div className="flex flex-col items-center p-2">
            /set/{`${setId}`} works!
        </div>
    );
}
