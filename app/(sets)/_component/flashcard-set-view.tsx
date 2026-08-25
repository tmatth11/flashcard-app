import FlashcardSetList from "./flashcard-set-list";
import Searchbox from "./searchbox";

export default async function FlashcardSetView({
    placeholder,
    isPublic,
    isPrivate,
    query
}: {
    placeholder: string;
    isPublic: boolean;
    isPrivate: boolean;
    query: string;
}) {
    return (
        <div className="flex flex-col justify-center">
            <Searchbox placeholder={placeholder} />
            {/* TODO: Fix width changing */}
            <FlashcardSetList isPublic={isPublic} isPrivate={isPrivate} query={query} />
        </div>
    );
}
