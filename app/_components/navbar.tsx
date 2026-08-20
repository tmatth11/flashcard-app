"use client";

import Link from "next/link";
import ModeToggle from "./mode-toggle";
import { Show, UserButton } from "@clerk/nextjs";
import { FileStack, FileUser, Menu, Plus } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [linksDisplay, setLinksDisplay] = useState("hidden");

    return (
        <header className="sticky inset-s-0 top-0 z-50 w-full bg-neutral-200 p-4 dark:bg-black">
            <nav className="flex flex-col items-center justify-between md:flex-row">
                <Link
                    href="/"
                    className="mb-2 text-2xl font-semibold md:mb-0 dark:text-white"
                >
                    Flashcard App
                </Link>
                <button
                    className="mb-2 cursor-pointer md:hidden"
                    aria-label="Expand menu"
                    onClick={() =>
                        linksDisplay == "hidden"
                            ? setLinksDisplay("flex")
                            : setLinksDisplay("hidden")
                    }
                >
                    <Menu />
                </button>
                <div
                    className={`${linksDisplay} flex-col items-start gap-5 md:flex md:flex-row md:items-center`}
                >
                    <Show when="signed-in">
                        <Link href="/create-set">
                            <div className="nav-link">
                                <Plus aria-label="Create set" />
                                <span>Create set</span>
                            </div>
                        </Link>
                        <Link href="/my-sets">
                            <div className="nav-link">
                                <FileUser aria-label="My sets" />
                                <span>My sets</span>
                            </div>
                        </Link>
                        <Link href="/all-sets">
                            <div className="nav-link">
                                <FileStack aria-label="All sets" />
                                <span>All sets</span>
                            </div>
                        </Link>
                    </Show>
                    <div className="nav-link">
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
                            className="button bg-blue-700 text-center"
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
