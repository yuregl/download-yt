import { UserService } from "../../../../src/modules/user/service/user.service";
import { UserRepository } from "../../../../src/modules/user/repository/user.repository";
import { CreateUserDto } from "../../../../src/modules/user/dto/create-user.dto";
import { UpdateUserDto } from "../../../../src/modules/user/dto/update-user.dto";
import { CustomerError } from "../../../../src/commons/Error/customer.error";
import { IUser } from "../../../../src/modules/user/interface/users.interface";
import { Model } from "mongoose";

describe("UserService", () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        userService = new UserService(mockUserRepository);
    });

    const createMockUser = (overrides: Partial<IUser> = {}): IUser => {
        const mockModel = {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndDelete: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            save: jest.fn(),
        } as unknown as Model<IUser>;

        const mockDocument = {
            _id: "1",
            name: "Test User",
            email: "test@example.com",
            password: "hashedPassword",
            vip: false,
            createdAt: new Date(),
            $assertPopulated: jest.fn(),
            $clearModifiedPaths: jest.fn(),
            $clone: jest.fn(),
            $createModifiedPathsSnapshot: jest.fn(),
            $getAllSubdocs: jest.fn(),
            $getPopulatedDocs: jest.fn(),
            $inc: jest.fn(),
            $isDefault: jest.fn(),
            $isDeleted: jest.fn(),
            $isValid: jest.fn(),
            $locals: {},
            $markValid: jest.fn(),
            $model: mockModel,
            $op: null,
            $session: jest.fn(),
            $set: jest.fn(),
            $setters: {},
            $where: {},
            collection: {},
            db: {},
            delete: jest.fn(),
            deleteOne: jest.fn(),
            depopulate: jest.fn(),
            directModifiedPaths: jest.fn(),
            equals: jest.fn(),
            errors: {},
            get: jest.fn(),
            increment: jest.fn(),
            init: jest.fn(),
            invalidate: jest.fn(),
            isDirectModifiedPaths: jest.fn(),
            isDirectSelected: jest.fn(),
            isInit: jest.fn(),
            isModified: jest.fn(),
            isNew: false,
            isSelected: jest.fn(),
            isSubdocument: jest.fn(),
            markModified: jest.fn(),
            modelName: "User",
            overwrite: jest.fn(),
            populate: jest.fn(),
            populated: jest.fn(),
            remove: jest.fn(),
            replaceOne: jest.fn(),
            save: jest.fn(),
            schema: {},
            set: jest.fn(),
            toJSON: jest.fn(),
            toObject: jest.fn(),
            unmarkModified: jest.fn(),
            update: jest.fn(),
            updateOne: jest.fn(),
            ...overrides,
        } as unknown as IUser;

        return mockDocument;
    };

    describe("create", () => {
        it("deve criar um novo usuário com sucesso", async () => {
            const userData: CreateUserDto = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            };

            const mockUser = createMockUser({
                _id: "1",
                name: userData.name,
                email: userData.email,
                password: "hashedPassword",
            });

            mockUserRepository.findByEmail.mockResolvedValue(null);
            mockUserRepository.create.mockResolvedValue(mockUser);

            const result = await userService.create(userData);

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
                userData.email,
            );
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                ...userData,
                password: expect.any(String),
            });
            expect(result).toMatchObject({
                _id: "1",
                name: userData.name,
                email: userData.email,
            });
        });

        it("deve lançar erro quando o usuário já existe", async () => {
            const userData: CreateUserDto = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            };

            const mockExistingUser = createMockUser({
                _id: "1",
                name: "Existing User",
                email: userData.email,
                password: "hashedPassword",
            });

            mockUserRepository.findByEmail.mockResolvedValue(mockExistingUser);

            await expect(userService.create(userData)).rejects.toThrow(
                new CustomerError("Usuário já existe", 400),
            );
        });
    });

    describe("findById", () => {
        it("deve retornar um usuário quando encontrado", async () => {
            const mockUser = createMockUser({
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                password: "hashedPassword",
            });

            jest.spyOn(mockUserRepository, "findById").mockResolvedValueOnce(
                mockUser,
            );

            const result = await userService.findById("1");

            expect(mockUserRepository.findById).toHaveBeenCalledWith("1");
            expect(result).toMatchObject({
                _id: "1",
                name: "Test User",
                email: "test@example.com",
            });
        });

        it("deve lançar erro quando o usuário não for encontrado", async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.findById("1")).rejects.toThrow(
                new CustomerError("Usuário não encontrado", 404),
            );
        });
    });

    describe("findByEmail", () => {
        it("deve retornar um usuário quando encontrado", async () => {
            const mockUser = createMockUser({
                _id: "1",
                name: "Test User",
                email: "test@example.com",
                password: "hashedPassword",
                vip: false,
            });

            mockUserRepository.findByEmail.mockResolvedValue(mockUser);

            const result = await userService.findByEmail("test@example.com");

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
                "test@example.com",
            );
            expect(result).toEqual(mockUser);
        });

        it("deve lançar erro quando o usuário não for encontrado", async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(
                userService.findByEmail("test@example.com"),
            ).rejects.toThrow(new CustomerError("Usuário não encontrado", 404));
        });
    });

    describe("update", () => {
        it("deve atualizar um usuário com sucesso", async () => {
            const userId = "1";
            const updateData: UpdateUserDto = {
                name: "Updated Name",
                password: "newPassword",
            };

            const mockUpdatedUser = createMockUser({
                _id: userId,
                name: updateData.name,
                email: "test@example.com",
                password: "hashedNewPassword",
                vip: false,
            });

            mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

            const result = await userService.update(userId, updateData);

            expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
                ...updateData,
                password: expect.any(String),
            });
            expect(result).toEqual(mockUpdatedUser);
        });

        it("deve lançar erro quando o usuário não for encontrado", async () => {
            const userId = "1";
            const updateData: UpdateUserDto = {
                name: "Updated Name",
                password: "newPassword",
            };

            mockUserRepository.update.mockResolvedValue(null);

            await expect(
                userService.update(userId, updateData),
            ).rejects.toThrow(new CustomerError("Usuário não encontrado", 404));
        });
    });

    describe("updateVip", () => {
        it("deve atualizar o status VIP do usuário", async () => {
            const userId = "1";
            const vipStatus = true;

            const mockUpdatedUser = createMockUser({
                _id: userId,
                name: "Test User",
                email: "test@example.com",
                password: "hashedPassword",
                vip: vipStatus,
            });

            mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

            const result = await userService.updateVip(userId, vipStatus);

            expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
                vip: vipStatus,
            });
            expect(result).toEqual(mockUpdatedUser);
        });
    });

    describe("checkUserVip", () => {
        it("deve retornar o status VIP do usuário", async () => {
            const userId = "1";

            const mockUser = createMockUser({
                _id: userId,
                name: "Test User",
                email: "test@example.com",
                password: "hashedPassword",
                vip: true,
            });

            mockUserRepository.findById.mockResolvedValue(mockUser);

            const result = await userService.checkUserVip(userId);

            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toBe(true);
        });

        it("deve lançar erro quando o usuário não for encontrado", async () => {
            const userId = "1";

            mockUserRepository.findById.mockResolvedValue(null);

            await expect(userService.checkUserVip(userId)).rejects.toThrow(
                new CustomerError("Usuário não encontrado", 404),
            );
        });
    });
});
