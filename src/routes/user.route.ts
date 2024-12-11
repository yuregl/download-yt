import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../modules/user/controller/user.controller";
import { UserService } from "../modules/user/service/user.service";
import { UserRepository } from "../modules/user/repository/user.repository";
import { UserModel } from "../modules/user/schema/user.schema";
import { validationInputMiddleware } from "../modules/user/middleware/validate-input.middleware";
import { CreateUserDto } from "../modules/user/dto/create-user.dto";
import { validateAutentication } from "../modules/user/middleware/validate-autentication";
import {
    UpdateUserDto,
    UpdateVipDto,
} from "../modules/user/dto/update-user.dto";

function userRoutes(): Router {
    const router = Router();
    const userRepository = new UserRepository(UserModel);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    router.post(
        "/user/create",
        validationInputMiddleware(CreateUserDto),
        (req: Request, res: Response, next: NextFunction) => {
            userController.create(req, res, next);
        },
    );

    router.get(
        "/user",
        validateAutentication(),
        (req: Request, res: Response, next: NextFunction) => {
            userController.findById(req, res, next);
        },
    );

    router.put(
        "/user/update",
        validateAutentication(),
        validationInputMiddleware(UpdateUserDto),
        (req: Request, res: Response, next: NextFunction) => {
            userController.update(req, res, next);
        },
    );

    router.put(
        "/user/update-vip",
        validateAutentication(),
        validationInputMiddleware(UpdateVipDto),
        (req: Request, res: Response, next: NextFunction) => {
            userController.updateVip(req, res, next);
        },
    );

    return router;
}

export { userRoutes };
