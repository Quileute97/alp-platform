import React from 'react';
import { CalendarCheck, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';

export const AdminSubscriptionsPage: React.FC = () => {
  const { subscriptions, products } = useData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quản Lý Thuê Bao Toàn Hệ Thống</h1>
        <p className="text-sm text-slate-400 mt-1">
          Theo dõi chu kỳ hiệu lực, ngày gia hạn và tỷ lệ duy trì thuê bao cBot của khách hàng.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Mã Thuê Bao</th>
                <th className="pb-3">Khách Hàng (User ID)</th>
                <th className="pb-3">Mã Đơn Hàng</th>
                <th className="pb-3">Ngày Bắt Đầu</th>
                <th className="pb-3">Ngày Hết Hạn</th>
                <th className="pb-3">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-mono font-bold text-white flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-blue-400" />
                    <span>{sub.id}</span>
                  </td>
                  <td className="py-4 font-mono text-slate-400">{sub.user_id}</td>
                  <td className="py-4 font-mono text-blue-400">{sub.order_id}</td>
                  <td className="py-4 font-mono text-slate-300">{formatDate(sub.start_at)}</td>
                  <td className="py-4 font-mono font-bold text-white">{formatDate(sub.expires_at)}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {sub.status === 'active' ? 'Đang Hoạt Động' : sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

