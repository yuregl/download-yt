import { Response } from "express";
import { CustomerError } from "../Error/customer.error";

export function handleError(
    error: Error,
    res: Response,
): Response<Error | CustomerError> {
    if (error instanceof CustomerError) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: (error as Error).message });
}
