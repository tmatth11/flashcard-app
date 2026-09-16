import { Flashcard } from "@/app/types";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockClerkAuth } from "../helpers";
import Card from "@/app/set/_components/card";
import userEvent from "@testing-library/user-event";

vi.mock("@/app/set/_components/star-button", () => ({
    default: () => <div data-testid="star-button">StarButton</div>,
}));

vi.mock("@/app/set/_components/delete-flashcard-button", () => ({
    default: () => <div data-testid="delete-button">DeleteButton</div>,
}));

vi.mock("@/app/set/_components/edit-flashcard-modal", () => ({
    default: () => <div data-testid="edit-modal">EditModal</div>,
}));


describe("Card", () => {
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

    it("renders the card's term by default", () => {
        mockClerkAuth(false);

        render(
            <Card
                flashcard={mockFlashcard}
                isOwner={false}
                totalCards={5}
                currentCard={1}
            />,
        );

        expect(screen.getByText(mockFlashcard.term)).toBeInTheDocument();
        expect(
            screen.queryByText(mockFlashcard.definition),
        ).not.toBeInTheDocument();
    });

    it("renders the card's term and definition on click", async () => {
        mockClerkAuth(false);
        
        const user = userEvent.setup();

        render(
            <Card
                flashcard={mockFlashcard}
                isOwner={false}
                totalCards={5}
                currentCard={1}
            />,
        );

        const cardButton = screen.getByRole("button", {name:  /flip card/i});
        
        await user.click(cardButton);
        expect(screen.getByText(mockFlashcard.definition)).toBeInTheDocument();
        
        await user.click(cardButton);
        expect(screen.getByText(mockFlashcard.term)).toBeInTheDocument();
    });
    
    it("flips the card on space and enter key press", async () => {
        mockClerkAuth(false);
        
        const user = userEvent.setup();

        render(
            <Card
                flashcard={mockFlashcard}
                isOwner={false}
                totalCards={5}
                currentCard={1}
            />,
        );

        const cardButton = screen.getByRole("button", {name:  /flip card/i});
        cardButton.focus();
        
        await user.keyboard("[Space]");
        expect(screen.getByText(mockFlashcard.definition)).toBeInTheDocument();
        
        await user.keyboard("[Space]");
        expect(screen.getByText(mockFlashcard.term)).toBeInTheDocument();
    });

    it("hides the star button when the user is not signed in", () => {
        mockClerkAuth(false);
        
        render(
            <Card
                flashcard={mockFlashcard}
                isOwner={false}
                totalCards={5}
                currentCard={1}
            />,
        );

        expect(screen.queryByTestId("star-button")).not.toBeInTheDocument();
    });
    
    it("shows the star button when the user is signed in", () => {
        mockClerkAuth(true);
        
        render(
            <Card
                flashcard={mockFlashcard}
                isOwner={false}
                totalCards={5}
                currentCard={1}
            />,
        );

        expect(screen.getByTestId("star-button")).toBeInTheDocument();
    });

    it("does not render the edit and delete buttons when the user is not the owner", () => {
        mockClerkAuth(true);
        
        render(
            <Card
                flashcard={mockFlashcard}
                isOwner={false}
                totalCards={5}
                currentCard={1}
            />,
        );

        expect(screen.queryByRole("button", {name: /edit/i})).not.toBeInTheDocument();
        expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
    });

    it("renders the edit and delete buttons when the user is the owner", () => {
        mockClerkAuth(true);
        
        render(
            <Card
                flashcard={mockFlashcard}
                isOwner={true}
                totalCards={5}
                currentCard={1}
            />,
        );

        expect(screen.getByRole("button", {name: /edit/i})).toBeInTheDocument();
        expect(screen.getByTestId("delete-button")).toBeInTheDocument();
        expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    });
});
