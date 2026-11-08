import React, { useState } from 'react';
import {
  Key,
  Search,
  ShieldAlert,
  Play,
  Pause,
  XOctagon,
  Calendar,
  RefreshCw,
  Bot,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';
import { License } from '@alp/shared-types';

export const AdminLicensesPage: React.FC = () => {
  const { licenses, products, accounts, updateLicenseStatus, extendLicense, rebindLicenseAccount } = useData();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Extend modal
  const [extendModalLic, setExtendModalLic] = useState<License | null>(null);
  const [extendDays, setExtendDays] = useState(30);

  // Rebind modal
  const [rebindModalLic, setRebindModalLic] = useState<License | null>(null);
  const [targetAccountId, setTargetAccountId] = useState('');

  const filtered = licenses.filter(l => {
    const acc = accounts.find(a => a.id === l.trading_account_id);
    const prod = products.find(p => p.id === l.product_id);

    const matchesStatus = selectedStatus === 'all' || l.status === selectedStatus;
    const matchesSearch =
      (l.license_key_prefix || '').toLowerCase().includes(search.toLowerCase()) ||
      l.product_id.toLowerCase().includes(search.toLowerCase()) ||
      (acc && acc.account_number.includes(search)) ||
      (prod && prod.name.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const handleConfirmExtend = () => {
    if (!extendModalLic) return;
    extendLicense(extendModalLic.id, extendDays);
    setExtendModalLic(null);
  };

  const handleConfirmRebind = () => {
    if (!rebindModalLic || !targetAccountId) return;
    rebindLicenseAccount(rebindModalLic.id, targetAccountId);
    setRebindModalLic(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quản Trị Bản Quyền (License Engine)</h1>
        <p className="text-sm text-slate-400 mt-1">
          Tra cứu, kích hoạt, tạm ngưng, thu hồi, gia hạn và chuyển đổi tài khoản cTrader của toàn bộ license.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Tất cả ({licenses.length})
          </button>
          <button
            onClick={() => setSelectedStatus('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedStatus === 'active' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Hoạt động ({licenses.filter(l => l.status === 'active').length})
          </button>
          <button
            onClick={() => setSelectedStatus('suspended')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedStatus === 'suspended' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Tạm ngưng ({licenses.filter(l => l.status === 'suspended').length})
          </button>
          <button
            onClick={() => setSelectedStatus('revoked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedStatus === 'revoked' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Thu hồi ({licenses.filter(l => l.status === 'revoked').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo prefix, số tài khoản cTrader..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Licenses Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">License Prefix</th>
                <th className="pb-3">Sản phẩm</th>
                <th className="pb-3">Tài khoản cTrader</th>
                <th className="pb-3">Ngày hết hạn</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3 text-right">Thao tác Quản trị</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((lic) => {
                const prod = products.find(p => p.id === lic.product_id);
                const acc = accounts.find(a => a.id === lic.trading_account_id);

                return (
                  <tr key={lic.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-4 font-mono font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      <span>{lic.license_key_prefix}-****-****</span>
                    </td>
                    <td className="py-4 font-semibold text-slate-200">
                      {prod?.name || lic.product_id}
                    </td>
                    <td className="py-4 font-mono text-slate-300">
                      {acc ? `${acc.broker} (#${acc.account_number})` : <span className="text-amber-400">Chưa gán</span>}
                    </td>
                    <td className="py-4 font-mono text-slate-300">
                      {formatDate(lic.expires_at)}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        lic.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : lic.status === 'suspended'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {lic.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {lic.status === 'active' ? (
                          <button
                            onClick={() => updateLicenseStatus(lic.id, 'suspended', 'Admin suspended')}
                            title="Tạm ngưng (Suspend)"
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateLicenseStatus(lic.id, 'active', 'Admin activated')}
                            title="Kích hoạt lại (Activate)"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setExtendModalLic(lic);
                            setExtendDays(30);
                          }}
                          title="Gia hạn thời gian (Extend)"
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setRebindModalLic(lic);
                            setTargetAccountId(lic.trading_account_id || (accounts[0]?.id || ''));
                          }}
                          title="Đổi tài khoản (Rebind)"
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        {lic.status !== 'revoked' && (
                          <button
                            onClick={() => {
                              if (confirm('Bạn có chắc muốn THU HỒI vĩnh viễn license này?')) {
                                updateLicenseStatus(lic.id, 'revoked', 'Admin revoked license');
                              }
                            }}
                            title="Thu hồi bản quyền (Revoke)"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                          >
                            <XOctagon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extend Modal */}
      {extendModalLic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-1">Gia Hạn Bản Quyền License</h3>
            <p className="text-xs text-slate-400 mb-6">
              Mã License: <span className="font-mono text-white font-bold">{extendModalLic.license_key_prefix}-****</span>
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Số ngày gia hạn thêm:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[30, 90, 365].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setExtendDays(d)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        extendDays === d
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      +{d} ngày
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setExtendModalLic(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmExtend}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30"
              >
                Cập Nhật Hạn Mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rebind Modal */}
      {rebindModalLic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-1">Quản Trị Rebind Tài Khoản cTrader</h3>
            <p className="text-xs text-slate-400 mb-6">
              Đổi tài khoản cTrader liên kết cho license này (Ghi log vào audit_logs).
            </p>

            <div className="space-y-3 mb-6">
              <label className="text-xs font-semibold text-slate-300 block">Tài khoản đích:</label>
              <select
                value={targetAccountId}
                onChange={(e) => setTargetAccountId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.broker} — Số TK: {acc.account_number} ({acc.environment})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setRebindModalLic(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmRebind}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30"
              >
                Xác Nhận Rebind
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
