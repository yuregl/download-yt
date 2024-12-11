import { Request, Response } from "express";
import { LoginDto } from "../dto/login.dto";
import { LoginService } from "../service/login.service";
import { TokenService } from "../service/token.service";

export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    async login(req: Request, res: Response) {
        const { email, password } = req.body as LoginDto;
        try {
            const token = await this.loginService.login(email, password);
            res.status(200).json(token);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}
