import { clerkClient, currentUser } from "@clerk/nextjs/server";
import FlashcardSetView from "../../_components/flashcard-set-view";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Page(props: {
    params: Promise<{
        username: string;
    }>;
    searchParams?: Promise<{
        query?: string;
        page?: string;
        sort?: string;
        visibility?: "all" | "private" | "public";
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

    const loggedInUser = await currentUser();
    const userImageUrl = loggedInUser?.imageUrl || '/blank-user.png';
    const isOwner = loggedInUser?.username === username;

    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const sortBy = searchParams?.sort || "created-descending";
    const rawVisibility = searchParams?.visibility || "all";
    const visibility = isOwner ? rawVisibility : "public";

    const pageTitle = isOwner ? "Your sets" : `${username}'s sets`;

    return (
        <div className="flex flex-col items-center p-2">
            <div className="flex flex-col items-center">
                <Image
                    width="50"
                    height="50"
                    className="mt-4"
                    src={userImageUrl}
                    alt={username}
                />
                <h1 className="text-center text-2xl font-semibold mt-2">
                    {pageTitle}
                </h1>
            </div>
            <FlashcardSetView
                query={query}
                currentPage={currentPage}
                sortBy={sortBy}
                targetUsername={username}
                isOwner={isOwner}
                visibility={visibility}
                placeholder={
                    isOwner ? "Search your sets" : `Search ${username}'s sets`
                }
            />
        </div>
    );
}
