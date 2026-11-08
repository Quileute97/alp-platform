import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Bot,
  Check,
  Shield,
  Zap,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../lib/utils';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, createCheckoutOrder } = useData();
  const navigate = useNavigate();

  const product = products.find(p => p.slug === slug || p.id === slug);

  const plans = [
    {
      id: 'plan_monthly',
      name: 'Gói 1 Tháng',
      interval: 'Hàng tháng',
      price: product?.id === 'GBPUSD_ALCHEMIST' ? 49 : 39,
      accounts: 1,
      badge: null,
      desc: 'Phù hợp trải nghiệm và kiểm nghiệm chiến lược',
    },
    {
      id: 'plan_quarterly',
      name: 'Gói 3 Tháng (Quý)',
      interval: 'Hàng quý',
      price: product?.id === 'GBPUSD_ALCHEMIST' ? 129 : 99,
      accounts: 2,
      badge: 'Tiết kiệm 15%',
      desc: 'Hỗ trợ kích hoạt cùng lúc 2 tài khoản cTrader',
    },
    {
      id: 'plan_yearly',
      name: 'Gói 1 Năm (Khuyên Dùng)',
      interval: 'Hàng năm',
      price: product?.id === 'GBPUSD_ALCHEMIST' ? 399 : 299,
      accounts: 3,
      badge: 'Tiết kiệm 40%',
      desc: 'Lựa chọn tối ưu nhất cho nhà đầu tư chuyên nghiệp',
      popular: true,
    },
    {
      id: 'plan_lifetime',
      name: 'Gói Trọn Đời',
      interval: 'Vĩnh viễn',
      price: product?.id === 'GBPUSD_ALCHEMIST' ? 899 : 499,
      accounts: 5,
      badge: 'Sở hữu vĩnh viễn',
      desc: 'Nhận toàn bộ bản cập nhật và tối ưu thuật toán trọn đời',
    },
  ];

  const [selectedPlanId, setSelectedPlanId] = useState('plan_yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-slate-400 mb-6">Sản phẩm bạn đang tìm không tồn tại hoặc đã bị tạm ngưng.</p>
        <Link to="/products" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium">
          Quay lại danh mục
        </Link>
      </div>
    );
  }

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[2];

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      createCheckoutOrder(product.id, selectedPlan.id, selectedPlan.price);
      setIsProcessing(false);
      setSuccessModal(true);
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh mục sản phẩm</span>
      </Link>

      {/* Product Overview Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
          <Bot className="w-10 h-10" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20 uppercase">
              {product.product_type}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              Phiên bản {product.version}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              cTrader Automate Desktop
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {product.name}
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 pt-4 text-xs">
            <div>
              <span className="text-slate-400 block">Nền tảng</span>
              <span className="text-white font-semibold">cTrader 5.x</span>
            </div>
            <div>
              <span className="text-slate-400 block">Cặp giao dịch</span>
              <span className="text-white font-semibold">{product.supported_symbols?.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Xác thực License</span>
              <span className="text-emerald-400 font-semibold">Ed25519 Signed</span>
            </div>
            <div>
              <span className="text-slate-400 block">Bảo vệ vị thế</span>
              <span className="text-blue-400 font-semibold">Giữ lệnh mở an toàn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plan Selector */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white">Lựa Chọn Gói Thuê Bao</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mọi gói thuê bao đều bao gồm bản quyền kích hoạt chính thức và quyền truy cập bản cập nhật.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/20'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-white text-base mb-1">{plan.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-4">{plan.desc}</p>
                </div>

                <div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-extrabold text-white">${plan.price}</span>
                    <span className="text-xs text-slate-400">/{plan.interval}</span>
                  </div>

                  <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mb-4">
                    <Check className="w-3.5 h-3.5" />
                    <span>Tối đa {plan.accounts} tài khoản cTrader</span>
                  </div>

                  <button
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isSelected ? 'Đang chọn gói này' : 'Chọn gói'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-xs text-slate-400">Bạn đang đặt mua bản quyền:</div>
          <div className="text-lg font-bold text-white">
            {product.name} — <span className="text-blue-400">{selectedPlan.name}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Được liên kết tối đa <strong className="text-slate-200">{selectedPlan.accounts} tài khoản giao dịch</strong> cTrader. Tự động kích hoạt license ngay sau khi hoàn tất.
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Tổng thanh toán:</span>
            <span className="text-2xl font-extrabold text-white">${selectedPlan.price}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="flex-1 sm:flex-initial px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isProcessing ? 'Đang kích hoạt...' : 'Thanh Toán & Nhận License'}</span>
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Đăng Ký Thuê Bao Thành Công!</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Hệ thống ALP đã xác nhận thanh toán, khởi tạo gói thuê bao và cấp mã License kích hoạt mới cho sản phẩm <strong>{product.name}</strong>.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/licenses')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30"
              >
                Xem Mã License Của Tôi
              </button>
              <button
                onClick={() => navigate('/downloads')}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Tải Xuống Tệp .algo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

