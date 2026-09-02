"use client";

import { Pencil } from "lucide-react";
import { Flashcard } from "../types";
import { useState } from "react";
import DeleteFlashcardButton from "./delete-flashcard-button";
import EditFlashcardModal from "./edit-flashcard-modal";
import StarButton from "./star-button";

export default function FlashcardItem({
    isOwner,
    flashcard,
    totalCards,
    currentCard,
}: {
    isOwner: boolean;
    flashcard: Flashcard;
    totalCards: number;
    currentCard: number;
}) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <>
            <div className="mt-2 rounded-md bg-neutral-200 p-2 dark:bg-slate-700">
                <div className="mb-2 flex items-center justify-between gap-2 p-1">
                    <span>{flashcard.order! + 1}</span>
                    <div className="flex items-center">
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
                </div>
                <div className="flex flex-col md:flex-row md:justify-between">
                    <p className="text-lg break-normal md:w-1/2">
                        {flashcard.term}
                    </p>
                    <div className="mx-2 hidden min-h-[1em] w-0.5 self-stretch bg-neutral-100 md:inline-block dark:bg-white/10"></div>
                    <hr className="md:none my-2 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
                    <p className="break-normal md:w-1/2">
                        {flashcard.definition}
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
