import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockClerkAuthUser } from "../helpers";
import Header from "@/app/(home)/_components/header";

describe("Header", () => {
    const mockUsername = "test_user";

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("renders necessary elements when user is signed out", () => {
        mockClerkAuthUser(null);
        
        render(<Header />);

        expect(screen.getByRole("heading", {level: 1, name: /study flashcard sets in the browser/i})).toBeInTheDocument();
        expect(screen.getByText(/create flashcard sets and share them with your friends/i)).toBeInTheDocument();

        expect(screen.getByRole("link", {name: /sign up/i})).toBeInTheDocument();
        expect(screen.getByRole("link", {name: /view all sets/i})).toBeInTheDocument();

        expect(screen.getByAltText(/screenshot of flashcard set page/i)).toBeInTheDocument();
    });
    
    it("doesn't render sign up button when user is signed in", () => {
        mockClerkAuthUser({username: mockUsername});
        
        render(<Header />);

        expect(screen.queryByRole("link", {name: /sign up/i})).not.toBeInTheDocument();
    });
});