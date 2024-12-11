import { Schema, model } from "mongoose";
import { IUser } from "../interface/users.interface";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    password: { type: String, required: true },
    vip: { type: Boolean, default: false },
});

export const UserModel = model<IUser>("User", UserSchema);
