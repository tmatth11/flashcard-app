import Testimonials, { testimonials } from "@/app/(home)/_components/testimonials";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("Testimonials", () => {
    beforeEach(() => {
        cleanup();
    });

    it("renders heading and all testimonials", () => {
        render(<Testimonials />);

        expect(screen.getByRole("heading", {level: 2, name: /testimonials/i})).toBeInTheDocument();

        for (const testimonial of testimonials ) {
            expect(screen.getByText(testimonial.message)).toBeInTheDocument();

            const testimonialAuthor = screen.getByText(`- ${testimonial.author}`);
            expect(testimonialAuthor).toBeInTheDocument();

            const cardWrapper = testimonialAuthor.closest(".testimonial");
            expect(cardWrapper).not.toBeNull();
            
            const starContainer = cardWrapper!.querySelector(".star-container");
            expect(starContainer).not.toBeNull();
            expect(starContainer!.children).toHaveLength(testimonial.stars);
        }
    });
});