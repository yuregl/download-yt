/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export function validationInputMiddleware(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObject = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoObject);

        if (errors.length > 0) {
            req.erro = {
                status: 400,
                message: "Validation errors",
                name: "Validation error",
                errors: errors.map((err) => ({
                    field: err.property,
                    message: Object.values(err.constraints || {}).join(", "),
                })),
            };
        }

        req.body = dtoObject;
        next();
    };
}
