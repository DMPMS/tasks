import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { ERROR_MESSAGES } from "../utils/messages";

dotenv.config();

if (!process.env.DB_HOST) {
  console.error(ERROR_MESSAGES.ENV.MISSING_DB_HOST);
  process.exit(1);
}

if (!process.env.DB_USER) {
  console.error(ERROR_MESSAGES.ENV.MISSING_DB_USER);
  process.exit(1);
}

if (!process.env.DB_PORT) {
  console.error(ERROR_MESSAGES.ENV.MISSING_DB_PORT);
  process.exit(1);
}

if (!process.env.DB_PASSWORD) {
  console.error(ERROR_MESSAGES.ENV.MISSING_DB_PASSWORD);
  process.exit(1);
}

if (!process.env.DB_DATABASE) {
  console.error(ERROR_MESSAGES.ENV.MISSING_DB_DATABASE);
  process.exit(1);
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: ["src/entities/*.ts"],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
