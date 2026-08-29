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

export interface Flashcard {
    id: number;
    term: string;
    definition: string;
}

export interface FlashcardSetFormProps {
    setId?: number;
    initialData?: {
        title: string;
        description: string | null;
        isPublic: boolean;
        flashcards: Flashcard[]
    };
}

export interface ViewAndEditSetPageProps {
    params: Promise<{
        "set-id": string;
    }>;
}