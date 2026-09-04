import { Flashcard } from "../types";
import Card from "./card";
import Pagination from "./pagination";
import StudyStarredCheckbox from "./study-starred-checkbox";

export default function FlashcardDisplay({
    flashcards,
    currentCard,
    isOwner,
    totalCards,
    hasStarredCards,
}: {
    flashcards: Flashcard[];
    currentCard: number;
    isOwner: boolean;
    totalCards: number;
    hasStarredCards: boolean;
}) {
    const totalFlashcards = flashcards.length;
    const activeCard = flashcards[currentCard - 1];

    return (
        <div className="mt-4 flex flex-col items-center">
            <Card
                key={activeCard.id}
                flashcard={activeCard}
                isOwner={isOwner}
                totalCards={totalCards}
                currentCard={currentCard}
            />
            <Pagination totalPages={totalFlashcards} />
            <div className="ml-auto">
                {hasStarredCards && <StudyStarredCheckbox />}
            </div>
        </div>
    );
}
