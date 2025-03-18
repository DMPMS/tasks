import app from "./src/app";
import dotenv from "dotenv";
import { AppDataSource } from "./src/config/orm";
import { SERVER } from "./src/config/constants";
import { LOG_MESSAGES } from "./src/utils/messages";

dotenv.config();

const PORT = Number(process.env.API_PORT) || SERVER.DEFAULT_PORT;

AppDataSource.initialize()
  .then(async () => {
    console.log(LOG_MESSAGES.DATABASE_CONNECTED);

    await AppDataSource.runMigrations();
    console.log(LOG_MESSAGES.MIGRATIONS_EXECUTED);

    app.listen(PORT, () => {
      console.log(LOG_MESSAGES.SERVER_RUNNING(PORT));
    });
  })
  .catch((error) => {
    console.error(LOG_MESSAGES.DATABASE_INITIALIZATION_ERROR, error);
  });
