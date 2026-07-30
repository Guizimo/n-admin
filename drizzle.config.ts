import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const databasePort = Number(process.env.DATABASE_PORT) || 3306;
const databaseSslEnabled =
  process.env.DATABASE_SSL === 'true' || databasePort === 4000;

export default defineConfig({
  dialect: 'mysql', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/db/schema.ts',
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    port: databasePort,
    user: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    ssl: databaseSslEnabled
      ? {
          rejectUnauthorized:
            process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false'
        }
      : undefined
  },
  tablesFilter: ['!_*'],
  verbose: true,
  strict: false
});
