import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Bot,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';
import { License } from '@alp/shared-types';

export const LicensesPage: React.FC = () => {
  const { licenses, products, accounts, rebindLicenseAccount } = useData();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [rebindModalLicense, setRebindModalLicense] = useState<License | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenRebind = (lic: License) => {
    setRebindModalLicense(lic);
    setSelectedAccountId(lic.trading_account_id || (accounts[0]?.id || ''));
  };

  const handleSaveRebind = () => {
    if (!rebindModalLicense || !selectedAccountId) return;
    rebindLicenseAccount(rebindModalLicense.id, selectedAccountId);
    setRebindModalLicense(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">License Của Tôi</h1>
        <p className="text-sm text-slate-400 mt-1">
          Quản lý bản quyền kích hoạt cho từng sản phẩm cBot và Indicator trên tài khoản cTrader của bạn.
        </p>
      </div>

      {/* Guide Callout */}
      <div className="bg-blue-950/30 border border-blue-800/40 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
          <Key className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white text-sm">Cách kích hoạt License trên cTrader Desktop</div>
          <p className="leading-relaxed">
            1. Mở phần mềm <strong>cTrader Desktop</strong> &gt; chuyển đến tab <strong>Automate</strong>.
          </p>
          <p className="leading-relaxed">
            2. Thêm cBot vào đồ thị và mở cửa sổ cấu hình <strong>Parameters</strong>.
          </p>
          <p className="leading-relaxed">
            3. Dán mã License của bạn vào ô <strong>"ALP License Key"</strong> và nhấn <strong>Apply</strong>. cBot sẽ tự động kết nối máy chủ ALP và kích hoạt giao dịch.
          </p>
        </div>
      </div>

      {/* Licenses List */}
      <div className="space-y-4">
        {licenses.map((lic) => {
          const prod = products.find(p => p.id === lic.product_id);
          const acc = accounts.find(a => a.id === lic.trading_account_id);
          const displayKey = `${lic.license_key_prefix}-88X9-4K21-99AF`;

          return (
            <div
              key={lic.id}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{prod?.name || lic.product_id}</h3>
                      <span className="text-[11px] text-slate-400">Định danh sản phẩm: {lic.product_id}</span>
                    </div>
                  </div>

                  {/* License Key Box */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 font-mono text-sm text-blue-300 font-bold tracking-wider flex items-center gap-3">
                      <span>{displayKey}</span>
                      <button
                        onClick={() => handleCopy(lic.id, displayKey)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                        title="Sao chép License Key"
                      >
                        {copiedId === lic.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      lic.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {lic.status === 'active' ? 'Đang kích hoạt' : lic.status}
                    </span>
                  </div>
                </div>

                {/* Right side info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                  <div className="text-xs space-y-1">
                    <div className="text-slate-400">Tài khoản cTrader liên kết:</div>
                    {acc ? (
                      <div className="font-semibold text-slate-200 font-mono">
                        {acc.broker} — #{acc.account_number} ({acc.environment})
                      </div>
                    ) : (
                      <div className="text-amber-400 font-medium">Chưa liên kết tài khoản</div>
                    )}
                    <div className="text-slate-400 pt-1">
                      Ngày hết hạn: <strong className="text-white font-mono">{formatDate(lic.expires_at)}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenRebind(lic)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700/60 flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Đổi tài khoản cTrader</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rebind Modal */}
      {rebindModalLicense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-1">Đổi Tài Khoản cTrader Cho License</h3>
            <p className="text-xs text-slate-400 mb-6">
              Chọn tài khoản cTrader bạn muốn ủy quyền chạy bot này. Lưu ý cBot trên tài khoản cũ sẽ ngưng nhận tín hiệu giao dịch mới.
            </p>

            <div className="space-y-3 mb-6">
              <label className="text-xs font-medium text-slate-300 block">Chọn tài khoản cTrader:</label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
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
                onClick={() => setRebindModalLicense(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveRebind}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-lg shadow-blue-600/30"
              >
                Xác Nhận Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

