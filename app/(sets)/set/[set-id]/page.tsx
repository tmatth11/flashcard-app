import { getFlashcardSetById } from "@/app/_lib/data";
import { ViewAndEditSetPageProps } from "../../types";
import { notFound } from "next/navigation";
import z from "zod";

const IdParamSchema = z.coerce.number().int().positive()

export default async function Page({params}: ViewAndEditSetPageProps) {
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

    return (
        <p>/set/[set-id] works!</p>
    );
}