import { auth } from "@clerk/nextjs/server";
import { Move, Trash2 } from "lucide-react";

export default async function Page() {
    await auth.protect();

    return (
        <div className="flex flex-col items-center p-2">
            <div className="md:w-2xl lg:w-3xl">
                <div className="mt-5 flex flex-col items-center justify-between gap-2 md:flex-row md:gap-0">
                    <h1 className="text-center text-xl font-semibold">
                        Create a new flashcard set
                    </h1>
                    <button className="button bg-blue-500">Create</button>
                </div>
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
                <div className="mt-4 rounded-md bg-slate-700 p-2">
                    <div className="flex items-center justify-between p-2 text-white">
                        <span className="break-all">1</span>
                        <div className="flex items-center gap-4">
                            <button aria-label="Move card">
                                <Move />
                            </button>
                            <button aria-label="Delete card">
                                <Trash2 />
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row">
                        <div className="flex w-full flex-col">
                            <textarea
                                name="term"
                                id="term"
                                className="rounded-md bg-slate-800 p-1 text-white"
                                placeholder="Enter term"
                            ></textarea>
                            <label htmlFor="term" className="mt-1 text-white">
                                Term
                            </label>
                        </div>
                        <div className="flex w-full flex-col">
                            <textarea
                                name="definition"
                                id="definition"
                                className="rounded-md bg-slate-800 p-1 text-white"
                                placeholder="Enter definition"
                            ></textarea>
                            <label
                                htmlFor="definition"
                                className="mt-1 text-white"
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
