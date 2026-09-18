import FlashcardFilter from "@/app/set/_components/flashcard-filter";
import { mockReplace } from "@/vitest.setup";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("FlashcardFilter", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders the study filter correctly with default value", () => {
        render(<FlashcardFilter />);

        const studyFilter = screen.getByRole("combobox", {name: /study filter/i});
        expect(studyFilter).toBeInTheDocument();
        expect(studyFilter).toHaveValue("all");
    });

    it("sets the filter parameter to chosen value", async () => {
        const user = userEvent.setup();

        render(<FlashcardFilter /> );
        
        const studyFilter = screen.getByRole("combobox", {name: /study filter/i});
        await user.selectOptions(studyFilter, "starred");

        expect(mockReplace).toHaveBeenCalledWith("/?filter=starred", {scroll: false});
    });
});