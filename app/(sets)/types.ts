export interface FlashcardSetFilters {
    query: string;
    currentPage: number;
    sortBy: string;
    targetUsername?: string;
    visibility?: "all" | "private" | "public";
}
export interface FlashcardSetProps {
    query: string;
    currentPage: number;
    sortBy: string;
    targetUsername?: string;
    visibility?: "all" | "private" | "public";
    isUserPage: boolean;
}

export interface FlashcardSetViewProps extends FlashcardSetProps {
    placeholder: string;
    isOwner?: boolean;
}