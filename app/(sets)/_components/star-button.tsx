"use client";

import { toggleStarFlashcard } from "@/app/actions/set-actions";
import { Star } from "lucide-react";
import { useTransition } from "react";

export default function StarButton({
    flashcardId,
    setId,
    isStarred,
}: {
    flashcardId: number;
    setId: number;
    isStarred: boolean;
}) {
    const [isPending, startTransition] = useTransition();

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startTransition(async () => {
                    await toggleStarFlashcard(flashcardId, setId);
                });
            }}
        >
            <button
                className={`cursor-pointer disabled:opacity-75 ${
                    isStarred
                        ? "text-yellow-400 enabled:hover:text-yellow-500"
                        : "dark:text-white text-neutral-400 enabled:hover:text-yellow-400"
                }`}
                disabled={isPending}
                title="Star"
                aria-label={isStarred ? "Unstar flashcard" : "Star flashcard"}
            >
                <Star fill="currentColor" color="currentColor" size={16} />
            </button>
        </form>
    );
}
