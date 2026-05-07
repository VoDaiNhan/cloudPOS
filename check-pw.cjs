const http = require('http')

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMTExMS0xMTExLTExMTEtMTExMS0xMTExMTExMTExMTEiLCJuYW1lIjoiQWRtaW4gVXNlciIsInBob25lIjoiMDk4NzY1NDMyMSIsImV4cCI6MTc3NzQ1OTAyMiwiaXNzIjoiQ2xvdWRQT1MiLCJhdWQiOiJDbG91ZFBPU19Vc2VycyJ9.bcTmhdjbNmpvfTgRZ_7Z7uITq6yKMObwaTSqxD_YgEY'
const STORE_ID = '22222222-2222-2222-2222-222222222222'

const endpoints = [
  // Group 1: Auth
  { method: 'GET', path: '/api/auth/me', name: '1.1 Auth - GetMe' },
  
  // Group 2: Store
  { method: 'GET', path: '/api/stores/my-store', name: '2.1 Store - GetMyStore' },
  
  // Group 3: Categories & Products
  { method: 'GET', path: '/api/categories', name: '3.1 Categories - GetAll' },
  { method: 'GET', path: '/api/products', name: '3.2 Products - GetAll' },
  
  // Group 4: Units
  { method: 'GET', path: '/api/units', name: '4.1 Units - GetAll' },
  { method: 'GET', path: '/api/unit-conversions', name: '4.2 UnitConversions - GetAll' },
  
  // Group 5: Customers & Groups
  { method: 'GET', path: '/api/customers', name: '5.1 Customers - GetAll' },
  { method: 'GET', path: '/api/customer-groups', name: '5.2 CustomerGroups - GetAll' },
  
  // Group 6: Suppliers
  { method: 'GET', path: '/api/suppliers', name: '6.1 Suppliers - GetAll' },
  
  // Group 7: Orders
  { method: 'GET', path: '/api/orders', name: '7.1 Orders - GetAll' },
  
  // Group 8: Shifts
  { method: 'GET', path: '/api/shifts/current', name: '8.1 Shifts - GetCurrent' },
  
  // Group 9: Import Orders & Inventory
  { method: 'GET', path: '/api/import-orders', name: '9.1 ImportOrders - GetAll' },
  { method: 'GET', path: '/api/inventory', name: '9.2 Inventory - GetAll' },
  { method: 'GET', path: '/api/inventory/low-stock', name: '9.3 Inventory - LowStock' },
  { method: 'GET', path: '/api/stock-history', name: '9.4 StockHistory - GetAll' },
  
  // Group 10: Stock Audit & Cancellation
  { method: 'GET', path: '/api/stock-audits', name: '10.1 StockAudits - GetAll' },
  { method: 'GET', path: '/api/stock-cancellations', name: '10.2 StockCancellations - GetAll' },
  
  // Group 11: Batches
  { method: 'GET', path: '/api/batches', name: '11.1 Batches - GetAll' },
  { method: 'GET', path: '/api/batches/expiring?withinDays=30', name: '11.2 Batches - Expiring' },
  { method: 'GET', path: '/api/batches/expired', name: '11.3 Batches - Expired' },
  
  // Group 12: Cashbook & Vouchers
  { method: 'GET', path: '/api/cashbook?page=1&pageSize=10', name: '12.1 Cashbook - GetAll' },
  { method: 'GET', path: '/api/cashbook/summary', name: '12.2 Cashbook - Summary' },
  { method: 'GET', path: '/api/vouchers', name: '12.3 Vouchers - GetAll' },
  
  // Group 13: Debts & Commissions
  { method: 'GET', path: '/api/debts', name: '13.1 Debts - GetAll' },
  { method: 'GET', path: '/api/debts/summary', name: '13.2 Debts - Summary' },
  { method: 'GET', path: '/api/commission-payables', name: '13.3 CommissionPayables - GetAll' },
  { method: 'GET', path: '/api/commission-payables/summary', name: '13.4 CommissionPayables - Summary' },
  
  // Group 14: Returns
  { method: 'GET', path: '/api/returns', name: '14.1 Returns - GetAll' },
  
  // Group 15: Dashboard & Reports
  { method: 'GET', path: '/api/dashboard/stats', name: '15.1 Dashboard - Stats' },
  { method: 'GET', path: '/api/dashboard/chart?days=7', name: '15.2 Dashboard - Chart' },
  { method: 'GET', path: '/api/dashboard/top-products?limit=10', name: '15.3 Dashboard - TopProducts' },
  { method: 'GET', path: '/api/dashboard/alerts', name: '15.4 Dashboard - Alerts' },
  { method: 'GET', path: '/api/reports/profit/summary', name: '15.5 Reports - ProfitSummary' },
  { method: 'GET', path: '/api/reports/profit/by-product', name: '15.6 Reports - ProfitByProduct' },
  { method: 'GET', path: '/api/reports/profit/by-supplier', name: '15.7 Reports - ProfitBySupplier' },
  
  // Group 16: Staff & Roles
  { method: 'GET', path: '/api/staff', name: '16.1 Staff - GetAll' },
  { method: 'GET', path: '/api/roles', name: '16.2 Roles - GetAll' },
  
  // Account
  { method: 'GET', path: '/api/account', name: 'Account - GetProfile' },
]

function testEndpoint(ep) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5109,
      path: ep.path,
      method: ep.method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'X-Store-Id': STORE_ID,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
    
    const req = http.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => {
        const status = res.statusCode
        const emoji = status >= 200 && status < 300 ? '✅' : status >= 400 && status < 500 ? '⚠️' : '❌'
        let preview = ''
        try {
          const json = JSON.parse(body)
          if (Array.isArray(json)) preview = `[${json.length} items]`
          else if (json.message) preview = json.message
          else preview = Object.keys(json).slice(0,3).join(', ')
        } catch { preview = body.substring(0, 60) }
        resolve({ ...ep, status, emoji, preview })
      })
    })
    
    req.on('error', (err) => resolve({ ...ep, status: 0, emoji: '💀', preview: err.message }))
    req.on('timeout', () => { req.destroy(); resolve({ ...ep, status: 0, emoji: '⏰', preview: 'Timeout' }) })
    req.end()
  })
}

async function run() {
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗')
  console.log('║          CloudPOS API Test Report - All GET Endpoints                       ║')
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝')
  console.log('')
  
  let passed = 0, failed = 0, warn = 0
  
  for (const ep of endpoints) {
    const r = await testEndpoint(ep)
    const line = `${r.emoji} ${r.status} | ${r.name.padEnd(38)} | ${r.preview}`
    console.log(line)
    if (r.status >= 200 && r.status < 300) passed++
    else if (r.status >= 400 && r.status < 500) warn++
    else failed++
  }
  
  console.log('')
  console.log('═══════════════════════════════════════════════')
  console.log(`Summary: ✅ ${passed} passed | ⚠️ ${warn} client errors | ❌ ${failed} server errors`)
  console.log(`Total: ${endpoints.length} endpoints tested`)
}

run()
