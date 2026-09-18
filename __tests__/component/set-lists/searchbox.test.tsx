import Searchbox from "@/app/(set-lists)/_components/searchbox";
import { mockReplace } from "@/vitest.setup";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("use-debounce", () => ({
    useDebouncedCallback: (fn: (...args: unknown[]) => void) => fn,
}));

describe("Searchbox", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders input with the provided placeholder", () => {
        render(<Searchbox placeholder="Search all sets" />);

        expect(screen.getByPlaceholderText("Search all sets")).toBeInTheDocument();
    });

    it("updates URL parameters with query and resets to page 1 on input", async () => {
        const user = userEvent.setup();

        render(<Searchbox placeholder="Search all sets" />);

        await user.type(screen.getByPlaceholderText("Search all sets"), "cheese");

        expect(mockReplace).toHaveBeenCalledWith("/?page=1&query=cheese");
    });
    
    it("removes query parameter from URL when search input is cleared", async () => {
        const user = userEvent.setup();

        render(<Searchbox placeholder="Search all sets" />);

        const input = screen.getByPlaceholderText("Search all sets");
        await user.type(input, "cheese");
        await user.clear(input);

        expect(mockReplace).toHaveBeenLastCalledWith("/?page=1");
    });
});