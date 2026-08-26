import { clerkClient } from "@clerk/nextjs/server";
import FlashcardSetView from "../../_components/flashcard-set-view";
import { redirect } from "next/navigation";

export default async function Page(props: {
    params: Promise<{
        username: string;
    }>;
    searchParams?: Promise<{
        query?: string;
        page?: string;
        sort?: string;
    }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const username = params.username;

    const client = await clerkClient();
    const users = await client.users.getUserList({
        username: [username],
    });

    if (users.data.length == 0) {
        redirect("/all-sets");
    }

    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sort || "created-descending";

    return (
        <div className="flex flex-col items-center p-2">
            <h1 className="text-center text-2xl font-semibold">
                {username}&apos;s sets
            </h1>
            <FlashcardSetView
                isPublic={true}
                isPrivate={false}
                query={query}
                currentPage={currentPage}
                sortBy={sortBy}
                targetUsername={username}
                placeholder={`Search ${username}'s sets`}
            />
        </div>
    );
}
