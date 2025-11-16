import fs from 'fs';
import path from 'path';
import pool from '../config/database';
import logger from '../utils/logger';

// Migration files in order
const migrationFiles = [
  'schema.sql',
  'schema_extension.sql',
  'reviews.sql',
  'user_orders.sql',
  'create_reference_brands_table.sql',
];

const executeSQLFile = async (filePath: string) => {
  try {
    logger.info(`Reading migration file: ${path.basename(filePath)}`);
    const schema = fs.readFileSync(filePath, 'utf8');

    // Split by semicolons and filter out empty statements
    const statements = schema
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.execute(statement);
          logger.info(`✅ Executed: ${statement.substring(0, 80)}...`);
        } catch (error: any) {
          // Ignore "table already exists" errors
          if (error.message && error.message.includes('already exists')) {
            logger.info(`⚠️  Table already exists, skipping: ${statement.substring(0, 50)}...`);
          } else {
            throw error;
          }
        }
      }
    }
  } catch (error: any) {
    logger.error(`❌ Error executing ${path.basename(filePath)}:`, error.message);
    throw error;
  }
};

const runMigration = async () => {
  try {
    logger.info('Starting database migration...');

    const migrationsDir = __dirname;

    // Execute all migration files in order
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      if (fs.existsSync(filePath)) {
        await executeSQLFile(filePath);
      } else {
        logger.warn(`⚠️  Migration file not found: ${file}`);
      }
    }

    logger.info('✅ Database migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database migration failed:', error);
    process.exit(1);
  }
};

runMigration();












