import '../helpers';

import Page, { metadata } from "@/app/(home)/page";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockClerkAuthUser } from '../helpers';

describe("Home Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    it("has the correct metadata export", () => {
        expect(metadata.title).toBe("Home");
        expect(metadata.description).toBe("Study flashcard sets in the browser");
    });
    
    it("renders all main headings correctly", () => {
        mockClerkAuthUser(null);

        render(<Page />);

        expect(screen.getByRole("heading", {level: 1, name: /study flashcard sets in the browser/i}));

        expect(screen.getByRole("heading", {level: 2, name: /features/i}));
        expect(screen.getByRole("heading", {level: 2, name: /testimonials/i}));
        expect(screen.getByRole("heading", {level: 2, name: /pricing/i}));
        expect(screen.getByRole("heading", {level: 2, name: /what are you waiting for?/i}));
    });
});