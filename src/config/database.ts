import mongoose from "mongoose";
import { config } from "./config";

export async function connectToDatabase() {
    try {
        await mongoose.connect(config.database.uri);
        console.info("Conectado ao MongoDB");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
}
