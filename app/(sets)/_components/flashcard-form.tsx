"use client";

import {
    createFlashcardSet,
    FlashcardSetState,
    updateFlashcardSet,
} from "@/app/actions/set-actions";
import { Plus, Trash2 } from "lucide-react";
import { useActionState, useId, useState } from "react";
import { Flashcard, FlashcardSetFormProps } from "../types";

const initialState: FlashcardSetState = {};

export default function FlashcardSetForm({
    setId,
    initialData,
}: FlashcardSetFormProps) {
    const isEditMode = Boolean(setId);
    const actionToUse = isEditMode ? updateFlashcardSet : createFlashcardSet;

    const baseId = useId();
    const [state, formAction, isPending] = useActionState<FlashcardSetState, FormData>(
        actionToUse,
        initialState,
    );

    const [flashcards, setFlashcards] = useState<Flashcard[]>(() =>
        initialData?.flashcards.length
            ? initialData.flashcards
            : [{ id: Date.now(), term: "", definition: "" }],
    );
    const [title, setTitle] = useState(initialData?.title ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");

    const appendCard = () => {
        setFlashcards((prev) => [
            ...prev,
            { id: Date.now(), term: "", definition: "" },
        ]);
    };

    const insertCard = (index: number) => {
        setFlashcards((prev) =>
            prev.toSpliced(index + 1, 0, {
                id: Date.now(),
                term: "",
                definition: "",
            }),
        );
    };

    const removeCard = (id: number) => {
        if (flashcards.length <= 1) return;
        setFlashcards((prev) => prev.filter((c) => c.id !== id));
    };

    const updateCard = (
        id: number,
        field: "term" | "definition",
        value: string,
    ) => {
        setFlashcards((prev) =>
            prev.map((card) =>
                card.id === id ? { ...card, [field]: value } : card,
            ),
        );
    };

    const isFormInvalid =
        flashcards.length === 0 ||
        !title.trim() ||
        flashcards.some((c) => !c.term.trim() || !c.definition.trim());

    return (
        <form
            action={formAction}
            className="flex flex-col justify-center md:w-2xl lg:w-3xl"
        >
            {setId && <input type="hidden" name="setId" value={setId} />}
            {/* Error message banner */}
            {state?.message && (
                <div className="rounded-md border-4 border-red-700 bg-red-500 p-2 text-center break-all text-white">
                    {state.message}
                </div>
            )}

            {/* Create Set header */}
            <div className="mt-5 flex flex-col items-center justify-between gap-2 md:flex-row md:gap-0">
                <h1 className="text-center text-xl font-semibold">
                    Create a new flashcard set
                </h1>
                <button
                    type="submit"
                    disabled={isPending || isFormInvalid}
                    className="button bg-blue-500 enabled:hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-75"
                >
                    {isEditMode ? "Save" : "Create"}
                </button>
            </div>
            {/* Visibility toggle */}
            <label className="mt-4 flex cursor-pointer items-center gap-2">
                <span>Public:</span>
                <input
                    className="cursor-pointer"
                    type="checkbox"
                    name="public"
                    id={`${baseId}-public`}
                    defaultChecked={initialData?.isPublic ?? true}
                />
            </label>
            <div className="mt-4 flex w-full flex-col gap-4">
                {/* Title input */}
                <div className="flex flex-col">
                    <textarea
                        name="title"
                        id={`${baseId}-title`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded-md bg-neutral-300 p-2 dark:bg-slate-800 dark:text-white"
                        placeholder="Enter title"
                        required
                    ></textarea>
                    <label htmlFor={`${baseId}-title`} className="mt-1">
                        Title
                    </label>
                    {state?.errors?.title && (
                        <div className="mt-1 text-sm text-red-500">
                            Errors:
                            <ul className="break-all">
                                {state.errors.title.map((error, i) => (
                                    <li key={i}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {/* Description input */}
                <div className="mb-4 flex flex-col">
                    <textarea
                        name="description"
                        id={`${baseId}-description`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded-md bg-neutral-300 p-2 dark:bg-slate-800 dark:text-white"
                        placeholder="Enter description"
                    ></textarea>
                    <label htmlFor={`${baseId}-description`} className="mt-1">
                        Description
                    </label>
                    {state?.errors?.description && (
                        <div className="mt-1 text-sm text-red-500">
                            Errors:
                            <ul className="break-all">
                                {state.errors.description.map((error, i) => (
                                    <li key={i}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {state?.errors?.cards && (
                <div className="mb-2 text-sm text-red-500">
                    Errors:
                    <ul className="break-all">
                        {state.errors.cards.map((error, i) => (
                            <li key={i}>- {error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Flashcard list */}
            {flashcards.map((flashcard, index) => {
                const termId = `${baseId}-card-${index}-term`;
                const definitionId = `${baseId}-card-${index}-definition`;
                const isLastCard = index === flashcards.length - 1;
                const isRemovable = flashcards.length > 1;

                return (
                    <div key={flashcard.id}>
                        <div className="rounded-md bg-neutral-200 p-2 dark:bg-slate-700">
                            <div className="flex items-center justify-between p-2 dark:text-white">
                                {/* Flashcard number */}
                                <span className="break-all">{index + 1}</span>
                                <div className="flex items-center gap-4">
                                    {/* Move button - Maybe some day */}
                                    {/* <button
                                        type="button"
                                        aria-label="Move card"
                                    >
                                        <Move />
                                    </button> */}
                                    {/* Delete button */}
                                    <button
                                        type="button"
                                        className="cursor-pointer enabled:hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-label="Delete card"
                                        disabled={!isRemovable}
                                        onClick={() => removeCard(flashcard.id)}
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
                                        value={flashcard.term}
                                        onChange={(e) =>
                                            updateCard(
                                                flashcard.id,
                                                "term",
                                                e.target.value,
                                            )
                                        }
                                        className="rounded-md bg-neutral-300 p-1 dark:bg-slate-800 dark:text-white"
                                        placeholder="Enter term"
                                        required
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
                                        value={flashcard.definition}
                                        onChange={(e) =>
                                            updateCard(
                                                flashcard.id,
                                                "definition",
                                                e.target.value,
                                            )
                                        }
                                        className="rounded-md bg-neutral-300 p-1 dark:bg-slate-800 dark:text-white"
                                        placeholder="Enter definition"
                                        required
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
                                    className="cursor-pointer rounded-full bg-blue-500 p-2 font-semibold text-white hover:bg-blue-400"
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
                className="button mt-4 bg-blue-500 hover:bg-blue-400"
                aria-label="Add card"
            >
                Add card
            </button>
            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={isPending || isFormInvalid}
                    className="button mt-4 w-1/2 bg-blue-500 enabled:hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-75"
                >
                    {isEditMode ? "Save" : "Create"}
                </button>
            </div>
        </form>
    );
}
