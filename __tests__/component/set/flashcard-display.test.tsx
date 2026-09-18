import { PaginationProps } from "@/app/_components/pagination";
import { CardProps } from "@/app/set/_components/card";
import FlashcardDisplay from "@/app/set/_components/flashcard-display";
import { Flashcard } from "@/app/types";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/set/_components/card", () => ({
    default: ({ flashcard, currentCard, totalCards, isOwner }: CardProps) => (
        <div data-testid="card">
            <span>Card ID: {flashcard.id}</span>
            <span>Term: {flashcard.term}</span>
            <span>Current: {currentCard}</span>
            <span>Total: {totalCards}</span>
            <span>Owner: {isOwner ? "yes" : "no"}</span>
        </div>
    ),
}));

vi.mock("@/app/_components/pagination", () => ({
    default: ({ totalPages }: PaginationProps) => (
        <div data-testid="pagination">Total Pages: {totalPages}</div>
    ),
}));

vi.mock("@/app/set/_components/study-starred-checkbox", () => ({
    default: () => (
        <div data-testid="study-starred-checkbox">Study Starred Checkbox</div>
    ),
}));

describe("FlashcardDisplay", () => {
    const mockFlashcards: Flashcard[] = [
        {
            id: 67,
            setId: 1,
            term: "First term",
            definition: "First definition",
        },
        {
            id: 68,
            setId: 1,
            term: "Second term",
            definition: "Second definition",
        },
        {
            id: 69,
            setId: 1,
            term: "Third term",
            definition: "Third definition",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders the correct flashcard", () => {
        render(
            <FlashcardDisplay
                flashcards={mockFlashcards}
                currentCard={2}
                isOwner={true}
                totalCards={3}
                hasStarredCards={false}
            />,
        );

        expect(screen.getByText(`Term: ${mockFlashcards[1].term}`)).toBeInTheDocument();
    });

    it("renders the total amount of cards", () => {
        render(
            <FlashcardDisplay
                flashcards={mockFlashcards}
                currentCard={2}
                isOwner={true}
                totalCards={3}
                hasStarredCards={false}
            />,
        );

        expect(screen.getByTestId("pagination")).toHaveTextContent(
            "Total Pages: 3",
        );
    });

    it("renders the study starred checkbox if the user has starred cards", () => {
        render(
            <FlashcardDisplay
                flashcards={mockFlashcards}
                currentCard={2}
                isOwner={true}
                totalCards={3}
                hasStarredCards={true}
            />,
        );

        expect(
            screen.getByTestId("study-starred-checkbox"),
        ).toBeInTheDocument();
    });

    it("does not the study starred checkbox if the user has starred cards", () => {
        render(
            <FlashcardDisplay
                flashcards={mockFlashcards}
                currentCard={2}
                isOwner={true}
                totalCards={3}
                hasStarredCards={false}
            />,
        );

        expect(
            screen.queryByTestId("study-starred-checkbox"),
        ).not.toBeInTheDocument();
    });
});
