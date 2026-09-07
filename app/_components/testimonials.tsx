import StarIcon from "./star-icon";

interface Testimonial {
    id: number;
    stars: number;
    message: string;
    author: string;
}

export default function Testimonials() {
    const testimonials: Testimonial[] = [
        {
            id: 0,
            stars: 5,
            message:
                "\"This is the best online flashcard application I've ever used!\"",
            author: "Gordan Freeman",
        },
        {
            id: 1,
            stars: 5,
            message:
                "\"I love using the dark mode feature so I don't blind myself.\"",
            author: "G-Man",
        },
        {
            id: 2,
            stars: 5,
            message: "\"This app seems familiar...\"",
            author: "Dr. Kleiner",
        },
    ];

    return (
        <section className="home-section">
            <h1 className="text-2xl font-semibold lg:text-3xl">Testimonials</h1>
            <div className="mt-2 flex flex-col gap-2 md:flex-row">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="testimonial">
                        <div className="star-container">
                            {Array.from({ length: testimonial.stars }).map(
                                (_, index) => (
                                    <StarIcon key={index} />
                                ),
                            )}
                        </div>
                        <p className="mt-2 wrap-break-word">
                            {testimonial.message}
                        </p>
                        <p className="font-semibold">- {testimonial.author}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
