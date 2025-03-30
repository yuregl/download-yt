import { Request, Response, NextFunction } from "express";
import { validateAutentication } from "../../../../src/modules/user/middleware/validate-autentication";
import { TokenService } from "../../../../src/modules/auth/service/token.service";

interface ValidationError {
    field: string;
    message: string;
}

interface CustomError {
    status: number;
    message: string;
    errors?: ValidationError[];
    name: string;
}

interface RequestWithError extends Omit<Request, "erro"> {
    erro?: CustomError;
}

jest.mock("../../../../src/modules/auth/service/token.service");

describe("validateAutentication", () => {
    let mockRequest: Partial<RequestWithError>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();
    let mockTokenService: jest.Mocked<TokenService>;

    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
        mockTokenService = new TokenService() as jest.Mocked<TokenService>;
        (TokenService as jest.Mock).mockImplementation(() => mockTokenService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("deve retornar erro quando não houver token", async () => {
        mockRequest = {
            headers: {},
        };

        const middleware = validateAutentication();
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.erro).toBeDefined();
        expect(mockRequest.erro?.status).toBe(401);
        expect(mockRequest.erro?.message).toBe("Token is required");
        expect(mockRequest.erro?.name).toBe("Token is required");
        expect(mockRequest.headers?.userId).toBeUndefined();
    });

    it("deve retornar erro quando o token não tiver o formato Bearer", async () => {
        mockRequest = {
            headers: {
                authorization: "invalid-token",
            },
        };

        mockTokenService.extractTokenFromHeader.mockReturnValue(null);

        const middleware = validateAutentication();
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.erro).toBeDefined();
        expect(mockRequest.erro?.status).toBe(401);
        expect(mockRequest.erro?.message).toBe("Invalid token");
        expect(mockRequest.erro?.name).toBe("Invalid token");
        expect(mockRequest.headers?.userId).toBeUndefined();
    });

    it("deve retornar erro quando o token for inválido", async () => {
        mockRequest = {
            headers: {
                authorization: "Bearer invalid-token",
            },
        };

        mockTokenService.extractTokenFromHeader.mockReturnValue(
            "invalid-token",
        );
        mockTokenService.verifyToken.mockReturnValue(null);

        const middleware = validateAutentication();
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.erro).toBeDefined();
        expect(mockRequest.erro?.status).toBe(401);
        expect(mockRequest.erro?.message).toBe("Invalid token");
        expect(mockRequest.erro?.name).toBe("Invalid token");
        expect(mockRequest.headers?.userId).toBeUndefined();
    });

    it("deve passar na validação quando o token for válido", async () => {
        const validToken = "valid-token";
        const userId = "123";

        mockRequest = {
            headers: {
                authorization: `Bearer ${validToken}`,
            },
        };

        mockTokenService.extractTokenFromHeader.mockReturnValue(validToken);
        mockTokenService.verifyToken.mockReturnValue(userId);

        const middleware = validateAutentication();
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.erro).toBeUndefined();
        expect(mockRequest.headers?.userId).toBe(userId);
    });
});
