export interface FlashcardSetFilters {
    query: string;
    currentPage: number;
    sortBy: string;
    targetUsername?: string;
    visibility?: "all" | "private" | "public";
}
export interface FlashcardSetProps extends FlashcardSetFilters {
    isUserPage: boolean;
    isOwner?: boolean;
}

export interface FlashcardSetViewProps extends FlashcardSetProps {
    placeholder: string;
}