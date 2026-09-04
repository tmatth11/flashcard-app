import { getFlashcardSetById } from "@/app/_lib/data";
import { SetPageProps } from "../../types";
import { notFound, redirect } from "next/navigation";
import z from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import FlashcardDisplay from "../../_components/flashcard-display";
import FlashcardItem from "../../_components/flashcard-item";
import { DeleteFlashcardSetButton } from "../../_components/delete-flashcard-set-button";
import FlashcardFilter from "../../_components/flashcard-filter";

const IdParamSchema = z.coerce.number().int().positive();

export default async function Page({ params, searchParams }: SetPageProps) {
    const { userId } = await auth();

    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const listFilter = resolvedSearchParams?.filter || "all";
    const studyFilter = resolvedSearchParams?.study;

    const result = IdParamSchema.safeParse(resolvedParams["set-id"]);
    if (!result.success) {
        notFound();
    }

    const setId: number = result.data;
    const setData = await getFlashcardSetById(setId, userId);

    if (!setData || (!setData.public && setData.userId !== userId)) {
        notFound();
    }

    const isOwner = setData.userId === userId;
    const allFlashcards = setData.flashcards.map((card) => ({
        ...card,
        isStarred: card.stars?.length > 0,
    }));
    const hasStarredCards = allFlashcards.some((card) => card.isStarred);

    const displayFlashcards =
        studyFilter === "starred"
            ? allFlashcards.filter((card) => card.isStarred)
            : allFlashcards;

    if (studyFilter === "starred" && displayFlashcards.length === 0) {
        const params = new URLSearchParams(resolvedSearchParams);
        params.delete("study");
        params.delete("page");
        params.delete("filter");
        redirect(`/set/${setId}?${params.toString()}`);
    }

    const itemListFlashcards =
        listFilter === "starred"
            ? allFlashcards.filter((card) => card.isStarred)
            : allFlashcards;

    const totalDisplayCards = displayFlashcards.length;
    const currentCard = Math.min(
        Math.max(1, Number(resolvedSearchParams?.page) || 1),
        totalDisplayCards || 1,
    );

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
                <FlashcardDisplay
                    isOwner={isOwner}
                    totalCards={setData.flashcards.length}
                    currentCard={currentCard}
                    flashcards={displayFlashcards}
                    hasStarredCards={hasStarredCards}
                />
                <div className="mt-4 flex flex-col gap-2 md:flex-row md:justify-between">
                    <p className="text-lg font-semibold">
                        Terms in this set ({`${setData.flashcards.length}`})
                    </p>
                    {isOwner && (
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/edit-set/${setId}`}
                                className="button bg-yellow-600 hover:bg-yellow-500"
                            >
                                Edit
                            </Link>
                            <DeleteFlashcardSetButton
                                id={setId}
                                username={username}
                            />
                        </div>
                    )}
                </div>
                <FlashcardFilter />
                <div className="mt-4">
                    {itemListFlashcards.length === 0 ? (
                        <p className="text-center">
                            There are no flashcards to display.
                        </p>
                    ) : (
                        itemListFlashcards.map((flashcard, index) => (
                            <FlashcardItem
                                key={flashcard.id}
                                index={index}
                                flashcard={{
                                    ...flashcard,
                                    setId,
                                }}
                                isOwner={isOwner}
                                totalCards={itemListFlashcards.length}
                                currentCard={currentCard}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
