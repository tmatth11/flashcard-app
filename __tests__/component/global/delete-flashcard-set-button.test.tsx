import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    DeleteFlashcardSetButtonProps,
    DeleteFlashcardSetButton,
} from "@/app/_components/delete-flashcard-set-button";
import { deleteFlashcardSet } from "@/app/_actions/set-actions";

vi.mock("@/app/_actions/set-actions", () => ({
    deleteFlashcardSet: vi.fn(),
}));

describe("DeleteFlashcardSetButton", () => {
    const mockProps: DeleteFlashcardSetButtonProps = {
        id: 1,
        username: "test_user",
        filters: {
            query: "spaghetti",
            currentPage: 1,
        },
    };

    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it("renders the delete button correctly", () => {
        render(
            <DeleteFlashcardSetButton
                id={mockProps.id}
                username={mockProps.username}
                filters={mockProps.filters}
            />,
        );

        const button = screen.getByRole("button", { name: "Delete" });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute("type", "submit");
    });

    it("submits the form and calls deleteFlashcardSet with bound arguments", async () => {
        const user = userEvent.setup();

        render(
            <DeleteFlashcardSetButton
                id={mockProps.id}
                username={mockProps.username}
                filters={mockProps.filters}
            />,
        );

        const button = screen.getByRole("button", { name: "Delete" });
        await user.click(button);

        expect(deleteFlashcardSet).toHaveBeenCalledWith(
            mockProps.id,
            mockProps.username,
            mockProps.filters,
            expect.any(FormData),
        );
    });
});
