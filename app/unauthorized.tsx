import Image from "next/image";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center gap-2 p-2 text-center">
            <h1 className="text-3xl font-semibold">Sorry!</h1>
            <Image
                src="/sorry.jpg"
                className="rounded-md"
                alt="Unauthorized image"
                width="200"
                height="100"
            />
            <p>
                You are not allowed to visit this page. Please go back to the
                home page.
            </p>
            <Link
                href="/"
                className="button cursor-pointer bg-blue-700 text-center hover:bg-blue-600 dark:text-white"
            >
                Ok
            </Link>
        </div>
    );
}
