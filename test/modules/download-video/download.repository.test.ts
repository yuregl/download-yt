import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { DownloadRepository } from "../../../src/modules/download-video/repository/download.repository";
import { DownloadVideoModel } from "../../../src/modules/download-video/schema/download.schema";

describe("DownloadRepository", () => {
    let mongoServer: MongoMemoryServer;
    let downloadRepository: DownloadRepository;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        downloadRepository = new DownloadRepository(DownloadVideoModel);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await DownloadVideoModel.deleteMany({});
    });

    describe("getAlldownloadsByUserIdByDay", () => {
        it("deve retornar downloads do usuário no dia atual", async () => {
            const userId = "user123";

            // Criar downloads de hoje
            await DownloadVideoModel.create([
                { url: "url1", userId, createdAt: new Date() },
                { url: "url2", userId, createdAt: new Date() },
            ]);

            // Criar download de ontem
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            await DownloadVideoModel.create({
                url: "url3",
                userId,
                createdAt: yesterday,
            });

            // Criar download de outro usuário
            await DownloadVideoModel.create({
                url: "url4",
                userId: "other-user",
                createdAt: new Date(),
            });

            const result =
                await downloadRepository.getAlldownloadsByUserIdByDay(userId);

            expect(result).toHaveLength(2);
            expect(result.every((download) => download.userId === userId)).toBe(
                true,
            );
            expect(
                result.every((download) => {
                    const downloadDate = new Date(download.createdAt);
                    const today = new Date();
                    return downloadDate.getDate() === today.getDate();
                }),
            ).toBe(true);
        });

        it("deve retornar array vazio quando não houver downloads no dia", async () => {
            const userId = "user123";

            // Criar apenas downloads de ontem
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            await DownloadVideoModel.create({
                url: "url1",
                userId,
                createdAt: yesterday,
            });

            const result =
                await downloadRepository.getAlldownloadsByUserIdByDay(userId);

            expect(result).toHaveLength(0);
        });

        it("deve retornar array vazio para usuário sem downloads", async () => {
            const result =
                await downloadRepository.getAlldownloadsByUserIdByDay(
                    "nonexistent-user",
                );
            expect(result).toHaveLength(0);
        });
    });

    describe("create", () => {
        it("deve criar um novo download", async () => {
            const downloadData = {
                url: "https://example.com/video",
                userId: "user123",
            };

            const result = await downloadRepository.create(downloadData);

            expect(result.url).toBe(downloadData.url);
            expect(result.userId).toBe(downloadData.userId);
            expect(result.createdAt).toBeDefined();
        });
    });
});
