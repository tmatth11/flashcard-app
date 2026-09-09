"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function StudyStarredCheckbox() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const isStudyingStarred = searchParams.get("study") === "starred";

    const handleToggle = (checked: boolean) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        if (checked) {
            params.set("study", "starred");
        } else {
            params.delete("study");
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <label className="mt-2 flex items-center gap-2 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
            <span>Study starred:</span>
            <input
                type="checkbox"
                checked={isStudyingStarred}
                onChange={(e) => handleToggle(e.target.checked)}
            />
        </label>
    );
}
