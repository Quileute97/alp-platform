import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Tag,
  Users,
  CreditCard,
  ShoppingBag,
  DollarSign,
  CalendarCheck,
  Key,
  GitBranch,
  FileText,
  Settings,
  Shield,
  ArrowLeft,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Tổng quan', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Sản phẩm', path: '/admin/products', icon: Box },
    { label: 'Gói giá', path: '/admin/plans', icon: Tag },
    { label: 'Khách hàng', path: '/admin/customers', icon: Users },
    { label: 'Tài khoản giao dịch', path: '/admin/accounts', icon: CreditCard },
    { label: 'Đơn hàng', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Thanh toán', path: '/admin/payments', icon: DollarSign },
    { label: 'Thuê bao', path: '/admin/subscriptions', icon: CalendarCheck },
    { label: 'License', path: '/admin/licenses', icon: Key },
    { label: 'Phiên bản Algo', path: '/admin/versions', icon: GitBranch },
    { label: 'Nhật ký hệ thống', path: '/admin/audit-logs', icon: FileText },
    { label: 'Cài đặt', path: '/admin/settings', icon: Settings },
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Quyền Truy Cập Bị Giới Hạn</h2>
          <p className="text-sm text-slate-400 mb-6">
            Khu vực này chỉ dành cho quản trị viên (Admin / Super Admin). Bạn hiện đang đăng nhập với vai trò <span className="text-emerald-400 font-semibold">{user?.role}</span>.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => switchRole('admin')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/30"
            >
              Chuyển sang vai trò Quản trị viên (Admin)
            </button>
            <Link
              to="/dashboard"
              className="block w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition"
            >
              Quay lại Bảng điều khiển Khách hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D14] text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-amber-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">ALP Control Center</span>
                <span className="text-[10px] ml-2 uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                  {user?.role}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition border border-slate-700/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Xem Giao Diện Khách Hàng</span>
            </Link>

            <button
              onClick={() => logout()}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Admin Layout Body */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <aside className="w-64 hidden lg:flex flex-col border-r border-slate-800/80 bg-slate-950/60 shrink-0 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-3">
            Quản Lý Hệ Thống
          </div>
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800/80 px-2">
            <div className="text-[11px] text-slate-400 text-center">
              ALP Core Engine v1.0 • Supabase RLS Active
            </div>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

