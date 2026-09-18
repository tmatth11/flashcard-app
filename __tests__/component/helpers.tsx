import { useAuth, useUser } from "@clerk/nextjs";
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

export function mockClerkAuth(isSignedIn: boolean = false) {
    vi.mocked(useAuth).mockReturnValue({
        isLoaded: true,
        isSignedIn,
        userId: isSignedIn ? "user123" : null,
        sessionId: isSignedIn ? "sess123" : null,
        sessionClaims: null,
        actor: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        has: vi.fn(),
        signOut: vi.fn(),
        getToken: vi.fn(),
    } as ReturnType<typeof useAuth>);
}