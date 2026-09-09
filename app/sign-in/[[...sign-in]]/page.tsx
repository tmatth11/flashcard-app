import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to using Clerk",
};

export default function Page() {

    return (
        <div className="flex flex-col items-center">
            <section className="mt-5">
                <SignIn />
            </section>
        </div>
    );
}
