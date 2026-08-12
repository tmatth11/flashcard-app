import Link from "next/link";
import ModeToggle from "@/app/components/mode-toggle";

export default function Home() {
    return (
        <>
            <header className="sticky inset-s-0 top-0 w-full border-b bg-neutral-200 p-2 dark:bg-black">
                <nav className="flex items-center justify-between">
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
