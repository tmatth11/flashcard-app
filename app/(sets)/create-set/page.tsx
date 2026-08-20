import { auth } from "@clerk/nextjs/server";

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
            </div>
        </div>
    );
}
