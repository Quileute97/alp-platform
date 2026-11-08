import React from 'react';
import { Settings, ShieldCheck, Key, RefreshCw, Cpu } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Cấu Hình Nền Tảng ALP</h1>
        <p className="text-sm text-slate-400 mt-1">
          Thiết lập thông số bảo mật Ed25519, thời gian ân hạn Grace Period và cấu hình cổng thanh toán.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Cơ Chế Ký Số Bất Đối Xứng (Ed25519)</h2>
            <p className="text-slate-400 text-[11px]">Bảo mật mọi phản hồi xác thực gửi về cTrader cBot</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Thuật toán ký số:</label>
            <input
              type="text"
              readOnly
              value="Ed25519 / HMAC-SHA256 Fallback"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Thời gian hiệu lực Cache tối đa:</label>
            <input
              type="text"
              readOnly
              value="24 Giờ (86,400 giây)"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Grace Period khi mất kết nối mạng:</label>
            <input
              type="text"
              readOnly
              value="72 Giờ (cho phép bot chạy an toàn bằng signed cache)"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Chính sách xử lý khi License hết hạn:</label>
            <input
              type="text"
              readOnly
              value="Chặn mở lệnh mới — TUYỆT ĐỐI KHÔNG đóng lệnh mở"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-semibold"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => alert('Đã lưu cấu hình an toàn hệ thống.')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-600/30"
          >
            Lưu Cấu Hình
          </button>
        </div>
      </div>
    </div>
  );
};

