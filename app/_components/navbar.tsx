import Link from "next/link";
import ModeToggle from "./mode-toggle";
import { Show, UserButton } from "@clerk/nextjs";
import { FileStack, FileUser, Plus } from "lucide-react";

export default function Navbar() {
    return (
        <header className="sticky inset-s-0 top-0 z-50 w-full bg-neutral-200 p-4 dark:bg-black">
            <nav className="flex flex-col items-center justify-between md:flex-row">
                <Link
                    href="/"
                    className="mb-2 text-2xl font-semibold md:mb-0 dark:text-white"
                >
                    Flashcard App
                </Link>
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                    <Show when="signed-in">
                        <Link href="#">
                            <div className="flex items-center gap-2">
                                <Plus aria-label="Create set" />
                                <span className="md:hidden">Create set</span>
                            </div>
                        </Link>
                        <Link href="#">
                            <div className="flex items-center gap-2">
                                <FileUser aria-label="Your sets" />
                                <span className="md:hidden">Your sets</span>
                            </div>
                        </Link>
                        <Link href="#">
                            <div className="flex items-center gap-2">
                                <FileStack aria-label="All sets" />
                                <span className="md:hidden">All sets</span>
                            </div>
                        </Link>
                    </Show>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <span className="md:hidden">Toggle mode</span>
                    </div>
                    <Show when="signed-out">
                        <Link
                            href="/sign-in"
                            className="cursor-pointer text-center dark:text-white"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/sign-up"
                            className="nav-button bg-blue-700 text-center"
                        >
                            Sign Up
                        </Link>
                    </Show>
                    <Show when="signed-in">
                        <div className="flex items-center gap-2">
                            <UserButton />
                            <span className="md:hidden">My account</span>
                        </div>
                    </Show>
                </div>
            </nav>
        </header>
    );
}
