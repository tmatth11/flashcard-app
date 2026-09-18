import { toggleStarFlashcard } from "@/app/_actions/star-actions";
import StarButton from "@/app/set/_components/star-button";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/_actions/star-actions", () => ({
    toggleStarFlashcard: vi.fn(),
}));

describe("StarButton", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders the correct color when not starred", () => {
        render(<StarButton flashcardId={1} setId={1} isStarred={false} />);

        const starButton = screen.getByRole("button");

        expect(starButton).toHaveClass("text-neutral-400");
        expect(starButton).toHaveAttribute("aria-label", "Star flashcard");
    });

    it("renders the correct color when starred", () => {
        render(<StarButton flashcardId={1} setId={1} isStarred={true} />);

        const starButton = screen.getByRole("button");

        expect(starButton).toHaveClass("text-yellow-400");
        expect(starButton).toHaveAttribute("aria-label", "Unstar flashcard");
    });

    it("calls the toggleStarFlashcard function when clicked", async () => {
        const user = userEvent.setup();

        render(<StarButton flashcardId={1} setId={1} isStarred={false} />);

        const starButton = screen.getByRole("button");

        await user.click(starButton);
        expect(toggleStarFlashcard).toHaveBeenCalledWith(1, 1);
    });
});
