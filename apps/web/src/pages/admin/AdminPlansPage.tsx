import React from 'react';
import { Tag, Plus, CheckCircle2 } from 'lucide-react';

export const AdminPlansPage: React.FC = () => {
  const plans = [
    { id: 'plan_monthly', name: 'Gói 1 Tháng', interval: 'monthly', days: 30, discount: '0%', active: true },
    { id: 'plan_quarterly', name: 'Gói 3 Tháng (Quý)', interval: 'quarterly', days: 90, discount: '15%', active: true },
    { id: 'plan_semi_annual', name: 'Gói 6 Tháng', interval: 'semi_annual', days: 180, discount: '25%', active: true },
    { id: 'plan_yearly', name: 'Gói 1 Năm', interval: 'yearly', days: 365, discount: '40%', active: true },
    { id: 'plan_lifetime', name: 'Gói Trọn Đời', interval: 'lifetime', days: 36500, discount: 'Sở hữu vĩnh viễn', active: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quản Lý Gói Giá & Chu Kỳ</h1>
          <p className="text-sm text-slate-400 mt-1">
            Cấu hình thời hạn chu kỳ thanh toán, tỷ lệ chiết khấu và các gói thuê bao định kỳ.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Mã Gói (ID)</th>
                <th className="pb-3">Tên Gói</th>
                <th className="pb-3">Chu Kỳ</th>
                <th className="pb-3">Thời Lượng (Ngày)</th>
                <th className="pb-3">Ưu Đãi / Chiết Khấu</th>
                <th className="pb-3">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-mono font-bold text-white">{p.id}</td>
                  <td className="py-4 font-semibold text-slate-200">{p.name}</td>
                  <td className="py-4 font-mono text-blue-400 uppercase">{p.interval}</td>
                  <td className="py-4 font-mono text-slate-300">{p.days} ngày</td>
                  <td className="py-4 text-emerald-400 font-medium">{p.discount}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Hoạt động
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

