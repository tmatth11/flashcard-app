import { Show } from "@clerk/nextjs";
import Link from "next/link";

export default function Pricing() {
    return (
        <section className="home-section">
            <h1 className="text-2xl font-semibold lg:text-3xl">Pricing</h1>
            <div className="flex h-90 w-70 flex-col items-center justify-center gap-2 rounded-md bg-neutral-300 p-2 dark:bg-slate-700">
                <h2 className="text-lg font-semibold">Flashcard App</h2>
                <p>
                    <span className="text-3xl font-bold">$0.00</span> / month
                </p>
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
            </div>
        </section>
    );
}
