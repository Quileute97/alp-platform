import React from 'react';
import { CreditCard, CheckCircle2, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';

export const AdminTradingAccountsPage: React.FC = () => {
  const { accounts } = useData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quản Lý Tài Khoản cTrader Toàn Hệ Thống</h1>
        <p className="text-sm text-slate-400 mt-1">
          Danh sách toàn bộ tài khoản cTrader của khách hàng đã đăng ký liên kết bản quyền bot.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Sàn Giao Dịch (Broker)</th>
                <th className="pb-3">Số Tài Khoản cTrader</th>
                <th className="pb-3">Môi Trường</th>
                <th className="pb-3">Mã Khách Hàng (User ID)</th>
                <th className="pb-3">Trạng Thái Xác Minh</th>
                <th className="pb-3">Ngày Đăng Ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>{acc.broker}</span>
                  </td>
                  <td className="py-4 font-mono font-bold text-slate-200">#{acc.account_number}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      acc.environment === 'live' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {acc.environment}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-slate-400">{acc.user_id}</td>
                  <td className="py-4">
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã xác minh</span>
                    </span>
                  </td>
                  <td className="py-4 font-mono text-slate-400">{formatDate(acc.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

