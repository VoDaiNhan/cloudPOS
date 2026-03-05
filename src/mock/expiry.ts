import type { ExpiryBatch, ExpirySummary } from '../types/expiry'

export const mockExpirySummary: ExpirySummary = {
  expiredCount: 12,
  nearExpiryCount: 24,
  safeCount: 1452
}

export const mockExpiryBatches: ExpiryBatch[] = [
  {
    id: 'b1',
    productId: 'prod1',
    productName: 'iPhone 15 Pro Max 256GB',
    sku: 'IP15PM-BLK',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoouKuZG2tPWGWVfPvKE1WtuBACEZ5AW4VwjwwCtB4lZ0AmU1PBmGA4jeWyMQvZtQW9LIbohagHZB2S56PJXo8qyYVjiTmrPZTz9W9rioxVKN_Jn54Bqedp8r9Eym75LpVtkrPiOlUqAUaONnbTQnGx_CimCB1ykBtUQ1hdfM_jAMnyYcpTOcCSmXtyZbZdGrybUQvKM1XeviT7ssB2tqzPCL3t6P13ZuU9ib3Zr3Pr9gj5TouBSyW8RQswaM9LTD3wZXtUp4HgEs',
    batchNumber: 'LOT-2023-0045',
    expiryDate: '15/02/2024',
    quantity: 12,
    unit: 'máy',
    status: 'EXPIRED',
    daysDifference: -5
  },
  {
    id: 'b2',
    productId: 'prod2',
    productName: 'Apple Watch Series 9',
    sku: 'AW9-S-45',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsKPOGswuyxMeDri6x4JBgymr0a1wD3X7KjNni5IDBa8wUnwu6o4VIItQ8Aun1T7Ksjx6ZAIQsasn2fTbM6eSwre6Ob0zWeLbYRpsBNJCY7ZOKb_O7T5VkyprmdRPbrn-V_HgPMQEB5rb3QWjfy5o-PRGAyP_0Uwh-5O-tqLIjFza4Xw4BY8ZzyZoBUlkYt-Rnskb57MN32wQi20hOr2e81-pU40A5mzLsrXtSPoC7WEj2p0gnpQzRVH5Y7JwNwNlBd0vNChMrQoI',
    batchNumber: 'LOT-2023-0122',
    expiryDate: '10/03/2024',
    quantity: 45,
    unit: 'chiếc',
    status: 'NEAR_EXPIRY',
    daysDifference: 18
  },
  {
    id: 'b3',
    productId: 'prod3',
    productName: 'Sony WH-1000XM5',
    sku: 'SN-XM5-W',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOrFJxVXRXl6K3KjZo_o7m2BKdL9j2BHww48OgK0WmSnHRIAiGITdcTlZzqrp0w3MxmgL5Y7lwtYaNhrOMPE89YfpNCsr7ym7ypfUyCbTmX2IfpDMSGoguGCHn-Bl51VnDLhtGOIC40gGB4EJ9K103p5YKNTNPZplwR6J9Ps91TvxkInENLh7HY8anlMzpgiJ8NWhLzbbA2gKLE0iDVKKyjJUBdP_fVe2oO7uP7NmmfWLOS744733rwzqhko5uLvPmy2kbkarOlFo',
    batchNumber: 'LOT-2023-0210',
    expiryDate: '12/03/2024',
    quantity: 20,
    unit: 'tai nghe',
    status: 'NEAR_EXPIRY',
    daysDifference: 20
  },
  {
    id: 'b4',
    productId: 'prod4',
    productName: 'Nike Air Max 270',
    sku: 'NK-AM270-R',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs6h3dOngnwDE6tsaRbqjTxGyEsPLtwQDFcyzY5ADk8zKH-fL_V43NpvI7AWQJjwBtHLYDzfqMCPaf69HtOZMJ5V239yW1xg9SYWSya5GcLrG7AhztEvay0jDlHSr92NsnU3aXIG6u0NvXsHbrMhOcG8PxhIjFuBOVSj_rAxwwSJoo79gHbTEEm5OpxSKKGQKKYplEYNOW4pZqMKjo6CS6HVF4uurf9d1obRX5y2tmD2NlWYj_Jgu5xmJ5Zcke2vzXYo1DeOVX5Qg',
    batchNumber: 'LOT-2023-0305',
    expiryDate: '01/01/2024',
    quantity: 5,
    unit: 'đôi',
    status: 'EXPIRED',
    daysDifference: -50
  }
]
