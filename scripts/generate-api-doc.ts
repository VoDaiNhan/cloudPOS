import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel, BorderStyle } from 'docx'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Định nghĩa cấu trúc API mapping
interface APIEndpoint {
  page: string
  service: string
  endpoint: string
  description: string
}

// Danh sách tất cả các API endpoints được sử dụng trong hệ thống
const apiEndpoints: APIEndpoint[] = [
  // Auth & Authentication
  {
    page: 'LoginPage',
    service: 'authService',
    endpoint: 'POST /api/auth/login',
    description: 'Đăng nhập hệ thống với số điện thoại và mật khẩu'
  },
  {
    page: 'RegisterPage',
    service: 'authService',
    endpoint: 'POST /api/auth/register',
    description: 'Đăng ký tài khoản mới'
  },
  {
    page: 'RegisterPage',
    service: 'authService',
    endpoint: 'POST /api/auth/register/send-otp',
    description: 'Gửi mã OTP xác thực email đăng ký'
  },

  // Dashboard
  {
    page: 'DashboardPage',
    service: 'dashboardService',
    endpoint: 'GET /api/dashboard/stats',
    description: 'Lấy thống kê tổng quan (doanh thu, đơn hàng, sản phẩm, khách hàng)'
  },
  {
    page: 'DashboardPage',
    service: 'dashboardService',
    endpoint: 'GET /api/dashboard/chart?days={days}',
    description: 'Lấy dữ liệu biểu đồ doanh thu theo số ngày'
  },
  {
    page: 'DashboardPage',
    service: 'dashboardService',
    endpoint: 'GET /api/dashboard/top-products?limit={limit}',
    description: 'Lấy danh sách sản phẩm bán chạy nhất'
  },
  {
    page: 'DashboardPage',
    service: 'dashboardService',
    endpoint: 'GET /api/dashboard/alerts',
    description: 'Lấy cảnh báo tồn kho thấp'
  },

  // Products
  {
    page: 'ProductListPage',
    service: 'productService',
    endpoint: 'GET /api/products',
    description: 'Lấy danh sách tất cả sản phẩm'
  },
  {
    page: 'ProductDetailPage',
    service: 'productService',
    endpoint: 'GET /api/products/{id}',
    description: 'Lấy thông tin chi tiết sản phẩm theo ID'
  },
  {
    page: 'ProductDetailPage',
    service: 'productService',
    endpoint: 'POST /api/products',
    description: 'Tạo sản phẩm mới'
  },
  {
    page: 'ProductDetailPage',
    service: 'productService',
    endpoint: 'PUT /api/products/{id}',
    description: 'Cập nhật thông tin sản phẩm'
  },
  {
    page: 'ProductListPage',
    service: 'productService',
    endpoint: 'DELETE /api/products/{id}',
    description: 'Xóa sản phẩm'
  },

  // POS (Point of Sale)
  {
    page: 'POSPage',
    service: 'posService',
    endpoint: 'GET /api/pos/products',
    description: 'Lấy danh sách sản phẩm cho màn hình bán hàng'
  },
  {
    page: 'POSPage',
    service: 'orderService',
    endpoint: 'POST /api/orders',
    description: 'Tạo đơn hàng mới từ POS'
  },
  {
    page: 'POSPage',
    service: 'customerService',
    endpoint: 'GET /api/customers',
    description: 'Lấy danh sách khách hàng'
  },

  // Orders
  {
    page: 'OrderListPage',
    service: 'orderService',
    endpoint: 'GET /api/orders',
    description: 'Lấy danh sách tất cả đơn hàng'
  },
  {
    page: 'OrderDetailPage',
    service: 'orderService',
    endpoint: 'GET /api/orders/{id}',
    description: 'Lấy chi tiết đơn hàng'
  },

  // Customers
  {
    page: 'CustomerListPage',
    service: 'customerService',
    endpoint: 'GET /api/customers',
    description: 'Lấy danh sách khách hàng'
  },
  {
    page: 'CustomerDetailPage',
    service: 'customerService',
    endpoint: 'GET /api/customers/{id}',
    description: 'Lấy thông tin chi tiết khách hàng'
  },
  {
    page: 'CustomerDetailPage',
    service: 'customerService',
    endpoint: 'POST /api/customers',
    description: 'Tạo khách hàng mới'
  },
  {
    page: 'CustomerDetailPage',
    service: 'customerService',
    endpoint: 'PUT /api/customers/{id}',
    description: 'Cập nhật thông tin khách hàng'
  },
  {
    page: 'CustomerListPage',
    service: 'customerService',
    endpoint: 'DELETE /api/customers/{id}',
    description: 'Xóa khách hàng'
  },

  // Customer Groups
  {
    page: 'CustomerGroupPage',
    service: 'customerGroupService',
    endpoint: 'GET /api/customer-groups',
    description: 'Lấy danh sách nhóm khách hàng'
  },
  {
    page: 'CustomerGroupPage',
    service: 'customerGroupService',
    endpoint: 'POST /api/customer-groups',
    description: 'Tạo nhóm khách hàng mới'
  },
  {
    page: 'CustomerGroupPage',
    service: 'customerGroupService',
    endpoint: 'PUT /api/customer-groups/{id}',
    description: 'Cập nhật nhóm khách hàng'
  },
  {
    page: 'CustomerGroupPage',
    service: 'customerGroupService',
    endpoint: 'DELETE /api/customer-groups/{id}',
    description: 'Xóa nhóm khách hàng'
  },

  // Categories
  {
    page: 'CategoryPage',
    service: 'categoryService',
    endpoint: 'GET /api/categories',
    description: 'Lấy danh sách nhóm hàng'
  },
  {
    page: 'CategoryPage',
    service: 'categoryService',
    endpoint: 'POST /api/categories',
    description: 'Tạo nhóm hàng mới'
  },
  {
    page: 'CategoryPage',
    service: 'categoryService',
    endpoint: 'PUT /api/categories/{id}',
    description: 'Cập nhật nhóm hàng'
  },
  {
    page: 'CategoryPage',
    service: 'categoryService',
    endpoint: 'DELETE /api/categories/{id}',
    description: 'Xóa nhóm hàng'
  },

  // Inventory
  {
    page: 'InventoryPage',
    service: 'inventoryService',
    endpoint: 'GET /api/inventory',
    description: 'Lấy danh sách tồn kho'
  },
  {
    page: 'InventoryPage',
    service: 'inventoryService',
    endpoint: 'PUT /api/inventory/{productId}',
    description: 'Cập nhật số lượng tồn kho'
  },

  // Import Orders
  {
    page: 'ImportOrderPage',
    service: 'importOrderService',
    endpoint: 'GET /api/import-orders',
    description: 'Lấy danh sách phiếu nhập hàng'
  },
  {
    page: 'ImportOrderPage',
    service: 'importOrderService',
    endpoint: 'POST /api/import-orders',
    description: 'Tạo phiếu nhập hàng mới'
  },
  {
    page: 'ImportOrderPage',
    service: 'importOrderService',
    endpoint: 'GET /api/import-orders/{id}',
    description: 'Lấy chi tiết phiếu nhập hàng'
  },

  // Suppliers
  {
    page: 'SupplierPage',
    service: 'supplierService',
    endpoint: 'GET /api/suppliers',
    description: 'Lấy danh sách nhà cung cấp'
  },
  {
    page: 'SupplierPage',
    service: 'supplierService',
    endpoint: 'POST /api/suppliers',
    description: 'Tạo nhà cung cấp mới'
  },
  {
    page: 'SupplierPage',
    service: 'supplierService',
    endpoint: 'PUT /api/suppliers/{id}',
    description: 'Cập nhật thông tin nhà cung cấp'
  },
  {
    page: 'SupplierPage',
    service: 'supplierService',
    endpoint: 'DELETE /api/suppliers/{id}',
    description: 'Xóa nhà cung cấp'
  },

  // Batches (Lô hàng)
  {
    page: 'BatchManagementPage',
    service: 'batchService',
    endpoint: 'GET /api/batches',
    description: 'Lấy danh sách lô hàng'
  },
  {
    page: 'BatchManagementPage',
    service: 'batchService',
    endpoint: 'POST /api/batches',
    description: 'Tạo lô hàng mới'
  },
  {
    page: 'BatchManagementPage',
    service: 'batchService',
    endpoint: 'GET /api/batches/product/{productId}',
    description: 'Lấy danh sách lô hàng theo sản phẩm'
  },

  // Expiry Date Management
  {
    page: 'ExpiryDatePage',
    service: 'batchService',
    endpoint: 'GET /api/batches/expiring',
    description: 'Lấy danh sách lô hàng sắp hết hạn'
  },

  // Debt Management
  {
    page: 'DebtPage',
    service: 'debtService',
    endpoint: 'GET /api/debts',
    description: 'Lấy danh sách công nợ khách hàng'
  },
  {
    page: 'DebtPage',
    service: 'debtService',
    endpoint: 'POST /api/debts/payment',
    description: 'Ghi nhận thanh toán công nợ'
  },

  // Cashbook
  {
    page: 'CashbookPage',
    service: 'cashbookService',
    endpoint: 'GET /api/cashbook',
    description: 'Lấy sổ quỹ tiền mặt'
  },
  {
    page: 'CashbookPage',
    service: 'cashbookService',
    endpoint: 'POST /api/cashbook/entry',
    description: 'Tạo phiếu thu/chi'
  },

  // Vouchers
  {
    page: 'PaymentVoucherPage',
    service: 'voucherService',
    endpoint: 'GET /api/vouchers/payment',
    description: 'Lấy danh sách phiếu chi'
  },
  {
    page: 'PaymentVoucherPage',
    service: 'voucherService',
    endpoint: 'POST /api/vouchers/payment',
    description: 'Tạo phiếu chi mới'
  },
  {
    page: 'ReceiptVoucherPage',
    service: 'voucherService',
    endpoint: 'GET /api/vouchers/receipt',
    description: 'Lấy danh sách phiếu thu'
  },
  {
    page: 'ReceiptVoucherPage',
    service: 'voucherService',
    endpoint: 'POST /api/vouchers/receipt',
    description: 'Tạo phiếu thu mới'
  },

  // Accounts
  {
    page: 'AccountPage',
    service: 'accountService',
    endpoint: 'GET /api/accounts',
    description: 'Lấy danh sách tài khoản kế toán'
  },
  {
    page: 'AccountPage',
    service: 'accountService',
    endpoint: 'POST /api/accounts',
    description: 'Tạo tài khoản kế toán mới'
  },

  // Staff Management
  {
    page: 'StaffPage',
    service: 'staffService',
    endpoint: 'GET /api/staff',
    description: 'Lấy danh sách nhân viên'
  },
  {
    page: 'StaffPage',
    service: 'staffService',
    endpoint: 'POST /api/staff',
    description: 'Tạo nhân viên mới'
  },
  {
    page: 'StaffPage',
    service: 'staffService',
    endpoint: 'PUT /api/staff/{id}',
    description: 'Cập nhật thông tin nhân viên'
  },
  {
    page: 'StaffPage',
    service: 'staffService',
    endpoint: 'DELETE /api/staff/{id}',
    description: 'Xóa nhân viên'
  },

  // Shift Management
  {
    page: 'OpenShiftPage',
    service: 'shiftService',
    endpoint: 'POST /api/shifts/open',
    description: 'Mở ca làm việc'
  },
  {
    page: 'CloseShiftPage',
    service: 'shiftService',
    endpoint: 'POST /api/shifts/close',
    description: 'Đóng ca làm việc'
  },
  {
    page: 'EndShiftReportPage',
    service: 'shiftService',
    endpoint: 'GET /api/shifts/{id}/report',
    description: 'Lấy báo cáo cuối ca'
  },
  {
    page: 'ShiftReportPage',
    service: 'shiftService',
    endpoint: 'GET /api/shifts',
    description: 'Lấy danh sách ca làm việc'
  },

  // Returns (Trả hàng)
  {
    page: 'CustomerReturnPage',
    service: 'returnService',
    endpoint: 'GET /api/returns/customer',
    description: 'Lấy danh sách phiếu trả hàng từ khách'
  },
  {
    page: 'CustomerReturnPage',
    service: 'returnService',
    endpoint: 'POST /api/returns/customer',
    description: 'Tạo phiếu trả hàng từ khách'
  },
  {
    page: 'SupplierReturnPage',
    service: 'returnService',
    endpoint: 'GET /api/returns/supplier',
    description: 'Lấy danh sách phiếu trả hàng cho nhà cung cấp'
  },
  {
    page: 'SupplierReturnPage',
    service: 'returnService',
    endpoint: 'POST /api/returns/supplier',
    description: 'Tạo phiếu trả hàng cho nhà cung cấp'
  },

  // Stock Management
  {
    page: 'StockAuditPage',
    service: 'stockAuditService',
    endpoint: 'GET /api/stock-audits',
    description: 'Lấy danh sách phiếu kiểm kho'
  },
  {
    page: 'StockAuditPage',
    service: 'stockAuditService',
    endpoint: 'POST /api/stock-audits',
    description: 'Tạo phiếu kiểm kho mới'
  },
  {
    page: 'StockCancellationPage',
    service: 'stockCancellationService',
    endpoint: 'GET /api/stock-cancellations',
    description: 'Lấy danh sách phiếu hủy hàng'
  },
  {
    page: 'StockCancellationPage',
    service: 'stockCancellationService',
    endpoint: 'POST /api/stock-cancellations',
    description: 'Tạo phiếu hủy hàng mới'
  },
  {
    page: 'StockHistoryPage',
    service: 'stockHistoryService',
    endpoint: 'GET /api/stock-history',
    description: 'Lấy lịch sử xuất nhập tồn'
  },

  // Reports
  {
    page: 'ProfitReportPage',
    service: 'profitService',
    endpoint: 'GET /api/reports/profit',
    description: 'Lấy báo cáo lãi lỗ'
  },
  {
    page: 'SalesReportPage',
    service: 'orderService',
    endpoint: 'GET /api/reports/sales',
    description: 'Lấy báo cáo bán hàng'
  },

  // Store Management
  {
    page: 'CreateStorePage',
    service: 'storeService',
    endpoint: 'POST /api/stores',
    description: 'Tạo cửa hàng mới'
  },
  {
    page: 'ChooseWorkplacePage',
    service: 'storeService',
    endpoint: 'GET /api/stores',
    description: 'Lấy danh sách cửa hàng của người dùng'
  },
  {
    page: 'SettingsPage',
    service: 'storeService',
    endpoint: 'PUT /api/stores/{id}',
    description: 'Cập nhật thông tin cửa hàng'
  },

  // Units (Đơn vị tính)
  {
    page: 'UnitManagementPage',
    service: 'unitService',
    endpoint: 'GET /api/units',
    description: 'Lấy danh sách đơn vị tính'
  },
  {
    page: 'UnitManagementPage',
    service: 'unitService',
    endpoint: 'POST /api/units',
    description: 'Tạo đơn vị tính mới'
  },

  // Pricing
  {
    page: 'PricingPage',
    service: 'productService',
    endpoint: 'GET /api/products/{id}/pricing',
    description: 'Lấy bảng giá sản phẩm'
  },
  {
    page: 'PricingPage',
    service: 'productService',
    endpoint: 'PUT /api/products/{id}/pricing',
    description: 'Cập nhật bảng giá sản phẩm'
  },

  // Commission Payable
  {
    page: 'CommissionPayablePage',
    service: 'commissionPayableService',
    endpoint: 'GET /api/commissions/payable',
    description: 'Lấy danh sách hoa hồng phải trả'
  },
  {
    page: 'CommissionPayablePage',
    service: 'commissionPayableService',
    endpoint: 'POST /api/commissions/payment',
    description: 'Thanh toán hoa hồng'
  },

  // Recipes (Công thức chế biến)
  {
    page: 'RecipePage',
    service: 'recipeService',
    endpoint: 'GET /api/recipes',
    description: 'Lấy danh sách công thức chế biến'
  },
  {
    page: 'RecipePage',
    service: 'recipeService',
    endpoint: 'POST /api/recipes',
    description: 'Tạo công thức chế biến mới'
  },
  {
    page: 'RecipePage',
    service: 'recipeService',
    endpoint: 'PUT /api/recipes/{id}',
    description: 'Cập nhật công thức chế biến'
  },
]

// Tạo document Word
function createWordDocument(): Document {
  // Header
  const titleParagraph = new Paragraph({
    text: 'BẢNG TỔNG HỢP TRẠNG THÁI API CÁC TRANG',
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 }
  })

  const subtitleParagraph = new Paragraph({
    text: 'CloudPOS - Hệ thống quản lý bán hàng',
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 }
  })

  const noteParagraph = new Paragraph({
    text: '✅ Lưu ý: 100% các trang đã tích hợp API thật từ backend',
    spacing: { after: 400 },
    bold: true
  })

  const statsParagraph = new Paragraph({
    text: `Tổng số: ${apiEndpoints.length} API endpoints được sử dụng`,
    spacing: { after: 400 }
  })

  // Tạo table header
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        children: [new Paragraph({ text: 'STT', bold: true, alignment: AlignmentType.CENTER })],
        width: { size: 8, type: WidthType.PERCENTAGE },
        shading: { fill: '1c43a6' },
        margins: { top: 100, bottom: 100, left: 100, right: 100 }
      }),
      new TableCell({
        children: [new Paragraph({ text: 'Trang', bold: true, alignment: AlignmentType.CENTER })],
        width: { size: 22, type: WidthType.PERCENTAGE },
        shading: { fill: '1c43a6' }
      }),
      new TableCell({
        children: [new Paragraph({ text: 'Service', bold: true, alignment: AlignmentType.CENTER })],
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { fill: '1c43a6' }
      }),
      new TableCell({
        children: [new Paragraph({ text: 'Endpoint', bold: true, alignment: AlignmentType.CENTER })],
        width: { size: 25, type: WidthType.PERCENTAGE },
        shading: { fill: '1c43a6' }
      }),
      new TableCell({
        children: [new Paragraph({ text: 'Mô tả chức năng', bold: true, alignment: AlignmentType.CENTER })],
        width: { size: 25, type: WidthType.PERCENTAGE },
        shading: { fill: '1c43a6' }
      })
    ]
  })

  // Tạo table rows
  const dataRows = apiEndpoints.map((endpoint, index) => {
    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })],
          margins: { top: 100, bottom: 100, left: 100, right: 100 }
        }),
        new TableCell({
          children: [new Paragraph({ text: endpoint.page })],
          margins: { top: 100, bottom: 100, left: 100, right: 100 }
        }),
        new TableCell({
          children: [new Paragraph({ text: endpoint.service })],
          margins: { top: 100, bottom: 100, left: 100, right: 100 }
        }),
        new TableCell({
          children: [new Paragraph({ text: endpoint.endpoint })],
          margins: { top: 100, bottom: 100, left: 100, right: 100 }
        }),
        new TableCell({
          children: [new Paragraph({ text: endpoint.description })],
          margins: { top: 100, bottom: 100, left: 100, right: 100 }
        })
      ]
    })
  })

  // Tạo table
  const table = new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 }
    }
  })

  // Footer
  const footerParagraph = new Paragraph({
    text: `\nNgày tạo: ${new Date().toLocaleDateString('vi-VN')}`,
    spacing: { before: 400 }
  })

  // Tạo document
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        titleParagraph,
        subtitleParagraph,
        noteParagraph,
        statsParagraph,
        table,
        footerParagraph
      ]
    }]
  })

  return doc
}

// Main function
async function main() {
  try {
    console.log('🚀 Đang tạo file Word...')
    
    const doc = createWordDocument()
    const buffer = await Packer.toBuffer(doc)
    
    const outputPath = path.join(__dirname, '..', 'Bang_Tong_Hop_API.docx')
    fs.writeFileSync(outputPath, buffer)
    
    console.log(`✅ Đã tạo file thành công: ${outputPath}`)
    console.log(`📊 Tổng số API endpoints: ${apiEndpoints.length}`)
  } catch (error) {
    console.error('❌ Lỗi khi tạo file:', error)
    process.exit(1)
  }
}

main()
