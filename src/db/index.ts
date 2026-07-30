import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const databasePort = Number(process.env.DATABASE_PORT) || 3306;
const databaseSslEnabled =
  process.env.DATABASE_SSL === 'true' ||
  process.env.NODE_ENV === 'production' ||
  databasePort === 4000;

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: databasePort,
  user: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'n_admin',
  ssl: databaseSslEnabled
    ? {
        rejectUnauthorized:
          process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false'
      }
    : undefined,
  waitForConnections: true,
  connectionLimit: 3,
  queueLimit: 0,
  connectTimeout: 10_000
});

export const db = drizzle(pool);
