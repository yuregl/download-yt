import { Request, Response } from "express";
import { UserController } from "../../../../src/modules/user/controller/user.controller";
import { UserService } from "../../../../src/modules/user/service/user.service";
import { IUser } from "../../../../src/modules/user/interface/users.interface";
import { UserRepository } from "../../../../src/modules/user/repository/user.repository";
import { RepositoryBase } from "../../../../src/commons/repository-base";
import { Model } from "mongoose";
import { CustomerError } from "../../../../src/commons/Error/customer.error";

interface MockUserService extends Partial<UserService> {
    create: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    updateVip: jest.Mock;
    userRepository: UserRepository;
}

class MockUserRepository extends RepositoryBase<IUser> {
    findByEmail = jest.fn();
    findAll = jest.fn();
    findById = jest.fn();
    create = jest.fn();
    update = jest.fn();
    delete = jest.fn();
}

interface RequestWithError extends Request {
    erro: {
        status: number;
        message: string;
        errors?: {
            field: string;
            message: string;
        }[];
        name: string;
    };
}

describe("UserController", () => {
    let userController: UserController;
    let mockUserService: MockUserService;
    let mockRequest: Partial<RequestWithError>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockUserService = {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            updateVip: jest.fn(),
            userRepository: new MockUserRepository({} as Model<IUser>),
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        userController = new UserController(
            mockUserService as unknown as UserService,
        );
    });

    describe("create", () => {
        const mockUser = {
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        };

        beforeEach(() => {
            mockRequest = {
                body: mockUser,
                erro: undefined,
            };
        });

        it("deve criar um usuário com sucesso", async () => {
            const createdUser = { ...mockUser, _id: "123" };
            mockUserService.create.mockResolvedValue(createdUser as IUser);

            await userController.create(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockUserService.create).toHaveBeenCalledWith(mockUser);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(createdUser);
        });

        it("deve retornar erro quando houver erro de validação", async () => {
            mockRequest.erro = {
                status: 400,
                message: "Validation error",
                name: "ValidationError",
                errors: [
                    {
                        field: "email",
                        message: "Email inválido",
                    },
                ],
            };

            await userController.create(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: [
                    {
                        field: "email",
                        message: "Email inválido",
                    },
                ],
            });
        });

        it("deve retornar erro quando o serviço falhar", async () => {
            const error = new CustomerError("Usuário já existe", 400);
            mockUserService.create.mockRejectedValue(error);

            await userController.create(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Usuário já existe",
            });
        });
    });

    describe("findById", () => {
        const mockUserId = "123";

        beforeEach(() => {
            mockRequest = {
                headers: { userId: mockUserId },
                erro: undefined,
            };
        });

        it("deve retornar usuário quando encontrado", async () => {
            const foundUser = {
                _id: mockUserId,
                name: "Test User",
                email: "test@example.com",
            };

            mockUserService.findById.mockResolvedValue(foundUser as IUser);

            await userController.findById(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockUserService.findById).toHaveBeenCalledWith(mockUserId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(foundUser);
        });

        it("deve retornar erro quando houver erro de validação", async () => {
            mockRequest.erro = {
                status: 400,
                message: "Usuário não encontrado",
                name: "ValidationError",
            };

            await userController.findById(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Usuário não encontrado",
            });
        });

        it("deve retornar erro quando houver erro de validação sem errors array", async () => {
            const erro = {
                status: 400,
                message: "Erro de validação genérico",
                name: "ValidationError",
            };
            // Explicitamente não incluindo a propriedade errors
            mockRequest.erro = erro;

            await userController.findById(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Erro de validação genérico",
            });
        });

        it("deve retornar erro quando o serviço falhar", async () => {
            const error = new CustomerError("Usuário não encontrado", 404);
            mockUserService.findById.mockRejectedValue(error);

            await userController.findById(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Usuário não encontrado",
            });
        });
    });

    describe("update", () => {
        const mockUserId = "123";
        const mockUpdateData = {
            name: "Updated Name",
            email: "updated@example.com",
        };

        beforeEach(() => {
            mockRequest = {
                headers: { userId: mockUserId },
                body: mockUpdateData,
                erro: undefined,
            };
        });

        it("deve atualizar usuário com sucesso", async () => {
            const updatedUser = {
                _id: mockUserId,
                ...mockUpdateData,
            };

            mockUserService.update.mockResolvedValue(updatedUser as IUser);

            await userController.update(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockUserService.update).toHaveBeenCalledWith(
                mockUserId,
                mockUpdateData,
            );
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
        });

        it("deve retornar erro quando houver erro de validação", async () => {
            mockRequest.erro = {
                status: 400,
                message: "Validation error",
                name: "ValidationError",
                errors: [
                    {
                        field: "name",
                        message: "Nome é obrigatório",
                    },
                    {
                        field: "password",
                        message: "Senha deve ter no mínimo 6 caracteres",
                    },
                ],
            };

            await userController.update(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: [
                    {
                        field: "name",
                        message: "Nome é obrigatório",
                    },
                    {
                        field: "password",
                        message: "Senha deve ter no mínimo 6 caracteres",
                    },
                ],
            });
        });

        it("deve retornar erro quando o serviço falhar", async () => {
            const error = new CustomerError("Usuário não encontrado", 404);
            mockUserService.update.mockRejectedValue(error);

            await userController.update(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Usuário não encontrado",
            });
        });
    });

    describe("updateVip", () => {
        const mockUserId = "123";
        const mockVipData = {
            status: true,
        };

        beforeEach(() => {
            mockRequest = {
                headers: { userId: mockUserId },
                body: mockVipData,
                erro: undefined,
            };
        });

        it("deve atualizar status VIP com sucesso", async () => {
            const updatedUser = {
                _id: mockUserId,
                vip: true,
            };

            mockUserService.updateVip.mockResolvedValue(updatedUser as IUser);

            await userController.updateVip(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockUserService.updateVip).toHaveBeenCalledWith(
                mockUserId,
                mockVipData.status,
            );
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
        });

        it("deve retornar erro quando houver erro de validação", async () => {
            mockRequest.erro = {
                status: 400,
                message: "Validation error",
                name: "ValidationError",
                errors: [
                    {
                        field: "status",
                        message: "Status deve ser um booleano",
                    },
                ],
            };

            await userController.updateVip(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: [
                    {
                        field: "status",
                        message: "Status deve ser um booleano",
                    },
                ],
            });
        });

        it("deve retornar erro quando o serviço falhar", async () => {
            const error = new CustomerError("Usuário não encontrado", 404);
            mockUserService.updateVip.mockRejectedValue(error);

            await userController.updateVip(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Usuário não encontrado",
            });
        });
    });
});
