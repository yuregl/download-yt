import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { UserRepository } from "../../../../src/modules/user/repository/user.repository";
import { UserModel } from "../../../../src/modules/user/schema/user.schema";
import { IUser } from "../../../../src/modules/user/interface/users.interface";

describe("UserRepository", () => {
    let mongoServer: MongoMemoryServer;
    let userRepository: UserRepository;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        userRepository = new UserRepository(UserModel);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await UserModel.deleteMany({});
    });

    describe("create", () => {
        it("deve criar um novo usuário", async () => {
            const userData: Partial<IUser> = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
                vip: false,
            };

            const user = await userRepository.create(userData);

            expect(user.name).toBe(userData.name);
            expect(user.email).toBe(userData.email);
            expect(user._id).toBeDefined();
        });
    });

    describe("findByEmail", () => {
        it("deve encontrar usuário por email", async () => {
            const userData: Partial<IUser> = {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
                vip: false,
            };

            await userRepository.create(userData);
            const user = await userRepository.findByEmail(userData.email!);

            expect(user).toBeDefined();
            expect(user?.email).toBe(userData.email);
        });

        it("deve retornar null quando usuário não for encontrado", async () => {
            const result = await userRepository.findByEmail(
                "nonexistent@example.com",
            );
            expect(result).toBeNull();
        });
    });
});
