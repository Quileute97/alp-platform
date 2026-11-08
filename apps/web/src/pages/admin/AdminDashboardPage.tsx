import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Key,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Bot,
  ShieldAlert,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate, formatCurrency } from '../../lib/utils';

export const AdminDashboardPage: React.FC = () => {
  const { products, subscriptions, licenses, orders, auditLogs } = useData();

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.amount, 0);
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const activeLicenses = licenses.filter(l => l.status === 'active');

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Tổng Quan Quản Trị Hệ Thống</h1>
          <p className="text-sm text-slate-400 mt-1">
            Trung tâm kiểm soát cấp phép cBot cTrader, doanh thu thuê bao và giám sát thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloudflare Edge & Supabase Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doanh Thu Tích Lũy</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {formatCurrency(totalRevenue, 'USD')}
          </div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tự động qua cổng thanh toán</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Thuê Bao Hoạt Động</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {activeSubs.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Tổng cộng: {subscriptions.length} gói đã phát hành
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">License Đang Kích Hoạt</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {activeLicenses.length}
          </div>
          <div className="text-xs text-indigo-400 mt-1">
            Xác thực Ed25519 Signed
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sản Phẩm cBot / Indicator</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {products.length}
          </div>
          <div className="text-xs text-amber-400 mt-1">
            Đang phân phối cTrader 5.x
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Licenses & System Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Licenses */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">License Cấp Mới & Trạng Thái</h2>
              <p className="text-xs text-slate-400">Danh sách mã bản quyền được quản lý</p>
            </div>
            <Link
              to="/admin/licenses"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {licenses.map((lic) => (
              <div
                key={lic.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-400">
                      {lic.license_key_prefix}-****
                    </span>
                    <span className="text-xs text-white font-medium">{lic.product_id}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Hết hạn: {formatDate(lic.expires_at)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    lic.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {lic.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Activity */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Nhật Ký Quản Trị Hệ Thống (Audit Logs)</h2>
              <p className="text-xs text-slate-400">Truy vết hành động quản lý và sự kiện cấp phép</p>
            </div>
            <Link
              to="/admin/audit-logs"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-start justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-slate-200 font-mono text-[11px]">
                    {log.action}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Tài nguyên: <span className="font-mono text-slate-300">{log.resource_type}/{log.resource_id}</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono shrink-0">
                  {formatDate(log.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

