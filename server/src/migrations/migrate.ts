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

    // Separate CREATE TABLE and CREATE VIEW statements
    const tableStatements: string[] = [];
    const viewStatements: string[] = [];

    for (const statement of statements) {
      const upperStatement = statement.toUpperCase().trim();
      if (upperStatement.startsWith('CREATE OR REPLACE VIEW') || upperStatement.startsWith('CREATE VIEW')) {
        viewStatements.push(statement);
      } else {
        tableStatements.push(statement);
      }
    }

    // Execute table statements first
    for (const statement of tableStatements) {
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

    // Execute view statements after tables are created
    for (const statement of viewStatements) {
      if (statement.trim()) {
        try {
          await pool.execute(statement);
          logger.info(`✅ Executed VIEW: ${statement.substring(0, 80)}...`);
        } catch (error: any) {
          // Ignore view errors if table doesn't exist (might be created in another file)
          if (error.message && error.message.includes("doesn't exist")) {
            logger.warn(`⚠️  View creation skipped (table doesn't exist): ${statement.substring(0, 50)}...`);
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












