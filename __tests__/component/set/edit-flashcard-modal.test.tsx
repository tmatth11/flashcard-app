import { updateFlashcard } from "@/app/_actions/card-actions";
import EditFlashcardModal from "@/app/set/_components/edit-flashcard-modal";
import { Flashcard } from "@/app/types";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/_actions/card-actions", () => ({
    updateFlashcard: vi.fn(),
}));

describe("EditFlashcardModal", () => {
    const mockCard: Flashcard = {
        id: 1,
        term: "Who was the creator of TypeScript?",
        definition: "Anders Hejlsberg",
        setId: 10,
    };

    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders form elements prefilled with term and definition if modal is open", () => {
        render(
            <EditFlashcardModal
                card={mockCard}
                isOpen={true}
                onClose={mockOnClose}
            />,
        );

        expect(screen.getByRole("textbox", {name: /term/i})).toHaveValue(mockCard.term);
        expect(screen.getByRole("textbox", {name: /definition/i})).toHaveValue(mockCard.definition);
    });

    it("returns nothing if modal is closed", () => {
        render(
            <EditFlashcardModal
                card={mockCard}
                isOpen={false}
                onClose={mockOnClose}
            />,
        );

        expect(screen.queryByText("Edit Flashcard")).not.toBeInTheDocument();
    });

    it("closes modal if close button is pressed", async () => {
        const user = userEvent.setup();
        
        render(
            <EditFlashcardModal
                card={mockCard}
                isOpen={true}
                onClose={mockOnClose}
            />,
        );

        await user.click(screen.getByRole("button", {name: /close edit flashcard modal/i}));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("closes modal if cancel button is pressed", async () => {
        const user = userEvent.setup();
        
        render(
            <EditFlashcardModal
                card={mockCard}
                isOpen={true}
                onClose={mockOnClose}
            />,
        );

        await user.click(screen.getByRole("button", {name: /cancel/i}));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("disables save button if term is missing", async () => {
        const user = userEvent.setup();
        
        render(
            <EditFlashcardModal
                card={mockCard}
                isOpen={true}
                onClose={mockOnClose}
            />,
        );

        await user.clear(screen.getByRole("textbox", {name: /term/i}));
        expect(screen.getByRole("button", {name: /save/i})).toBeDisabled();
    });

    it("disables save button if definition is missing", async () => {
        const user = userEvent.setup();
        
        render(
            <EditFlashcardModal
                card={mockCard}
                isOpen={true}
                onClose={mockOnClose}
            />,
        );

        await user.clear(screen.getByRole("textbox", {name: /definition/i}));
        expect(screen.getByRole("button", {name: /save/i})).toBeDisabled();
    });

    it("submits the form and calls updateFlashcard", async () => {
        const user = userEvent.setup();
        
        render(
            <EditFlashcardModal
                card={mockCard}
                isOpen={true}
                onClose={mockOnClose}
            />,
        );

        const termInput = screen.getByRole("textbox", {name: /term/i});
        const definitionInput = screen.getByRole("textbox", {name: /definition/i});

        await user.clear(termInput);
        await user.type(termInput, "New Term");
        
        await user.clear(definitionInput);
        await user.type(definitionInput, "New Definition");

        await user.click(screen.getByRole("button", {name: /save/i}));

        expect(updateFlashcard).toHaveBeenCalledWith(
            expect.anything(),
            expect.any(FormData)
        );
    });
});
