import { getAllFlashcardSets } from "@/app/_lib/data";

export default async function FlashcardSetList(props: FlashcardSetProps) {
    const flashcardSets = await getAllFlashcardSets(props);

    return (
        <div className="mt-4 flex flex-col justify-center gap-4 md:w-xl lg:w-3xl">
            {flashcardSets.map((flashcardSet) => {
                return (
                    <div
                        key={flashcardSet.id}
                        className="flex flex-col rounded-md bg-neutral-200 p-2 dark:bg-slate-700 dark:text-white"
                    >
                        <div>
                            <span className="line-clamp-2 text-sm break-all">
                                {flashcardSet.termCount} Term
                                {flashcardSet.termCount > 1 ? "s" : ""}
                            </span>
                        </div>
                        <span className="line-clamp-2 text-lg font-semibold break-all">
                            {flashcardSet.title}
                        </span>
                        <span className="line-clamp-2 text-sm break-all">
                            {flashcardSet.description}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
