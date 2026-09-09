import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/app/_components/navbar";
import { ThemeProvider } from "./_components/theme-provider";
import ClerkThemeProvider from "./_components/clerk-theme-provider";
import { Metadata } from "next";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        template: "%s | Flashcard App",
        default: "Flashcard App"
    }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={`${inter.className} h-full`} suppressHydrationWarning>
            <body
                className="flex min-h-dvh flex-col"
                suppressHydrationWarning
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    enableColorScheme={false}
                >
                    <ClerkThemeProvider>
                        <Navbar />
                        <main className="bg-main flex-1 dark:text-white">
                            {children}
                        </main>
                    </ClerkThemeProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
