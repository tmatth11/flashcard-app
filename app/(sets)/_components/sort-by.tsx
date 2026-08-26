'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortBy({ defaultValue }: { defaultValue: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();

    const handleSort = (sortValue: string) => {
        const params = new URLSearchParams(searchParams);
        if (sortValue) {
            params.set("sort", sortValue);
        }
        else {
            params.delete("sort");
        }
        params.set("page", "1");
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="mt-4">
            <label htmlFor="sort-by">Sort by: </label>
            <select
                className="cursor-pointer rounded-md bg-neutral-200 p-1 dark:bg-slate-700"
                name="sort-by"
                id="sort-by"
                defaultValue={defaultValue || "created-descending"}
                onChange={(e) => handleSort(e.target.value)}
            >
                <option value="created-descending">Created: Descending</option>
                <option value="created-ascending">Created: Ascending</option>
                <option value="modified-descending">
                    Modified: Descending
                </option>
                <option value="modified-ascending">Modified: Ascending</option>
            </select>
        </div>
    );
}
