import { auth } from "@clerk/nextjs/server";
import { Move, Trash2 } from "lucide-react";

export default async function Page() {
    await auth.protect();

    return (
        <div className="flex flex-col items-center p-2">
            <div className="md:w-2xl lg:w-3xl">
                {/* Create Set header */}
                <div className="mt-5 flex flex-col items-center justify-between gap-2 md:flex-row md:gap-0">
                    <h1 className="text-center text-xl font-semibold">
                        Create a new flashcard set
                    </h1>
                    <button className="button bg-blue-500">Create</button>
                </div>
                {/* Visibility toggle */}
                <select
                    className="mt-4 cursor-pointer"
                    id="visiblity"
                    name="visiblity"
                >
                    <option value="public" className="text-black">
                        Public
                    </option>
                    <option value="private" className="text-black">
                        Private
                    </option>
                </select>
                <div className="mt-4 flex w-full flex-col gap-4">
                    {/* Title input */}
                    <div className="flex flex-col">
                        <textarea
                            name="title"
                            id="title"
                            className="rounded-md bg-neutral-300 p-2 dark:bg-slate-800 dark:text-white"
                            placeholder="Enter title"
                        ></textarea>
                        <label htmlFor="title" className="mt-1">
                            Title
                        </label>
                    </div>
                    {/* Description input */}
                    <div className="flex flex-col">
                        <textarea
                            name="description"
                            id="description"
                            className="rounded-md bg-neutral-300 p-2 dark:bg-slate-800 dark:text-white"
                            placeholder="Enter description"
                        ></textarea>
                        <label htmlFor="description" className="mt-1">
                            Description
                        </label>
                    </div>
                </div>
                {/* Flashcard input */}
                <div className="mt-4 rounded-md bg-neutral-200 p-2 dark:bg-slate-700">
                    <div className="flex items-center justify-between p-2 dark:text-white">
                        {/* Flashcard number */}
                        <span className="break-all">1</span>
                        <div className="flex items-center gap-4">
                            {/* Move button */}
                            <button aria-label="Move card">
                                <Move />
                            </button>
                            {/* Delete button */}
                            <button aria-label="Delete card">
                                <Trash2 />
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row">
                        {/* Term */}
                        <div className="flex w-full flex-col">
                            <textarea
                                name="term"
                                id="term"
                                className="rounded-md bg-neutral-300 p-1 dark:bg-slate-800 dark:text-white"
                                placeholder="Enter term"
                            ></textarea>
                            <label
                                htmlFor="term"
                                className="mt-1 dark:text-white"
                            >
                                Term
                            </label>
                        </div>
                        {/* Definition */}
                        <div className="flex w-full flex-col">
                            <textarea
                                name="definition"
                                id="definition"
                                className="rounded-md bg-neutral-300 p-1 dark:bg-slate-800 dark:text-white"
                                placeholder="Enter definition"
                            ></textarea>
                            <label
                                htmlFor="definition"
                                className="mt-1 dark:text-white"
                            >
                                Definition
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
