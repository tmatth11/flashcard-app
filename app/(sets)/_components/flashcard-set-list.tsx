import { getAllFlashcardSets } from "@/app/_lib/data";
import Image from "next/image";
import { FlashcardSetProps } from "../types";
import Link from "next/link";
import { Lock } from "lucide-react";
import { DeleteFlashcardSetButton } from "./delete-flashcard-set-button";

export default async function FlashcardSetList(props: FlashcardSetProps) {
    const { isOwner, isUserPage } = props;

    const filters = {
        query: props.query,
        currentPage: props.currentPage,
        sortBy: props.sortBy,
        targetUsername: props.targetUsername,
        visibility: props.visibility,
    };

    const flashcardSets = await getAllFlashcardSets(filters);

    return (
        <div className="mt-4 flex flex-col justify-center gap-4">
            {(flashcardSets.length == 0 && <p className="text-center">No flashcard sets were found.</p>) ||
                flashcardSets.map((flashcardSet) => {
                    return (
                        <div
                            key={flashcardSet.id}
                            className="flex flex-col rounded-md bg-neutral-200 p-2 dark:bg-slate-700 dark:text-white"
                        >
                            <div className="line-clamp-2 text-sm break-all">
                                <span>{flashcardSet.termCount} Term</span>
                                <span>
                                    {flashcardSet.termCount > 1 ? "s" : ""}{" "}
                                </span>
                                {!isUserPage && (
                                    <span>
                                        <span>| </span>
                                        <Image
                                            width="20"
                                            height="20"
                                            src={flashcardSet.imageUrl}
                                            alt={flashcardSet.username}
                                            className="inline-block rounded-full"
                                        />
                                        <span> </span>
                                        <Link
                                            href={`/sets/${flashcardSet.username}`}
                                            className="hover:underline"
                                        >
                                            {flashcardSet.username}
                                        </Link>
                                    </span>
                                )}
                            </div>

                            <span className="line-clamp-2 text-lg font-semibold break-all">
                                {flashcardSet.title}{" "}
                                {isOwner && !flashcardSet.public && (
                                    <span className="inline-block">
                                        <Lock size={16} />
                                    </span>
                                )}
                            </span>
                            <span className="line-clamp-2 text-sm break-all">
                                {flashcardSet.description}
                            </span>
                            {isOwner && (
                                <div className="flex justify-end gap-2">
                                    <Link href={`/edit-set/${flashcardSet.id}`} className="button bg-yellow-600 hover:bg-yellow-500">
                                        Edit
                                    </Link>
                                    <DeleteFlashcardSetButton
                                        id={flashcardSet.id}
                                        username={flashcardSet.username}
                                        filters={filters}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
        </div>
    );
}
