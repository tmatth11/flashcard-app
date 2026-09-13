import { deleteFlashcard, updateFlashcard } from "@/app/_actions/card-actions";
import { db } from "@/app/_db/drizzle";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTestParams, mockAuthUser, mockRemainingCards, mockSetOwner, mockTotalCardsCount, TEST_PARAMS, TEST_USERS } from "./helpers";

// Flashcard form data generator

function createCardFormData(overrides?: {
    cardId?: string;
    setId?: string;
    term?: string;
    definition?: string;
}) {
    const formData = new FormData();

    formData.append("cardId", overrides?.cardId ?? String(TEST_PARAMS.cardId));
    formData.append("setId", overrides?.setId ?? String(TEST_PARAMS.setId));
    formData.append("term", overrides?.term ?? "What is the sum of 1 + 1?");
    formData.append("definition", overrides?.definition ?? "2");

    return formData;
}

// Flashcard Actions Tests

describe("Flashcard Actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // deleteFlashcard
    describe("deleteFlashcard", () => {
        it("throws unauthorized error if user is not logged in", async () => {
            mockAuthUser(null);

            await expect(deleteFlashcard(TEST_PARAMS.cardId, TEST_PARAMS.setId, TEST_PARAMS.currentCard)).rejects.toThrow(
                "Unauthorized: You must be logged in to delete flashcards."
            );
        });

        it("throws forbidden error if user tries to delete another user's flashcard", async () => {
            mockAuthUser();
            mockSetOwner(TEST_USERS.other);

            await expect(deleteFlashcard(TEST_PARAMS.cardId, TEST_PARAMS.setId, TEST_PARAMS.currentCard)).rejects.toThrow(
                "Forbidden: You do not own this flashcard set."
            );
        });

        it("throws error if user tries to delete their only card", async () => {
            mockAuthUser();
            mockSetOwner();
            mockTotalCardsCount(1);

            await expect(deleteFlashcard(TEST_PARAMS.cardId, TEST_PARAMS.setId, TEST_PARAMS.currentCard)).rejects.toThrow(
                "Error: A set must have at least 1 card."
            );
        });

        it("card is deleted successfully and user is not redirected to next card page", async () => {
            mockAuthUser();
            mockSetOwner();
            mockTotalCardsCount(3);
            mockRemainingCards();

            const params = getTestParams({currentCard: 1});
            await deleteFlashcard(params.cardId, params.setId, params.currentCard);

            expect(redirect).not.toHaveBeenCalled();
            expect(revalidatePath).toHaveBeenCalledWith(`/set/${TEST_PARAMS.setId}`);
        });

        it("card is deleted successfully and user is redirected to next card page", async () => {
            mockAuthUser();
            mockSetOwner();
            mockTotalCardsCount(3);
            mockRemainingCards();

            const params = getTestParams({currentCard: 3});
            await deleteFlashcard(params.cardId, params.setId, params.currentCard);

            expect(redirect).toHaveBeenCalledWith(`/set/${params.setId}?page=2`);
        });
    });

    // updateFlashcard
    describe("updateFlashcard", () => {
        it("throws unauthorized error if user is not logged in", async () => {
            mockAuthUser(null);

            const formData = createCardFormData();

            await expect(
                updateFlashcard({success: false}, formData)
            ).rejects.toThrow(
                "Unauthorized: You must be logged in to update flashcards."
            );
        });

        it("throws error if card is missing a definition or definition", async () => {
            mockAuthUser();

            const formData = createCardFormData({term: "", definition: ""});
            const result = await updateFlashcard({success: false}, formData);

            expect(result).toEqual({
                error: "Validation failed",
                errors: {
                    term: ["Term is required."],
                    definition: ["Definition is required."],
                },
            });
        });

        it("throws forbidden error if user tries to update another user's flashcard", async () => {
            mockAuthUser();
            mockSetOwner(TEST_USERS.other);

            const formData = createCardFormData();
            const result = await updateFlashcard({success: false}, formData);

            expect(result).toEqual({
                success: false,
                error: "Forbidden: You do not own this flashcard set."
            });
        });

        it("card is updated successfully", async () => {
            mockAuthUser();
            mockSetOwner();

            const formData = createCardFormData();
            const result = await updateFlashcard({success: true}, formData);

            expect(db.update).toHaveBeenCalled();
            expect(revalidatePath).toHaveBeenCalledWith(`/set/${TEST_PARAMS.setId}`);
            expect(result).toEqual({
                success: true,
            });
        });
    });
});