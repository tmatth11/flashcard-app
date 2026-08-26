import { getAllFlashcardSets } from "@/app/_lib/data";
import Image from "next/image";
import { FlashcardSetProps } from "../types";
import Link from "next/link";

export default async function FlashcardSetList(props: FlashcardSetProps) {
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
            {flashcardSets.map((flashcardSet) => {
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
                            {props.isUserPage ?? (
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
                            {flashcardSet.title}
                        </span>
                        <span className="line-clamp-2 text-sm break-all">
                            {flashcardSet.description}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
