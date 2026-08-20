import { auth } from "@clerk/nextjs/server";

export default async function Page() {
    await auth.protect();

    return (
        <p>/create-set works!</p>
    );
}