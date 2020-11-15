import Bluebird from 'bluebird';
import 'reflect-metadata';
Promise = Bluebird as any;

import { connect as connectToDatabase } from '@config/database';
import { logger } from '@config/logger';
import { appName, environment } from '@config/vars';

(async () => {
  logger.info(`Starting ${appName} (${environment})`);
  await connectToDatabase();
  (await import('@config/server')).startServer();
})().catch((error) => {
  logger.error(`Failed to start ${appName} (${environment})`);
  logger.error(error);
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info(`Shutting down ${appName} (${environment})`);
  process.exit(0);
});
