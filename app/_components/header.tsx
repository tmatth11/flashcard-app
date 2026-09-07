import { Show } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <section className="md:flex-row">
            <div className="flex flex-col items-center gap-2 md:items-start">
                <h1 className="text-center text-3xl font-semibold md:text-left">
                    Study flashcard sets in the browser
                </h1>
                <p className="mt-2 text-center md:text-left">
                    Create flashcard sets and share them with your friends
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <Show when="signed-out">
                        <Link href="/sign-up" className="btn btn-primary">
                            Sign Up
                        </Link>
                    </Show>
                    <Link href="/all-sets" className="btn btn-secondary">
                        View All Sets
                    </Link>
                </div>
            </div>
            <Image
                width="500"
                height="100"
                src="/header-image.png"
                alt="Screenshot of flashcard set page"
            />
        </section>
    );
}
