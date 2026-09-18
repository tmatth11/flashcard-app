import Pagination from "@/app/_components/pagination";
import { cleanup, render, screen } from "@testing-library/react";
import {
    ReadonlyURLSearchParams,
    usePathname,
    useSearchParams,
} from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
    useSearchParams: vi.fn(),
}));

function mockNavigation(pathname: string, pageParam: string | null) {
    vi.mocked(usePathname).mockReturnValue(pathname);

    const params = new URLSearchParams();
    if (pageParam !== null) {
        params.set("page", pageParam);
    }

    vi.mocked(useSearchParams).mockReturnValue(
        params as unknown as ReadonlyURLSearchParams,
    );
}

describe("Pagination", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("disables both buttons when there is 1 total page", () => {
        mockNavigation("/sets", null);

        render(<Pagination totalPages={1} />);

        const previousButton = screen.getByRole("button", {
            name: /previous page/i,
        });
        const nextButton = screen.getByRole("button", { name: /next page/i });

        expect(previousButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
    });

    it("renders the current page and total pages indicator correctly", () => {
        mockNavigation("/sets", "2");

        render(<Pagination totalPages={5} />);

        expect(screen.getByText("2 of 5")).toBeInTheDocument();
    });

    it("generates the correct previous and next URLs for pages in the middle", () => {
        mockNavigation("/all-sets", "2");

        render(<Pagination totalPages={5} />);

        const previousButton = screen.getByRole("button", {
            name: /previous page/i,
        }).closest("a");
        const nextButton = screen.getByRole("button", { name: /next page/i }).closest("a");

        expect(previousButton).toHaveAttribute("href", "/all-sets?page=1");
        expect(nextButton).toHaveAttribute("href", "/all-sets?page=3");
    });

    it("wraps back to the first page when clicking next on the last page", () => {
        mockNavigation("/all-sets", "5");

        render(<Pagination totalPages={5} />);

        const nextButton = screen.getByRole("button", { name: /next page/i }).closest("a");
        expect(nextButton).toHaveAttribute("href", "/all-sets?page=1");
    });

    it("wraps back to the last page when clicking previous on the first page", () => {
        mockNavigation("/all-sets", "1");

        render(<Pagination totalPages={5} />);

        const previousButton = screen.getByRole("button", {
            name: /previous page/i,
        }).closest("a");
        expect(previousButton).toHaveAttribute("href", "/all-sets?page=5");
    });

    it("clamps out-of-bounds page parameter to valid number of total pages", () => {
        mockNavigation("/all-sets", "100");

        render(<Pagination totalPages={5} />);

        expect(screen.getByText("5 of 5")).toBeInTheDocument();
    });
});
