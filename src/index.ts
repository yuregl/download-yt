import { config } from "./config/config";
import { connectToDatabase } from "./config/database";
import expressApp from "./routes";

async function main(): Promise<void> {
    await connectToDatabase();
    const app = await expressApp();

    app.listen(config.server.port, () => {
        console.log(
            `Server is running on port http://localhost:${config.server.port}`,
        );
    });
}

main();
