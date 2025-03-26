import {
    hashPassword,
    comparePassword,
} from "../../../src/commons/utils/hashPassword";
import bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("hashPassword", () => {
    it("should hash the password correctly", async () => {
        const password = "mySecretPassword";
        const hashedPassword = "hashedPassword123";

        (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

        const result = await hashPassword(password);

        expect(result).toBe(hashedPassword);
        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it("should throw an error if hashing fails", async () => {
        const password = "mySecretPassword";

        (bcrypt.hash as jest.Mock).mockRejectedValue(
            new Error("Hashing failed"),
        );

        await expect(hashPassword(password)).rejects.toThrow("Hashing failed");
    });
});

describe("comparePassword", () => {
    it("should return true if the password matches the hash", async () => {
        const password = "mySecretPassword";
        const hash = "hashedPassword123";

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await comparePassword(password, hash);

        expect(result).toBe(true);
        expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it("should return false if the password does not match the hash", async () => {
        const password = "mySecretPassword";
        const hash = "hashedPassword123";

        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const result = await comparePassword(password, hash);

        expect(result).toBe(false);
        expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
    });

    it("should throw an error if comparison fails", async () => {
        const password = "mySecretPassword";
        const hash = "hashedPassword123";

        (bcrypt.compare as jest.Mock).mockRejectedValue(
            new Error("Comparison failed"),
        );

        await expect(comparePassword(password, hash)).rejects.toThrow(
            "Comparison failed",
        );
    });
});
