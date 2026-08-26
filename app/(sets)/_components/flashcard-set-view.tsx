import { fetchFlashcardSetsPages } from "@/app/_lib/data";
import FlashcardSetList from "./flashcard-set-list";
import Pagination from "./pagination";
import Searchbox from "./searchbox";
import { Suspense } from "react";
import SortBy from "./sort-by";
import VisibilityFilter from "./visibility-filter";
import { FlashcardSetViewProps } from "../types";

export default async function FlashcardSetView({
    placeholder,
    query,
    currentPage,
    sortBy,
    targetUsername,
    isOwner = false,
    visibility = "all",
    isUserPage
}: FlashcardSetViewProps) {
    const filters = {
        query: query,
        currentPage: currentPage,
        sortBy: sortBy,
        targetUsername: targetUsername,
        visibility: visibility,
    };
    
    const totalPages = await fetchFlashcardSetsPages(filters);

    return (
        <div className="flex w-3xs flex-col justify-center md:w-xl lg:w-3xl">
            {isOwner && <VisibilityFilter defaultValue={visibility} />}
            <SortBy defaultValue="created-descending" />
            <Searchbox placeholder={placeholder} />
            <Suspense fallback={<p className="mt-4 text-center">Loading...</p>}>
                <FlashcardSetList
                    query={query}
                    currentPage={currentPage}
                    sortBy={sortBy}
                    targetUsername={targetUsername}
                    visibility={visibility}
                    isUserPage={isUserPage}
                />
            </Suspense>
            <Pagination totalPages={totalPages} />
        </div>
    );
}
