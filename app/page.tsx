import Link from "next/link";

export default function Home() {
    return (
        <header>
            <nav className="sticky inset-s-0 top-0 w-full border-b bg-neutral-200 p-2">
                <Link href="/" className="text-2xl font-semibold">
                    Flashcard App
                </Link>
            </nav>
        </header>
    );
}
