import { db } from "@/app/_db/drizzle";
import { fetchFlashcardSetsPages } from "@/app/_lib/data";
import { auth } from "@clerk/nextjs/server";
import { vi } from "vitest";

// Types

type AuthResult = Awaited<ReturnType<typeof auth>>;
type SetQueryResult = Awaited<ReturnType<typeof db.query.flashcardSet.findFirst>>;
type SelectCountResult = ReturnType<typeof db.select>;
type RemainingCardsResult = Awaited<ReturnType<typeof db.query.flashcard.findMany>>;
type DatabaseInsertResult = ReturnType<typeof db.insert>;
type UpdateSetResult = ReturnType<typeof db.update>;
type DatabaseDeleteResult = ReturnType<typeof db.delete>;
type FlashcardStarQueryResult = Awaited<ReturnType<typeof db.query.flashcardStar.findFirst>>;

// Objects

export const TEST_USERS = {
    owner: "user_owner_123",
    other: "user_other_123"
} as const;

export const TEST_USERNAMES = {
    owner: "testuser",
    other: "otheruser"
} as const;

export const TEST_PARAMS = {
    cardId: 1,
    setId: 10,
    currentCard: 1,
    username: TEST_USERNAMES.owner,
};

// Utility functions

export function getTestParams(overrides?: Partial<typeof TEST_PARAMS>) {
    return {
        ...TEST_PARAMS,
        ...overrides,
    };
}

export function mockAuthUser(userId: string | null = TEST_USERS.owner) {
    vi.mocked(auth).mockResolvedValueOnce({ userId } as unknown as AuthResult);
}

export function mockSetOwner(userId: string = TEST_USERS.owner) {
    vi.mocked(db.query.flashcardSet.findFirst).mockResolvedValueOnce(
        { userId } as unknown as SetQueryResult
    );
}

export function mockTotalCardsCount(cardCount: number) {
    vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
            where: vi.fn().mockResolvedValueOnce([{ value: cardCount }]),
        }),
    } as unknown as SelectCountResult);
}

export function mockRemainingCards(cards: Array<{ id: number; order: number }> = [{ id: 2, order: 0 }, { id: 3, order: 1 }]) {
    vi.mocked(db.query.flashcard.findMany).mockResolvedValueOnce(
        cards as unknown as RemainingCardsResult
    );
}

export function mockInsertReturningSet(setId: number = TEST_PARAMS.setId) {
    vi.mocked(db.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnValueOnce({
            returning: vi.fn().mockResolvedValueOnce([{ id: setId }]),
        }),
    } as unknown as DatabaseInsertResult);
}

export function mockFetchFlashcardSetsPages(totalPages: number) {
    vi.mocked(fetchFlashcardSetsPages).mockResolvedValueOnce(totalPages);
}

export function mockFlashcardSetUpdate(updatedSets: Array<{ id: number }> = []) {
    vi.mocked(db.update).mockReturnValueOnce({
        set: vi.fn().mockReturnValueOnce({
            where: vi.fn().mockReturnValueOnce({
                returning: vi.fn().mockReturnValueOnce(updatedSets),
            }),
        }),
    } as unknown as UpdateSetResult);
}

export function mockDatabaseDelete() {
    vi.mocked(db.delete).mockReturnValueOnce({
        where: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DatabaseDeleteResult);
}

export function mockDatabaseInsert() {
    vi.mocked(db.insert).mockReturnValueOnce({
        values: vi.fn().mockResolvedValueOnce(undefined),
    } as unknown as DatabaseInsertResult);
}

export function mockExistingStar(hasStar: boolean = true) {
    const starResult = hasStar
        ? ({userId: TEST_USERS.owner, flashcardId: TEST_PARAMS.cardId} as unknown as FlashcardStarQueryResult)
        : undefined;
    
        vi.mocked(db.query.flashcardStar.findFirst).mockResolvedValueOnce(starResult);
}