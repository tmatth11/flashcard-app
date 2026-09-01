import { Flashcard } from "../types";
import Card from "./card";
import Pagination from "./pagination";

export default function FlashcardDisplay({
    flashcards,
    currentCard,
    isOwner,
    totalCards
}: {
    flashcards: Flashcard[];
    currentCard: number;
    isOwner: boolean;
    totalCards: number;
}) {
    const totalFlashcards = flashcards.length;

    return (
        <div className="mt-4 flex flex-col items-center">
            <Card key={currentCard - 1} flashcard={flashcards[currentCard - 1]} isOwner={isOwner} totalCards={totalCards} currentCard={currentCard} />
            <Pagination totalPages={totalFlashcards} />
        </div>
    );
}
