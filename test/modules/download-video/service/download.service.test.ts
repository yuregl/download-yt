/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownloadService } from "../../../../src/modules/download-video/service/download.service";
import { UserService } from "../../../../src/modules/user/service/user.service";
import { DownloadRepository } from "../../../../src/modules/download-video/repository/download.repository";
import ytdl, { Payload } from "youtube-dl-exec";
import { CustomerError } from "../../../../src/commons/Error/customer.error";

jest.mock("youtube-dl-exec");

describe("DownloadService", () => {
    let downloadService: DownloadService;
    let mockDownloadRepository: jest.Mocked<DownloadRepository>;
    let mockUserService: jest.Mocked<UserService>;

    beforeEach(() => {
        mockDownloadRepository = {
            create: jest.fn(),
            getAlldownloadsByUserIdByDay: jest.fn(),
        } as unknown as jest.Mocked<DownloadRepository>;

        mockUserService = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<UserService>;

        downloadService = new DownloadService(
            mockDownloadRepository,
            mockUserService,
        );
    });

    describe("createDownload", () => {
        const mockUserId = "user123";
        const mockUrl = "https://youtube.com/video";
        const mockCreateDownloadDto = { url: mockUrl, resolution: "22" };

        const mockMetadataVideo = {
            formats: [
                {
                    format_id: "22",
                    url: "https://example.com/video-url",
                },
            ],
        };

        it("should throw error when user is not found", async () => {
            // Prepare
            mockUserService.findById.mockResolvedValue(null);
            (ytdl as jest.MockedFunction<typeof ytdl>).mockResolvedValue(
                mockMetadataVideo as Payload,
            );

            // Act & Assert
            await expect(
                downloadService.createDownload(
                    mockCreateDownloadDto,
                    mockUserId,
                ),
            ).rejects.toThrow(new CustomerError("Usuário não encontrado", 404));
        });

        it("should limit downloads for non-VIP users", async () => {
            // Prepare
            mockUserService.findById.mockResolvedValue({
                id: mockUserId,
                vip: false,
            });
            mockDownloadRepository.getAlldownloadsByUserIdByDay.mockResolvedValue(
                Array(10).fill({
                    url: "test",
                    createdAt: new Date(),
                    userId: mockUserId,
                    _id: "test-id",
                }) as any,
            );
            (ytdl as jest.MockedFunction<typeof ytdl>).mockResolvedValue(
                mockMetadataVideo as Payload,
            );

            // Act & Assert
            await expect(
                downloadService.createDownload(
                    mockCreateDownloadDto,
                    mockUserId,
                ),
            ).rejects.toThrow("Limite de downloads diários atingido");
        });

        it("should allow VIP users to download without limit", async () => {
            // Prepare
            mockUserService.findById.mockResolvedValue({
                id: mockUserId,
                vip: true,
            });
            mockDownloadRepository.getAlldownloadsByUserIdByDay.mockResolvedValue(
                Array(20).fill({
                    url: "test",
                    createdAt: new Date(),
                    userId: mockUserId,
                    _id: "test-id",
                }) as any,
            );
            (ytdl as jest.MockedFunction<typeof ytdl>).mockResolvedValue(
                mockMetadataVideo as Payload,
            );

            // Act
            const result = await downloadService.createDownload(
                mockCreateDownloadDto,
                mockUserId,
            );

            // Assert
            expect(result.url).toBe("https://example.com/video-url");
        });
    });

    describe("getAlldownloadsByUserIdByDay", () => {
        it("should return downloads from the same day", async () => {
            const userId = "user123";
            const mockDownloads = [
                {
                    url: "https://example1.com/video",
                    createdAt: new Date(),
                    userId,
                    _id: "test-id",
                },
            ] as any;

            mockDownloadRepository.getAlldownloadsByUserIdByDay.mockResolvedValue(
                mockDownloads,
            );

            const result =
                await downloadService.getAlldownloadsByUserIdByDay(userId);

            expect(result).toEqual(mockDownloads);
        });
    });

    describe("getValidFormats", () => {
        const mockUrl = "https://youtube.com/video";
        const mockMetadataVideo = {
            title: "Test Video",
            thumbnail: "https://example.com/thumbnail.jpg",
            formats: [
                {
                    format_id: "22",
                    filesize: 1000000,
                    filesize_approx: 900000,
                    ext: "mp4",
                    audio_channels: 2,
                },
                {
                    format_id: "18",
                    filesize: 500000,
                    ext: "mp4",
                    audio_channels: 1,
                },
            ],
        };

        it("should return valid formats with filesize", async () => {
            // Prepare
            (ytdl as jest.MockedFunction<typeof ytdl>).mockResolvedValue(
                mockMetadataVideo as Payload,
            );

            // Act
            const result = await downloadService.getValidFormats(mockUrl);

            // Assert
            expect(result).toEqual({
                url: mockUrl,
                name: mockMetadataVideo.title,
                thumbnail: mockMetadataVideo.thumbnail,
                formats: [
                    {
                        fileSize: 1000000,
                        extension: "mp4",
                        audioChannels: 2,
                        formatId: "22",
                        resolution: "720",
                    },
                    {
                        fileSize: 500000,
                        extension: "mp4",
                        audioChannels: 1,
                        formatId: "18",
                        resolution: "360",
                    },
                ],
            });
        });

        it("should use filesize_approx when filesize is not available", async () => {
            // Prepare
            const mockMetadataVideoWithoutFilesize = {
                ...mockMetadataVideo,
                formats: [
                    {
                        format_id: "22",
                        filesize_approx: 900000,
                        ext: "mp4",
                        audio_channels: 2,
                    },
                ],
            };
            (ytdl as jest.MockedFunction<typeof ytdl>).mockResolvedValue(
                mockMetadataVideoWithoutFilesize as Payload,
            );

            // Act
            const result = await downloadService.getValidFormats(mockUrl);

            // Assert
            expect(result.formats[0].fileSize).toBe(900000);
        });
    });
});
