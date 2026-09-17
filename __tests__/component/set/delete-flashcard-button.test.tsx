import { deleteFlashcard } from "@/app/_actions/card-actions";
import DeleteFlashcardButton from "@/app/set/_components/delete-flashcard-button";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/_actions/card-actions", () => ({
    deleteFlashcard: vi.fn(),
}));

describe("DeleteFlashcardButton", () => {
    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it("render enabled button if there is more than 1 card", () => {
        render(
            <DeleteFlashcardButton
                cardId={1}
                setId={1}
                totalCards={2}
                currentCard={1}
            />,
        );

        const button = screen.getByRole("button", {name: "Delete flashcard"});
        expect(button).not.toBeDisabled();
    });

    it("render disabled button if there is only 1 card", () => {
        render(
            <DeleteFlashcardButton
                cardId={1}
                setId={1}
                totalCards={1}
                currentCard={1}
            />,
        );

        const button = screen.getByRole("button", {name: "Delete flashcard"});
        expect(button).toBeDisabled();
    });

    it("submits the form and calls deleteFlashcard with bound arguments", async () => {
        const user = userEvent.setup();

        render(
            <DeleteFlashcardButton
                cardId={1}
                setId={1}
                totalCards={2}
                currentCard={1}
            />,
        );

        const button = screen.getByRole("button", {name: "Delete flashcard"});
        await user.click(button);

        expect(deleteFlashcard).toHaveBeenCalledWith(
            1,
            1,
            1,
            expect.any(FormData),
        );
    });
});
