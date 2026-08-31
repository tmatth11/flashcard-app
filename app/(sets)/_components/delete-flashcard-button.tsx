import { deleteFlashcard } from "@/app/actions/set-actions";
import { Trash } from "lucide-react";

export default function DeleteFlashcardButton({
    cardId,
    setId,
    totalCards,
}: {
    cardId: number;
    setId: number;
    totalCards: number;
}) {
    const deleteFlashcardWithId = deleteFlashcard.bind(null, cardId, setId);
    const isOnlyCard = totalCards <= 1;

    return (
        <form action={deleteFlashcardWithId}>
            <button
                type="submit"
                aria-label="delete"
                title="Delete"
                className="cursor-pointer enabled:hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isOnlyCard}
            >
                <Trash size={16} />
            </button>
        </form>
    );
}
