import { Request, Response } from "express";
import { LoginDto } from "../dto/login.dto";
import { LoginService } from "../service/login.service";
import { TokenDto } from "../dto/token.dto";

export class LoginController {
    constructor(private readonly loginService: LoginService) {}

    async login(req: Request, res: Response): Promise<Response<TokenDto>> {
        const { email, password } = req.body as LoginDto;
        try {
            const token = await this.loginService.login(email, password);
            return res.status(200).json(token);
        } catch (error) {
            return res.status(401).json({ message: (error as Error).message });
        }
    }
}
