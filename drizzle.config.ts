import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { ConfigProvider } from '@src/config';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: new ConfigProvider().env.DATABASE_URL,
  },
});
