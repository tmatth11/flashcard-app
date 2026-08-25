import { fetchFlashcardSetsPages } from "@/app/_lib/data";
import FlashcardSetList from "./flashcard-set-list";
import Pagination from "./pagination";
import Searchbox from "./searchbox";
import { Suspense } from "react";
import SortBy from "./sort-by";

export default async function FlashcardSetView({
    placeholder,
    isPublic,
    isPrivate,
    query,
    currentPage,
    sortBy
}: {
    placeholder: string;
    isPublic: boolean;
    isPrivate: boolean;
    query: string;
    currentPage: number;
    sortBy: string;
}) {
    const filters = {
        isPublic: isPublic,
        isPrivate: isPrivate,
        query: query,
        currentPage: currentPage,
        sortBy: sortBy
    };

    const totalPages = await fetchFlashcardSetsPages(filters);

    return (
        <div className="flex w-3xs flex-col justify-center md:w-xl lg:w-3xl">
            <SortBy defaultValue="created-descending" />
            <Searchbox placeholder={placeholder} />
            <Suspense fallback={<p className="mt-4 text-center">Loading...</p>}>
                <FlashcardSetList
                    isPublic={isPublic}
                    isPrivate={isPrivate}
                    query={query}
                    currentPage={currentPage}
                    sortBy={sortBy}
                />
            </Suspense>
            <Pagination totalPages={totalPages} />
        </div>
    );
}
