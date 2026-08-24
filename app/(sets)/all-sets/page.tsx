import FlashcardSetList from "../_component/flashcard-set-list";

export default function Page() {
    return (
        <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-2xl font-semibold">
                All Flashcard Sets
            </h1>
            <FlashcardSetList isPublic={true} isPrivate={false} />
        </div>
    );
}
