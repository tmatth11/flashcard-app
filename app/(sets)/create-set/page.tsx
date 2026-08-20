import { auth } from "@clerk/nextjs/server";

export default async function Page() {
    await auth.protect();

    return (
        <div className="flex flex-col items-center p-2">
            <div className="lg:w-3xl md:w-2xl">
                <div className="mt-5 flex flex-col items-center justify-between gap-2 md:flex-row md:gap-0">
                    <h1 className="text-xl text-center font-semibold">
                        Create a new flashcard set
                    </h1>
                    <button className="button bg-blue-500">Create</button>
                </div>
            </div>
        </div>
    );
}
