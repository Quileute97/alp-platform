import React, { useState } from 'react';
import { FileText, Search, Shield, Filter } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs } = useData();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.resource_type.toLowerCase().includes(search.toLowerCase()) ||
    log.resource_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Nhật Ký Hệ Thống (Audit Logs)</h1>
        <p className="text-sm text-slate-400 mt-1">
          Lịch sử kiểm tra toàn diện mọi thao tác tạo đơn, cấp phát license, cập nhật vai trò và cấu hình.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Lọc theo hành động (ACTION), tài nguyên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Ghi nhận: <strong className="text-white">{filtered.length}</strong> sự kiện
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Thời điểm (UTC)</th>
                <th className="pb-3">Hành động</th>
                <th className="pb-3">Tài nguyên</th>
                <th className="pb-3">Định danh (Resource ID)</th>
                <th className="pb-3">Dữ liệu chi tiết (Metadata)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-mono text-slate-400 text-[11px]">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="py-4 font-mono font-bold text-amber-400">
                    {log.action}
                  </td>
                  <td className="py-4 font-medium text-slate-300 uppercase text-[10px]">
                    {log.resource_type}
                  </td>
                  <td className="py-4 font-mono text-slate-200">
                    {log.resource_id}
                  </td>
                  <td className="py-4 font-mono text-[11px] text-slate-400">
                    {JSON.stringify(log.metadata || {})}
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

