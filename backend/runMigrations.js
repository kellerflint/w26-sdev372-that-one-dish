import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Read migration file
    const migrationPath = path.join(process.cwd(), 'migrations', '001_add_origin_column.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Execute migration
    await connection.query(sql);
    console.log('✓ Migration applied successfully: Added origin column to dishes table');
  } catch (err) {
    console.error('Migration error:', err.message);
    if (err.message.includes('Duplicate column')) {
      console.log('✓ Column already exists, skipping migration');
    } else {
      throw err;
    }
  } finally {
    await connection.end();
  }
}

runMigrations();
