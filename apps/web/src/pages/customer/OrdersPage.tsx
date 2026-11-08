import React from 'react';
import { ShoppingBag, CheckCircle2, Clock, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate, formatCurrency } from '../../lib/utils';

export const OrdersPage: React.FC = () => {
  const { orders } = useData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Lịch Sử Đơn Hàng</h1>
        <p className="text-sm text-slate-400 mt-1">
          Theo dõi các giao dịch mua mới và gia hạn thuê bao Algo trên nền tảng ALP.
        </p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Mã Đơn Hàng</th>
                <th className="pb-3">Ngày Tạo</th>
                <th className="pb-3">Thời Điểm Thanh Toán</th>
                <th className="pb-3">Số Tiền</th>
                <th className="pb-3">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-mono font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-400" />
                    <span>{ord.order_number}</span>
                  </td>
                  <td className="py-4 text-slate-300 font-mono">
                    {formatDate(ord.created_at)}
                  </td>
                  <td className="py-4 text-slate-300 font-mono">
                    {formatDate(ord.paid_at)}
                  </td>
                  <td className="py-4 font-bold text-white font-mono text-sm">
                    {formatCurrency(ord.amount, ord.currency)}
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {ord.status === 'paid' ? 'Đã Thanh Toán' : ord.status}
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

