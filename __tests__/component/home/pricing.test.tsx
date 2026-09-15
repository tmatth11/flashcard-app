import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../helpers';
import { mockClerkAuthUser } from '../helpers';
import { cleanup, render, screen } from '@testing-library/react';
import Pricing from '@/app/(home)/_components/pricing';

describe("Pricing", () => {
    const mockUsername = "test_user";

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    })
    
    it("renders heading and sign in link when signed out", () => {
        mockClerkAuthUser(null);

        render(<Pricing />);

        expect(screen.getByRole("heading", {level: 2, name: /pricing/i})).toBeInTheDocument();
        expect(screen.getByRole("link", {name: /try now/i})).toHaveAttribute("href", "/sign-up");
    });
    
    it("renders create set link when signed out", () => {
        mockClerkAuthUser({username: mockUsername});

        render(<Pricing />);
        expect(screen.getByRole("link", {name: /try now/i})).toHaveAttribute("href", "/create-set");
    });
});