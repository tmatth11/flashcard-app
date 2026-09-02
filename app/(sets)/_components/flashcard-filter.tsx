"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FlashcardFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentFilter = searchParams.get("filter") || "all";

    const handleFilterChange = (filter: string) => {
        const params = new URLSearchParams(searchParams);
        if (filter === "all") {
            params.delete("filter");
        } else {
            params.set("filter", filter);
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <select
            value={currentFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="mt-4 cursor-pointer rounded-md bg-neutral-200 p-1 dark:bg-slate-700"
        >
            <option value="all">All terms</option>
            <option value="starred">Starred terms</option>
        </select>
    );
}
