import StudyStarredCheckbox from "@/app/set/_components/study-starred-checkbox";
import { mockReplace } from "@/vitest.setup";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("StudyStarredCheckbox", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders unchecked when 'study' query parameter is not 'starred'", () => {
        vi.mocked(useSearchParams).mockReturnValue(
            new URLSearchParams("") as ReturnType<typeof useSearchParams>,
        );

        render(<StudyStarredCheckbox />);

        expect(screen.getByRole("checkbox")).not.toBeChecked();
    });
    
    it("renders checked when 'study' query parameter is 'starred'", () => {
        vi.mocked(useSearchParams).mockReturnValue(
            new URLSearchParams("?study=starred") as ReturnType<typeof useSearchParams>,
        );

        render(<StudyStarredCheckbox />);

        expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("resets page parameter and sets study parameter to starred if checked", async () => {
        const user = userEvent.setup();

        vi.mocked(useSearchParams).mockReturnValue(
            new URLSearchParams("") as ReturnType<typeof useSearchParams>,
        );

        render(<StudyStarredCheckbox />);
        
        await user.click(screen.getByRole("checkbox"));
        expect(mockReplace).toHaveBeenCalledWith("/?page=1&study=starred", {scroll: false});
    });
    
    it("resets page parameter and deletes study parameter if unchecked", async () => {
        const user = userEvent.setup();

        vi.mocked(useSearchParams).mockReturnValue(
            new URLSearchParams("?study=starred") as ReturnType<typeof useSearchParams>,
        );

        render(<StudyStarredCheckbox />);
        
        await user.click(screen.getByRole("checkbox"));
        expect(mockReplace).toHaveBeenCalledWith("/?page=1", {scroll: false});
    });
});
