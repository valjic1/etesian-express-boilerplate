import { ConnectionOptions, createConnection } from "typeorm";

import { RefreshToken } from "@models/refresh-token";
import { User } from "@models/user";

import { logger } from "./logger";
import { db } from "./vars";

const options: ConnectionOptions = {
  type: "postgres",
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.schema,
  synchronize: true,
  logging: false,
  entities: [RefreshToken, User],
};

export const connect = async () => {
  try {
    const connection = await createConnection(options);
    logger.info(`Postgres running on port ${db.port}`);
    return connection;
  } catch (error) {
    logger.error(`Postgres failed with error: [${error}]`);
    throw error;
  }
};
