import { deleteFlashcardSet } from "@/app/_actions/set-actions";
import { FlashcardSetFilters } from "../types";

export function DeleteFlashcardSetButton({
    id,
    username,
    filters,
}: {
    id: number;
    username: string;
    filters?: FlashcardSetFilters;
}) {
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
