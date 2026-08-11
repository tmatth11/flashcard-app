import type { Metadata } from "next";
import "./globals.css";
import {Inter} from 'next/font/google';

const inter = Inter({
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: {
        template: '%s | Flashcard App',
        default: "Flashcard App"
    },
    description: "Create your own flashcards and share them with friends!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={inter.className}
        >
            <head>
                <link
                    rel="icon"
                    href="/icon?<generated>"
                    type="image/<generated>"
                    sizes="<generated>"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
