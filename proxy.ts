import { clerkMiddleware } from "@clerk/nextjs/server";

const hasProxy = Boolean(process.env.NEXT_PUBLIC_CLERK_PROXY_URL);

export default clerkMiddleware(
    hasProxy
        ? {
            frontendApiProxy: {
                enabled: true,
            },
        } : {}
);

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
        "/__clerk/(.*)",
    ],
};