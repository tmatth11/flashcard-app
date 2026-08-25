import { fetchFlashcardSetsPages } from "@/app/_lib/data";
import FlashcardSetList from "./flashcard-set-list";
import Pagination from "./pagination";
import Searchbox from "./searchbox";

export default async function FlashcardSetView({
    placeholder,
    isPublic,
    isPrivate,
    query,
    currentPage,
}: {
    placeholder: string;
    isPublic: boolean;
    isPrivate: boolean;
    query: string;
    currentPage: number;
}) {
    const filters = {
        isPublic: isPublic,
        isPrivate: isPrivate,
        query: query,
        currentPage: currentPage
    };

    const totalPages = await fetchFlashcardSetsPages(filters);

    return (
        <div className="flex flex-col justify-center w-3xs md:w-xl lg:w-3xl">
            <Searchbox placeholder={placeholder} />
            <FlashcardSetList isPublic={isPublic} isPrivate={isPrivate} query={query} currentPage={currentPage} />
            <Pagination totalPages={totalPages} />
        </div>
    );
}
