import React from 'react';
import { GitBranch, Plus, FileCode, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const AdminVersionsPage: React.FC = () => {
  const versions = [
    {
      id: 'ver-1',
      product_id: 'GBPUSD_ALCHEMIST',
      version: '2.1.0',
      min_supported: '5.0.0',
      status: 'active',
      download_path: '/downloads/cbots/Alchemist_GBPUSD_v2.1.0.algo',
      release_date: '2026-11-01',
      notes: 'Tích hợp ALP License Manager v1.0, lọc tin tức CPI',
    },
    {
      id: 'ver-2',
      product_id: 'EURGBP_MEAN_GRID',
      version: '1.4.2',
      min_supported: '5.0.0',
      status: 'active',
      download_path: '/downloads/cbots/EURGBP_Grid_v1.4.2.algo',
      release_date: '2026-10-28',
      notes: 'Tính bước lưới theo ATR thích ứng, heartbeat license',
    },
    {
      id: 'ver-3',
      product_id: 'ELLIOTT_WAVE_SCANNER',
      version: '3.0.1',
      min_supported: '5.0.0',
      status: 'active',
      download_path: '/downloads/indicators/ElliottWaveScanner_v3.0.1.algo',
      release_date: '2026-10-25',
      notes: 'Nhận diện sóng cụt và Harmonic, cảnh báo Telegram',
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quản Lý Phiên Bản Algo (Releases)</h1>
        <p className="text-sm text-slate-400 mt-1">
          Theo dõi các bản build `.algo`, release notes và phiên bản cTrader tối thiểu được hỗ trợ.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Sản Phẩm</th>
                <th className="pb-3">Phiên Bản</th>
                <th className="pb-3">cTrader Tối Thiểu</th>
                <th className="pb-3">Tệp Binary</th>
                <th className="pb-3">Ghi Chú Phát Hành</th>
                <th className="pb-3">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {versions.map((ver) => (
                <tr key={ver.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-bold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span>{ver.product_id}</span>
                  </td>
                  <td className="py-4 font-mono font-bold text-slate-200">v{ver.version}</td>
                  <td className="py-4 font-mono text-slate-300">cTrader &gt;= {ver.min_supported}</td>
                  <td className="py-4 font-mono text-xs text-blue-400">{ver.download_path}</td>
                  <td className="py-4 text-slate-300 max-w-xs">{ver.notes}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {ver.status}
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

