import jwt from "jsonwebtoken";
import { config } from "../../../config/config";
import { TokenPayload } from "../interface/token-payload.interface";

export class TokenService {
    generateToken(userId: string): string {
        const token = jwt.sign({ userId }, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
        });
        return token;
    }

    verifyToken(token: string): string | null {
        try {
            const decoded = jwt.verify(
                token,
                config.jwt.secret,
            ) as TokenPayload;
            return decoded.userId;
        } catch (error) {
            return null;
        }
    }

    extractTokenFromHeader(header: string): string | null {
        const [type, token] = header.split(" ");
        if (type !== "Bearer") {
            return null;
        }
        return token;
    }
}
