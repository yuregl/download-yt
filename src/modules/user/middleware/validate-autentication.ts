import { NextFunction, Request, Response } from "express";
import { TokenService } from "../../auth/service/token.service";

export function validateAutentication() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const tokenService = new TokenService();

        const token = req.headers["authorization"];

        if (!token) {
            req.erro = {
                status: 401,
                message: "Token is required",
                name: "Token is required",
            };
            return next();
        }

        const tokenWithoutBearer = tokenService.extractTokenFromHeader(token);

        if (!tokenWithoutBearer) {
            req.erro = {
                status: 401,
                message: "Invalid token",
                name: "Invalid token",
            };
            return next();
        }

        const validToken = tokenService.verifyToken(tokenWithoutBearer);

        if (!validToken) {
            req.erro = {
                status: 401,
                message: "Invalid token",
                name: "Invalid token",
            };
            return next();
        }

        req.headers.userId = validToken;
        next();
    };
}
