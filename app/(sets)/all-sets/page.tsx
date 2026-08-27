import FlashcardSetView from "../_components/flashcard-set-view";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        sort?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sort || "created-descending";

    return (
        <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-2xl font-semibold">
                All Flashcard Sets
            </h1>
            <FlashcardSetView
                visibility="public"
                query={query}
                currentPage={currentPage}
                sortBy={sortBy}
                placeholder="Search all sets"
                isUserPage={false}
            />
        </div>
    );
}
