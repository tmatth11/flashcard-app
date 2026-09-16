import Navbar from "@/app/_components/navbar";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockClerkAuthUser } from "../helpers";

vi.mock("@/app/_components/mode-toggle", () => ({
    default: () => <div data-testid="mode-toggle">Toggle mode</div>,
}));

describe("Navbar", () => {
    const mockUserName = "test_user";

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
        vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    });

    it("renders core elements and signed-out navigation links", () => {
        mockClerkAuthUser(null);

        render(<Navbar />);

        // Check if signed out navigation links appear when signed out
        expect(screen.getByText("Flashcard App")).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /all sets/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /sign in/i }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /sign up/i }),
        ).toBeInTheDocument();
        expect(screen.getByTestId("mode-toggle")).toBeInTheDocument();

        // Check if signed in navigation links don't appear when signed out
        expect(
            screen.queryByRole("link", { name: /create set/i }),
        ).not.toBeInTheDocument();
        expect(screen.queryByText(/my sets/i)).not.toBeInTheDocument();
        expect(screen.queryByTestId("user-button")).not.toBeInTheDocument();
    });

    it("renders signed-in links", () => {
        mockClerkAuthUser({ username: mockUserName });

        render(<Navbar />);

        // Check if signed-in links appear when signed in
        expect(
            screen.getByRole("link", { name: /create set/i }),
        ).toHaveAttribute("href", "/create-set");
        expect(screen.getByRole("link", { name: /my sets/i })).toHaveAttribute(
            "href",
            `/sets/${mockUserName}`,
        );
        expect(screen.getByTestId("user-button")).toBeInTheDocument();

        // Check if signed-out links don't appear when signed in
        expect(
            screen.queryByRole("link", { name: /sign in/i }),
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("link", { name: /sign up/i }),
        ).not.toBeInTheDocument();
    });

    it("toggles links when hamburger button is clicked", async () => {
        mockClerkAuthUser({ username: mockUserName });
        const user = userEvent.setup();

        render(<Navbar />);

        const menuButton = screen.getByRole("button", { name: /expand menu/i });
        const navContainer = screen
            .getByText("All sets")
            .closest("div.flex-col");

        expect(navContainer).toHaveClass("hidden");

        // Click the hamburger menu when navContainer is hidden
        await user.click(menuButton);
        expect(navContainer).toHaveClass("flex");

        // Click the hamburger menu when navContainer is flex
        await user.click(menuButton);
        expect(navContainer).toHaveClass("hidden");
    });

    it("resets scroll position when title is clicked", async () => {
        mockClerkAuthUser(null);
        const user = userEvent.setup();

        render(<Navbar />);

        const titleLink = screen.getByText("Flashcard App");
        await user.click(titleLink);

        expect(scrollTo).toHaveBeenCalledWith(0, 0);
    });
});
