import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env.dev")) {
    dotenv.config({path: ".env.dev"});
} else {
    dotenv.config({path: ".env.prod"});
}

export const ENVIRONMENT = process.env.NODE_ENV;
const isProduction = ENVIRONMENT === "production";

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = process.env["MONGODB_URI"];

if (!SESSION_SECRET) {
    console.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    console.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}