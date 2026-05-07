const { Client } = require('pg')

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_exMViZjR04yH@ep-cold-cake-amkfm9l7-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require'
})

async function run() {
  await client.connect()
  const r = await client.query(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name IN ('order_items', 'orders')
  `)
  console.log(r.rows.map(r => r.column_name).join(', '))
  await client.end()
}
run()
