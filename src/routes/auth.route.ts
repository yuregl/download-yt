import { Router, Request, Response } from "express";
import { LoginController } from "../modules/auth/controller/login";
import { LoginService } from "../modules/auth/service/login.service";
import { UserService } from "../modules/user/service/user.service";
import { UserModel } from "../modules/user/schema/user.schema";
import { TokenService } from "../modules/auth/service/token.service";
import { UserRepository } from "../modules/user/repository/user.repository";

function authRoutes(): Router {
    const router = Router();

    const userRepository = new UserRepository(UserModel);
    const tokenService = new TokenService();
    const userService = new UserService(userRepository);

    const loginService = new LoginService(userService, tokenService);
    const loginController = new LoginController(loginService);

    router.post("/auth/login", (req: Request, res: Response) => {
        loginController.login(req, res);
    });

    return router;
}

export { authRoutes };
