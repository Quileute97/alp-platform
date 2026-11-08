import React from 'react';
import { DollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const AdminPaymentsPage: React.FC = () => {
  const mockEvents = [
    {
      id: 'evt-1',
      provider: 'VietQR / SeAPay',
      provider_event_id: 'VQR-TX-9908124',
      order_id: 'ord-301',
      amount: '$399.00',
      status: 'processed',
      created_at: '2026-11-01T08:00:00Z',
    },
    {
      id: 'evt-2',
      provider: 'Stripe Global',
      provider_event_id: 'ch_3N4x982KdLs981',
      order_id: 'ord-302',
      amount: '$39.00',
      status: 'processed',
      created_at: '2026-11-03T10:00:00Z',
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quản Lý Thanh Toán & Webhook Idempotency</h1>
        <p className="text-sm text-slate-400 mt-1">
          Theo dõi nhật ký webhook cổng thanh toán. Hệ thống tự động triệt tiêu các sự kiện trùng lặp nhờ khóa duy nhất `(provider, provider_event_id)`.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Cổng Thanh Toán</th>
                <th className="pb-3">Mã Giao Dịch Cổng (Provider Event ID)</th>
                <th className="pb-3">Mã Đơn Hàng</th>
                <th className="pb-3">Số Tiền</th>
                <th className="pb-3">Trạng Thái Xử Lý</th>
                <th className="pb-3">Thời Điểm Nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {mockEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>{evt.provider}</span>
                  </td>
                  <td className="py-4 font-mono text-slate-300 font-bold">{evt.provider_event_id}</td>
                  <td className="py-4 font-mono text-blue-400">{evt.order_id}</td>
                  <td className="py-4 font-mono font-bold text-white">{evt.amount}</td>
                  <td className="py-4">
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã kích hoạt</span>
                    </span>
                  </td>
                  <td className="py-4 font-mono text-slate-400">{formatDate(evt.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

