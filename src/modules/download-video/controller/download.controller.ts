import { NextFunction, Request, Response } from "express";
import { DownloadService } from "../service/download.service";
import { CreateDownloadDto } from "../dto/download.dto";
import { handleError } from "../../../commons/utils/type-error.utils";
import { GetFormatsDto } from "../dto/get-formats.dto";

export class DownloadController {
    constructor(private readonly downloadService: DownloadService) {}

    async createDownload(req: Request, res: Response, next: NextFunction) {
        if (req.erro) {
            return res.status(req.erro.status).json({
                message:
                    req.erro.errors === undefined
                        ? req.erro.message
                        : req.erro.errors,
            });
        }

        try {
            const downloadDto = req.body as CreateDownloadDto;

            const userId = req.headers.userId as string;
            const download = await this.downloadService.createDownload(
                downloadDto,
                userId,
            );
            return res.status(200).json(download);
        } catch (error) {
            handleError(error as Error, res);
        }
    }

    async getValidFormats(req: Request, res: Response, next: NextFunction) {
        if (req.erro) {
            return res.status(req.erro.status).json({
                message:
                    req.erro.errors === undefined
                        ? req.erro.message
                        : req.erro.errors,
            });
        }
        const { url } = req.body as GetFormatsDto;
        try {
            const formats = await this.downloadService.getValidFormats(url);
            return res.status(200).json(formats);
        } catch (error) {
            handleError(error as Error, res);
        }
    }
}
