import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectToDatabase } from "../config/database";
import { userRoutes } from "./user.route";
import { authRoutes } from "./auth.route";
import { downloadRoutes } from "./download.route";

async function expressApp() {
    await connectToDatabase();
    const app = express();

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Muitas requisições, tente novamente mais tarde.",
    });

    app.use(limiter);

    app.use(cors());
    app.use(express.json());

    app.use(userRoutes());
    app.use(authRoutes());
    app.use(downloadRoutes());

    return app;
}

export default expressApp;
