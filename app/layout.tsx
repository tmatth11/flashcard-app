import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

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
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    enableColorScheme={false}
                >
                    <div className="min-h-dvh">{children}</div>
                </ThemeProvider>
            </body>
        </html>
    );
}
