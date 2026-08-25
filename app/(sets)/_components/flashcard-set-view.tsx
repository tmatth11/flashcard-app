import { fetchFlashcardSetsPages } from "@/app/_lib/data";
import FlashcardSetList from "./flashcard-set-list";
import Pagination from "./pagination";
import Searchbox from "./searchbox";
import { Suspense } from "react";

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
        currentPage: currentPage,
    };

    const totalPages = await fetchFlashcardSetsPages(filters);

    return (
        <div className="flex w-3xs flex-col justify-center md:w-xl lg:w-3xl">
            <Searchbox placeholder={placeholder} />
            <Suspense fallback={<p className="mt-4 text-center">Loading...</p>}>
                <FlashcardSetList
                    isPublic={isPublic}
                    isPrivate={isPrivate}
                    query={query}
                    currentPage={currentPage}
                />
            </Suspense>
            <Pagination totalPages={totalPages} />
        </div>
    );
}
