import Link from "next/link";
import ModeToggle from "@/app/components/mode-toggle";

export default function Home() {
    return (
        <>
            <header>
                <nav className="sticky inset-s-0 top-0 flex w-full items-center justify-between border-b bg-neutral-200 p-2 dark:bg-black">
                    <Link
                        href="/"
                        className="text-xl font-semibold md:text-2xl dark:text-white"
                    >
                        Flashcard App
                    </Link>
                    <ModeToggle />
                </nav>
            </header>
            <main>
                
            </main>
        </>
    );
}
