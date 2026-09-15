import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../helpers';
import { mockClerkAuthUser } from '../helpers';
import { cleanup, render, screen } from '@testing-library/react';
import CallToAction from '@/app/(home)/_components/call-to-action';

describe("CallToAction", () => {
    const mockUsername = "test_user";

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    })
    
    it("renders heading and sign in link when signed out", () => {
        mockClerkAuthUser(null);

        render(<CallToAction />);

        expect(screen.getByText(/what are you waiting for?/i)).toBeInTheDocument();
        expect(screen.getByRole("link", {name: /try now/i})).toHaveAttribute("href", "/sign-up");
    });
    
    it("renders create set link when signed out", () => {
        mockClerkAuthUser({username: mockUsername});

        render(<CallToAction />);
        expect(screen.getByRole("link", {name: /try now/i})).toHaveAttribute("href", "/create-set");
    });
});