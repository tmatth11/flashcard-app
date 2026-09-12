import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockAuthUser, mockDatabaseDelete, mockDatabaseInsert, mockFetchFlashcardSetsPages, mockFlashcardSetUpdate, mockInsertReturningSet, mockSetOwner, TEST_PARAMS, TEST_USERNAMES, TEST_USERS } from "./helpers";
import { createFlashcardSet, deleteFlashcardSet, updateFlashcardSet } from "@/app/_actions/set-actions";
import { db } from "@/app/_db/drizzle";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Flashcard set form data generator

function createSetFormData(overrides?: {
    title?: string;
    description?: string;
    public?: string;
    terms?: string[];
    definitions?: string[];
    setId?: string;
}) {
    const formData = new FormData();

    if (overrides?.setId) formData.append("setId", overrides.setId);
    formData.append("title", overrides?.title ?? "Test Set");
    if (overrides?.description) formData.append("description", overrides.description ?? "This set is a test.");

    const terms = overrides?.terms ?? ["Term 1"];
    const definitions = overrides?.definitions ?? ["Definition 1"];

    terms.forEach((t) => formData.append("term", t));
    definitions.forEach((d) => formData.append("definition", d));

    return formData;
}

describe("Flashcard Set Actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // createFlashcardSet
    describe("createFlashcardSet", () => {
        it("throws unauthorized error if user is not logged in", async () => {
            mockAuthUser(null);

            const formData = createSetFormData();
            const result = await createFlashcardSet({ message: "", success: false }, formData);

            expect(result).toEqual({
                message: "Unauthorized: Please sign in to create flashcards sets.",
                success: false,
            });
        });

        it("returns validation error if fields are missing", async () => {
            mockAuthUser();

            const formData = createSetFormData({ title: "", terms: [""] });
            const result = await createFlashcardSet({ message: "", success: false }, formData);

            expect(result.success).toBe(false);
            expect(result.message).toBe("Error: Missing or invalid fields. Please check your inputs.");
        });

        it("creates flashcard set successfully", async () => {
            mockAuthUser();
            mockInsertReturningSet(TEST_PARAMS.setId);

            const formData = createSetFormData();
            await createFlashcardSet({ message: "", success: false }, formData);

            expect(db.insert).toHaveBeenCalledTimes(2);
            expect(revalidatePath).toHaveBeenCalledWith(`/set/${TEST_PARAMS.setId}`);
            expect(redirect).toHaveBeenCalledWith(`/set/${TEST_PARAMS.setId}`);
        });
    });

    // deleteFlashcardSet
    describe("deleteFlashcardSet", () => {
        it("throws unauthorized error if user is not logged in", async () => {
            mockAuthUser(null);

            await expect(
                deleteFlashcardSet(TEST_PARAMS.setId, TEST_USERNAMES.owner)
            ).rejects.toThrow(
                "Unauthorized: You must be logged in to delete flashcard sets."
            );
        });

        it("throws forbidden error if user tries to delete another user's flashcard set", async () => {
            mockAuthUser();
            mockSetOwner(TEST_USERS.other);

            await expect(
                deleteFlashcardSet(TEST_PARAMS.setId, TEST_USERNAMES.owner)
            ).rejects.toThrow(
                "Forbidden: You do not own this flashcard set."
            );
        });

        it("deletes flashcard set and redirects to sets page with no filters applied", async () => {
            mockAuthUser();
            mockSetOwner();

            await deleteFlashcardSet(TEST_PARAMS.setId, TEST_USERNAMES.owner);

            expect(db.delete).toHaveBeenCalled();
            expect(revalidatePath).toHaveBeenCalledWith(`/sets/${TEST_USERNAMES.owner}`);
            expect(redirect).toHaveBeenCalledWith(`/sets/${TEST_USERNAMES.owner}`);
        });

        it("deletes flashcard set and redirects to sets page with filters applied", async () => {
            mockAuthUser();
            mockSetOwner();
            mockFetchFlashcardSetsPages(2);

            await deleteFlashcardSet(TEST_PARAMS.setId, TEST_USERNAMES.owner, {
                currentPage: 5,
                query: "Test",
            });

            expect(redirect).toHaveBeenCalledWith(`/sets/${TEST_USERNAMES.owner}?query=Test&page=2`);
        });
    });

    // updateFlashcardSet
    describe("updateFlashcardSet", () => {
        it("throws unauthorized error if user is not logged in", async () => {
            mockAuthUser(null);

            const formData = createSetFormData();
            const result = await updateFlashcardSet({ message: "", success: false }, formData);

            expect(result).toEqual({
                message: "Unauthorized: Please sign in to edit flashcards sets.",
                success: false,
            });
        });

        it("throws error if setId is missing", async () => {
            mockAuthUser();

            const formData = createSetFormData();
            const result = await updateFlashcardSet({ message: "", success: false }, formData);

            expect(result).toEqual({
                message: "Error: Flashcard set ID must be provided.",
                success: false,
            });
        });

        it("throws error if setId is not a valid number", async () => {
            mockAuthUser();

            const formData = createSetFormData({ setId: "number 1" });
            const result = await updateFlashcardSet({ message: "", success: false }, formData);

            expect(result).toEqual({
                message: "Error: Invalid flashcard set ID.",
                success: false,
            });
        });

        it("throws error if set does not have a title", async () => {
            mockAuthUser();

            const formData = createSetFormData({
                setId: String(TEST_PARAMS.setId),
                title: "",
            });
            const result = await updateFlashcardSet({ message: "", success: false }, formData);

            expect(result).toEqual({
                message: "Error: Title is required.",
                success: false,
            });
        });

        it("throws error if card in set does not have a term or definition", async () => {
            mockAuthUser();

            const formData = createSetFormData({
                setId: String(TEST_PARAMS.setId),
                terms: [""],
                definitions: [""],
            });
            const result = await updateFlashcardSet({ message: "", success: false }, formData);

            expect(result).toEqual({
                message: "Error: All flashcards must have both a term and a definition.",
                success: false,
            });
        });

        it("throws error if set is not found or user is unauthorized", async () => {
            mockAuthUser();
            mockFlashcardSetUpdate([]);

            const formData = createSetFormData({
                setId: String(TEST_PARAMS.setId)
            });
            const result = await updateFlashcardSet({ message: "", success: false }, formData);

            expect(result).toEqual({
                message: "Error: Set not found or you are unauthorized.",
                success: false,
            });
        });

        it("updates set successfully", async () => {
            mockAuthUser();
            mockFlashcardSetUpdate([{ id: TEST_PARAMS.setId }]);
            mockDatabaseDelete();
            mockDatabaseInsert();

            const formData = createSetFormData({
                setId: String(TEST_PARAMS.setId)
            });

            await updateFlashcardSet({ message: "", success: false }, formData);

            expect(db.update).toHaveBeenCalledTimes(1);
            expect(db.delete).toHaveBeenCalledTimes(1);
            expect(db.insert).toHaveBeenCalledTimes(1);

            expect(revalidatePath).toHaveBeenCalledWith(`/edit-set/${TEST_PARAMS.setId}`);
            expect(revalidatePath).toHaveBeenCalledWith(`/set/${TEST_PARAMS.setId}`);
            expect(redirect).toHaveBeenCalledWith(`/set/${TEST_PARAMS.setId}`);
        });
    });
});