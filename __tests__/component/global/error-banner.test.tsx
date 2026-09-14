import ErrorBanner, { ErrorBannerProps } from "@/app/_components/error-banner";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("ErrorBanner", () => {
    const mockProps: ErrorBannerProps = {
        message: "Error: Spaghetti not found."
    };

    beforeEach(() => {
        cleanup();
    });

    it("renders the error message correctly", () => {
        render(<ErrorBanner message={mockProps.message} />);

        const message = screen.getByText(mockProps.message);
        expect(message).toBeInTheDocument();
    });
});
