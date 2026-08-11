import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "",
    description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
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
