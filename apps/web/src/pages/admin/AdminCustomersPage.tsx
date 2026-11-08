import React, { useState } from 'react';
import { Users, Search, Shield, CheckCircle2, UserX, AlertTriangle, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Profile, UserRole, UserStatus } from '@alp/shared-types';
import { formatDate } from '../../lib/utils';

export const AdminCustomersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { subscriptions, licenses, orders, accounts } = useData();

  // Mock customers list
  const [customers, setCustomers] = useState<Profile[]>([
    {
      id: 'usr-customer-1',
      email: 'trader.pro@vietnamalgo.vn',
      full_name: 'Nguyễn Minh Đạt',
      role: 'customer',
      status: 'active',
      created_at: '2026-10-01T08:00:00Z',
      updated_at: '2026-11-08T10:00:00Z',
    },
    {
      id: 'usr-customer-2',
      email: 'hoang.fx@gmail.com',
      full_name: 'Trần Huy Hoàng',
      role: 'customer',
      status: 'active',
      created_at: '2026-10-12T09:30:00Z',
      updated_at: '2026-10-12T09:30:00Z',
    },
    {
      id: 'usr-customer-3',
      email: 'quant.lead@hft.sg',
      full_name: 'Lê Quốc Thắng',
      role: 'support',
      status: 'active',
      created_at: '2026-09-20T14:15:00Z',
      updated_at: '2026-11-01T11:00:00Z',
    },
    {
      id: 'usr-admin-1',
      email: 'admin@vietnamalgo.vn',
      full_name: 'Quản Trị Viên Trưởng',
      role: 'super_admin',
      status: 'active',
      created_at: '2026-08-01T00:00:00Z',
      updated_at: '2026-11-08T00:00:00Z',
    }
  ]);

  const [search, setSearch] = useState('');

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setCustomers(prev => prev.map(c => c.id === userId ? { ...c, role: newRole } : c));
  };

  const handleToggleStatus = (userId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === userId) {
        const next: UserStatus = c.status === 'active' ? 'suspended' : 'active';
        return { ...c, status: next };
      }
      return c;
    }));
  };

  const filtered = customers.filter(c =>
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Quản Lý Khách Hàng & Phân Quyền</h1>
        <p className="text-sm text-slate-400 mt-1">
          Quản lý tài khoản người dùng, vai trò (Roles) và quyền truy cập vào nền tảng ALP.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Tổng cộng: <strong className="text-white">{filtered.length}</strong> người dùng
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Khách hàng</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Vai trò (Role)</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3">Ngày tham gia</th>
                <th className="pb-3 text-right">Quản trị vai trò</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      {cust.full_name.charAt(0)}
                    </div>
                    <span>{cust.full_name}</span>
                  </td>
                  <td className="py-4 font-mono text-slate-300">{cust.email}</td>
                  <td className="py-4">
                    <select
                      value={cust.role}
                      onChange={(e) => handleChangeRole(cust.id, e.target.value as UserRole)}
                      className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-blue-400 focus:outline-none focus:border-blue-500"
                    >
                      <option value="customer">customer</option>
                      <option value="support">support</option>
                      <option value="admin">admin</option>
                      <option value="super_admin">super_admin</option>
                    </select>
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      cust.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {cust.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400 font-mono">
                    {formatDate(cust.created_at)}
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(cust.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        cust.status === 'active'
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {cust.status === 'active' ? 'Khóa truy cập' : 'Mở khóa'}
                    </button>
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

