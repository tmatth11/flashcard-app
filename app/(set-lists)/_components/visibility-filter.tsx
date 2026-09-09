'use client';

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function VisibilityFilter({
    defaultValue = "all",
}: {
    defaultValue?: string;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFilterChange = (visibility: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("visibility", visibility);
        params.set("page", "1");
        replace(`${pathname}?${params.toString()}`);
    };

    const activeFilter = searchParams.get("visibility") || defaultValue;

    return (
        <div className="mt-4">
            <label htmlFor="visibility">Visibility: </label>
            <select
                className="cursor-pointer rounded-md bg-neutral-200 p-1 dark:bg-slate-700"
                name="visibility"
                id="visibility"
                defaultValue={activeFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
            >
                <option value="all">All sets</option>
                <option value="private">Private sets</option>
                <option value="public">
                    Public sets
                </option>
            </select>
        </div>
    );
}
