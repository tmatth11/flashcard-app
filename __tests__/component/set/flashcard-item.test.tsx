import FlashcardItem from "@/app/set/_components/flashcard-item";
import { Flashcard } from "@/app/types";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockClerkAuth } from "../helpers";

vi.mock("@/app/set/_components/edit-flashcard-modal", () => ({
    default: () => <div data-testid="edit-modal">EditModal</div>,
}));

vi.mock("@/app/set/_components/star-button", () => ({
    default: () => <div data-testid="star-button">StarButton</div>,
}));

vi.mock("@/app/set/_components/delete-flashcard-button", () => ({
    default: () => <div data-testid="delete-button">DeleteButton</div>,
}));

describe("FlashcardItem", () => {
    const mockFlashcard: Flashcard = {
        id: 1,
        setId: 67,
        term: "What is the capital of Spain?",
        definition: "Madrid",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders flashcard index, term, and definition correctly", () => {
        mockClerkAuth(false);

        render(
            <FlashcardItem
                isOwner={false}
                flashcard={mockFlashcard}
                totalCards={2}
                currentCard={2}
                index={0}
            />,
        );

        expect(screen.getByTestId("position")).toHaveTextContent("1");
        expect(screen.getByText(mockFlashcard.term)).toBeInTheDocument();
        expect(screen.getByText(mockFlashcard.definition)).toBeInTheDocument();
    });

    it("hides the star button when the user is not signed in", () => {
        mockClerkAuth(false);

        render(
            <FlashcardItem
                isOwner={false}
                flashcard={mockFlashcard}
                totalCards={2}
                currentCard={2}
                index={0}
            />,
        );

        expect(screen.queryByTestId("star-button")).not.toBeInTheDocument();
    });
    
    it("shows the star button when the user is signed in", () => {
        mockClerkAuth(true);

        render(
            <FlashcardItem
                isOwner={false}
                flashcard={mockFlashcard}
                totalCards={2}
                currentCard={2}
                index={0}
            />,
        );

        expect(screen.getByTestId("star-button")).toBeInTheDocument();
    });

    it("renders the edit and delete buttons when the user is the owner", () => {
        mockClerkAuth(true);

        render(
            <FlashcardItem
                isOwner={true}
                flashcard={mockFlashcard}
                totalCards={2}
                currentCard={2}
                index={0}
            />,
        );

        expect(screen.getByRole("button", {name: /edit/i})).toBeInTheDocument();
        expect(screen.getByTestId("delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    });
    
    it("does not render the edit and delete buttons when the user is not the owner", () => {
        mockClerkAuth(true);

        render(
            <FlashcardItem
                isOwner={false}
                flashcard={mockFlashcard}
                totalCards={2}
                currentCard={2}
                index={0}
            />,
        );

        expect(screen.queryByRole("button", {name: /edit/i})).not.toBeInTheDocument();
        expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    });
});
