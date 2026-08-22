"use client";

import { Move, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";

export default function FlashcardSetForm() {
    const baseId = useId();

    const [flashcards, setFlashcards] = useState(() => [
        { id: crypto.randomUUID() },
    ]);

    const appendCard = () => {
        setFlashcards((prev) => [...prev, { id: crypto.randomUUID() }]);
    };

    const insertCard = (index: number) => {
        setFlashcards((prev) => prev.toSpliced(index + 1, 0, {id: crypto.randomUUID()}));
    };

    const canRemoveCard = () => flashcards.length > 1;

    const removeCard = (id: string) => {
        if (!canRemoveCard) return;
        setFlashcards((prev) => prev.filter((c) => c.id !== c.id));
    };

    return (
        <form className="flex flex-col justify-center md:w-2xl lg:w-3xl">
            {/* Create Set header */}
            <div className="mt-5 flex flex-col items-center justify-between gap-2 md:flex-row md:gap-0">
                <h1 className="text-center text-xl font-semibold">
                    Create a new flashcard set
                </h1>
                <button type="submit" className="button bg-blue-500">
                    Create
                </button>
            </div>
            {/* Visibility toggle */}
            <label className="flex items-center gap-2">
                <span>Public:</span>
                <input
                    type="checkbox"
                    name="public"
                    id={`${baseId}-public`}
                    defaultChecked
                />
            </label>
            <div className="mt-4 flex w-full flex-col gap-4">
                {/* Title input */}
                <div className="flex flex-col">
                    <textarea
                        name="title"
                        id={`${baseId}-title`}
                        className="rounded-md bg-neutral-300 p-2 dark:bg-slate-800 dark:text-white"
                        placeholder="Enter title"
                    ></textarea>
                    <label htmlFor={`${baseId}-title`} className="mt-1">
                        Title
                    </label>
                </div>
                {/* Description input */}
                <div className="flex flex-col mb-4">
                    <textarea
                        name="description"
                        id={`${baseId}-description`}
                        className="rounded-md bg-neutral-300 p-2 dark:bg-slate-800 dark:text-white"
                        placeholder="Enter description"
                    ></textarea>
                    <label htmlFor={`${baseId}-description`} className="mt-1">
                        Description
                    </label>
                </div>
            </div>
            {/* Flashcard list */}
            {flashcards.map((flashcard, index) => {
                const termId = `${baseId}-card-${index}-term`;
                const definitionId = `${baseId}-card-${index}-definition`;
                const isLastCard = index == flashcards.length - 1;

                return (
                    <div key={flashcard.id}>
                        <div className="rounded-md bg-neutral-200 p-2 dark:bg-slate-700">
                            <div className="flex items-center justify-between p-2 dark:text-white">
                                {/* Flashcard number */}
                                <span className="break-all">{index + 1}</span>
                                <div className="flex items-center gap-4">
                                    {/* Move button */}
                                    <button
                                        type="button"
                                        aria-label="Move card"
                                    >
                                        <Move />
                                    </button>
                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        aria-label="Delete card"
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row">
                                {/* Term */}
                                <div className="flex w-full flex-col">
                                    <textarea
                                        name="term"
                                        id={termId}
                                        className="rounded-md bg-neutral-300 p-1 dark:bg-slate-800 dark:text-white"
                                        placeholder="Enter term"
                                    ></textarea>
                                    <label
                                        htmlFor={termId}
                                        className="mt-1 dark:text-white"
                                    >
                                        Term
                                    </label>
                                </div>
                                {/* Definition */}
                                <div className="flex w-full flex-col">
                                    <textarea
                                        name="definition"
                                        id={definitionId}
                                        className="rounded-md bg-neutral-300 p-1 dark:bg-slate-800 dark:text-white"
                                        placeholder="Enter definition"
                                    ></textarea>
                                    <label
                                        htmlFor={definitionId}
                                        className="mt-1 dark:text-white"
                                    >
                                        Definition
                                    </label>
                                </div>
                            </div>
                        </div>

                        {!isLastCard && (
                            <div className="my-2 flex justify-center">
                                <button
                                    type="button"
                                    className="rounded-full bg-blue-500 p-2 font-semibold cursor-pointer"
                                    onClick={() => insertCard(index)}
                                >
                                    <Plus />
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
            {/* Add Card button */}
            <button
                type="button"
                onClick={appendCard}
                className="button mt-4 bg-blue-500"
                aria-label="Add card"
            >
                Add card
            </button>
        </form>
    );
}
