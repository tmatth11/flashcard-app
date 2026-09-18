export interface ErrorBannerProps {
    message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
    return (
        <div className="rounded-md border-4 border-red-700 bg-red-500 p-2 text-center break-all text-white">
            {message}
        </div>
    );
}
