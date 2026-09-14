import ModeToggle from "@/app/_components/mode-toggle";
import { useTheme } from "@teispace/next-themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it, vi, expect } from "vitest";

vi.mock("@teispace/next-themes", () => ({
    useTheme: vi.fn(),
}));

describe("ModeToggle", () => {
    const mockSetTheme = vi.fn();

    function setupThemeMock(resolvedTheme: "light" | "dark" = "light") {
        vi.mocked(useTheme).mockImplementation(
            () =>
                ({
                    setTheme: mockSetTheme,
                    resolvedTheme,
                    systemTheme: "light",
                    theme: resolvedTheme,
                    forcedTheme: null,
                    themes: ["light", "dark", "system"],
                }) as unknown as ReturnType<typeof useTheme>,
        );
    }

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders dark mode toggle button when theme is light and switches to dark mode on click", async () => {
        const user = userEvent.setup();
        setupThemeMock("light");

        render(<ModeToggle />);

        const button = screen.getByRole("button", { name: /dark mode/i });
        expect(button).toBeInTheDocument();

        await user.click(button);

        expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
    
    it("renders light mode toggle button when theme is dark and switches to light mode on click", async () => {
        const user = userEvent.setup();
        setupThemeMock("dark");

        render(<ModeToggle />);

        const button = screen.getByRole("button", { name: /light mode/i });
        expect(button).toBeInTheDocument();

        await user.click(button);

        expect(mockSetTheme).toHaveBeenCalledWith("light");
    });
});
