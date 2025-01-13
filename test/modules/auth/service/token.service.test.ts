// src/modules/auth/service/token.service.spec.ts
import { TokenService } from "../../../../src/modules/auth/service/token.service";
import jwt from "jsonwebtoken";
import { config } from "../../../../src/config/config";

jest.mock("jsonwebtoken");

describe("TokenService", () => {
    let tokenService: TokenService;

    beforeEach(() => {
        tokenService = new TokenService();
        // Mockando a configuração
        config.jwt = {
            secret: "mockSecret",
            expiresIn: "1h",
            refreshTokenSecret: "mockRefreshTokenSecret",
        };
    });

    describe("generateToken", () => {
        it("should generate a token for a given user ID", () => {
            const userId = "123";
            (jwt.sign as jest.Mock).mockReturnValue("mockToken");

            const token = tokenService.generateToken(userId);

            expect(token).toBe("mockToken");
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId },
                config.jwt.secret,
                {
                    expiresIn: config.jwt.expiresIn,
                },
            );
        });
    });

    describe("verifyToken", () => {
        it("should return the user ID for a valid token", () => {
            const token = "mockToken";
            (jwt.verify as jest.Mock).mockReturnValue({ userId: "123" });

            const userId = tokenService.verifyToken(token);

            expect(userId).toBe("123");
            expect(jwt.verify).toHaveBeenCalledWith(token, config.jwt.secret);
        });

        it("should return null for an invalid token", () => {
            const token = "invalidToken";
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error("Invalid token");
            });

            const userId = tokenService.verifyToken(token);

            expect(userId).toBeNull();
        });
    });

    describe("extractTokenFromHeader", () => {
        it("should extract the token from a Bearer header", () => {
            const header = "Bearer mockToken";
            const token = tokenService.extractTokenFromHeader(header);

            expect(token).toBe("mockToken");
        });

        it("should return null if the header is not a Bearer token", () => {
            const header = "Basic mockToken";
            const token = tokenService.extractTokenFromHeader(header);

            expect(token).toBeNull();
        });
    });
});
