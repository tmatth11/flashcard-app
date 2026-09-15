import FlashcardSetForm from "@/app/(set-forms)/_components/flashcard-form";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/_actions/set-actions", () => ({
    updateFlashcardSet: vi.fn(),
    createFlashcardSet: vi.fn(),
}));

describe("FlashcardSetForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders in 'Create' mode with disabled submit button when fields are empty", () => {
        render(<FlashcardSetForm />);

        expect(
            screen.getByRole("heading", {
                level: 1,
                name: /create a new flashcard set/i,
            }),
        ).toBeInTheDocument();

        const submitButtons = screen.getAllByRole("button", {
            name: /^create$/i,
        });

        submitButtons.forEach((submitButton) => {
            expect(submitButton).toBeDisabled();
        });

        expect(
            screen.getByRole("button", { name: /delete card/i }),
        ).toBeDisabled();
    });

    it("renders in 'Edit' mode with form fields pre-populated with existing data", () => {
        const initialData = {
            title: "Spaghetti Quiz",
            description: "This quiz has lot's a spaghetti!",
            isPublic: false,
            flashcards: [
                {
                    id: 1,
                    term: "What does this quiz have?",
                    definition: "Lot's a spaghetti!",
                },
                {
                    id: 2,
                    term: "Top text",
                    definition: "Bottom text",
                },
            ],
        };

        render(<FlashcardSetForm setId={67} initialData={initialData} />);

        expect(
            screen.getByRole("heading", {
                level: 1,
                name: /edit your flashcard set/i,
            }),
        ).toBeInTheDocument();

        expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue(
            initialData.title,
        );
        expect(
            screen.getByRole("textbox", { name: /description/i }),
        ).toHaveValue(initialData.description);

        const terms = screen.getAllByRole("textbox", { name: /^term$/i });
        const definitions = screen.getAllByRole("textbox", {
            name: /^definition$/i,
        });

        initialData.flashcards.forEach((card, index) => {
            expect(terms[index]).toHaveValue(card.term);
            expect(definitions[index]).toHaveValue(card.definition);
        });

        const submitButtons = screen.getAllByRole("button", {
            name: /^save$/i,
        });

        submitButtons.forEach((submitButton) => {
            expect(submitButton).not.toBeDisabled();
        });

        const deleteFlashcardButtons = screen.getAllByRole("button", {
            name: /delete card/i,
        });

        deleteFlashcardButtons.forEach((button) => {
            expect(button).not.toBeDisabled();
        });
    });

    it("allows adding and removing flashcards dynamically", async () => {
        const user = userEvent.setup();

        render(<FlashcardSetForm />);

        expect(screen.getAllByLabelText(/term/i)).toHaveLength(1);

        await user.click(screen.getByRole("button", { name: /add card/i }));
        expect(screen.getAllByLabelText(/term/i)).toHaveLength(2);

        await user.click(screen.getByRole("button", { name: /add flashcard/i }));
        expect(screen.getAllByLabelText(/term/i)).toHaveLength(3);

        const deleteButtons = screen.getAllByRole("button", {
            name: /delete card/i,
        });
        await user.click(deleteButtons[0]);

        expect(screen.getAllByLabelText(/term/i)).toHaveLength(2);
    });

    it("enables submit button only when all required fields are filled", async () => {
        const user = userEvent.setup();

        render(<FlashcardSetForm />);

        const submitButtons = screen.getAllByRole("button", {
            name: /^create$/i,
        });

        submitButtons.forEach((submitButton) => {
            expect(submitButton).toBeDisabled();
        });

        await user.type(
            screen.getByRole("textbox", { name: /title/i }),
            "Spaghetti",
        );

        submitButtons.forEach((submitButton) => {
            expect(submitButton).toBeDisabled();
        });

        await user.type(
            screen.getByRole("textbox", { name: /term/i }),
            "My Term",
        );
        await user.type(
            screen.getByRole("textbox", { name: /definition/i }),
            "My Definition",
        );

        submitButtons.forEach((submitButton) => {
            expect(submitButton).not.toBeDisabled();
        });
    });
});
