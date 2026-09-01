'use client';

import { useState } from "react";
import { Flashcard } from "../types";

export default function Card({flashcard}: {
    flashcard: Flashcard
}) {
    const [termSide, setTermSide] = useState(true);

    return (
        <>
            <div onClick={() => setTermSide((prev) => !prev)} className="cursor-pointer w-full h-90 mt-2 flex flex-col rounded-md bg-neutral-200 p-2 dark:bg-slate-700 overflow-y-auto">
                <p className="text-xl my-auto text-center break-all">
                    {termSide ? flashcard.term : flashcard.definition}
                </p>
            </div>
        </>
    );
}
