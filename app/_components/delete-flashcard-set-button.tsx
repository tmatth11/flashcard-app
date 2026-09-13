import { deleteFlashcardSet } from "@/app/_actions/set-actions";
import { FlashcardSetFilters } from "../types";

export interface DeleteFlashcardSetButtonProps {
    id: number;
    username: string;
    filters?: FlashcardSetFilters;
}

export function DeleteFlashcardSetButton({
    id,
    username,
    filters,
}: DeleteFlashcardSetButtonProps) {
    const deleteFlashcardSetWithId = deleteFlashcardSet.bind(
        null,
        id,
        username,
        filters,
    );

    return (
        <form action={deleteFlashcardSetWithId}>
            <button type="submit" className="btn btn-red">
                Delete
            </button>
        </form>
    );
}
