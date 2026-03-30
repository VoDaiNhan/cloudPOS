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
// import DiscountComparisonDemo from '../pages/DiscountComparisonDemo' // Temporarily disabled
// import UnitManagementDemo from '../pages/UnitManagementDemo' // Temporarily disabled due to import errors
import PricingManagementDemo from '../pages/PricingManagementDemo'
// import UnitConversionPage from '../pages/UnitConversionPage' // Temporarily disabled due to import errors
import { BatchManagementDemo } from '../pages/BatchManagementDemo'
import { ReturnExchangePage } from '../pages/ReturnExchangePage'

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
  { path: '/debt', element: <DebtPage /> },
  { path: '/choose-workplace', element: <ChooseWorkplacePage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/expiry', element: <ExpiryDatePage /> },
  { path: '/stock-history', element: <StockHistoryPage /> },
  { path: '/categories', element: <CategoryPage /> },
  { path: '/products', element: <ProductListPage /> },
  { path: '/products/new', element: <ProductDetailPage /> },
  { path: '/products/:id', element: <ProductDetailPage /> },
  { path: '/customers', element: <CustomerListPage /> },
  { path: '/suppliers', element: <SupplierListPage /> },
  { path: '/pos', element: <POSPage /> },
  { path: '/pos/discount', element: <SmartDiscountDemo /> },
  { path: '/pos/return-exchange', element: <ReturnExchangePage /> },
  { path: '/import-order', element: <ImportOrderPage /> },
  { path: '/inventory', element: <InventoryPage /> },
  { path: '/inventory/batches', element: <BatchManagementDemo /> },
  { path: '/inventory/pricing', element: <PricingManagementDemo /> },
  // { path: '/inventory/units', element: <UnitManagementDemo /> }, // Temporarily disabled
  { path: '/stock-audit', element: <StockAuditPage /> },
  { path: '/supplier-return', element: <SupplierReturnPage /> },
  { path: '/customer-return', element: <CustomerReturnPage /> },
  { path: '/stock-cancellation', element: <StockCancellationPage /> },
  { path: '/cashbook', element: <CashbookPage /> },
  { path: '/store-access', element: <StoreAccessPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/create-store', element: <CreateStorePage /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/account', element: <AccountPage /> },
  { path: '/staff-permissions', element: <StaffPermissionsPage /> },
  { path: '/settings', element: <SystemSettingsPage /> },
  { path: '/checkout/success', element: <PaymentSuccessPage /> },
  // { path: '/unit-conversions', element: <UnitConversionPage /> }, // Temporarily disabled
  { path: '/reports', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <NotFoundPage /> },
]

// Modal routes — these are rendered separately as overlays
const modalRoutes: RouteObject[] = [
  { path: '/open-shift', element: <OpenShiftPage /> },
  { path: '/close-shift', element: <CloseShiftPage /> },
  { path: '/end-shift-report', element: <EndShiftReportPage /> },
  { path: '/receipt-voucher', element: <ReceiptVoucherPage /> },
  { path: '/payment-voucher', element: <PaymentVoucherPage /> },
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
