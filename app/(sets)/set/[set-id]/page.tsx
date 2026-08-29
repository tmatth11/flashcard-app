import { getFlashcardSetById } from "@/app/_lib/data";
import { ViewAndEditSetPageProps } from "../../types";
import { notFound } from "next/navigation";
import z from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import FlashcardDisplay from "../../_components/flashcard-display";
import FlashcardItem from "../../_components/flashcard-item";

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

    if (!setData || (!setData.public && setData.userId !== userId)) {
        notFound();
    }

    const isOwner = setData.userId === userId;

    const client = await clerkClient();
    const setOwner = await client.users.getUser(setData.userId);
    const username = setOwner.username ?? "Unknown user";
    const imageUrl = setOwner.imageUrl ?? "/blank-user.png";

    return (
        <div className="flex flex-col items-center p-2">
            <div className="flex w-3xs flex-col justify-center md:w-xl lg:w-3xl">
                <span className="text-sm">
                    Created by:{" "}
                    <Image
                        width="20"
                        height="20"
                        src={imageUrl}
                        alt={username}
                        className="inline-block rounded-full"
                    />{" "}
                    <Link
                        className="hover:underline"
                        href={`/sets/${username}`}
                    >
                        {isOwner ? "You" : username}
                    </Link>
                </span>
                <h1 className="mt-4 text-lg font-semibold break-all md:text-xl">
                    {setData.title}
                </h1>
                <p className="mt-2 break-all">{setData.description}</p>
                <FlashcardDisplay />
                <div className="mt-4">
                    {setData.flashcards.map((flashcard) => (
                        <FlashcardItem
                            key={flashcard.id}
                            flashcard={{ ...flashcard, setId }}
                            isOwner={isOwner}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
