import { Show } from "@clerk/nextjs";
import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="home-section">
            <h1 className="text-2xl font-semibold lg:text-3xl">
                What are you waiting for?
            </h1>
            <Show when="signed-out">
                <Link href="/sign-up" className="btn btn-primary">
                    Try Now!
                </Link>
            </Show>
            <Show when="signed-in">
                <Link href="/create-set" className="btn btn-primary">
                    Try Now!
                </Link>
            </Show>
        </section>
    );
}
