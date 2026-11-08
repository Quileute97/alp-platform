import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Bot, ArrowRight, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../lib/utils';

export const SubscriptionsPage: React.FC = () => {
  const { subscriptions, products } = useData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Gói Thuê Bao Của Tôi</h1>
        <p className="text-sm text-slate-400 mt-1">
          Theo dõi chu kỳ thanh toán, ngày bắt đầu và thời hạn sử dụng các sản phẩm cTrader Algo.
        </p>
      </div>

      <div className="space-y-4">
        {subscriptions.map((sub) => {
          const lic = sub.product_plan_id;
          const isAlchemist = lic.includes('pp-1') || lic.includes('pp-2') || lic.includes('pp-3') || lic.includes('pp-4') || lic.includes('yearly');
          const prod = isAlchemist ? products[0] : products[1];

          return (
            <div
              key={sub.id}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{prod?.name || 'Gói Thuê Bao Algo'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      Mã đơn: {sub.order_id}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 uppercase">
                      {sub.status === 'active' ? 'Đang hiệu lực' : sub.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">Ngày bắt đầu</span>
                  <span className="font-mono text-slate-200">{formatDate(sub.start_at)}</span>
                </div>

                <div>
                  <span className="text-slate-400 block">Hạn sử dụng</span>
                  <span className="font-mono font-bold text-white">{formatDate(sub.expires_at)}</span>
                </div>

                <Link
                  to={`/products/${prod?.slug || 'gbpusd-alchemist-cbot'}`}
                  className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 font-semibold transition"
                >
                  Gia Hạn Gói
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

