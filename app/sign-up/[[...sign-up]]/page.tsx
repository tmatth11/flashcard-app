import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Sign up using Clerk",
};

export default function Page() {

    return (
        <div className="flex flex-col items-center">
            <section className="mt-5">
                <SignUp />
            </section>
        </div>
    );
}
