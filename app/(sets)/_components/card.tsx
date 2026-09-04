"use client";

import { useState } from "react";
import { Flashcard } from "../types";
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
                                title="Edit"
                                className="button"
                            >
                                <Pencil
                                    size={16}
                                    className="text-black hover:text-gray-500 dark:text-white"
                                />
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
                <div
                    onClick={() => setTermSide((prev) => !prev)}
                    className="flex flex-1 cursor-pointer items-center justify-center"
                >
                    <p className="text-center text-xl wrap-break-word w-full">
                        {termSide ? flashcard.term : flashcard.definition}
                    </p>
                </div>
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