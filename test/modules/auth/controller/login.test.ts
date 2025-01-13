import { Request, Response } from "express";
import { LoginController } from "../../../../src/modules/auth/controller/login";
import { LoginService } from "../../../../src/modules/auth/service/login.service";
import { TokenDto } from "../../../../src/modules/auth/dto/token.dto";

describe("LoginController", () => {
    let loginController: LoginController;
    let loginService: jest.Mocked<LoginService>;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        status = jest.fn().mockReturnValue({ json });
        req = {
            body: {
                username: "",
                password: "",
            },
        };
        res = {
            status,
        };

        loginService = {
            login: jest.fn(),
        } as unknown as jest.Mocked<LoginService>;

        loginController = new LoginController(loginService);
    });

    it("should return 200 for valid credentials", async () => {
        const tokenResponse: TokenDto = {
            token: "valid-token",
        };

        req.body.username = "user";
        req.body.password = "pass";
        loginService.login.mockResolvedValueOnce(tokenResponse);

        await loginController.login(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({ token: "valid-token" });
    });

    it("should return 401 for invalid credentials", async () => {
        req.body.username = "user";
        req.body.password = "wrongpass";

        loginService.login.mockRejectedValue(new Error("Invalid credentials"));

        await loginController.login(req as Request, res as Response);

        expect(status).toHaveBeenCalledWith(401);
        expect(json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });
});
