import { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    createdAt: Date;
    password: string;
    vip: boolean;
}
