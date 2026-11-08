import React from 'react';
import { User, Shield, Key, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../lib/utils';

export const ProfilePage: React.FC = () => {
  const { user, switchRole } = useAuth();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Hồ Sơ Khách Hàng</h1>
        <p className="text-sm text-slate-400 mt-1">
          Thông tin tài khoản và phân quyền truy cập trên nền tảng ALP.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-blue-500/20">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.full_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 font-mono">{user?.email}</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-6 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Mã định danh (User ID):</span>
            <span className="font-mono text-slate-200 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 block">
              {user?.id}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Trạng thái tài khoản:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5 py-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hoạt động bình thường (Active)</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Ngày tạo tài khoản:</span>
            <span className="font-mono text-slate-200">{formatDate(user?.created_at)}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Chính sách bảo mật:</span>
            <span className="text-blue-400 font-medium">Bảo vệ qua Supabase RLS</span>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6">
          <div className="text-xs font-semibold text-slate-300 mb-2">Chuyển đổi vai trò người dùng (Thử nghiệm):</div>
          <div className="flex flex-wrap gap-2">
            {(['customer', 'support', 'admin', 'super_admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                  user?.role === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

