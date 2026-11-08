import React from 'react';
import { Link } from 'react-router-dom';
import {
  Key,
  CalendarCheck,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Download,
  Bot
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatCurrency } from '../../lib/utils';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { subscriptions, licenses, orders, accounts, products } = useData();

  const activeLicenses = licenses.filter(l => l.status === 'active');
  const activeSubs = subscriptions.filter(s => s.status === 'active');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900 border border-blue-900/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            Bảng điều khiển cá nhân
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Xin chào, {user?.full_name || 'Nhà giao dịch'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Quản lý các gói thuê bao, mã bản quyền cBot và tài khoản cTrader được cấp quyền giao dịch.
          </p>
        </div>

        <Link
          to="/products"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20 flex items-center gap-1.5 shrink-0"
        >
          <span>Khám phá thêm cBot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Thuê bao đang mở</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{activeSubs.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">Đang hoạt động</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">License kích hoạt</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{activeLicenses.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">Đã liên kết cTrader</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Tài khoản cTrader</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{accounts.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Đã xác minh</div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Đơn hàng hoàn tất</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{orders.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Giao dịch an toàn</div>
        </div>
      </div>

      {/* Active Licenses Table Preview */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">License Đang Hoạt Động</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Bản quyền được cBot dùng để xác thực với máy chủ ALP trước khi thực thi lệnh.
            </p>
          </div>
          <Link
            to="/licenses"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Sản phẩm</th>
                <th className="pb-3">Mã License (Prefix)</th>
                <th className="pb-3">Tài khoản cTrader</th>
                <th className="pb-3">Hạn sử dụng</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {licenses.slice(0, 3).map((lic) => {
                const prod = products.find(p => p.id === lic.product_id);
                const acc = accounts.find(a => a.id === lic.trading_account_id);
                return (
                  <tr key={lic.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{prod?.name || lic.product_id}</span>
                      </div>
                    </td>
                    <td className="py-4 font-mono font-bold text-slate-200">
                      {lic.license_key_prefix}-****-****
                    </td>
                    <td className="py-4">
                      {acc ? (
                        <span className="font-mono text-slate-300">
                          {acc.broker} ({acc.account_number}) [{acc.environment}]
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium">Chưa gán tài khoản</span>
                      )}
                    </td>
                    <td className="py-4 text-slate-300 font-mono">
                      {formatDate(lic.expires_at)}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        lic.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {lic.status === 'active' ? 'Đang hoạt động' : lic.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        to="/licenses"
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        Quản lý
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/downloads"
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Trung Tâm Tải Xuống</h3>
              <p className="text-xs text-slate-400">Tải file .algo và hướng dẫn cài đặt cTrader</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
        </Link>

        <Link
          to="/accounts"
          className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Đăng Ký Tài Khoản Giao Dịch</h3>
              <p className="text-xs text-slate-400">Liên kết số tài khoản sàn để kích hoạt bot</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
        </Link>
      </div>
    </div>
  );
};

