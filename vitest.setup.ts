import { vi } from 'vitest';

// Dummy environment variables
process.env.CLERK_SECRET_KEY = 'sk_test_dummy'
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_dummy'
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/dummy'

/* Mocks */

// Drizzle database

const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{id: 1}]),
    query: {
        flashcardSet: {
            findFirst: vi.fn(),
        },
        flashcard: {
            findMany: vi.fn(),
        },
        flashcardStar: {
            findFirst: vi.fn(),
        }
    },
    transaction: vi.fn(async (cb) => cb(mockDb)),
};

vi.mock("@/app/_db/drizzle", () => ({
    db: mockDb,
}));

// Clerk

vi.mock("@clerk/nextjs/server", () => ({
    auth: vi.fn().mockResolvedValue({ userId: 'user_test_123' }),
}));

// Next.js

vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}));