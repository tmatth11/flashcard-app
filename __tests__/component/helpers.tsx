import { useUser } from "@clerk/nextjs";
import { vi } from "vitest";

vi.mock("@clerk/nextjs", () => ({
    useUser: vi.fn(),
    UserButton: () => <div data-testid="user-button">Clerk User Button</div>,
    Show: ({
        when,
        children,
    }: {
        when: "signed-in" | "signed-out";
        children: React.ReactNode;
    }) => {
        const { isSignedIn } = useUser();
        return (when === "signed-in") === isSignedIn ? <>{children}</> : null;
    },
}));

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