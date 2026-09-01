import { Flashcard } from "../types";
import Card from "./card";
import Pagination from "./pagination";

export default function FlashcardDisplay({
    flashcards,
    currentCard
}: {
    flashcards: Flashcard[];
    currentCard: number;
}) {
    const totalFlashcards = flashcards.length;

    return (
        <div className="mt-4 flex flex-col items-center">
            <Card key={currentCard - 1} flashcard={flashcards[currentCard - 1]} />
            <Pagination totalPages={totalFlashcards} />
        </div>
    );
}
