import path from 'path';

import dotenv from 'dotenv-safe';

dotenv.config({
  allowEmptyValues: true,
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

export const appName = process.env.APP_NAME as string;
export const environment = process.env.NODE_ENV as string;
export const saltRounds = Number(process.env.SALT_ROUNDS);
export const logs = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
export const useHttps = process.env.USE_HTTPS === 'true' ? true : false;
export const port = Number(process.env.PORT);

// Database
export const db = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  schema: process.env.DB_SCHEMA,
};

// JWT
export const jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES as string;
export const jwtSecret = process.env.JWT_SECRET as string;
