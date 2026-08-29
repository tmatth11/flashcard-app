import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/app/_components/navbar";
import { ThemeProvider } from "./_components/theme-provider";

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
        <ClerkProvider>
            <html
                lang="en"
                className={inter.className}
                suppressHydrationWarning
            >
                <body className="flex min-h-screen flex-col" suppressHydrationWarning>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                        enableColorScheme={false}
                    >
                        <Navbar />
                        <main className="flex-1 dark:bg-neutral-900 dark:text-white">
                            {children}
                        </main>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
