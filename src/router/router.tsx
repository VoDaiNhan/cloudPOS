import { useLocation, useRoutes, Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { MODAL_ROUTES } from './modalRoutes'
import AuthLayout from '../layouts/AuthLayout'
import PublicLayout from '../layouts/PublicLayout'
import LandingPage from '../pages/LandingPage'
import PricingPage from '../pages/PricingPage'
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
import CheckoutPage from '../pages/CheckoutPage'
import AccountPage from '../pages/AccountPage'
import StaffPermissionsPage from '../pages/StaffPermissionsPage'
import SystemSettingsPage from '../pages/SystemSettingsPage'
import PaymentSuccessPage from '../pages/PaymentSuccessPage'
import NotFoundPage from '../pages/NotFoundPage'
import TestPage from '../pages/TestPage'
import SmartDiscountDemo from '../pages/SmartDiscountDemo'
import DiscountComparisonDemo from '../pages/DiscountComparisonDemo'
import PricingManagementDemo from '../pages/PricingManagementDemo'
import { BatchManagementDemo } from '../pages/BatchManagementDemo'
import { ReturnExchangePage } from '../pages/ReturnExchangePage'
import ReturnInventoryPage from '../pages/ReturnInventoryPage'
import UnitConversionPage from '../pages/UnitConversionPage'
import ProfitReportPage from '../pages/ProfitReportPage'
import RecipeManagementPage from '../pages/RecipeManagementPage'
import { authService } from '../services/authService'

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  return children
}

const protectedPage = (element: React.ReactNode) => <RequireAuth>{element}</RequireAuth>

// Modal routes are defined in modalRoutes.ts
// They are rendered as overlays using background location pattern

const mainRoutes: RouteObject[] = [
  { path: '/test', element: <TestPage /> }, // Test page to verify React is working
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: '/pricing', element: <PricingPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },
  { path: '/debt', element: protectedPage(<DebtPage />) },
  { path: '/choose-workplace', element: protectedPage(<ChooseWorkplacePage />) },
  { path: '/dashboard', element: protectedPage(<DashboardPage />) },
  { path: '/expiry', element: protectedPage(<ExpiryDatePage />) },
  { path: '/stock-history', element: protectedPage(<StockHistoryPage />) },
  { path: '/categories', element: protectedPage(<CategoryPage />) },
  { path: '/products', element: protectedPage(<ProductListPage />) },
  { path: '/products/new', element: protectedPage(<ProductDetailPage />) },
  { path: '/products/:id', element: protectedPage(<ProductDetailPage />) },
  { path: '/customers', element: protectedPage(<CustomerListPage />) },
  { path: '/suppliers', element: protectedPage(<SupplierListPage />) },
  { path: '/pos', element: protectedPage(<POSPage />) },
  { path: '/pos/discount', element: protectedPage(<SmartDiscountDemo />) },
  { path: '/pos/discount-comparison', element: protectedPage(<DiscountComparisonDemo />) },
  { path: '/pos/return-exchange', element: protectedPage(<ReturnExchangePage />) },
  { path: '/import-order', element: protectedPage(<ImportOrderPage />) },
  { path: '/inventory', element: protectedPage(<InventoryPage />) },
  { path: '/inventory/batches', element: protectedPage(<BatchManagementDemo />) },
  { path: '/inventory/pricing', element: protectedPage(<PricingManagementDemo />) },
  { path: '/inventory/returns', element: protectedPage(<ReturnInventoryPage />) },
  { path: '/inventory/units', element: protectedPage(<UnitConversionPage />) },
  { path: '/recipes/:productId', element: protectedPage(<RecipeManagementPage />) },
  { path: '/recipes', element: protectedPage(<RecipeManagementPage />) },
  { path: '/stock-audit', element: protectedPage(<StockAuditPage />) },
  { path: '/supplier-return', element: protectedPage(<SupplierReturnPage />) },
  { path: '/customer-return', element: protectedPage(<CustomerReturnPage />) },
  { path: '/stock-cancellation', element: protectedPage(<StockCancellationPage />) },
  { path: '/cashbook', element: protectedPage(<CashbookPage />) },
  { path: '/store-access', element: protectedPage(<StoreAccessPage />) },
  { path: '/register', element: <RegisterPage /> },
  { path: '/create-store', element: protectedPage(<CreateStorePage />) },
  { path: '/onboarding', element: protectedPage(<OnboardingPage />) },
  { path: '/checkout', element: protectedPage(<CheckoutPage />) },
  { path: '/account', element: protectedPage(<AccountPage />) },
  { path: '/staff-permissions', element: protectedPage(<StaffPermissionsPage />) },
  { path: '/settings', element: protectedPage(<SystemSettingsPage />) },
  { path: '/checkout/success', element: protectedPage(<PaymentSuccessPage />) },
  { path: '/unit-conversions', element: protectedPage(<UnitConversionPage />) },
  { path: '/reports/profit', element: protectedPage(<ProfitReportPage />) },
  { path: '/reports', element: <Navigate to="/reports/profit" replace /> },
  { path: '*', element: <NotFoundPage /> },
]

// Modal routes — these are rendered separately as overlays
const modalRoutes: RouteObject[] = [
  { path: '/open-shift', element: protectedPage(<OpenShiftPage />) },
  { path: '/close-shift', element: protectedPage(<CloseShiftPage />) },
  { path: '/end-shift-report', element: protectedPage(<EndShiftReportPage />) },
  { path: '/end-shift-report/:id', element: protectedPage(<EndShiftReportPage />) },
  { path: '/receipt-voucher', element: protectedPage(<ReceiptVoucherPage />) },
  { path: '/payment-voucher', element: protectedPage(<PaymentVoucherPage />) },
]

export default function AppRouter() {
  const location = useLocation()
  // background is the page behind the modal (if navigated with state.background)
  const background = (location.state as { background?: Location })?.background

  // Render the "main" page using the background location (or current if no background)
  const mainElement = useRoutes(mainRoutes, background || location)

  // Render the modal overlay (only when we are on a modal route)
  const modalElement = useRoutes(modalRoutes, location)
  const isModalRoute = MODAL_ROUTES.some(r => location.pathname.startsWith(r))

  return (
    <>
      {mainElement}
      {isModalRoute && modalElement}
    </>
  )
}
