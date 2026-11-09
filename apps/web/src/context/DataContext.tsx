import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductPlan,
  Order,
  Subscription,
  TradingAccount,
  License,
  AuditLog,
  UserRole,
} from '@alp/shared-types';

interface DataContextType {
  products: Product[];
  orders: Order[];
  subscriptions: Subscription[];
  accounts: TradingAccount[];
  licenses: License[];
  auditLogs: AuditLog[];
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addTradingAccount: (account: { broker: string; account_number: string; environment: 'demo' | 'live' }) => void;
  updateLicenseStatus: (id: string, status: License['status'], note?: string) => void;
  extendLicense: (id: string, days: number) => void;
  rebindLicenseAccount: (id: string, newAccountId: string) => void;
  createCheckoutOrder: (productId: string, planId: string, amount: number) => Order;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'GBPUSD_ALCHEMIST',
    slug: 'gbpusd-alchemist-cbot',
    name: 'Alchemist Bot GBPUSD Pro',
    description: 'cBot tự động giao dịch scalping chuyên sâu trên cặp GBPUSD, kết hợp kiểm soát Drawdown thích ứng và tối ưu hóa phiên London Breakout.',
    product_type: 'cbot',
    platform: 'ctrader',
    version: '2.1.0',
    status: 'active',
    features: [
      'Chiến lược London Breakout thích ứng tự động',
      'Kiểm soát rủi ro đa tầng Dynamic Trailing Stop',
      'Bộ lọc biến động chống giãn spread tin tức CPI / NFP',
      'Tương thích cTrader Automate Desktop 5.x',
      'Định tuyến lệnh trượt giá cực thấp'
    ],
    supported_symbols: ['GBPUSD'],
    image_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-11-08T10:00:00Z',
  },
  {
    id: 'EURGBP_MEAN_GRID',
    slug: 'eurgbp-asymmetric-grid',
    name: 'Asymmetric Mean Grid EURGBP',
    description: 'cBot lưới phi đối xứng tái cân bằng vị thế, khai thác triệt để đặc tính hồi quy sideway biên độ hẹp của cặp tiền EURGBP và EURCHF.',
    product_type: 'cbot',
    platform: 'ctrader',
    version: '1.4.2',
    status: 'active',
    features: [
      'Lưới bước giá thích ứng theo độ biến động ATR',
      'Bảo vệ tài khoản Equity Protection tự ngắt khi chạm ngưỡng',
      'Tái cân bằng khối lượng tự động triệt tiêu rủi ro một chiều',
      'Tối ưu hóa lãi suất swap âm qua đêm'
    ],
    supported_symbols: ['EURGBP', 'EURCHF'],
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    created_at: '2026-10-15T08:00:00Z',
    updated_at: '2026-11-08T10:00:00Z',
  },
  {
    id: 'ELLIOTT_WAVE_SCANNER',
    slug: 'elliott-wave-scanner-indicator',
    name: 'Elliott Wave Scanner & Harmonic Pro',
    description: 'Chỉ báo tự động nhận diện mẫu hình sóng Elliott (1-2-3-4-5, A-B-C) và mô hình Harmonic theo thời gian thực trên cTrader.',
    product_type: 'indicator',
    platform: 'ctrader',
    version: '3.0.1',
    status: 'active',
    features: [
      'Quét đa khung thời gian từ M5 đến Daily',
      'Phát hiện mô hình Gartley, Bat, Butterfly chuẩn xác',
      'Bắn tín hiệu trực tiếp về Telegram cá nhân',
      'Không vẽ lại nến (Non-repaint)'
    ],
    supported_symbols: ['Mọi cặp Forex', 'XAUUSD', 'BTCUSD', 'US500'],
    image_url: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&auto=format&fit=crop&q=80',
    created_at: '2026-10-20T08:00:00Z',
    updated_at: '2026-11-08T10:00:00Z',
  },
  {
    id: 'SMC_ICT_STRUCTURE',
    slug: 'smart-money-concepts-smc-ict',
    name: 'Smart Money Concepts (SMC & ICT)',
    description: 'Bộ chỉ báo quét thanh khoản Liquidity Sweep, Order Block (OB), Fair Value Gap (FVG) và Break of Structure (BOS) chuyên nghiệp.',
    product_type: 'indicator',
    platform: 'ctrader',
    version: '2.0.0',
    status: 'active',
    features: [
      'Tự động xác định cấu trúc Swing High/Low',
      'Vẽ khối lệnh Order Block hợp lệ theo thuật toán liên ngân hàng',
      'Đánh dấu vùng mất cân bằng thanh khoản Fair Value Gap (FVG)',
      'Phát hiện điểm thay đổi xu hướng CHoCH và tiếp diễn BOS'
    ],
    supported_symbols: ['Forex Major', 'XAUUSD', 'Chỉ số'],
    image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    created_at: '2026-10-25T08:00:00Z',
    updated_at: '2026-11-08T10:00:00Z',
  }
];

const INITIAL_ACCOUNTS: TradingAccount[] = [
  {
    id: 'acc-1',
    user_id: 'usr-customer-1',
    broker: 'IC Markets Global',
    account_number: '1288590',
    environment: 'live',
    verification_status: 'verified',
    verified_at: '2026-11-01T08:00:00Z',
    created_at: '2026-11-01T08:00:00Z',
  },
  {
    id: 'acc-2',
    user_id: 'usr-customer-1',
    broker: 'Pepperstone',
    account_number: '8839210',
    environment: 'demo',
    verification_status: 'verified',
    verified_at: '2026-11-03T10:00:00Z',
    created_at: '2026-11-03T10:00:00Z',
  }
];

const INITIAL_LICENSES: License[] = [
  {
    id: 'lic-101',
    subscription_id: 'sub-201',
    product_id: 'GBPUSD_ALCHEMIST',
    trading_account_id: 'acc-1',
    license_key_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    license_key_prefix: 'ALG-8899',
    status: 'active',
    issued_at: '2026-11-01T08:00:00Z',
    expires_at: '2027-11-01T08:00:00Z',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z',
  },
  {
    id: 'lic-102',
    subscription_id: 'sub-202',
    product_id: 'EURGBP_MEAN_GRID',
    trading_account_id: 'acc-2',
    license_key_hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    license_key_prefix: 'ALG-3421',
    status: 'active',
    issued_at: '2026-11-03T10:00:00Z',
    expires_at: '2026-12-03T10:00:00Z',
    created_at: '2026-11-03T10:00:00Z',
    updated_at: '2026-11-03T10:00:00Z',
  }
];

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-201',
    user_id: 'usr-customer-1',
    order_id: 'ord-301',
    product_plan_id: 'pp-3',
    status: 'active',
    start_at: '2026-11-01T08:00:00Z',
    expires_at: '2027-11-01T08:00:00Z',
    created_at: '2026-11-01T08:00:00Z',
    updated_at: '2026-11-01T08:00:00Z',
  },
  {
    id: 'sub-202',
    user_id: 'usr-customer-1',
    order_id: 'ord-302',
    product_plan_id: 'pp-5',
    status: 'active',
    start_at: '2026-11-03T10:00:00Z',
    expires_at: '2026-12-03T10:00:00Z',
    created_at: '2026-11-03T10:00:00Z',
    updated_at: '2026-11-03T10:00:00Z',
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-301',
    user_id: 'usr-customer-1',
    order_number: 'ALP-20261101-0982',
    amount: 399.00,
    currency: 'USD',
    status: 'paid',
    created_at: '2026-11-01T07:55:00Z',
    paid_at: '2026-11-01T08:00:00Z',
  },
  {
    id: 'ord-302',
    user_id: 'usr-customer-1',
    order_number: 'ALP-20261103-1104',
    amount: 39.00,
    currency: 'USD',
    status: 'paid',
    created_at: '2026-11-03T09:50:00Z',
    paid_at: '2026-11-03T10:00:00Z',
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actor_id: 'usr-admin-1',
    action: 'PRODUCT_PUBLISHED',
    resource_type: 'products',
    resource_id: 'GBPUSD_ALCHEMIST',
    metadata: { version: '2.1.0' },
    created_at: '2026-11-01T07:00:00Z',
  },
  {
    id: 'log-2',
    actor_id: 'usr-customer-1',
    action: 'ORDER_FULFILLED',
    resource_type: 'orders',
    resource_id: 'ord-301',
    metadata: { amount: 399.00, subscription_id: 'sub-201' },
    created_at: '2026-11-01T08:00:00Z',
  },
  {
    id: 'log-3',
    actor_id: 'usr-customer-1',
    action: 'LICENSE_ISSUED',
    resource_type: 'licenses',
    resource_id: 'lic-101',
    metadata: { account_number: '1288590', broker: 'IC Markets Global' },
    created_at: '2026-11-01T08:05:00Z',
  }
];

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('alp_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [accounts, setAccounts] = useState<TradingAccount[]>(() => {
    const saved = localStorage.getItem('alp_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [licenses, setLicenses] = useState<License[]>(() => {
    const saved = localStorage.getItem('alp_licenses');
    return saved ? JSON.parse(saved) : INITIAL_LICENSES;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('alp_subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('alp_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('alp_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('alp_products', JSON.stringify(products));
  }, [products]);

  // Fetch live products from API on mount with graceful fallback
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    fetch(`${apiBase}/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
        }
      })
      .catch(() => {
        // Fall back gracefully to local storage or initial products
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('alp_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('alp_licenses', JSON.stringify(licenses));
  }, [licenses]);

  useEffect(() => {
    localStorage.setItem('alp_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('alp_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('alp_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addProduct = (prodData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const newId = prodData.slug.toUpperCase().replace(/-/g, '_');
    const newProduct: Product = {
      ...prodData,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);

    // Record audit log
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'PRODUCT_CREATED',
      resource_type: 'products',
      resource_id: newId,
      metadata: { name: newProduct.name },
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p)));

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'PRODUCT_UPDATED',
      resource_type: 'products',
      resource_id: id,
      metadata: updates,
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const addTradingAccount = (acc: { broker: string; account_number: string; environment: 'demo' | 'live' }) => {
    const newAcc: TradingAccount = {
      id: `acc-${Date.now()}`,
      user_id: 'usr-customer-1',
      broker: acc.broker,
      account_number: acc.account_number,
      environment: acc.environment,
      verification_status: 'verified',
      verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    setAccounts(prev => [newAcc, ...prev]);
  };

  const updateLicenseStatus = (id: string, status: License['status'], note?: string) => {
    setLicenses(prev => prev.map(l => (l.id === id ? { ...l, status, updated_at: new Date().toISOString() } : l)));

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      action: `LICENSE_${status.toUpperCase()}`,
      resource_type: 'licenses',
      resource_id: id,
      metadata: { status, note: note || 'Admin manual action' },
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const extendLicense = (id: string, days: number) => {
    setLicenses(prev => prev.map(l => {
      if (l.id === id) {
        const curDate = new Date(l.expires_at).getTime() > Date.now() ? new Date(l.expires_at) : new Date();
        const newExpires = new Date(curDate.getTime() + days * 86400000).toISOString();
        return { ...l, expires_at: newExpires, status: 'active', updated_at: new Date().toISOString() };
      }
      return l;
    }));

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'LICENSE_EXTENDED',
      resource_type: 'licenses',
      resource_id: id,
      metadata: { days_added: days },
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const rebindLicenseAccount = (id: string, newAccountId: string) => {
    setLicenses(prev => prev.map(l => (l.id === id ? { ...l, trading_account_id: newAccountId, updated_at: new Date().toISOString() } : l)));

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'LICENSE_REBOUND',
      resource_type: 'licenses',
      resource_id: id,
      metadata: { new_trading_account_id: newAccountId },
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const createCheckoutOrder = (productId: string, planId: string, amount: number): Order => {
    const orderNum = `ALP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      user_id: 'usr-customer-1',
      order_number: orderNum,
      amount,
      currency: 'USD',
      status: 'paid',
      created_at: new Date().toISOString(),
      paid_at: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);

    // Create subscription
    const days = planId.includes('yearly') ? 365 : planId.includes('quarterly') ? 90 : planId.includes('lifetime') ? 36500 : 30;
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      user_id: 'usr-customer-1',
      order_id: newOrder.id,
      product_plan_id: planId,
      status: 'active',
      start_at: new Date().toISOString(),
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSubscriptions(prev => [newSub, ...prev]);

    // Create license
    const prefix = `ALG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLic: License = {
      id: `lic-${Date.now()}`,
      subscription_id: newSub.id,
      product_id: productId,
      trading_account_id: accounts[0]?.id || null,
      license_key_hash: 'simulated_hash_' + Math.random().toString(36).substring(2),
      license_key_prefix: prefix,
      status: 'active',
      issued_at: new Date().toISOString(),
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLicenses(prev => [newLic, ...prev]);

    const log: AuditLog = {
      id: `log-${Date.now()}`,
      action: 'ORDER_PURCHASE_COMPLETED',
      resource_type: 'orders',
      resource_id: newOrder.id,
      metadata: { amount, productId, license_prefix: prefix },
      created_at: new Date().toISOString(),
    };
    setAuditLogs(prev => [log, ...prev]);

    return newOrder;
  };

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        subscriptions,
        accounts,
        licenses,
        auditLogs,
        addProduct,
        updateProduct,
        addTradingAccount,
        updateLicenseStatus,
        extendLicense,
        rebindLicenseAccount,
        createCheckoutOrder,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

