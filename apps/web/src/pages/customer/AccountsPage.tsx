import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  Shield,
  Bot,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';

export const AccountsPage: React.FC = () => {
  const { accounts, addTradingAccount, licenses, products } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [broker, setBroker] = useState('IC Markets Global');
  const [accountNumber, setAccountNumber] = useState('');
  const [environment, setEnvironment] = useState<'live' | 'demo'>('live');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) return;

    addTradingAccount({
      broker,
      account_number: accountNumber.trim(),
      environment,
    });

    setAccountNumber('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Tài Khoản Giao Dịch cTrader</h1>
          <p className="text-sm text-slate-400 mt-1">
            Đăng ký và xác minh số tài khoản cTrader của bạn để liên kết bản quyền cBot.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Tài Khoản cTrader</span>
        </button>
      </div>

      {/* Note about cTrader account identity */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5">Quy tắc định danh tài khoản độc lập</strong>
          Để đảm bảo tính bảo mật và duy nhất, hệ thống ALP xác thực tài khoản dựa trên tổ hợp: <strong>Sàn giao dịch (Broker) + Số tài khoản + Môi trường (Live / Demo)</strong>.
        </div>
      </div>

      {/* Accounts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => {
          const linkedLicenses = licenses.filter(l => l.trading_account_id === acc.id);

          return (
            <div
              key={acc.id}
              className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{acc.broker}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs font-bold text-slate-200">
                          #{acc.account_number}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          acc.environment === 'live'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {acc.environment}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đã xác minh</span>
                  </span>
                </div>

                <div className="border-t border-slate-800/80 pt-4 mt-2">
                  <div className="text-xs text-slate-400 mb-2 font-medium">
                    Sản phẩm Algo đang chạy trên tài khoản này ({linkedLicenses.length}):
                  </div>
                  {linkedLicenses.length > 0 ? (
                    <div className="space-y-1.5">
                      {linkedLicenses.map(lic => {
                        const prod = products.find(p => p.id === lic.product_id);
                        return (
                          <div
                            key={lic.id}
                            className="flex items-center justify-between text-xs bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-2"
                          >
                            <span className="font-medium text-slate-200">{prod?.name || lic.product_id}</span>
                            <span className="text-[10px] text-emerald-400 font-mono font-semibold">Active</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic py-2">Chưa gán license nào cho tài khoản này.</div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Ngày đăng ký: {formatDate(acc.created_at)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-1">Đăng Ký Tài Khoản cTrader Mới</h3>
            <p className="text-xs text-slate-400 mb-6">
              Nhập chính xác số tài khoản cTrader hiển thị ở góc trên bên trái màn hình cTrader Desktop của bạn.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Sàn giao dịch (Broker):</label>
                <select
                  value={broker}
                  onChange={(e) => setBroker(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="IC Markets Global">IC Markets Global</option>
                  <option value="Pepperstone">Pepperstone</option>
                  <option value="FxPro">FxPro</option>
                  <option value="Spotware Beta">Spotware Beta / cTrader Demo</option>
                  <option value="Khác (Other Broker)">Khác (Other Broker)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Số tài khoản cTrader:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 1288590"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Môi trường (Environment):</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                      environment === 'live'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="env"
                      value="live"
                      checked={environment === 'live'}
                      onChange={() => setEnvironment('live')}
                      className="sr-only"
                    />
                    <span>Live (Tài khoản thật)</span>
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                      environment === 'demo'
                        ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="env"
                      value="demo"
                      checked={environment === 'demo'}
                      onChange={() => setEnvironment('demo')}
                      className="sr-only"
                    />
                    <span>Demo (Thử nghiệm)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-lg shadow-blue-600/30"
                >
                  Lưu Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

