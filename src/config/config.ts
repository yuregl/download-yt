import dotenv from "dotenv";
dotenv.config();

export const config = {
    server: {
        port: process.env.PORT || 3333,
        nodeEnv: process.env.NODE_ENV || "development",
    },
    database: {
        uri: process.env.MONGODB_URI || constructMongoUri(),
    },
    bcrypt: {
        salt: parseInt(process.env.SALT as string) || 10,
    },
    jwt: {
        secret: process.env.JWT_SECRET as string,
        expiresIn: process.env.JWT_EXPIRES_IN as string,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    },
};

function constructMongoUri(): string {
    const {
        MONGODB_USER,
        MONGODB_PASSWORD,
        MONGODB_HOST,
        MONGODB_PORT,
        MONGODB_DATABASE,
        MONGODB_AUTH_SOURCE,
    } = process.env;

    if (!MONGODB_HOST) {
        return "mongodb://localhost:27017/seu_banco";
    }

    const credentials =
        MONGODB_USER && MONGODB_PASSWORD
            ? `${MONGODB_USER}:${MONGODB_PASSWORD}@`
            : "";

    const auth = MONGODB_AUTH_SOURCE
        ? `?authSource=${MONGODB_AUTH_SOURCE}`
        : "";

    return `mongodb://${credentials}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}${auth}`;
}
