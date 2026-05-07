// Run the 006 migration script on Neon DB
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_exMViZjR04yH@ep-cold-cake-amkfm9l7-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require'
})

async function main() {
  await client.connect()
  console.log('Connected to Neon DB.')

  const sqlPath = path.join(__dirname, '..', 'CloudPOS_BE', 'src', 'CloudPOS.Infrastructure', 'Scripts', '006_product_recipes_and_inventory.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  console.log('Running migration 006_product_recipes_and_inventory.sql...')
  await client.query(sql)
  console.log('✓ Migration completed successfully!')

  // Verify
  const res = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name IN ('product_type', 'is_sellable', 'allow_negative_stock')
    ORDER BY column_name
  `)
  console.log(`  ✓ products table has new columns: ${res.rows.map(r => r.column_name).join(', ')}`)

  const tableRes = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_name = 'product_recipes'
  `)
  console.log(`  ✓ product_recipes table: ${tableRes.rows.length > 0 ? 'EXISTS' : 'MISSING'}`)

  await client.end()
}

main().catch(err => { console.error(err); process.exit(1) })
