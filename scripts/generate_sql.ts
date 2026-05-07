import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { posProducts, posCategories } from '../src/mock/pos';

const STORE_ID = '22222222-2222-2222-2222-222222222222';

let sql = `-- Seed Mock Data from Frontend\n`;
sql += `USE CloudPOS;\nGO\n\n`;

// 1. Insert Categories
const categoryMap = new Map<string, string>();
sql += `-- Categories\n`;
posCategories.forEach((catName, index) => {
    // skip 'Tất cả'
    if (catName === 'Tất cả') return;
    const catId = crypto.randomUUID();
    categoryMap.set(catName, catId);
    sql += `INSERT INTO categories (id, store_id, code, name, is_active) VALUES ('${catId}', '${STORE_ID}', 'CAT${index}', N'${catName}', 1);\n`;
});
sql += `\n`;

// 2. Insert Units
const unitMap = new Map<string, string>();
sql += `-- Units\n`;
const uniqueUnits = [...new Set(posProducts.map(p => p.baseUnit))];
uniqueUnits.forEach((unitName) => {
    if (!unitName) return;
    const unitId = crypto.randomUUID();
    unitMap.set(unitName, unitId);
    sql += `INSERT INTO units (id, store_id, name, is_base) VALUES ('${unitId}', '${STORE_ID}', N'${unitName}', 1);\n`;
});
sql += `\n`;

// 3. Insert Products
sql += `-- Products\n`;
posProducts.forEach((p, index) => {
    const productId = crypto.randomUUID();
    const catId = categoryMap.get(p.category) || 'NULL';
    const unitId = unitMap.get(p.baseUnit) || 'NULL';
    const code = `SP${String(index + 1).padStart(3, '0')}`;
    const costPrice = Math.round(p.price * 0.6);
    const barcode = `89300123${String(45670 + index).padStart(4, '0')}`;
    const stock = p.stockInBaseUnit || 0;
    const catIdStr = catId === 'NULL' ? 'NULL' : `'${catId}'`;
    const unitIdStr = unitId === 'NULL' ? 'NULL' : `'${unitId}'`;

    sql += `INSERT INTO products (id, store_id, category_id, code, name, barcode, image_url, cost_price, retail_price, base_unit_id, stock_quantity, status) 
VALUES ('${productId}', '${STORE_ID}', ${catIdStr}, '${code}', N'${p.name}', '${barcode}', '${p.image}', ${costPrice}, ${p.price}, ${unitIdStr}, ${stock}, 'active');\n`;
});

const outPath = path.resolve('../CloudPOS_BE/src/CloudPOS.Infrastructure/Data/Scripts/003_seed_mock_products.sql');
fs.writeFileSync(outPath, sql, 'utf-8');
console.log(`Generated SQL at ${outPath}`);
