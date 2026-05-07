import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read connection string from appsettings.json
const appsettingsPath = path.join(__dirname, '../../CloudPOS_BE/src/CloudPOS.API/appsettings.json');
const appsettings = JSON.parse(fs.readFileSync(appsettingsPath, 'utf8'));
const connStr = appsettings.ConnectionStrings.DefaultConnection;

// Parse .NET connection string to PostgreSQL format
function parseConnectionString(str) {
  const parts = {};
  str.split(';').forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) {
      parts[key.trim()] = value.trim();
    }
  });
  
  const host = parts.Host || parts.Server;
  const database = parts.Database;
  const username = parts.Username || parts['User Id'];
  const password = parts.Password;
  const ssl = parts.SslMode === 'Require';
  
  return {
    host,
    database,
    user: username,
    password,
    ssl: ssl ? { rejectUnauthorized: false } : false,
    port: 5432
  };
}

const config = parseConnectionString(connStr);
console.log('Connecting to:', config.host, '/', config.database);

// Read migration script
const migrationPath = path.join(__dirname, '../../CloudPOS_BE/src/CloudPOS.Infrastructure/Scripts/006_product_recipes_and_inventory.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

async function runMigration() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('✓ Connected to database');
    
    // Run the migration
    await client.query(migrationSQL);
    console.log('✓ Migration executed successfully');
    
    // Verify the column exists
    const result = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND column_name IN ('is_sellable', 'product_type', 'allow_negative_stock')
      ORDER BY column_name
    `);
    
    console.log('\n✓ Verified columns:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (default: ${row.column_default})`);
    });
    
    console.log('\n✓ Done!');
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
