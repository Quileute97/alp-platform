import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/customer/ProductsPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { DashboardPage } from './pages/customer/DashboardPage';
import { SubscriptionsPage } from './pages/customer/SubscriptionsPage';
import { AccountsPage } from './pages/customer/AccountsPage';
import { LicensesPage } from './pages/customer/LicensesPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { DownloadsPage } from './pages/customer/DownloadsPage';
import { SupportPage } from './pages/customer/SupportPage';
import { ProfilePage } from './pages/customer/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminPlansPage } from './pages/admin/AdminPlansPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminTradingAccountsPage } from './pages/admin/AdminTradingAccountsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage';
import { AdminLicensesPage } from './pages/admin/AdminLicensesPage';
import { AdminVersionsPage } from './pages/admin/AdminVersionsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer Facing Portal (100% Vietnamese) */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/licenses" element={<LicensesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/downloads" element={<DownloadsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Control Center (100% Vietnamese) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="plans" element={<AdminPlansPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
              <Route path="accounts" element={<AdminTradingAccountsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
              <Route path="licenses" element={<AdminLicensesPage />} />
              <Route path="versions" element={<AdminVersionsPage />} />
              <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
};

