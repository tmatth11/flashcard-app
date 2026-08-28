"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const validTotalPages = Math.max(1, totalPages);

    const rawPage = Number(searchParams.get("page")) || 1;
    const currentPage = Math.min(rawPage, validTotalPages);

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="mt-4 flex items-center justify-center gap-3">
            {/* Previous arrow */}
            <Link href={createPageURL(currentPage - 1)}>
                <button
                    className="button bg-blue-500 enabled:hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-75"
                    aria-label="Previous page"
                    disabled={currentPage <= 1}
                >
                    <ArrowLeft />
                </button>
            </Link>
            {/* Current page/Total pages */}
            <p>
                {currentPage} of {validTotalPages}
            </p>
            {/* Next arrow */}
            <Link href={createPageURL(currentPage + 1)}>
                <button
                    className="button bg-blue-500 enabled:hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-75"
                    aria-label="Next page"
                    disabled={currentPage >= validTotalPages}
                >
                    <ArrowRight />
                </button>
            </Link>
        </div>
    );
}
