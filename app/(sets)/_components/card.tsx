"use client";

import { useState } from "react";
import { Flashcard } from "../types";
import { Pencil } from "lucide-react";
import DeleteFlashcardButton from "./delete-flashcard-button";
import EditFlashcardModal from "./edit-flashcard-modal";

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
            <div
                onClick={() => setTermSide((prev) => !prev)}
                className="mt-2 flex h-90 w-full cursor-pointer flex-col overflow-y-auto rounded-md bg-neutral-200 p-2 dark:bg-slate-700"
            >
                {isOwner && (
                    <div className="flex items-center justify-end">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditOpen(true);
                            }}
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
                <p className="my-auto text-center text-xl break-all">
                    {termSide ? flashcard.term : flashcard.definition}
                </p>
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
