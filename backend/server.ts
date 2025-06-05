import app from "./src/app";
import dotenv from "dotenv";
import { AppDataSource } from "./src/config/orm";
import { ERROR_MESSAGES, LOG_MESSAGES } from "./src/utils/messages";

dotenv.config();

const apiPort = Number(process.env.API_PORT);

if (!apiPort) {
  console.log(ERROR_MESSAGES.ENV.MISSING_API_PORT);
  process.exit(1);
}

AppDataSource.initialize()
  .then(async () => {
    console.log(LOG_MESSAGES.DATABASE_CONNECTED);

    await AppDataSource.runMigrations();
    console.log(LOG_MESSAGES.MIGRATIONS_EXECUTED);

    app.listen(apiPort, () => {
      console.log(LOG_MESSAGES.SERVER_RUNNING(apiPort));
    });
  })
  .catch((error) => {
    console.error(LOG_MESSAGES.DATABASE_INITIALIZATION_ERROR, error);
  });
