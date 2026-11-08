import React from 'react';
import { HelpCircle, MessageSquare, Mail, Phone, ExternalLink } from 'lucide-react';

export const SupportPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Trung Tâm Hỗ Trợ Kỹ Thuật</h1>
        <p className="text-sm text-slate-400 mt-1">
          Hỗ trợ cài đặt cBot, khắc phục sự cố license và tư vấn cấu hình tham số giao dịch cTrader.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">Telegram Trực Tuyến</h3>
          <p className="text-xs text-slate-400 mb-4">Kênh trao đổi tín hiệu và hỗ trợ 24/7</p>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            <span>Nhắn tin @ALP_Support</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">Email Kỹ Thuật</h3>
          <p className="text-xs text-slate-400 mb-4">Phản hồi yêu cầu trong vòng 2 giờ</p>
          <a
            href="mailto:support@vietnamalgo.vn"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition"
          >
            <span>support@vietnamalgo.vn</span>
          </a>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base mb-1">Tài Liệu API & cBot</h3>
          <p className="text-xs text-slate-400 mb-4">Xem cấu trúc tích hợp AlpLicenseManager</p>
          <button
            onClick={() => alert('Xem tài liệu chi tiết tại thư mục docs/CTRADER_INTEGRATION.md')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition"
          >
            <span>Đọc Hướng Dẫn</span>
          </button>
        </div>
      </div>
    </div>
  );
};

