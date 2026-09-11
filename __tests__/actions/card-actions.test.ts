import { deleteFlashcard, updateFlashcard } from "@/app/_actions/card-actions";
import { db } from "@/app/_db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

/* Test Setup */

type AuthResult = Awaited<ReturnType<typeof auth>>;
type SetQueryResult = Awaited<ReturnType<typeof db.query.flashcardSet.findFirst>>;
type SelectCountResult = ReturnType<typeof db.select>;
type RemainingCardsResult = Awaited<ReturnType<typeof db.query.flashcard.findMany>>;

const TEST_USERS = {
    owner: "user_owner_123",
    other: "user_other_123"
} as const;

const TEST_PARAMS = {
    cardId: 1,
    setId: 10,
    currentCard: 1,
};

function getTestParams(overrides?: Partial<typeof TEST_PARAMS>) {
    return {
        ...TEST_PARAMS,
        ...overrides,
    };
}

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

function mockAuthUser(userId: string | null = TEST_USERS.owner) {
    vi.mocked(auth).mockResolvedValueOnce({ userId } as unknown as AuthResult);
}

function mockSetOwner(userId: string = TEST_USERS.owner) {
    vi.mocked(db.query.flashcardSet.findFirst).mockResolvedValueOnce(
        {userId} as unknown as SetQueryResult
    );
}

function mockTotalCardsCount(cardCount: number) {
    vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
            where: vi.fn().mockResolvedValueOnce([{value: cardCount}]),
        }),
    } as unknown as SelectCountResult);
}

function mockRemainingCards(cards: Array<{id: number; order: number}> = [{id: 2, order: 0}, {id: 3, order: 1}]) {
    vi.mocked(db.query.flashcard.findMany).mockResolvedValueOnce(
        cards as unknown as RemainingCardsResult
    );
}

/* Flashcard Actions Tests*/

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