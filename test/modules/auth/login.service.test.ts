import { LoginService } from "../../../src/modules/auth/service/login.service";
import { UserService } from "../../../src/modules/user/service/user.service";
import { TokenService } from "../../../src/modules/auth/service/token.service";
import { comparePassword } from "../../../src/commons/utils/hashPassword";

jest.mock("../../../src/commons/utils/hashPassword");

describe("LoginService", () => {
    let loginService: LoginService;
    let userService: jest.Mocked<UserService>;
    let tokenService: jest.Mocked<TokenService>;

    beforeEach(() => {
        userService = {
            findByEmail: jest.fn(),
        } as unknown as jest.Mocked<UserService>;

        tokenService = {
            generateToken: jest.fn(),
        } as unknown as jest.Mocked<TokenService>;

        loginService = new LoginService(userService, tokenService);
    });

    it("should return a token when credentials are valid", async () => {
        const email = "test@example.com";
        const password = "password";
        const user = { id: "1", email, password: "hashedPassword" };

        userService.findByEmail = jest.fn().mockResolvedValue(user);
        (comparePassword as jest.Mock).mockResolvedValue(true);
        tokenService.generateToken = jest.fn().mockResolvedValue("token");

        const result = await loginService.login(email, password);

        console.log({ result });

        expect(result).toEqual({ token: "token" });
        expect(userService.findByEmail).toHaveBeenCalledWith(email);
        expect(tokenService.generateToken).toHaveBeenCalledWith(user.id);
    });

    it("should throw an error if user does not exist", async () => {
        const email = "test@example.com";
        const password = "password";

        userService.findByEmail = jest.fn().mockResolvedValue(null);

        await expect(loginService.login(email, password)).rejects.toThrow(
            Error,
        );
    });

    it("should throw an error if password is invalid", async () => {
        const email = "test@example.com";
        const password = "wrongPassword";
        const user = { id: "1", email, password: "hashedPassword" };

        userService.findByEmail = jest.fn().mockResolvedValue(user);
        (comparePassword as jest.Mock).mockResolvedValue(false);

        await expect(loginService.login(email, password)).rejects.toThrow(
            Error,
        );
    });
});
