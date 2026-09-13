import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAuthUser, mockExistingStar, TEST_PARAMS } from "./helpers";
import { toggleStarFlashcard } from "@/app/_actions/star-actions";
import { db } from "@/app/_db/drizzle";
import { revalidatePath } from "next/cache";

describe("Flashcard Star Actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("throws unauthorized error is user is not logged in", async () => {
        mockAuthUser(null);

        await expect(toggleStarFlashcard(TEST_PARAMS.cardId, TEST_PARAMS.setId)).rejects.toThrow(
            "Unauthorized: You must be logged in to star flashcards."
        );
    });

    it("deletes existing star if user has already starred the flashcard", async () => {
        mockAuthUser();
        mockExistingStar(true);

        await toggleStarFlashcard(TEST_PARAMS.cardId, TEST_PARAMS.setId);

        expect(db.query.flashcardStar.findFirst).toHaveBeenCalled();
        expect(db.delete).toHaveBeenCalled();
        expect(db.insert).not.toHaveBeenCalled();
        expect(revalidatePath).toHaveBeenCalledWith(`/set/${TEST_PARAMS.setId}`);
    });

    it("adds a new star if user has not already starred the flashcard", async () => {
        mockAuthUser();
        mockExistingStar(false);

        await toggleStarFlashcard(TEST_PARAMS.cardId, TEST_PARAMS.setId);

        expect(db.query.flashcardStar.findFirst).toHaveBeenCalled();
        expect(db.delete).not.toHaveBeenCalled();
        expect(db.insert).toHaveBeenCalled();
        expect(revalidatePath).toHaveBeenCalledWith(`/set/${TEST_PARAMS.setId}`);
    });
});