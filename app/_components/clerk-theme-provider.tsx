"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "@teispace/next-themes";

export default function ClerkThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { resolvedTheme } = useTheme();

    return (
        <ClerkProvider
            appearance={{
                theme: resolvedTheme === "dark" ? dark : undefined,
            }}
        >
            {children}
        </ClerkProvider>
    );
}
