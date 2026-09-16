import { useUser } from "@clerk/nextjs";
import { vi } from "vitest";

export function mockClerkAuthUser(user: { username: string } | null = null) {
    if (user) {
        vi.mocked(useUser).mockReturnValue({
            user: { username: user.username } as unknown as NonNullable<
                ReturnType<typeof useUser>["user"]
            >,
            isLoaded: true,
            isSignedIn: true,
        });
    } else {
        vi.mocked(useUser).mockReturnValue({
            user: null,
            isLoaded: true,
            isSignedIn: false,
        });
    }
}