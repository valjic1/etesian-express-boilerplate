import fs from "fs";
import http from "http";
import https from "https";
import path from "path";

import { app } from "@api/config/express";

import { logger } from "./logger";
import { port, useHttps } from "./vars";

const cert = fs.readFileSync(path.join(__dirname, "../../ssl/etesian.cert"));
const key = fs.readFileSync(path.join(__dirname, "../../ssl/etesian.key"));

const server = useHttps
  ? https.createServer({ key, cert }, app)
  : http.createServer(app);

export const startServer = () =>
  server
    .listen(port, () => logger.info(`Express running on port ${port}`))
    .on("error", (error) => {
      logger.error(`Express failed with error: [${error}]`);
    });
