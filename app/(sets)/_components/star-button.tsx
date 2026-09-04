"use client";

import { toggleStarFlashcard } from "@/app/actions/set-actions";
import { Star } from "lucide-react";
import React, { useTransition } from "react";

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

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
            await toggleStarFlashcard(flashcardId, setId);
        });
    };

    return (
        <button
            onClick={handleClick}
            className={`cursor-pointer disabled:opacity-75 ${
                isStarred
                    ? "text-yellow-400 enabled:hover:text-yellow-500"
                    : "text-neutral-400 enabled:hover:text-yellow-400 dark:text-white"
            }`}
            disabled={isPending}
            type="button"
            title="Star"
            aria-label={isStarred ? "Unstar flashcard" : "Star flashcard"}
        >
            <Star fill="currentColor" color="currentColor" size={16} />
        </button>
    );
}
