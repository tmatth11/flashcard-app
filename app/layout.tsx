import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import ModeToggle from "@/app/components/mode-toggle";
import {
    ClerkProvider,
    Show,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        template: "%s | Flashcard App",
        default: "Flashcard App",
    },
    description: "Create your own flashcards and share them with friends!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
            <head>
                <link
                    rel="icon"
                    href="/icon?<generated>"
                    type="image/<generated>"
                    sizes="<generated>"
                />
            </head>
            <body>
                <ClerkProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                        enableColorScheme={false}
                    >
                        <header className="sticky inset-s-0 top-0 w-full border-b bg-neutral-200 p-4 dark:bg-black">
                            <nav className="flex items-center justify-between">
                                <Link
                                    href="/"
                                    className="text-2xl font-semibold dark:text-white"
                                >
                                    Flashcard App
                                </Link>
                                <div className="flex items-center gap-4">
                                    <ModeToggle />
                                    <Show when="signed-out">
                                        <SignInButton>
                                            <span className="cursor-pointer text-center dark:text-white">
                                                Log In
                                            </span>
                                        </SignInButton>
                                        <SignUpButton>
                                            <button className="nav-button bg-blue-700">
                                                Sign Up
                                            </button>
                                        </SignUpButton>
                                    </Show>
                                    <Show when="signed-in">
                                        <UserButton />
                                    </Show>
                                </div>
                            </nav>
                        </header>
                        <main className="min-h-dvh">{children}</main>
                    </ThemeProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
