import { deleteFlashcardSet } from "@/app/actions/set-actions";
import { FlashcardSetFilters } from "../types";

export function DeleteFlashcardSetButton({
    id,
    username,
    filters
}: {
    id: number;
    username: string;
    filters: FlashcardSetFilters
}) {
    const deleteFlashcardSetWithId = deleteFlashcardSet.bind(
        null,
        id,
        username,
        filters
    );

    return (
        <form action={deleteFlashcardSetWithId}>
            <button className="button bg-red-600 hover:bg-red-500">
                Delete
            </button>
        </form>
    );
}
