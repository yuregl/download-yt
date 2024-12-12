import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto, UpdateVipDto } from "../dto/update-user.dto";

import { handleError } from "../../../commons/utils/type-error.utils";
import { CustomerError } from "../../../commons/Error/customer.error";
import { IUser } from "../interface/users.interface";

export class UserController {
    constructor(private readonly userService: UserService) {}

    async create(
        req: Request,
        res: Response,
    ): Promise<Response<CreateUserDto> | Response<CustomerError | Error>> {
        if (req.erro) {
            return res
                .status(req.erro.status)
                .json({ message: req.erro.errors });
        }

        const userData = req.body as CreateUserDto;

        try {
            const createdUser = await this.userService.create(userData);
            return res.status(201).json(createdUser);
        } catch (error) {
            return handleError(error as Error, res);
        }
    }

    async findById(
        req: Request,
        res: Response,
    ): Promise<Response<Partial<IUser>> | Response<CustomerError | Error>> {
        if (req.erro) {
            return res.status(req.erro.status).json({
                message:
                    req.erro.errors === undefined
                        ? req.erro.message
                        : req.erro.errors,
            });
        }

        const userId = req.headers.userId as string;
        try {
            const user = await this.userService.findById(userId);
            return res.status(200).json(user);
        } catch (error) {
            return handleError(error as Error, res);
        }
    }

    async update(
        req: Request,
        res: Response,
    ): Promise<Response<IUser> | Response<CustomerError | Error>> {
        if (req.erro) {
            return res
                .status(req.erro.status)
                .json({ message: req.erro.errors });
        }

        const userId = req.headers.userId as string;
        const userData = req.body as UpdateUserDto;

        try {
            const updatedUser = await this.userService.update(userId, userData);
            return res.status(200).json(updatedUser);
        } catch (error) {
            return handleError(error as Error, res);
        }
    }

    async updateVip(
        req: Request,
        res: Response,
    ): Promise<Response<IUser> | Response<CustomerError | Error>> {
        if (req.erro) {
            return res
                .status(req.erro.status)
                .json({ message: req.erro.errors });
        }

        const userId = req.headers.userId as string;
        const body = req.body as UpdateVipDto;

        try {
            const updatedUser = await this.userService.updateVip(
                userId,
                body.status,
            );
            return res.status(200).json(updatedUser);
        } catch (error) {
            return handleError(error as Error, res);
        }
    }
}
