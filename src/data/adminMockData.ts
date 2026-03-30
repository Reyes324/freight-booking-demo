export interface Enterprise {
  id: string;
  name: string;
  phone: string;
  password: string;
  countryCode: string;
  country: string;
  currency: string;         // 账期管理币种，统一为 "CNY"
  localCurrency: string;    // 当地货币（HKD, THB, MYR, SGD）- 用于显示参考
  premiumRate: number;
  creditLimit: number;      // 人民币金额
  usedCredit: number;       // 人民币金额
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  enterpriseId: string;
  date: string;
  orderId: string | null;
  description: string;

  // 原始交易币种和金额
  localCurrency: string | null;  // "HKD" / "THB" / "MYR" / null（月度重置、额度调整无原币种）
  localAmount: number | null;    // 当地货币金额 / null

  // 账期变动（人民币）
  cnyAmount: number;             // 人民币变动金额（正数为增加，负数为减少）

  // 换算汇率（交易时固化）
  exchangeRate: number | null;   // 汇率值 / null
  rateDate: string | null;       // 汇率日期 "YYYY-MM-DD" / null
}

export interface MonthlyExchangeRate {
  month: string;          // "2026-03"
  rateDate: string;       // "2026-02-28" - 汇率生效日期
  rates: {
    'CNY/HKD': number;    // 1 CNY = 1.092 HKD
    'CNY/THB': number;    // 1 CNY = 4.85 THB
    'CNY/MYR': number;    // 1 CNY = 0.62 MYR
    'CNY/SGD': number;    // 1 CNY = 0.185 SGD
  };
  lockedAt: string;       // "2026-02-28 23:59:59"
}

export interface FeeBreakdown {
  baseFare: number;
  distanceFee: number;
  serviceFee: number;
  surcharge: number;
  tax: number;
  discount: number;
  total: number;
}

export interface AdminOrder {
  orderId: string;
  supplierOrderId: string;
  supplierCode: string;
  supplierName: string;
  enterpriseId: string;
  orderDate: string;
  country: string;
  vehicleType: string;
  pickupAddress: string;
  pickupContact: string;
  dropoffAddress: string;
  dropoffContact: string;
  driverInfo: string;
  status: string;
  lliAmount: number;
  lliFeeBreakdown: FeeBreakdown;
  llmAmount: number;
  llmFeeBreakdown: FeeBreakdown;
  currency: string;
}

// ========== Monthly Exchange Rates ==========
export const monthlyExchangeRates: MonthlyExchangeRate[] = [
  {
    month: '2026-03',
    rateDate: '2026-02-28',
    rates: {
      'CNY/HKD': 1.092,
      'CNY/THB': 4.85,
      'CNY/MYR': 0.62,
      'CNY/SGD': 0.185,
    },
    lockedAt: '2026-02-28 23:59:59',
  },
  {
    month: '2026-04',
    rateDate: '2026-03-31',
    rates: {
      'CNY/HKD': 1.105,
      'CNY/THB': 4.92,
      'CNY/MYR': 0.64,
      'CNY/SGD': 0.188,
    },
    lockedAt: '2026-03-31 23:59:59',
  },
];

// 工具函数：获取当月汇率
export function getMonthlyRate(yearMonth: string): MonthlyExchangeRate | undefined {
  return monthlyExchangeRates.find(r => r.month === yearMonth);
}

// 工具函数：获取当前月份
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// ========== Enterprises ==========
export const enterprises: Enterprise[] = [
  {
    id: 'ENT-20251101-001',
    name: '菜鸟速递',
    phone: '63123456',
    password: 'Cainiao@2025',
    countryCode: '+852',
    country: '香港',
    currency: 'CNY',
    localCurrency: 'HKD',
    premiumRate: 1.15,
    creditLimit: 50000,
    usedCredit: 11500,
    createdAt: '2025-11-01',
  },
  {
    id: 'ENT-20251215-001',
    name: '顺丰国际',
    phone: '81234567',
    password: 'SF@2025intl',
    countryCode: '+66',
    country: '泰国',
    currency: 'CNY',
    localCurrency: 'THB',
    premiumRate: 1.20,
    creditLimit: 200000,
    usedCredit: 45000,
    createdAt: '2025-12-15',
  },
  {
    id: 'ENT-20260108-001',
    name: '极兔快递',
    phone: '13800138000',
    password: 'JT@express2025',
    countryCode: '+60',
    country: '马来西亚',
    currency: 'CNY',
    localCurrency: 'MYR',
    premiumRate: 1.10,
    creditLimit: 30000,
    usedCredit: 12800,
    createdAt: '2026-01-08',
  },
  {
    id: 'ENT-20260220-001',
    name: 'Flash Express',
    phone: '91234567',
    password: 'Flash@2026',
    countryCode: '+66',
    country: '泰国',
    currency: 'CNY',
    localCurrency: 'THB',
    premiumRate: 1.18,
    creditLimit: 150000,
    usedCredit: 32000,
    createdAt: '2026-02-20',
  },
];

// ========== Credit Transactions ==========
// 交易记录说明：
// - localCurrency/localAmount: 订单的原始币种和金额（月度重置、额度调整为 null）
// - cnyAmount: 账期变动的人民币金额（正数为增加，负数为减少）
// - exchangeRate/rateDate: 交易时固化的汇率和汇率日期（月度重置、额度调整为 null）
// - 3月汇率：1 CNY = 1.092 HKD / 4.85 THB / 0.62 MYR
export const creditTransactions: CreditTransaction[] = [
  // 菜鸟速递（香港）
  {
    id: 'tx-006', enterpriseId: 'ENT-20251101-001', date: '2026-03-01 00:00',
    orderId: null, description: '月度额度重置',
    localCurrency: null, localAmount: null, cnyAmount: 50000,
    exchangeRate: null, rateDate: null
  },
  {
    id: 'tx-005', enterpriseId: 'ENT-20251101-001', date: '2026-03-12 11:00',
    orderId: 'LLI-20260312-001', description: '订单支付',
    localCurrency: 'HKD', localAmount: 185.00, cnyAmount: -169.41,
    exchangeRate: 1.092, rateDate: '2026-02-28'
  },
  {
    id: 'tx-004', enterpriseId: 'ENT-20251101-001', date: '2026-03-15 16:20',
    orderId: 'LLI-20260315-002', description: '订单支付',
    localCurrency: 'HKD', localAmount: 256.00, cnyAmount: -234.43,
    exchangeRate: 1.092, rateDate: '2026-02-28'
  },
  {
    id: 'tx-003', enterpriseId: 'ENT-20251101-001', date: '2026-03-18 09:45',
    orderId: 'LLI-20260318-003', description: '订单支付',
    localCurrency: 'HKD', localAmount: 128.00, cnyAmount: -117.22,
    exchangeRate: 1.092, rateDate: '2026-02-28'
  },
  {
    id: 'tx-002', enterpriseId: 'ENT-20251101-001', date: '2026-03-19 10:15',
    orderId: null, description: '额度调整',
    localCurrency: null, localAmount: null, cnyAmount: 5000,
    exchangeRate: null, rateDate: null
  },
  {
    id: 'tx-001', enterpriseId: 'ENT-20251101-001', date: '2026-03-20 14:30',
    orderId: 'LLI-20260320-001', description: '订单支付',
    localCurrency: 'HKD', localAmount: 74.00, cnyAmount: -67.77,
    exchangeRate: 1.092, rateDate: '2026-02-28'
  },

  // 顺丰国际（泰国）
  {
    id: 'tx-105', enterpriseId: 'ENT-20251215-001', date: '2026-03-01 00:00',
    orderId: null, description: '月度额度重置',
    localCurrency: null, localAmount: null, cnyAmount: 200000,
    exchangeRate: null, rateDate: null
  },
  {
    id: 'tx-104', enterpriseId: 'ENT-20251215-001', date: '2026-03-15 14:10',
    orderId: 'LLI-20260315-103', description: '订单支付',
    localCurrency: 'THB', localAmount: 2100.00, cnyAmount: -432.99,
    exchangeRate: 4.85, rateDate: '2026-02-28'
  },
  {
    id: 'tx-103', enterpriseId: 'ENT-20251215-001', date: '2026-03-18 08:20',
    orderId: null, description: '额度调整',
    localCurrency: null, localAmount: null, cnyAmount: 5000,
    exchangeRate: null, rateDate: null
  },
  {
    id: 'tx-102', enterpriseId: 'ENT-20251215-001', date: '2026-03-20 15:45',
    orderId: 'LLI-20260320-102', description: '订单支付',
    localCurrency: 'THB', localAmount: 890.00, cnyAmount: -183.51,
    exchangeRate: 4.85, rateDate: '2026-02-28'
  },
  {
    id: 'tx-101', enterpriseId: 'ENT-20251215-001', date: '2026-03-21 09:30',
    orderId: 'LLI-20260321-101', description: '订单支付',
    localCurrency: 'THB', localAmount: 1250.00, cnyAmount: -257.73,
    exchangeRate: 4.85, rateDate: '2026-02-28'
  },

  // 极兔快递（马来西亚）
  {
    id: 'tx-204', enterpriseId: 'ENT-20260108-001', date: '2026-03-01 00:00',
    orderId: null, description: '月度额度重置',
    localCurrency: null, localAmount: null, cnyAmount: 30000,
    exchangeRate: null, rateDate: null
  },
  {
    id: 'tx-203', enterpriseId: 'ENT-20260108-001', date: '2026-03-19 09:00',
    orderId: 'LLI-20260319-203', description: '订单支付',
    localCurrency: 'MYR', localAmount: 63.00, cnyAmount: -101.61,
    exchangeRate: 0.62, rateDate: '2026-02-28'
  },
  {
    id: 'tx-202', enterpriseId: 'ENT-20260108-001', date: '2026-03-21 14:30',
    orderId: 'LLI-20260321-202', description: '订单支付',
    localCurrency: 'MYR', localAmount: 82.00, cnyAmount: -132.26,
    exchangeRate: 0.62, rateDate: '2026-02-28'
  },
  {
    id: 'tx-201', enterpriseId: 'ENT-20260108-001', date: '2026-03-22 10:00',
    orderId: 'LLI-20260322-201', description: '订单支付',
    localCurrency: 'MYR', localAmount: 45.00, cnyAmount: -72.58,
    exchangeRate: 0.62, rateDate: '2026-02-28'
  },

  // Flash Express（泰国）
  {
    id: 'tx-303', enterpriseId: 'ENT-20260220-001', date: '2026-03-01 00:00',
    orderId: null, description: '月度额度重置',
    localCurrency: null, localAmount: null, cnyAmount: 150000,
    exchangeRate: null, rateDate: null
  },
  {
    id: 'tx-302', enterpriseId: 'ENT-20260220-001', date: '2026-03-22 08:45',
    orderId: 'LLI-20260322-302', description: '订单支付',
    localCurrency: 'THB', localAmount: 950.00, cnyAmount: -195.88,
    exchangeRate: 4.85, rateDate: '2026-02-28'
  },
  {
    id: 'tx-301', enterpriseId: 'ENT-20260220-001', date: '2026-03-23 11:15',
    orderId: 'LLI-20260323-301', description: '订单支付',
    localCurrency: 'THB', localAmount: 1800.00, cnyAmount: -371.13,
    exchangeRate: 4.85, rateDate: '2026-02-28'
  },
];

// ========== Orders ==========
export const adminOrders: AdminOrder[] = [
  // 菜鸟速递 orders (香港 → LLM-HK)
  {
    orderId: 'LLI-20260320-001', supplierOrderId: 'LLM-HK-88001', supplierCode: 'LLM-HK', supplierName: 'Lalamove Hong Kong',
    enterpriseId: 'ENT-20251101-001', orderDate: '2026-03-20 14:30', country: '香港', vehicleType: 'Van',
    pickupAddress: '中环皇后大道中 99 号', pickupContact: '李明 +852 6312 3456',
    dropoffAddress: '尖沙咀广东道 28 号', dropoffContact: '王芳 +852 9876 5432',
    driverInfo: 'AB 1234 / +852 5111 2222', status: '已完成',
    lliAmount: 85.10, lliFeeBreakdown: { baseFare: 40, distanceFee: 28, serviceFee: 0, surcharge: 10, tax: 7.10, discount: 0, total: 85.10 },
    llmAmount: 74.00, llmFeeBreakdown: { baseFare: 35, distanceFee: 24, serviceFee: 0, surcharge: 9, tax: 6.00, discount: 0, total: 74.00 },
    currency: 'HKD',
  },
  {
    orderId: 'LLI-20260318-003', supplierOrderId: 'LLM-HK-88002', supplierCode: 'LLM-HK', supplierName: 'Lalamove Hong Kong',
    enterpriseId: 'ENT-20251101-001', orderDate: '2026-03-18 09:45', country: '香港', vehicleType: 'Pickup Truck',
    pickupAddress: '葵涌工业区 12 号', pickupContact: '陈生 +852 6312 3456',
    dropoffAddress: '观塘开源道 50 号', dropoffContact: '张太 +852 6234 5678',
    driverInfo: 'CD 5678 / +852 5222 3333', status: '已完成',
    lliAmount: 147.20, lliFeeBreakdown: { baseFare: 65, distanceFee: 48, serviceFee: 15, surcharge: 8, tax: 11.20, discount: 0, total: 147.20 },
    llmAmount: 128.00, llmFeeBreakdown: { baseFare: 56, distanceFee: 42, serviceFee: 13, surcharge: 7, tax: 10.00, discount: 0, total: 128.00 },
    currency: 'HKD',
  },
  {
    orderId: 'LLI-20260315-002', supplierOrderId: 'LLM-HK-88003', supplierCode: 'LLM-HK', supplierName: 'Lalamove Hong Kong',
    enterpriseId: 'ENT-20251101-001', orderDate: '2026-03-15 16:20', country: '香港', vehicleType: 'Small Truck',
    pickupAddress: '新蒲岗大有街 1 号', pickupContact: '刘先生 +852 6312 3456',
    dropoffAddress: '荃湾德士古道 200 号', dropoffContact: '何小姐 +852 9345 6789',
    driverInfo: 'EF 9012 / +852 5333 4444', status: '已完成',
    lliAmount: 294.40, lliFeeBreakdown: { baseFare: 130, distanceFee: 95, serviceFee: 30, surcharge: 15, tax: 24.40, discount: 0, total: 294.40 },
    llmAmount: 256.00, llmFeeBreakdown: { baseFare: 113, distanceFee: 83, serviceFee: 26, surcharge: 13, tax: 21.00, discount: 0, total: 256.00 },
    currency: 'HKD',
  },
  {
    orderId: 'LLI-20260312-001', supplierOrderId: 'LLM-HK-88004', supplierCode: 'LLM-HK', supplierName: 'Lalamove Hong Kong',
    enterpriseId: 'ENT-20251101-001', orderDate: '2026-03-12 11:00', country: '香港', vehicleType: 'Van',
    pickupAddress: '铜锣湾轩尼诗道 500 号', pickupContact: '赵明 +852 6312 3456',
    dropoffAddress: '北角英皇道 600 号', dropoffContact: '孙丽 +852 9456 7890',
    driverInfo: 'GH 3456 / +852 5444 5555', status: '已完成',
    lliAmount: 212.75, lliFeeBreakdown: { baseFare: 40, distanceFee: 120, serviceFee: 20, surcharge: 15, tax: 17.75, discount: 0, total: 212.75 },
    llmAmount: 185.00, llmFeeBreakdown: { baseFare: 35, distanceFee: 104, serviceFee: 17, surcharge: 13, tax: 16.00, discount: 0, total: 185.00 },
    currency: 'HKD',
  },
  {
    orderId: 'LLI-20260324-005', supplierOrderId: 'LLM-HK-88005', supplierCode: 'LLM-HK', supplierName: 'Lalamove Hong Kong',
    enterpriseId: 'ENT-20251101-001', orderDate: '2026-03-24 08:30', country: '香港', vehicleType: 'Van',
    pickupAddress: '湾仔港湾道 25 号', pickupContact: '周敏 +852 6312 3456',
    dropoffAddress: '深水埗长沙湾道 888 号', dropoffContact: '吴刚 +852 9567 8901',
    driverInfo: 'IJ 7890 / +852 5555 6666', status: '配送中',
    lliAmount: 109.25, lliFeeBreakdown: { baseFare: 40, distanceFee: 45, serviceFee: 0, surcharge: 12, tax: 12.25, discount: 0, total: 109.25 },
    llmAmount: 95.00, llmFeeBreakdown: { baseFare: 35, distanceFee: 39, serviceFee: 0, surcharge: 10, tax: 11.00, discount: 0, total: 95.00 },
    currency: 'HKD',
  },
  // 顺丰国际 orders (泰国 → LLM-TH)
  {
    orderId: 'LLI-20260321-101', supplierOrderId: 'LLM-TH-99001', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'ENT-20251215-001', orderDate: '2026-03-21 09:30', country: '泰国', vehicleType: 'Van',
    pickupAddress: 'Sukhumvit Rd, Khlong Toei', pickupContact: 'Somchai +66 812 345 67',
    dropoffAddress: 'Silom Rd, Bang Rak', dropoffContact: 'Nattaya +66 823 456 78',
    driverInfo: 'กข 1234 / +66 891 234 567', status: '已完成',
    lliAmount: 1437.50, lliFeeBreakdown: { baseFare: 600, distanceFee: 450, serviceFee: 150, surcharge: 100, tax: 137.50, discount: 0, total: 1437.50 },
    llmAmount: 1250.00, llmFeeBreakdown: { baseFare: 520, distanceFee: 390, serviceFee: 130, surcharge: 87, tax: 123.00, discount: 0, total: 1250.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260320-102', supplierOrderId: 'LLM-TH-99002', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'ENT-20251215-001', orderDate: '2026-03-20 15:45', country: '泰国', vehicleType: 'Motorcycle',
    pickupAddress: 'Ratchadaphisek Rd, Din Daeng', pickupContact: 'Pradit +66 812 345 67',
    dropoffAddress: 'Phahonyothin Rd, Chatuchak', dropoffContact: 'Wanida +66 834 567 89',
    driverInfo: 'คง 5678 / +66 892 345 678', status: '已完成',
    lliAmount: 1023.50, lliFeeBreakdown: { baseFare: 300, distanceFee: 420, serviceFee: 100, surcharge: 80, tax: 123.50, discount: 0, total: 1023.50 },
    llmAmount: 890.00, llmFeeBreakdown: { baseFare: 260, distanceFee: 365, serviceFee: 87, surcharge: 70, tax: 108.00, discount: 0, total: 890.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260315-103', supplierOrderId: 'LLM-TH-99003', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'ENT-20251215-001', orderDate: '2026-03-15 14:10', country: '泰国', vehicleType: 'Pickup Truck',
    pickupAddress: 'Rama IV Rd, Pathum Wan', pickupContact: 'Kittisak +66 812 345 67',
    dropoffAddress: 'Lat Phrao Rd, Wang Thonglang', dropoffContact: 'Siriporn +66 845 678 90',
    driverInfo: 'จฉ 9012 / +66 893 456 789', status: '已完成',
    lliAmount: 2415.00, lliFeeBreakdown: { baseFare: 1000, distanceFee: 800, serviceFee: 200, surcharge: 150, tax: 265.00, discount: 0, total: 2415.00 },
    llmAmount: 2100.00, llmFeeBreakdown: { baseFare: 870, distanceFee: 695, serviceFee: 174, surcharge: 130, tax: 231.00, discount: 0, total: 2100.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260324-104', supplierOrderId: 'LLM-TH-99004', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'ENT-20251215-001', orderDate: '2026-03-24 10:00', country: '泰国', vehicleType: 'Van',
    pickupAddress: 'Charoen Krung Rd, Samphanthawong', pickupContact: 'Apinya +66 812 345 67',
    dropoffAddress: 'Petchaburi Rd, Ratchathewi', dropoffContact: 'Chalerm +66 856 789 01',
    driverInfo: 'ชซ 3456 / +66 894 567 890', status: '前往装货地',
    lliAmount: 1265.00, lliFeeBreakdown: { baseFare: 600, distanceFee: 350, serviceFee: 100, surcharge: 80, tax: 135.00, discount: 0, total: 1265.00 },
    llmAmount: 1100.00, llmFeeBreakdown: { baseFare: 520, distanceFee: 304, serviceFee: 87, surcharge: 70, tax: 119.00, discount: 0, total: 1100.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260323-105', supplierOrderId: 'GRAB-TH-55001', supplierCode: 'GRAB-TH', supplierName: 'Grab Thailand',
    enterpriseId: 'ENT-20251215-001', orderDate: '2026-03-23 16:30', country: '泰国', vehicleType: '4-Door Car',
    pickupAddress: 'Wireless Rd, Lumphini', pickupContact: 'Tanawat +66 812 345 67',
    dropoffAddress: 'Thonglor Soi 13', dropoffContact: 'Parichat +66 867 890 12',
    driverInfo: 'ฌญ 7890 / +66 895 678 901', status: '已完成',
    lliAmount: 862.50, lliFeeBreakdown: { baseFare: 350, distanceFee: 280, serviceFee: 50, surcharge: 60, tax: 122.50, discount: 0, total: 862.50 },
    llmAmount: 750.00, llmFeeBreakdown: { baseFare: 300, distanceFee: 245, serviceFee: 44, surcharge: 52, tax: 109.00, discount: 0, total: 750.00 },
    currency: 'THB',
  },
  // 极兔快递 orders (马来西亚 → LLM-MY)
  {
    orderId: 'LLI-20260322-201', supplierOrderId: 'LLM-MY-77001', supplierCode: 'LLM-MY', supplierName: 'Lalamove Malaysia',
    enterpriseId: 'ENT-20260108-001', orderDate: '2026-03-22 10:00', country: '马来西亚', vehicleType: 'Van',
    pickupAddress: 'Jalan Bukit Bintang, KL', pickupContact: 'Ahmad +60 12 345 6789',
    dropoffAddress: 'Jalan Ampang, KL', dropoffContact: 'Mei Ling +60 13 456 7890',
    driverInfo: 'WKL 1234 / +60 17 123 4567', status: '已完成',
    lliAmount: 52.80, lliFeeBreakdown: { baseFare: 20, distanceFee: 18, serviceFee: 5, surcharge: 3, tax: 6.80, discount: 0, total: 52.80 },
    llmAmount: 45.00, llmFeeBreakdown: { baseFare: 17, distanceFee: 15, serviceFee: 4, surcharge: 3, tax: 6.00, discount: 0, total: 45.00 },
    currency: 'MYR',
  },
  {
    orderId: 'LLI-20260321-202', supplierOrderId: 'LLM-MY-77002', supplierCode: 'LLM-MY', supplierName: 'Lalamove Malaysia',
    enterpriseId: 'ENT-20260108-001', orderDate: '2026-03-21 14:30', country: '马来西亚', vehicleType: 'Pickup Truck',
    pickupAddress: 'Petaling Jaya, Selangor', pickupContact: 'Raj +60 12 345 6789',
    dropoffAddress: 'Shah Alam, Selangor', dropoffContact: 'Siti +60 14 567 8901',
    driverInfo: 'BJK 5678 / +60 18 234 5678', status: '已完成',
    lliAmount: 95.70, lliFeeBreakdown: { baseFare: 35, distanceFee: 32, serviceFee: 10, surcharge: 6, tax: 12.70, discount: 0, total: 95.70 },
    llmAmount: 82.00, llmFeeBreakdown: { baseFare: 30, distanceFee: 28, serviceFee: 8, surcharge: 5, tax: 11.00, discount: 0, total: 82.00 },
    currency: 'MYR',
  },
  {
    orderId: 'LLI-20260319-203', supplierOrderId: 'LLM-MY-77003', supplierCode: 'LLM-MY', supplierName: 'Lalamove Malaysia',
    enterpriseId: 'ENT-20260108-001', orderDate: '2026-03-19 09:00', country: '马来西亚', vehicleType: 'Small Truck',
    pickupAddress: 'Subang Jaya, Selangor', pickupContact: 'Wei +60 12 345 6789',
    dropoffAddress: 'Klang, Selangor', dropoffContact: 'Hafiz +60 15 678 9012',
    driverInfo: 'BDG 9012 / +60 19 345 6789', status: '已完成',
    lliAmount: 74.50, lliFeeBreakdown: { baseFare: 28, distanceFee: 25, serviceFee: 8, surcharge: 4, tax: 9.50, discount: 0, total: 74.50 },
    llmAmount: 63.00, llmFeeBreakdown: { baseFare: 24, distanceFee: 21, serviceFee: 7, surcharge: 3, tax: 8.00, discount: 0, total: 63.00 },
    currency: 'MYR',
  },
  {
    orderId: 'LLI-20260324-204', supplierOrderId: 'LLM-MY-77004', supplierCode: 'LLM-MY', supplierName: 'Lalamove Malaysia',
    enterpriseId: 'ENT-20260108-001', orderDate: '2026-03-24 15:00', country: '马来西亚', vehicleType: 'Van',
    pickupAddress: 'Bangsar South, KL', pickupContact: 'Tan +60 12 345 6789',
    dropoffAddress: 'Mont Kiara, KL', dropoffContact: 'Aisha +60 16 789 0123',
    driverInfo: 'WPJ 3456 / +60 11 456 7890', status: '正在呼叫司机',
    lliAmount: 41.30, lliFeeBreakdown: { baseFare: 20, distanceFee: 10, serviceFee: 0, surcharge: 5, tax: 6.30, discount: 0, total: 41.30 },
    llmAmount: 35.00, llmFeeBreakdown: { baseFare: 17, distanceFee: 9, serviceFee: 0, surcharge: 4, tax: 5.00, discount: 0, total: 35.00 },
    currency: 'MYR',
  },
  {
    orderId: 'LLI-20260317-205', supplierOrderId: 'LLM-MY-77005', supplierCode: 'LLM-MY', supplierName: 'Lalamove Malaysia',
    enterpriseId: 'ENT-20260108-001', orderDate: '2026-03-17 11:30', country: '马来西亚', vehicleType: 'Motorcycle',
    pickupAddress: 'KLCC, KL', pickupContact: 'Danny +60 12 345 6789',
    dropoffAddress: 'Mid Valley, KL', dropoffContact: 'Priya +60 17 890 1234',
    driverInfo: 'WA 7777 / +60 12 567 8901', status: '已完成',
    lliAmount: 18.60, lliFeeBreakdown: { baseFare: 8, distanceFee: 5, serviceFee: 0, surcharge: 2, tax: 3.60, discount: 0, total: 18.60 },
    llmAmount: 15.00, llmFeeBreakdown: { baseFare: 7, distanceFee: 4, serviceFee: 0, surcharge: 2, tax: 2.00, discount: 0, total: 15.00 },
    currency: 'MYR',
  },
  {
    orderId: 'LLI-20260314-206', supplierOrderId: 'GRAB-MY-66001', supplierCode: 'GRAB-MY', supplierName: 'Grab Malaysia',
    enterpriseId: 'ENT-20260108-001', orderDate: '2026-03-14 08:00', country: '马来西亚', vehicleType: 'Van',
    pickupAddress: 'Sunway Pyramid, Selangor', pickupContact: 'Jason +60 12 345 6789',
    dropoffAddress: 'Puchong, Selangor', dropoffContact: 'Nurul +60 18 901 2345',
    driverInfo: 'BHP 8888 / +60 13 678 9012', status: '已完成',
    lliAmount: 38.40, lliFeeBreakdown: { baseFare: 15, distanceFee: 12, serviceFee: 3, surcharge: 2, tax: 6.40, discount: 0, total: 38.40 },
    llmAmount: 32.00, llmFeeBreakdown: { baseFare: 13, distanceFee: 10, serviceFee: 2, surcharge: 2, tax: 5.00, discount: 0, total: 32.00 },
    currency: 'MYR',
  },
  // Flash Express orders (泰国 → LLM-TH)
  {
    orderId: 'LLI-20260323-301', supplierOrderId: 'LLM-TH-66001', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'ENT-20260220-001', orderDate: '2026-03-23 11:15', country: '泰国', vehicleType: 'Pickup Truck',
    pickupAddress: 'Bang Na-Trat Rd, Bang Na', pickupContact: 'Anurak +66 912 345 67',
    dropoffAddress: 'Samut Prakan Industrial Estate', dropoffContact: 'Suwanna +66 923 456 78',
    driverInfo: 'ฎฏ 1111 / +66 896 789 012', status: '已完成',
    lliAmount: 2070.00, lliFeeBreakdown: { baseFare: 900, distanceFee: 650, serviceFee: 180, surcharge: 120, tax: 220.00, discount: 0, total: 2070.00 },
    llmAmount: 1800.00, llmFeeBreakdown: { baseFare: 780, distanceFee: 565, serviceFee: 157, surcharge: 104, tax: 194.00, discount: 0, total: 1800.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260322-302', supplierOrderId: 'LLM-TH-66002', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'ENT-20260220-001', orderDate: '2026-03-22 08:45', country: '泰国', vehicleType: 'Van',
    pickupAddress: 'Ngamwongwan Rd, Nonthaburi', pickupContact: 'Piyapong +66 912 345 67',
    dropoffAddress: 'Muang Thong Thani, Pak Kret', dropoffContact: 'Ratana +66 934 567 89',
    driverInfo: 'ฐฑ 2222 / +66 897 890 123', status: '已完成',
    lliAmount: 1092.50, lliFeeBreakdown: { baseFare: 500, distanceFee: 310, serviceFee: 80, surcharge: 60, tax: 142.50, discount: 0, total: 1092.50 },
    llmAmount: 950.00, llmFeeBreakdown: { baseFare: 435, distanceFee: 270, serviceFee: 70, surcharge: 52, tax: 123.00, discount: 0, total: 950.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260324-303', supplierOrderId: 'LLM-TH-66003', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'ENT-20260220-001', orderDate: '2026-03-24 14:00', country: '泰国', vehicleType: 'Small Truck',
    pickupAddress: 'Rama II Rd, Samae Dam', pickupContact: 'Worapat +66 912 345 67',
    dropoffAddress: 'Bangpakong Industrial Park', dropoffContact: 'Jintana +66 945 678 90',
    driverInfo: 'ฒณ 3333 / +66 898 901 234', status: '配送中',
    lliAmount: 2875.00, lliFeeBreakdown: { baseFare: 1200, distanceFee: 950, serviceFee: 250, surcharge: 150, tax: 325.00, discount: 0, total: 2875.00 },
    llmAmount: 2500.00, llmFeeBreakdown: { baseFare: 1043, distanceFee: 826, serviceFee: 217, surcharge: 130, tax: 284.00, discount: 0, total: 2500.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260319-304', supplierOrderId: 'GRAB-TH-55002', supplierCode: 'GRAB-TH', supplierName: 'Grab Thailand',
    enterpriseId: 'ENT-20260220-001', orderDate: '2026-03-19 13:20', country: '泰国', vehicleType: 'Motorcycle',
    pickupAddress: 'Siam Square Soi 7', pickupContact: 'Chanin +66 912 345 67',
    dropoffAddress: 'Ekamai Soi 5', dropoffContact: 'Naruemon +66 956 789 01',
    driverInfo: 'ดต 4444 / +66 899 012 345', status: '已完成',
    lliAmount: 575.00, lliFeeBreakdown: { baseFare: 200, distanceFee: 180, serviceFee: 50, surcharge: 30, tax: 115.00, discount: 0, total: 575.00 },
    llmAmount: 500.00, llmFeeBreakdown: { baseFare: 174, distanceFee: 157, serviceFee: 43, surcharge: 26, tax: 100.00, discount: 0, total: 500.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260316-305', supplierOrderId: 'LLM-TH-66004', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'ENT-20260220-001', orderDate: '2026-03-16 10:00', country: '泰国', vehicleType: 'Van',
    pickupAddress: 'Ratchayothin, Chatuchak', pickupContact: 'Boonmee +66 912 345 67',
    dropoffAddress: 'Don Mueang, Lak Si', dropoffContact: 'Araya +66 967 890 12',
    driverInfo: 'ถท 5555 / +66 890 123 456', status: '已过期',
    lliAmount: 920.00, lliFeeBreakdown: { baseFare: 400, distanceFee: 280, serviceFee: 70, surcharge: 50, tax: 120.00, discount: 0, total: 920.00 },
    llmAmount: 800.00, llmFeeBreakdown: { baseFare: 348, distanceFee: 243, serviceFee: 61, surcharge: 43, tax: 105.00, discount: 0, total: 800.00 },
    currency: 'THB',
  },
];
