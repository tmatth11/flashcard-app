import VisibilityFilter from "@/app/(set-lists)/_components/visibility-filter";
import { mockReplace } from "@/vitest.setup";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("VisibilityFilter", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders visibility filter correctly with no default value passed in", () => {
        render(<VisibilityFilter />);

        expect(screen.getByRole("combobox")).toHaveValue("all");
    });
    
    it("renders visibility filter correctly with default value passed in", () => {
        render(<VisibilityFilter defaultValue="private" />);

        expect(screen.getByRole("combobox")).toHaveValue("private");
    });

    it("sets visibility parameter to chosen value and resets page parameter to 1", async () => {
        const user = userEvent.setup();

        render(<VisibilityFilter />);

        const visibilitySelect = screen.getByRole("combobox");
        await user.selectOptions(visibilitySelect, "private");
        
        expect(mockReplace).toHaveBeenCalledWith("/?visibility=private&page=1");
    });
});