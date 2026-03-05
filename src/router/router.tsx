import { useRoutes, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import CreateStorePage from '../pages/CreateStorePage'
import StoreAccessPage from '../pages/StoreAccessPage'
import ChooseWorkplacePage from '../pages/ChooseWorkplacePage'
import CategoryPage from '../pages/CategoryPage'
import ProductListPage from '../pages/ProductListPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import CustomerListPage from '../pages/CustomerListPage'
import SupplierListPage from '../pages/SupplierListPage'
import OpenShiftPage from '../pages/OpenShiftPage'
import POSPage from '../pages/POSPage'
import CloseShiftPage from '../pages/CloseShiftPage'
import ImportOrderPage from '../pages/ImportOrderPage'
import InventoryPage from '../pages/InventoryPage'
import StockAuditPage from '../pages/StockAuditPage'
import SupplierReturnPage from '../pages/SupplierReturnPage'
import CustomerReturnPage from '../pages/CustomerReturnPage'
import StockCancellationPage from '../pages/StockCancellationPage'
import CashbookPage from '../pages/CashbookPage'
import ReceiptVoucherPage from '../pages/ReceiptVoucherPage'
import PaymentVoucherPage from '../pages/PaymentVoucherPage'
import DebtPage from '../pages/DebtPage'
import DashboardPage from '../pages/DashboardPage'
import EndShiftReportPage from '../pages/EndShiftReportPage'
import ExpiryDatePage from '../pages/ExpiryDatePage'
import StockHistoryPage from '../pages/StockHistoryPage'
import OnboardingPage from '../pages/OnboardingPage'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/receipt-voucher',
        element: <ReceiptVoucherPage />
      },
      {
        path: '/payment-voucher',
        element: <PaymentVoucherPage />
      },
      {
        path: '/debt',
        element: <DebtPage />
      }
    ],
  },
  {
    path: '/choose-workplace',
    element: <ChooseWorkplacePage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />
  },
  {
    path: '/end-shift-report',
    element: <EndShiftReportPage />
  },
  {
    path: '/expiry',
    element: <ExpiryDatePage />
  },
  {
    path: '/stock-history',
    element: <StockHistoryPage />
  },
  {
    path: '/categories',
    element: <CategoryPage />,
  },
  {
    path: '/products',
    element: <ProductListPage />,
  },
  {
    path: '/products/new',
    element: <ProductDetailPage />,
  },
  {
    path: '/products/:id',
    element: <ProductDetailPage />,
  },
  {
    path: '/customers',
    element: <CustomerListPage />,
  },
  {
    path: '/suppliers',
    element: <SupplierListPage />,
  },
  {
    path: '/open-shift',
    element: <OpenShiftPage />,
  },
  {
    path: '/pos',
    element: <POSPage />,
  },
  {
    path: '/close-shift',
    element: <CloseShiftPage />,
  },
  {
    path: '/import-order',
    element: <ImportOrderPage />,
  },
  {
    path: '/inventory',
    element: <InventoryPage />,
  },
  {
    path: '/stock-audit',
    element: <StockAuditPage />,
  },
  {
    path: '/supplier-return',
    element: <SupplierReturnPage />,
  },
  {
    path: '/customer-return',
    element: <CustomerReturnPage />,
  },
  {
    path: '/stock-cancellation',
    element: <StockCancellationPage />,
  },
  {
    path: '/cashbook',
    element: <CashbookPage />,
  },
  {
    path: '/store-access',
    element: <StoreAccessPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/create-store',
    element: <CreateStorePage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
]

export default function AppRouter() {
  const element = useRoutes(routes)
  return element
}
