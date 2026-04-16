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
    'CNY/VND': number;    // 1 CNY = 3450 VND
    'CNY/THB': number;    // 1 CNY = 4.85 THB
    'CNY/MYR': number;    // 1 CNY = 0.62 MYR
    'CNY/IDR': number;    // 1 CNY = 2150 IDR
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
  pickupTime: string;      // 新增：装货时间
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
      'CNY/VND': 3450,
      'CNY/THB': 4.85,
      'CNY/MYR': 0.62,
      'CNY/IDR': 2150,
    },
    lockedAt: '2026-02-28 23:59:59',
  },
  {
    month: '2026-04',
    rateDate: '2026-03-31',
    rates: {
      'CNY/VND': 3480,
      'CNY/THB': 4.92,
      'CNY/MYR': 0.64,
      'CNY/IDR': 2180,
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
    id: 'E001',
    name: 'Viettel Post',
    phone: '246123456',
    password: 'Viettel@2026',
    countryCode: '+84',
    country: '越南',
    currency: 'CNY',
    localCurrency: 'VND',
    premiumRate: 1.15,
    creditLimit: 50000,
    usedCredit: 11500,
    createdAt: '2025-11-01',
  },
  {
    id: 'E002',
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
    id: 'E003',
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
    id: 'E004',
    name: 'JNE Express',
    phone: '212345678',
    password: 'JNE@2026',
    countryCode: '+62',
    country: '印尼',
    currency: 'CNY',
    localCurrency: 'IDR',
    premiumRate: 1.18,
    creditLimit: 150000,
    usedCredit: 32000,
    createdAt: '2026-02-20',
  },
];

// ========== Credit Transactions ==========
export const creditTransactions: CreditTransaction[] = [
  // Viettel Post（越南）
  {
    id: 'tx-005', enterpriseId: 'E001', date: '2026-03-12 11:00',
    orderId: 'LLI-20260312-001', description: '订单支付',
    localCurrency: 'VND', localAmount: 585000.00, cnyAmount: -169.57,
    exchangeRate: 3450, rateDate: '2026-02-28'
  },
  {
    id: 'tx-007', enterpriseId: 'E001', date: '2026-03-14 15:30',
    orderId: 'LLI-20260312-001', description: '订单退款',
    localCurrency: 'VND', localAmount: 585000.00, cnyAmount: 169.57,
    exchangeRate: 3450, rateDate: '2026-02-28'
  },

  // 顺丰国际（泰国）
  {
    id: 'tx-104', enterpriseId: 'E002', date: '2026-03-15 14:10',
    orderId: 'LLI-20260315-103', description: '订单支付',
    localCurrency: 'THB', localAmount: 2100.00, cnyAmount: -432.99,
    exchangeRate: 4.85, rateDate: '2026-02-28'
  },
  {
    id: 'tx-106', enterpriseId: 'E002', date: '2026-03-16 10:20',
    orderId: 'LLI-20260315-103', description: '订单退款',
    localCurrency: 'THB', localAmount: 500.00, cnyAmount: 103.09,
    exchangeRate: 4.85, rateDate: '2026-02-28'
  },

  // 极兔快递（马来西亚）
  {
    id: 'tx-203', enterpriseId: 'E003', date: '2026-03-19 09:00',
    orderId: 'LLI-20260319-203', description: '订单支付',
    localCurrency: 'MYR', localAmount: 63.00, cnyAmount: -101.61,
    exchangeRate: 0.62, rateDate: '2026-02-28'
  },

  // JNE Express（印尼）
  {
    id: 'tx-302', enterpriseId: 'E004', date: '2026-03-22 08:45',
    orderId: 'LLI-20260322-302', description: '订单支付',
    localCurrency: 'IDR', localAmount: 420000.00, cnyAmount: -195.35,
    exchangeRate: 2150, rateDate: '2026-02-28'
  },
  {
    id: 'tx-304', enterpriseId: 'E004', date: '2026-03-23 14:15',
    orderId: 'LLI-20260322-302', description: '订单退款',
    localCurrency: 'IDR', localAmount: 100000.00, cnyAmount: 46.51,
    exchangeRate: 2150, rateDate: '2026-02-28'
  },
];

// ========== Orders ==========
export const adminOrders: AdminOrder[] = [
  // Viettel Post orders (越南 → LLM-VN)
  {
    orderId: 'LLI-20260320-001', supplierOrderId: 'LLM-VN-88001', supplierCode: 'LLM-VN', supplierName: 'Lalamove Vietnam',
    enterpriseId: 'E001', orderDate: '2026-03-20 14:30', pickupTime: '2026-03-20 15:00', country: '越南', vehicleType: 'Van',
    pickupAddress: 'Hoàn Kiếm, Hà Nội', pickupContact: 'Nguyễn Văn A +84 246 123 456',
    dropoffAddress: 'Quận 1, TP.HCM', dropoffContact: 'Trần Thị B +84 283 987 654',
    driverInfo: '29A-123.45 / +84 912 345 678', status: '已完成',
    lliAmount: 295000, lliFeeBreakdown: { baseFare: 150000, distanceFee: 100000, serviceFee: 20000, surcharge: 15000, tax: 10000, discount: 0, total: 295000 },
    llmAmount: 256000, llmFeeBreakdown: { baseFare: 130000, distanceFee: 88000, serviceFee: 17000, surcharge: 13000, tax: 8000, discount: 0, total: 256000 },
    currency: 'VND',
  },
  {
    orderId: 'LLI-20260318-003', supplierOrderId: 'LLM-VN-88002', supplierCode: 'LLM-VN', supplierName: 'Lalamove Vietnam',
    enterpriseId: 'E001', orderDate: '2026-03-18 09:45', pickupTime: '2026-03-18 10:15', country: '越南', vehicleType: 'Motorcycle',
    pickupAddress: 'Ba Đình, Hà Nội', pickupContact: 'Phạm Minh +84 246 123 456',
    dropoffAddress: 'Cầu Giấy, Hà Nội', dropoffContact: 'Lê Hoa +84 901 234 567',
    driverInfo: '29B-567.89 / +84 923 456 789', status: '已完成',
    lliAmount: 52000, lliFeeBreakdown: { baseFare: 20000, distanceFee: 18000, serviceFee: 5000, surcharge: 4000, tax: 5000, discount: 0, total: 52000 },
    llmAmount: 45000, llmFeeBreakdown: { baseFare: 17000, distanceFee: 15000, serviceFee: 4000, surcharge: 4000, tax: 5000, discount: 0, total: 45000 },
    currency: 'VND',
  },
  {
    orderId: 'LLI-20260324-005', supplierOrderId: 'LLM-VN-88005', supplierCode: 'LLM-VN', supplierName: 'Lalamove Vietnam',
    enterpriseId: 'E001', orderDate: '2026-03-24 08:30', pickupTime: '2026-03-24 09:00', country: '越南', vehicleType: 'Pickup Truck',
    pickupAddress: 'Đống Đa, Hà Nội', pickupContact: 'Lý Quốc +84 246 123 456',
    dropoffAddress: 'Thanh Xuân, Hà Nội', dropoffContact: 'Đỗ Hùng +84 934 567 890',
    driverInfo: '29D-901.23 / +84 955 666 777', status: '配送中',
    lliAmount: 185000, lliFeeBreakdown: { baseFare: 80000, distanceFee: 75000, serviceFee: 15000, surcharge: 10000, tax: 5000, discount: 0, total: 185000 },
    llmAmount: 160000, llmFeeBreakdown: { baseFare: 70000, distanceFee: 65000, serviceFee: 13000, surcharge: 8000, tax: 4000, discount: 0, total: 160000 },
    currency: 'VND',
  },
  // 顺丰国际 orders (泰国 → LLM-TH)
  {
    orderId: 'LLI-20260321-101', supplierOrderId: 'LLM-TH-99001', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'E002', orderDate: '2026-03-21 09:30', pickupTime: '2026-03-21 10:00', country: '泰国', vehicleType: 'Van',
    pickupAddress: 'Sukhumvit Rd, Khlong Toei', pickupContact: 'Somchai +66 812 345 67',
    dropoffAddress: 'Silom Rd, Bang Rak', dropoffContact: 'Nattaya +66 823 456 78',
    driverInfo: 'กข 1234 / +66 891 234 567', status: '已完成',
    lliAmount: 1437.50, lliFeeBreakdown: { baseFare: 600, distanceFee: 450, serviceFee: 150, surcharge: 100, tax: 137.50, discount: 0, total: 1437.50 },
    llmAmount: 1250.00, llmFeeBreakdown: { baseFare: 520, distanceFee: 390, serviceFee: 130, surcharge: 87, tax: 123.00, discount: 0, total: 1250.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260320-102', supplierOrderId: 'LLM-TH-99002', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'E002', orderDate: '2026-03-20 15:45', pickupTime: '2026-03-20 16:15', country: '泰国', vehicleType: 'Motorcycle',
    pickupAddress: 'Ratchadaphisek Rd, Din Daeng', pickupContact: 'Pradit +66 812 345 67',
    dropoffAddress: 'Phahonyothin Rd, Chatuchak', dropoffContact: 'Wanida +66 834 567 89',
    driverInfo: 'คง 5678 / +66 892 345 678', status: '已完成',
    lliAmount: 1023.50, lliFeeBreakdown: { baseFare: 300, distanceFee: 420, serviceFee: 100, surcharge: 80, tax: 123.50, discount: 0, total: 1023.50 },
    llmAmount: 890.00, llmFeeBreakdown: { baseFare: 260, distanceFee: 365, serviceFee: 87, surcharge: 70, tax: 108.00, discount: 0, total: 890.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260324-104', supplierOrderId: 'LLM-TH-99004', supplierCode: 'LLM-TH', supplierName: 'Lalamove Thailand',
    enterpriseId: 'E002', orderDate: '2026-03-24 10:00', pickupTime: '2026-03-24 10:30', country: '泰国', vehicleType: 'Pickup Truck',
    pickupAddress: 'Rama IV Rd, Pathum Wan', pickupContact: 'Kittisak +66 812 345 67',
    dropoffAddress: 'Lat Phrao Rd, Wang Thonglang', dropoffContact: 'Siriporn +66 845 678 90',
    driverInfo: 'ชซ 3456 / +66 894 567 890', status: '前往装货地',
    lliAmount: 2115.00, lliFeeBreakdown: { baseFare: 900, distanceFee: 750, serviceFee: 200, surcharge: 150, tax: 115.00, discount: 0, total: 2115.00 },
    llmAmount: 1850.00, llmFeeBreakdown: { baseFare: 780, distanceFee: 650, serviceFee: 175, surcharge: 130, tax: 115.00, discount: 0, total: 1850.00 },
    currency: 'THB',
  },
  {
    orderId: 'LLI-20260323-105', supplierOrderId: 'GRAB-TH-55001', supplierCode: 'GRAB-TH', supplierName: 'Grab Thailand',
    enterpriseId: 'E002', orderDate: '2026-03-23 16:30', pickupTime: '2026-03-23 17:00', country: '泰国', vehicleType: '4-Door Car',
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
    enterpriseId: 'E003', orderDate: '2026-03-22 10:00', pickupTime: '2026-03-22 10:30', country: '马来西亚', vehicleType: 'Van',
    pickupAddress: 'Jalan Bukit Bintang, KL', pickupContact: 'Ahmad +60 12 345 6789',
    dropoffAddress: 'Jalan Ampang, KL', dropoffContact: 'Mei Ling +60 13 456 7890',
    driverInfo: 'WKL 1234 / +60 17 123 4567', status: '已完成',
    lliAmount: 52.80, lliFeeBreakdown: { baseFare: 20, distanceFee: 18, serviceFee: 5, surcharge: 3, tax: 6.80, discount: 0, total: 52.80 },
    llmAmount: 45.00, llmFeeBreakdown: { baseFare: 17, distanceFee: 15, serviceFee: 4, surcharge: 3, tax: 6.00, discount: 0, total: 45.00 },
    currency: 'MYR',
  },
  {
    orderId: 'LLI-20260321-202', supplierOrderId: 'LLM-MY-77002', supplierCode: 'LLM-MY', supplierName: 'Lalamove Malaysia',
    enterpriseId: 'E003', orderDate: '2026-03-21 14:30', pickupTime: '2026-03-21 15:00', country: '马来西亚', vehicleType: 'Pickup Truck',
    pickupAddress: 'Petaling Jaya, Selangor', pickupContact: 'Raj +60 12 345 6789',
    dropoffAddress: 'Shah Alam, Selangor', dropoffContact: 'Siti +60 14 567 8901',
    driverInfo: 'BJK 5678 / +60 18 234 5678', status: '已完成',
    lliAmount: 95.70, lliFeeBreakdown: { baseFare: 35, distanceFee: 32, serviceFee: 10, surcharge: 6, tax: 12.70, discount: 0, total: 95.70 },
    llmAmount: 82.00, llmFeeBreakdown: { baseFare: 30, distanceFee: 28, serviceFee: 8, surcharge: 5, tax: 11.00, discount: 0, total: 82.00 },
    currency: 'MYR',
  },
  {
    orderId: 'LLI-20260319-203', supplierOrderId: 'LLM-MY-77003', supplierCode: 'LLM-MY', supplierName: 'Lalamove Malaysia',
    enterpriseId: 'E003', orderDate: '2026-03-19 09:00', pickupTime: '2026-03-19 09:30', country: '马来西亚', vehicleType: 'Small Truck',
    pickupAddress: 'Subang Jaya, Selangor', pickupContact: 'Wei +60 12 345 6789',
    dropoffAddress: 'Klang, Selangor', dropoffContact: 'Hafiz +60 15 678 9012',
    driverInfo: 'BDG 9012 / +60 19 345 6789', status: '已完成',
    lliAmount: 74.50, lliFeeBreakdown: { baseFare: 28, distanceFee: 25, serviceFee: 8, surcharge: 4, tax: 9.50, discount: 0, total: 74.50 },
    llmAmount: 63.00, llmFeeBreakdown: { baseFare: 24, distanceFee: 21, serviceFee: 7, surcharge: 3, tax: 8.00, discount: 0, total: 63.00 },
    currency: 'MYR',
  },
  {
    orderId: 'LLI-20260324-204', supplierOrderId: 'LLM-MY-77004', supplierCode: 'LLM-MY', supplierName: 'Lalamove Malaysia',
    enterpriseId: 'E003', orderDate: '2026-03-24 15:00', pickupTime: '2026-03-24 15:30', country: '马来西亚', vehicleType: 'Van',
    pickupAddress: 'Bangsar South, KL', pickupContact: 'Tan +60 12 345 6789',
    dropoffAddress: 'Mont Kiara, KL', dropoffContact: 'Aisha +60 16 789 0123',
    driverInfo: 'WPJ 3456 / +60 11 456 7890', status: '正在呼叫司机',
    lliAmount: 41.30, lliFeeBreakdown: { baseFare: 20, distanceFee: 10, serviceFee: 0, surcharge: 5, tax: 6.30, discount: 0, total: 41.30 },
    llmAmount: 35.00, llmFeeBreakdown: { baseFare: 17, distanceFee: 9, serviceFee: 0, surcharge: 4, tax: 5.00, discount: 0, total: 35.00 },
    currency: 'MYR',
  },
  {
    orderId: 'LLI-20260317-205', supplierOrderId: 'LLM-MY-77005', supplierCode: 'LLM-MY', supplierName: 'Lalamove Malaysia',
    enterpriseId: 'E003', orderDate: '2026-03-17 11:30', pickupTime: '2026-03-17 12:00', country: '马来西亚', vehicleType: 'Motorcycle',
    pickupAddress: 'KLCC, KL', pickupContact: 'Danny +60 12 345 6789',
    dropoffAddress: 'Mid Valley, KL', dropoffContact: 'Priya +60 17 890 1234',
    driverInfo: 'WA 7777 / +60 12 567 8901', status: '已完成',
    lliAmount: 18.60, lliFeeBreakdown: { baseFare: 8, distanceFee: 5, serviceFee: 0, surcharge: 2, tax: 3.60, discount: 0, total: 18.60 },
    llmAmount: 15.00, llmFeeBreakdown: { baseFare: 7, distanceFee: 4, serviceFee: 0, surcharge: 2, tax: 2.00, discount: 0, total: 15.00 },
    currency: 'MYR',
  },
  // JNE Express orders (印尼 → LLM-ID)
  {
    orderId: 'LLI-20260322-302', supplierOrderId: 'LLM-ID-66002', supplierCode: 'LLM-ID', supplierName: 'Lalamove Indonesia',
    enterpriseId: 'E004', orderDate: '2026-03-22 08:45', pickupTime: '2026-03-22 09:15', country: '印尼', vehicleType: 'Van',
    pickupAddress: 'Jl. Sudirman, Jakarta Pusat', pickupContact: 'Budi +62 21 2345678',
    dropoffAddress: 'Jl. Gatot Subroto, Jakarta Selatan', dropoffContact: 'Siti +62 812 3456 7890',
    driverInfo: 'B 1234 ABC / +62 813 4567 8901', status: '已完成',
    lliAmount: 485000, lliFeeBreakdown: { baseFare: 200000, distanceFee: 150000, serviceFee: 50000, surcharge: 40000, tax: 45000, discount: 0, total: 485000 },
    llmAmount: 420000, llmFeeBreakdown: { baseFare: 175000, distanceFee: 130000, serviceFee: 43000, surcharge: 35000, tax: 37000, discount: 0, total: 420000 },
    currency: 'IDR',
  },
  {
    orderId: 'LLI-20260323-303', supplierOrderId: 'LLM-ID-66003', supplierCode: 'LLM-ID', supplierName: 'Lalamove Indonesia',
    enterpriseId: 'E004', orderDate: '2026-03-23 11:20', pickupTime: '2026-03-23 11:50', country: '印尼', vehicleType: 'Small Truck',
    pickupAddress: 'Jl. Thamrin, Jakarta Pusat', pickupContact: 'Agus +62 21 2345678',
    dropoffAddress: 'Jl. Kuningan, Jakarta Selatan', dropoffContact: 'Dewi +62 812 9876 5432',
    driverInfo: 'B 5678 DEF / +62 814 5678 9012', status: '已完成',
    lliAmount: 720000, lliFeeBreakdown: { baseFare: 300000, distanceFee: 250000, serviceFee: 80000, surcharge: 60000, tax: 30000, discount: 0, total: 720000 },
    llmAmount: 625000, llmFeeBreakdown: { baseFare: 260000, distanceFee: 215000, serviceFee: 70000, surcharge: 55000, tax: 25000, discount: 0, total: 625000 },
    currency: 'IDR',
  },
  {
    orderId: 'LLI-20260324-304', supplierOrderId: 'LLM-ID-66004', supplierCode: 'LLM-ID', supplierName: 'Lalamove Indonesia',
    enterpriseId: 'E004', orderDate: '2026-03-24 14:00', pickupTime: '2026-03-24 14:30', country: '印尼', vehicleType: 'Motorcycle',
    pickupAddress: 'Monas, Jakarta Pusat', pickupContact: 'Eko +62 21 2345678',
    dropoffAddress: 'Kota Tua, Jakarta Barat', dropoffContact: 'Maya +62 815 6789 0123',
    driverInfo: 'B 9012 GHI / +62 815 6789 0123', status: '已完成',
    lliAmount: 38000, lliFeeBreakdown: { baseFare: 15000, distanceFee: 12000, serviceFee: 5000, surcharge: 3000, tax: 3000, discount: 0, total: 38000 },
    llmAmount: 33000, llmFeeBreakdown: { baseFare: 13000, distanceFee: 10000, serviceFee: 4000, surcharge: 3000, tax: 3000, discount: 0, total: 33000 },
    currency: 'IDR',
  },
  {
    orderId: 'LLI-20260324-305', supplierOrderId: 'GRAB-ID-44001', supplierCode: 'GRAB-ID', supplierName: 'Grab Indonesia',
    enterpriseId: 'E004', orderDate: '2026-03-24 16:45', pickupTime: '2026-03-24 17:15', country: '印尼', vehicleType: '4-Door Car',
    pickupAddress: 'SCBD, Jakarta Selatan', pickupContact: 'Andi +62 21 2345678',
    dropoffAddress: 'Kemang, Jakarta Selatan', dropoffContact: 'Rina +62 816 7890 1234',
    driverInfo: '-', status: '正在呼叫司机',
    lliAmount: 65000, lliFeeBreakdown: { baseFare: 25000, distanceFee: 20000, serviceFee: 10000, surcharge: 5000, tax: 5000, discount: 0, total: 65000 },
    llmAmount: 56000, llmFeeBreakdown: { baseFare: 22000, distanceFee: 17000, serviceFee: 9000, surcharge: 4000, tax: 4000, discount: 0, total: 56000 },
    currency: 'IDR',
  },
  {
    orderId: 'LLI-20260315-306', supplierOrderId: 'LLM-ID-66005', supplierCode: 'LLM-ID', supplierName: 'Lalamove Indonesia',
    enterpriseId: 'E004', orderDate: '2026-03-15 09:30', pickupTime: '2026-03-15 10:00', country: '印尼', vehicleType: 'Van',
    pickupAddress: 'Tanjung Priok, Jakarta Utara', pickupContact: 'Hadi +62 21 2345678',
    dropoffAddress: 'Cengkareng, Jakarta Barat', dropoffContact: 'Lina +62 817 8901 2345',
    driverInfo: '-', status: '已取消',
    lliAmount: 0, lliFeeBreakdown: { baseFare: 0, distanceFee: 0, serviceFee: 0, surcharge: 0, tax: 0, discount: 0, total: 0 },
    llmAmount: 0, llmFeeBreakdown: { baseFare: 0, distanceFee: 0, serviceFee: 0, surcharge: 0, tax: 0, discount: 0, total: 0 },
    currency: 'IDR',
  },
  {
    orderId: 'LLI-20260310-307', supplierOrderId: 'LLM-ID-66006', supplierCode: 'LLM-ID', supplierName: 'Lalamove Indonesia',
    enterpriseId: 'E004', orderDate: '2026-03-10 13:15', pickupTime: '2026-03-10 13:45', country: '印尼', vehicleType: 'Pickup Truck',
    pickupAddress: 'Blok M, Jakarta Selatan', pickupContact: 'Yanto +62 21 2345678',
    dropoffAddress: 'Pondok Indah, Jakarta Selatan', dropoffContact: 'Siska +62 818 9012 3456',
    driverInfo: 'B 2345 PQR / +62 818 9012 3456', status: '已完成',
    lliAmount: 185000, lliFeeBreakdown: { baseFare: 80000, distanceFee: 60000, serviceFee: 20000, surcharge: 15000, tax: 10000, discount: 0, total: 185000 },
    llmAmount: 160000, llmFeeBreakdown: { baseFare: 70000, distanceFee: 52000, serviceFee: 17000, surcharge: 13000, tax: 8000, discount: 0, total: 160000 },
    currency: 'IDR',
  },
];
