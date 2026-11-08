import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '@alp/shared-types';

interface AuthContextType {
  user: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEFAULT_USER: Profile = {
  id: 'usr-customer-1',
  email: 'trader.pro@vietnamalgo.vn',
  full_name: 'Nguyễn Minh Đạt',
  role: 'customer',
  status: 'active',
  created_at: '2026-10-01T08:00:00Z',
  updated_at: '2026-11-08T10:00:00Z',
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('alp_current_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('alp_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('alp_current_user');
    }
  }, [user]);

  const login = (email: string, role: UserRole = 'customer') => {
    const name = email.split('@')[0];
    const newUser: Profile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: name.charAt(0).toUpperCase() + name.slice(1),
      role,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updated: Profile = { ...user, role };
    setUser(updated);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isStaff = isAdmin || user?.role === 'support';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isStaff,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

