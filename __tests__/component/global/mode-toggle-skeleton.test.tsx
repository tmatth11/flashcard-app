import ModeToggleSkeleton from "@/app/_components/mode-toggle-skeleton";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("ModeToggleSkeleton", () => {
    beforeEach(() => {
        cleanup();
    });

    it("renders the mode toggle skeleton correctly", () => {
        render(<ModeToggleSkeleton />);
        
        const loadingButton = screen.getByRole("button", {
            name: /loading dark mode toggle/i,
        });

        expect(loadingButton).toBeInTheDocument();
    });
});
