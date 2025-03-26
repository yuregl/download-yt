import { Request, Response } from "express";
import { DownloadController } from "../../../../src/modules/download-video/controller/download.controller";
import { DownloadService } from "../../../../src/modules/download-video/service/download.service";
import { CustomerError } from "../../../../src/commons/Error/customer.error";

interface MockDownloadService extends Partial<DownloadService> {
    createDownload: jest.Mock;
    getValidFormats: jest.Mock;
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

describe("DownloadController", () => {
    let downloadController: DownloadController;
    let mockDownloadService: MockDownloadService;
    let mockRequest: Partial<RequestWithError>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockDownloadService = {
            createDownload: jest.fn(),
            getValidFormats: jest.fn(),
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        downloadController = new DownloadController(
            mockDownloadService as unknown as DownloadService,
        );
    });

    describe("createDownload", () => {
        const mockDownloadData = {
            url: "https://www.youtube.com/watch?v=123",
            format: "mp4",
            quality: "720p",
        };

        const mockUserId = "123";

        beforeEach(() => {
            mockRequest = {
                body: mockDownloadData,
                headers: { userId: mockUserId },
                erro: undefined,
            };
        });

        it("deve criar download com sucesso", async () => {
            const createdDownload = {
                id: "456",
                ...mockDownloadData,
                status: "pending",
            };

            mockDownloadService.createDownload.mockResolvedValue(
                createdDownload,
            );

            await downloadController.createDownload(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockDownloadService.createDownload).toHaveBeenCalledWith(
                mockDownloadData,
                mockUserId,
            );
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(createdDownload);
        });

        it("deve retornar erro quando houver erro de validação", async () => {
            mockRequest.erro = {
                status: 400,
                message: "Validation error",
                name: "ValidationError",
                errors: [
                    {
                        field: "url",
                        message: "URL inválida",
                    },
                ],
            };

            await downloadController.createDownload(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: [
                    {
                        field: "url",
                        message: "URL inválida",
                    },
                ],
            });
        });

        it("deve retornar erro quando houver erro de validação sem errors array", async () => {
            const erro = {
                status: 400,
                message: "Erro de validação genérico",
                name: "ValidationError",
            };
            mockRequest.erro = erro;

            await downloadController.createDownload(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Erro de validação genérico",
            });
        });

        it("deve retornar erro quando o serviço falhar", async () => {
            const error = new CustomerError("Erro ao criar download", 500);
            mockDownloadService.createDownload.mockRejectedValue(error);

            await downloadController.createDownload(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Erro ao criar download",
            });
        });
    });

    describe("getValidFormats", () => {
        const mockFormatsData = {
            url: "https://www.youtube.com/watch?v=123",
        };

        beforeEach(() => {
            mockRequest = {
                body: mockFormatsData,
                erro: undefined,
            };
        });

        it("deve retornar formatos válidos com sucesso", async () => {
            const mockFormats = ["mp4", "webm", "mkv"];
            mockDownloadService.getValidFormats.mockResolvedValue(mockFormats);

            await downloadController.getValidFormats(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockDownloadService.getValidFormats).toHaveBeenCalledWith(
                mockFormatsData.url,
            );
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockFormats);
        });

        it("deve retornar erro quando houver erro de validação", async () => {
            mockRequest.erro = {
                status: 400,
                message: "Validation error",
                name: "ValidationError",
                errors: [
                    {
                        field: "url",
                        message: "URL inválida",
                    },
                ],
            };

            await downloadController.getValidFormats(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: [
                    {
                        field: "url",
                        message: "URL inválida",
                    },
                ],
            });
        });

        it("deve retornar erro quando houver erro de validação sem errors array", async () => {
            const erro = {
                status: 400,
                message: "Erro de validação genérico",
                name: "ValidationError",
            };
            mockRequest.erro = erro;

            await downloadController.getValidFormats(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Erro de validação genérico",
            });
        });

        it("deve retornar erro quando o serviço falhar", async () => {
            const error = new CustomerError("Erro ao buscar formatos", 500);
            mockDownloadService.getValidFormats.mockRejectedValue(error);

            await downloadController.getValidFormats(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: "Erro ao buscar formatos",
            });
        });
    });
});
