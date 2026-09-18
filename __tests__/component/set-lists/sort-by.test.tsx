import SortBy from "@/app/(set-lists)/_components/sort-by";
import { mockReplace } from "@/vitest.setup";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("SortBy", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders sort by filter correctly with passed in default value", () => {
        render(<SortBy defaultValue="created-ascending" />);

        expect(screen.getByRole("combobox")).toHaveValue("created-ascending");
    });

    it("sets sort parameter to chosen value and reset page parameter to 1", async () => {
        const user = userEvent.setup();

        render(<SortBy defaultValue="created-descending" />);

        const sortBySelect = screen.getByRole("combobox");
        await user.selectOptions(sortBySelect, "modified-descending");
        
        expect(mockReplace).toHaveBeenCalledWith("/?sort=modified-descending&page=1");
    });
});