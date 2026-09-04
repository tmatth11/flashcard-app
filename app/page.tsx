import { Show } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Lock, Star, TabletSmartphone } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col items-center gap-2 p-2">
            <div className="md:w-2xl lg:w-4xl">
                {/* Header */}
                <section className="mt-5 flex flex-col items-center gap-4 md:flex-row">
                    <div className="flex flex-col items-center gap-2 md:items-start">
                        <h1 className="text-center text-3xl font-semibold md:text-left">
                            Study flashcard sets in the browser
                        </h1>
                        <p className="mt-2 text-center md:text-left">
                            Create flashcard sets and share them with your
                            friends
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <Show when="signed-out">
                                <Link
                                    href="/sign-up"
                                    className="button cursor-pointer bg-blue-700 text-center hover:bg-blue-600 dark:text-white"
                                >
                                    Sign Up
                                </Link>
                            </Show>
                            <Link
                                href="/all-sets"
                                className="button bg-neutral-700 text-center hover:bg-neutral-600 dark:bg-slate-700 dark:hover:bg-slate-600"
                            >
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
                {/* Features */}
                <section className="mt-5 flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-semibold lg:text-3xl">
                        Features
                    </h1>
                    <div className="mt-2 flex flex-col gap-2 md:flex-row">
                        {/* Private/Public Sets */}
                        <div className="flex flex-1 flex-col items-center gap-1 text-center">
                            <div className="w-fit rounded-md bg-neutral-300 p-2 text-center dark:bg-slate-700">
                                <Lock />
                            </div>
                            <h2 className="text-lg">Private Sets</h2>
                            <p>
                                Make flashcard sets private so that only you can
                                see them
                            </p>
                        </div>
                        {/* Starred Terms */}
                        <div className="flex flex-1 flex-col items-center gap-1 text-center">
                            <div className="w-fit rounded-md bg-neutral-300 p-2 text-center dark:bg-slate-700">
                                <Star fill="#ffff00" color="#ffff00" />
                            </div>
                            <h2 className="text-lg">Starred Terms</h2>
                            <p>Study select flashcards in any set</p>
                        </div>
                        {/* Mobile-Friendly User Interface */}
                        <div className="flex flex-1 flex-col items-center gap-1 text-center">
                            <div className="w-fit rounded-md bg-neutral-300 p-2 text-center dark:bg-slate-700">
                                <TabletSmartphone />
                            </div>
                            <h2 className="text-lg">Mobile Friendly</h2>
                            <p>Study your flashcards on the go</p>
                        </div>
                    </div>
                </section>
                {/* Testimonials */}
                <section className="mt-5 flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-semibold lg:text-3xl">
                        Testimonials
                    </h1>
                    <div className="mt-2 flex flex-col gap-2 md:flex-row">
                        <div className="flex flex-1 flex-col rounded-md bg-neutral-300 p-2 dark:bg-slate-700">
                            <div className="flex items-center gap-1">
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                            </div>
                            <p className="mt-2 wrap-break-word">
                                &quot;This is the best online flashcard
                                application I&apos;ve ever used!&quot;
                            </p>
                            <p className="font-semibold">- Gordan Freeman</p>
                        </div>
                        <div className="flex flex-1 flex-col rounded-md bg-neutral-300 p-2 dark:bg-slate-700">
                            <div className="flex items-center gap-1">
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                            </div>
                            <p className="mt-2 wrap-break-word">
                                &quot;I love using the dark mode feature so I
                                don&apos;t blind myself.&quot;
                            </p>
                            <p className="font-semibold">- G-Man</p>
                        </div>
                        <div className="flex flex-1 flex-col rounded-md bg-neutral-300 p-2 dark:bg-slate-700">
                            <div className="flex items-center gap-1">
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                                <Star fill="#ffff00" color="#ffff00" />
                            </div>
                            <p className="mt-2 wrap-break-word">
                                &quot;This app seems familiar...&quot;
                            </p>
                            <p className="font-semibold">- Dr. Kleiner</p>
                        </div>
                    </div>
                </section>
                {/* Pricing */}
                <section className="mt-5 flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-semibold lg:text-3xl">
                        Pricing
                    </h1>
                    <div className="flex h-90 w-70 flex-col items-center justify-center gap-2 rounded-md bg-neutral-300 p-2 dark:bg-slate-700">
                        <h2 className="text-lg font-semibold">Flashcard App</h2>
                        <p>
                            <span className="text-3xl font-bold">$0.00</span> /
                            month
                        </p>
                        <Show when="signed-out">
                            <Link
                                href="/sign-up"
                                className="button bg-blue-700 hover:bg-blue-600"
                            >
                                Try Now!
                            </Link>
                        </Show>
                        <Show when="signed-in">
                            <Link
                                href="/create-set"
                                className="button bg-blue-700 hover:bg-blue-600"
                            >
                                Try Now!
                            </Link>
                        </Show>
                    </div>
                </section>
                {/* Call to Action */}
                <section className="mt-5 flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-semibold lg:text-3xl">
                        What are you waiting for?
                    </h1>
                    <Show when="signed-out">
                        <Link
                            href="/sign-up"
                            className="button bg-blue-700 hover:bg-blue-600"
                        >
                            Try Now!
                        </Link>
                    </Show>
                    <Show when="signed-in">
                            <Link
                                href="/create-set"
                                className="button bg-blue-700 hover:bg-blue-600"
                            >
                                Try Now!
                            </Link>
                        </Show>
                </section>
            </div>
        </div>
    );
}
