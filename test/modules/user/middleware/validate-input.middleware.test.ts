import { Request, Response, NextFunction } from "express";
import { validationInputMiddleware } from "../../../../src/modules/user/middleware/validate-input.middleware";
import { CreateUserDto } from "../../../../src/modules/user/dto/create-user.dto";

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

describe("validationInputMiddleware", () => {
    let mockRequest: Partial<RequestWithError>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {
            body: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        nextFunction = jest.fn();
    });

    it("deve passar na validação quando os dados são válidos", async () => {
        const validData = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        };

        mockRequest.body = validData;

        const middleware = validationInputMiddleware(CreateUserDto);
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.erro).toBeUndefined();
        expect(mockRequest.body).toBeInstanceOf(CreateUserDto);
    });

    it("deve passar na validação quando não há erros de validação", async () => {
        const validData = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        };

        mockRequest.body = validData;

        const middleware = validationInputMiddleware(CreateUserDto);
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.erro).toBeUndefined();
        expect(mockRequest.body).toBeInstanceOf(CreateUserDto);
        expect(mockRequest.body).toEqual(validData);
    });

    it("deve retornar erro quando o email é inválido", async () => {
        const invalidData = {
            name: "Test User",
            email: "invalid-email",
            password: "password123",
        };

        mockRequest.body = invalidData;

        const middleware = validationInputMiddleware(CreateUserDto);
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.erro).toBeDefined();
        expect(mockRequest.erro?.status).toBe(400);
        expect(mockRequest.erro?.errors).toHaveLength(1);
        expect(mockRequest.erro?.errors?.[0].field).toBe("email");
        expect(mockRequest.erro?.errors?.[0].message).toContain(
            "Email inválido",
        );
    });

    it("deve retornar erro quando a senha é muito curta", async () => {
        const invalidData = {
            name: "Test User",
            email: "test@example.com",
            password: "123",
        };

        mockRequest.body = invalidData;

        const middleware = validationInputMiddleware(CreateUserDto);
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.erro).toBeDefined();
        expect(mockRequest.erro?.status).toBe(400);
        expect(mockRequest.erro?.errors).toHaveLength(1);
        expect(mockRequest.erro?.errors?.[0].field).toBe("password");
        expect(mockRequest.erro?.errors?.[0].message).toContain(
            "Senha deve ter no mínimo 6 caracteres",
        );
    });

    it("deve retornar erro quando o nome é vazio", async () => {
        const invalidData = {
            name: "",
            email: "test@example.com",
            password: "password123",
        };

        mockRequest.body = invalidData;

        const middleware = validationInputMiddleware(CreateUserDto);
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.erro).toBeDefined();
        expect(mockRequest.erro?.status).toBe(400);
        expect(mockRequest.erro?.errors).toHaveLength(1);
        expect(mockRequest.erro?.errors?.[0].field).toBe("name");
        expect(mockRequest.erro?.errors?.[0].message).toContain(
            "Nome é obrigatório",
        );
    });

    it("deve retornar múltiplos erros quando há várias validações falhando", async () => {
        const invalidData = {
            name: "",
            email: "invalid-email",
            password: "123",
        };

        mockRequest.body = invalidData;

        const middleware = validationInputMiddleware(CreateUserDto);
        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction,
        );

        expect(nextFunction).toHaveBeenCalled();
        expect(mockRequest.erro).toBeDefined();
        expect(mockRequest.erro?.status).toBe(400);
        expect(mockRequest.erro?.errors).toHaveLength(3);
        expect(mockRequest.erro?.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: "name" }),
                expect.objectContaining({ field: "email" }),
                expect.objectContaining({ field: "password" }),
            ]),
        );
    });
});
