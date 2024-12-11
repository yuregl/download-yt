interface ValidationError {
    field: string;
    message: string;
}

interface CustomError {
    status: number;
    message: string;
    errors?: ValidationError[];
    name: string;
}

declare namespace Express {
    interface Request {
        erro: CustomError;
        headers: {
            userId: string;
        };
    }
}
