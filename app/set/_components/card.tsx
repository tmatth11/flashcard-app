"use client";

import { useState } from "react";
import { Flashcard } from "../../types";
import { Pencil } from "lucide-react";
import DeleteFlashcardButton from "./delete-flashcard-button";
import EditFlashcardModal from "./edit-flashcard-modal";
import StarButton from "./star-button";

export default function Card({
    flashcard,
    isOwner,
    totalCards,
    currentCard,
}: {
    flashcard: Flashcard;
    isOwner: boolean;
    totalCards: number;
    currentCard: number;
}) {
    const [termSide, setTermSide] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter" || e.key == " ") {
            e.preventDefault();
            setTermSide((prev) => !prev);
        }
    };

    return (
        <>
            <div className="mt-2 flex h-90 w-full flex-col overflow-y-auto rounded-md bg-neutral-200 p-2 dark:bg-slate-700">
                <div className="flex items-center justify-end">
                    <StarButton
                        flashcardId={flashcard.id}
                        setId={flashcard.setId!}
                        isStarred={flashcard.isStarred!}
                    />
                    {isOwner && (
                        <div className="flex items-center">
                            <button
                                onClick={() => setIsEditOpen(true)}
                                aria-label="edit"
                                title="Edit flashcard"
                                className="button"
                            >
                                <Pencil className="text-black hover:text-gray-500 dark:text-white" />
                            </button>
                            <DeleteFlashcardButton
                                totalCards={totalCards}
                                cardId={flashcard.id}
                                setId={flashcard.setId!}
                                currentCard={currentCard}
                            />
                        </div>
                    )}
                </div>
                <button
                    role="button"
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    onClick={() => setTermSide((prev) => !prev)}
                    className="flex flex-1 cursor-pointer items-center justify-center focus:ring-2 focus:ring-blue-500 focus:outline-none dark:focus:ring-blue-400"
                >
                    <p className="w-full text-center text-xl wrap-break-word">
                        {termSide ? flashcard.term : flashcard.definition}
                    </p>
                </button>
            </div>

            {isOwner && (
                <EditFlashcardModal
                    key={`${flashcard.id}-${isEditOpen}`}
                    card={flashcard}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </>
    );
}
