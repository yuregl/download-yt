import { comparePassword } from "../../../commons/utils/hashPassword";
import { UserService } from "../../user/service/user.service";
import { TokenDto } from "../dto/token.dto";
import { TokenService } from "./token.service";

export class LoginService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
    ) {}

    async login(email: string, password: string): Promise<TokenDto> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }
        const token = await this.tokenService.generateToken(user.id);
        return { token };
    }
}
