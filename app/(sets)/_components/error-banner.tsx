export default function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="rounded-md border-4 border-red-700 bg-red-500 p-2 text-center break-all text-white">
            {message}
        </div>
    );
}
