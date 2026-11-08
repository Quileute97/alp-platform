import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Zap,
  ShieldCheck,
  TrendingUp,
  Award,
  Lock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../lib/utils';

export const HomePage: React.FC = () => {
  const { products } = useData();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-900/60 to-slate-950 border border-blue-900/30 p-8 sm:p-12 lg:p-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>Hệ Thống Cấp Phép & Phân Phối cTrader Algo Độc Lập</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Tối Ưu Hóa Giao Dịch Tự Động với <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">ALP Platform</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Nền tảng thương mại hóa cBot và Indicator cTrader tiên phong. Xác thực bản quyền tốc độ cao qua mật mã Ed25519, bảo vệ vị thế giao dịch tuyệt đối khi hết hạn thuê bao.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/products"
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <span>Khám Phá Kho Algo cTrader</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition border border-slate-700/60"
          >
            Bảng Điều Khiển Của Tôi
          </Link>
        </div>

        {/* Highlight Metrics */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80 pt-8">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">4+</div>
            <div className="text-xs text-slate-400 mt-1">Sản phẩm cBot & Indicator</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">&lt; 50ms</div>
            <div className="text-xs text-slate-400 mt-1">Độ trễ xác thực License</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">100%</div>
            <div className="text-xs text-slate-400 mt-1">Bảo toàn lệnh khi hết hạn</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">Ed25519</div>
            <div className="text-xs text-slate-400 mt-1">Ký số bất đối xứng</div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Sản Phẩm Algo Tiêu Biểu</h2>
            <p className="text-sm text-slate-400 mt-1">
              Được kiểm nghiệm thực tế qua hàng nghìn giờ backtest và giao dịch live trên cTrader Desktop.
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Xem tất cả sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          v{product.version}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 uppercase font-semibold">
                          {product.product_type}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                          cTrader 5.x
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {product.description}
                </p>

                <div className="space-y-1.5 mb-6">
                  {product.features?.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Giá chỉ từ</span>
                  <div className="text-lg font-extrabold text-white">
                    {product.id === 'GBPUSD_ALCHEMIST' ? '$49 / tháng' : '$39 / tháng'}
                  </div>
                </div>
                <Link
                  to={`/products/${product.slug}`}
                  className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-semibold transition"
                >
                  Chi Tiết & Mua Bản Quyền
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Advantages */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Tại Sao Chọn ALP?</h2>
          <p className="text-sm text-slate-400 mt-2">
            Được xây dựng bởi các chuyên gia Algo cTrader, thấu hiểu quy trình vận hành và rủi ro quản trị vốn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Bảo Vệ Vị Thế Giao Dịch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khi license hết hạn, cBot chỉ dừng mở lệnh mới. Hệ thống tuyệt đối không bao giờ tự đóng cưỡng bức các lệnh đang mở, bảo toàn tài khoản khỏi trượt giá và spread đột biến.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Xác Thực Bất Đối Xứng Ed25519</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Máy chủ ALP ký số vào từng phản hồi hợp lệ. cBot giải mã và xác minh tính toàn vẹn cục bộ, ngăn chặn triệt để hành vi giả mạo DNS hoặc proxy license cục bộ.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Grace Period & Offline Cache</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nếu kết nối Internet tạm thời gián đoạn hoặc API bảo trì định kỳ, cBot vẫn vận hành an toàn nhờ bộ nhớ đệm có chữ ký trong khoảng thời gian ân hạn đã cấu hình.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

