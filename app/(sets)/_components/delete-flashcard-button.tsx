import { deleteFlashcard } from "@/app/actions/set-actions";
import { Trash } from "lucide-react";

export default function DeleteFlashcardButton({
    cardId,
    setId,
    totalCards,
    currentCard,
}: {
    cardId: number;
    setId: number;
    totalCards: number;
    currentCard: number;
}) {
    const deleteFlashcardWithId = deleteFlashcard.bind(
        null,
        cardId,
        setId,
        currentCard,
    );
    const isOnlyCard = totalCards <= 1;

    return (
        <form action={deleteFlashcardWithId}>
            <button
                onClick={(e) => e.stopPropagation()}
                type="submit"
                aria-label="delete"
                title="Delete flashcard"
                className="red-icon"
                disabled={isOnlyCard}
            >
                <Trash />
                <span className="sr-only">
                    Delete flashcard {isOnlyCard ? "(Disabled: You need at least 2 flashcards to remove this flashcard)" : ""}
                </span>
            </button>
        </form>
    );
}
