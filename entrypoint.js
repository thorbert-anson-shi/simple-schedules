import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

async function run() {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: './drizzle' });
    await pool.end();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }

  require('./dist/src/main.js');
}

run();
