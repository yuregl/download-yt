import { Document } from "mongoose";

export interface IDownloadVideo extends Document {
    url: string;
    createdAt: Date;
    userId: string;
}
