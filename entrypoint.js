const { migrate } = require('drizzle-orm/node-postgres/migrator');
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');

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
