import { Router, Request, Response } from "express";
import { DownloadController } from "../modules/download-video/controller/download.controller";
import { DownloadService } from "../modules/download-video/service/download.service";
import { DownloadRepository } from "../modules/download-video/repository/download.repository";
import { DownloadVideoModel } from "../modules/download-video/schema/download.schema";
import { validationInputMiddleware } from "../modules/user/middleware/validate-input.middleware";
import { validateAutentication } from "../modules/user/middleware/validate-autentication";
import { CreateDownloadDto } from "../modules/download-video/dto/download.dto";
import { UserRepository } from "../modules/user/repository/user.repository";
import { UserModel } from "../modules/user/schema/user.schema";
import { UserService } from "../modules/user/service/user.service";
import { GetFormatsDto } from "../modules/download-video/dto/get-formats.dto";

function downloadRoutes(): Router {
    const router = Router();

    const userRepository = new UserRepository(UserModel);
    const userService = new UserService(userRepository);

    const downloadRepository = new DownloadRepository(DownloadVideoModel);

    const downloadService = new DownloadService(
        downloadRepository,
        userService,
    );
    const downloadController = new DownloadController(downloadService);

    router.post(
        "/download/create",
        validateAutentication(),
        validationInputMiddleware(CreateDownloadDto),
        (req: Request, res: Response) => {
            downloadController.createDownload(req, res);
        },
    );

    router.get(
        "/download/get-formats",
        validateAutentication(),
        validationInputMiddleware(GetFormatsDto),
        (req: Request, res: Response) => {
            downloadController.getValidFormats(req, res);
        },
    );

    return router;
}

export { downloadRoutes };
