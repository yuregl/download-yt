import { model, Schema } from "mongoose";
import { IDownloadVideo } from "../interface/donwload.interface";

const DownloadVideoSchema = new Schema({
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: String, required: true },
});

export const DownloadVideoModel = model<IDownloadVideo>(
    "DownloadVideo",
    DownloadVideoSchema,
);
