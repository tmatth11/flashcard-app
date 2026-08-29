"use client";
import * as React from "react";
import { CircleQuestionMark, Moon, Sun } from "lucide-react";
import { useTheme } from '@teispace/next-themes';

export default function ModeToggle() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Wait until mounted on client to safely show the UI
    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                aria-label="Loading dark mode toggle"
                className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 cursor-pointer"
            >
                <CircleQuestionMark />
            </button>
        );
    }

    // resolvedTheme knows if the system is currently "light" or "dark"
    const isDark = resolvedTheme === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            aria-label={isDark ? "Light mode" : "Dark mode"}
            onClick={toggleTheme}
            className="cursor-pointer rounded-md border bg-white p-2 text-black dark:bg-black dark:text-white"
        >
            {isDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            )}
        </button>
    );
}
