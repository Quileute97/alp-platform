import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  CalendarCheck,
  CreditCard,
  Key,
  ShoppingBag,
  Download,
  HelpCircle,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CustomerLayout: React.FC = () => {
  const { user, isAdmin, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Tổng quan', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Sản phẩm Algo', path: '/products', icon: Bot },
    { label: 'Gói thuê bao', path: '/subscriptions', icon: CalendarCheck },
    { label: 'Tài khoản giao dịch', path: '/accounts', icon: CreditCard },
    { label: 'License của tôi', path: '/licenses', icon: Key },
    { label: 'Đơn hàng', path: '/orders', icon: ShoppingBag },
    { label: 'Tải xuống', path: '/downloads', icon: Download },
    { label: 'Hỗ trợ', path: '/support', icon: HelpCircle },
    { label: 'Hồ sơ', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col">
      {/* Top Notification / Role Switcher Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  ALP
                </span>
                <span className="text-[10px] ml-1.5 uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                  cTrader Algo
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition"
              >
                Trang chủ
              </Link>
              <Link
                to="/products"
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition"
              >
                Kho Algo cBot
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Role indicator & Quick switch button */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-full px-3 py-1 text-xs">
              <span className="text-slate-400">Chế độ xem:</span>
              <span className="font-semibold text-emerald-400 uppercase tracking-wider">
                {user?.role || 'Khách hàng'}
              </span>
              <button
                onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
                className="ml-1 text-[11px] underline text-blue-400 hover:text-blue-300 transition"
                title="Chuyển đổi giao diện để kiểm tra cả vai trò Khách hàng và Admin"
              >
                Đổi sang {isAdmin ? 'Khách hàng' : 'Admin'}
              </button>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Trang Quản Trị</span>
              </Link>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="text-right hidden md:block">
                <div className="text-xs font-medium text-slate-200">{user?.full_name || 'Khách hàng'}</div>
                <div className="text-[11px] text-slate-400">{user?.email}</div>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar Nav */}
        <aside className="w-64 hidden lg:block shrink-0">
          <div className="sticky top-24 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-3">
              Menu Khách Hàng
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t border-slate-800/60 px-3">
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/30 text-xs">
                <div className="font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
                  <span>cTrader Automate</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Bản quyền xác thực qua Ed25519. Không đóng lệnh cưỡng bức khi hết hạn.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm p-4 pt-20">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                <span className="font-semibold text-sm">Điều hướng</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 ALP (Algo License Platform). Hệ thống phân phối & cấp phép cBot cTrader chuyên nghiệp.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              License API Hoạt Động (Ed25519)
            </span>
            <span>Phiên bản v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

