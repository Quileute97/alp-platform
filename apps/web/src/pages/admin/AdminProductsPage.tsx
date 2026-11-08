import React, { useState } from 'react';
import { Bot, Plus, Edit3, Archive, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Product, ProductType } from '@alp/shared-types';

export const AdminProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [productType, setProductType] = useState<ProductType>('cbot');
  const [version, setVersion] = useState('1.0.0');
  const [symbols, setSymbols] = useState('GBPUSD, EURUSD');
  const [features, setFeatures] = useState('Trailing stop tự động, Khớp lệnh nhanh');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    addProduct({
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      description: description.trim(),
      product_type: productType,
      platform: 'ctrader',
      version: version.trim(),
      status: 'active',
      supported_symbols: symbols.split(',').map(s => s.trim()).filter(Boolean),
      features: features.split(',').map(s => s.trim()).filter(Boolean),
      download_file_path: `/downloads/cbots/${slug.trim()}_v${version.trim()}.algo`,
    });

    setName('');
    setSlug('');
    setDescription('');
    setModalOpen(false);
  };

  const handleToggleStatus = (prod: Product) => {
    const nextStatus = prod.status === 'active' ? 'archived' : 'active';
    updateProduct(prod.id, { status: nextStatus });
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quản Lý Sản Phẩm Algo</h1>
          <p className="text-sm text-slate-400 mt-1">
            Thêm mới, sửa đổi thông số chiến lược và quản lý phiên bản cBot / Indicator trên hệ thống.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, mã code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <span className="text-xs text-slate-400">
            Tổng cộng: <strong className="text-white">{filtered.length}</strong> sản phẩm
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Sản phẩm</th>
                <th className="pb-3">Mã Code (ID)</th>
                <th className="pb-3">Loại</th>
                <th className="pb-3">Phiên bản</th>
                <th className="pb-3">Cặp tiền hỗ trợ</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span>{prod.name}</span>
                  </td>
                  <td className="py-4 font-mono text-slate-300">{prod.id}</td>
                  <td className="py-4 uppercase font-semibold text-blue-400">{prod.product_type}</td>
                  <td className="py-4 font-mono text-slate-300">v{prod.version}</td>
                  <td className="py-4 text-slate-300">{prod.supported_symbols?.join(', ') || 'Tất cả'}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      prod.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {prod.status === 'active' ? 'Hoạt Động' : 'Lưu Trữ'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(prod)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      {prod.status === 'active' ? 'Tạm ẩn' : 'Kích hoạt'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">Thêm Sản Phẩm Algo cTrader Mới</h3>
            <p className="text-xs text-slate-400 mb-6">
              Khai báo thông tin cBot hoặc Indicator để đưa vào danh mục và cấu hình gói license.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Tên sản phẩm:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: XAUUSD Scalper Gold Pro"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                  }}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Slug URL:</label>
                  <input
                    type="text"
                    placeholder="xauusd-scalper-pro"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Phiên bản ban đầu:</label>
                  <input
                    type="text"
                    placeholder="1.0.0"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Loại sản phẩm:</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as ProductType)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="cbot">cBot (Robot giao dịch tự động)</option>
                  <option value="indicator">Indicator (Chỉ báo phân tích kỹ thuật)</option>
                  <option value="bundle">Bundle (Gói combo đa sản phẩm)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Mô tả chiến lược:</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả tóm tắt nguyên lý vào lệnh, kiểm soát rủi ro..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Cặp tiền tối ưu (cách nhau dấu phẩy):</label>
                <input
                  type="text"
                  placeholder="XAUUSD, GBPUSD"
                  value={symbols}
                  onChange={(e) => setSymbols(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Tính năng nổi bật (cách nhau dấu phẩy):</label>
                <input
                  type="text"
                  placeholder="Quản trị vốn tự động, Không trượt giá"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

