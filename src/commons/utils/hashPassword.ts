import { config } from "../../config/config";
import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    const salt = config.bcrypt.salt;
    return await bcrypt.hash(password, salt);
}

export async function comparePassword(
    password: string,
    hashedPassword: string,
): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}
