import Features from "@/app/(home)/_components/features";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("Features", () => {
    beforeEach(() => {
        cleanup()
    });

    it("renders heading and all three feature cards", () => {
        render(<Features />);

        // Confirm main heading is in the document
        expect(screen.getByRole("heading", {level: 2, name: /features/i})).toBeInTheDocument();

        // Confirm subheading are in the document
        expect(screen.getByRole("heading", {level: 3, name: /private sets/i})).toBeInTheDocument();
        expect(screen.getByRole("heading", {level: 3, name: /starred terms/i})).toBeInTheDocument();
        expect(screen.getByRole("heading", {level: 3, name: /mobile friendly/i})).toBeInTheDocument();
        
        // Confirm descriptive text is in the document
        expect(screen.getByText(/make flashcard sets private/i)).toBeInTheDocument();
        expect(screen.getByText(/study select flashcards in any set/i)).toBeInTheDocument();
        expect(screen.getByText(/study your flashcards on the go/i)).toBeInTheDocument();
    });
});