import { useActionState, useEffect } from "react";
import { Flashcard, FlashcardState } from "../types";
import { updateFlashcard } from "@/app/actions/set-actions";
import { X } from "lucide-react";
import ErrorBanner from "./error-banner";

const initialState: FlashcardState = {};

export default function EditFlashcardModal({
    card,
    isOpen,
    onClose,
}: {
    card: Flashcard;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [state, formAction, isPending] = useActionState<
        FlashcardState,
        FormData
    >(updateFlashcard, initialState);

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [state?.success, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-neutral-200 p-6 shadow-xl dark:bg-slate-700">
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        title="Close"
                        className="red-icon"
                    >
                        <X />
                    </button>
                </div>
                <h2 className="mb-4 text-xl font-semibold">Edit Flashcard</h2>
                <form action={formAction} className="flex flex-col">
                    <input type="hidden" name="cardId" value={card.id} />
                    <input type="hidden" name="setId" value={card.setId} />

                    {state?.error && (
                        <ErrorBanner message={state.error} />
                    )}
                    {/* Term input */}
                    <div className="mt-4 flex flex-col">
                        <textarea
                            name="term"
                            id="term"
                            defaultValue={card.term}
                            placeholder="Enter term"
                            required
                        ></textarea>
                        <label htmlFor="term" className="mt-1">
                            Term
                        </label>
                    </div>
                    {/* Definition input */}
                    <div className="mt-4 flex flex-col">
                        <textarea
                            name="definition"
                            id="definition"
                            defaultValue={card.definition}
                            placeholder="Enter definition"
                            required
                        ></textarea>
                        <label htmlFor="definition" className="mt-1">
                            Definition
                        </label>
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="btn btn-red"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isPending}
                            className="btn btn-primary"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
