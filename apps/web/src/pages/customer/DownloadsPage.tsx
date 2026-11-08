import React from 'react';
import {
  Download,
  Bot,
  FileCode,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const DownloadsPage: React.FC = () => {
  const { products } = useData();

  const downloadItems = [
    {
      id: 'GBPUSD_ALCHEMIST',
      name: 'Alchemist Bot GBPUSD Pro',
      version: '2.1.0',
      file_name: 'Alchemist_GBPUSD_v2.1.0.algo',
      file_size: '1.24 MB',
      updated_at: '2026-11-01',
      changelog: [
        'Tích hợp chuẩn xác thực ALP License Manager v1.0',
        'Nâng cấp bộ lọc biến động tin tức CPI/FOMC',
        'Tối ưu hóa khớp lệnh trượt giá cực thấp',
      ],
    },
    {
      id: 'EURGBP_MEAN_GRID',
      name: 'Asymmetric Mean Grid EURGBP',
      version: '1.4.2',
      file_name: 'EURGBP_Grid_v1.4.2.algo',
      file_size: '980 KB',
      updated_at: '2026-10-28',
      changelog: [
        'Sửa lỗi tính khoảng cách lưới theo ATR',
        'Tích hợp heartbeat license ALP ngầm định',
      ],
    },
    {
      id: 'ELLIOTT_WAVE_SCANNER',
      name: 'Elliott Wave Scanner & Harmonic Pro',
      version: '3.0.1',
      file_name: 'ElliottWaveScanner_v3.0.1.algo',
      file_size: '2.15 MB',
      updated_at: '2026-10-25',
      changelog: [
        'Nâng cấp thuật toán phát hiện sóng cụt và mô hình Harmonic',
        'Cảnh báo trực tiếp Telegram qua API token riêng',
      ],
    },
  ];

  const handleDownload = (fileName: string) => {
    alert(`Đang khởi tạo đường dẫn tải xuống có chữ ký (Signed URL) an toàn cho tệp: ${fileName}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Trung Tâm Tải Xuống cTrader Algo</h1>
        <p className="text-sm text-slate-400 mt-1">
          Tải về các tệp thực thi `.algo` tương thích trực tiếp với cTrader Desktop trên Windows.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300">
          <div className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Hướng dẫn cài đặt nhanh tệp .algo</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed">
            <li>Tải tệp <strong>.algo</strong> về máy tính.</li>
            <li>Nhấp đúp chuột vào tệp đã tải; cTrader sẽ tự động mở và cài đặt.</li>
            <li>Vào tab <strong>Automate</strong> trên cTrader để thấy bot xuất hiện.</li>
          </ol>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300">
          <div className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Yêu cầu quyền truy cập (Access Rights)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Để cBot có thể gửi request xác thực bản quyền đến hệ thống ALP, bạn cần cấp quyền <strong>FullAccess</strong> trong cTrader khi thêm robot vào chart.
          </p>
        </div>
      </div>

      {/* Download Items */}
      <div className="space-y-4">
        {downloadItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Phiên bản {item.version}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Dung lượng: {item.file_size}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Cập nhật: {item.updated_at}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pl-1">
                  <div className="text-xs font-semibold text-slate-300 mb-1.5">Ghi chú phát hành (Changelog):</div>
                  <ul className="space-y-1">
                    {item.changelog.map((log, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                        <span>{log}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
                <button
                  onClick={() => handleDownload(item.file_name)}
                  className="w-full lg:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Về ({item.file_name})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

