import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Layers, ArrowRight, CheckCircle, Search, Filter } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../lib/utils';

export const ProductsPage: React.FC = () => {
  const { products } = useData();
  const [filterType, setFilterType] = useState<'all' | 'cbot' | 'indicator'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = products.filter(p => {
    const matchesType = filterType === 'all' || p.product_type === filterType;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.supported_symbols?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Kho Sản Phẩm Algo cTrader</h1>
        <p className="text-sm text-slate-400 mt-1">
          Lựa chọn các giải pháp tự động hóa giao dịch cBot và Indicator chất lượng cao dành cho cTrader Desktop.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Tất cả ({products.length})
          </button>
          <button
            onClick={() => setFilterType('cbot')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterType === 'cbot'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            cBot Tự Động
          </button>
          <button
            onClick={() => setFilterType('indicator')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filterType === 'indicator'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Chỉ Báo (Indicator)
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, cặp tiền..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-white">{prod.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        v{prod.version}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 uppercase font-semibold">
                        {prod.product_type}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        cTrader Automate
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-4 leading-relaxed line-clamp-3">
                {prod.description}
              </p>

              {/* Supported Symbols */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 mb-1.5 font-medium">Cặp giao dịch tối ưu:</div>
                <div className="flex flex-wrap gap-1.5">
                  {prod.supported_symbols?.map((sym) => (
                    <span
                      key={sym}
                      className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-200 text-xs font-mono"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-1.5 mb-6">
                {prod.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Gói thuê bao</span>
                <div className="text-base font-bold text-white">Tháng / Quý / Năm / Trọn Đời</div>
              </div>
              <Link
                to={`/products/${prod.slug}`}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
              >
                <span>Xem Bảng Giá & Mua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

