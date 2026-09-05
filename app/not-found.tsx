import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center gap-2 p-2 text-center">
            <h1 className="text-3xl font-semibold">Woah there!</h1>
            <Image
                src="/woah-there.jpg"
                className="rounded-md"
                alt="Not found image"
                width="200"
                height="100"
            />
            <p>This page does not exist. Please go back to the home page.</p>
            <Link
                href="/"
                className="button cursor-pointer bg-blue-700 text-center hover:bg-blue-600 dark:text-white"
            >
                Ok
            </Link>
        </div>
    );
}
