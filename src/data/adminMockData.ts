export interface Enterprise {
  id: string;
  name: string;
  phone: string;
  password: string;
  countryCode: string;
  country: string;
  currency: string;
  premiumRate: number;
  creditLimit: number;
  usedCredit: number;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  enterpriseId: string;
  date: string;
  orderId: string | null;
  description: string;
  amount: number;
  currency: string;
}

export interface AdminOrder {
  orderId: string;
  llmOrderId: string;
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
  llmAmount: number;
  currency: string;
}

// ========== Enterprises ==========
export const enterprises: Enterprise[] = [
  {
    id: 'ent-001',
    name: '菜鸟速递',
    phone: '63123456',
    password: 'Cainiao@2025',
    countryCode: '+852',
    country: '香港',
    currency: 'HK$',
    premiumRate: 1.15,
    creditLimit: 50000,
    usedCredit: 12500,
    createdAt: '2025-11-01',
  },
  {
    id: 'ent-002',
    name: '顺丰国际',
    phone: '81234567',
    password: 'SF@2025intl',
    countryCode: '+66',
    country: '泰国',
    currency: 'THB',
    premiumRate: 1.20,
    creditLimit: 200000,
    usedCredit: 45000,
    createdAt: '2025-12-15',
  },
  {
    id: 'ent-003',
    name: '极兔快递',
    phone: '13800138000',
    password: 'JT@express2025',
    countryCode: '+86',
    country: '中国',
    currency: 'CNY',
    premiumRate: 1.10,
    creditLimit: 100000,
    usedCredit: 78200,
    createdAt: '2026-01-08',
  },
  {
    id: 'ent-004',
    name: 'Flash Express',
    phone: '91234567',
    password: 'Flash@2026',
    countryCode: '+66',
    country: '泰国',
    currency: 'THB',
    premiumRate: 1.18,
    creditLimit: 150000,
    usedCredit: 32000,
    createdAt: '2026-02-20',
  },
];

// ========== Credit Transactions ==========
export const creditTransactions: CreditTransaction[] = [
  // 菜鸟速递
  { id: 'tx-001', enterpriseId: 'ent-001', date: '2026-03-20 14:30', orderId: 'ORD-20260320-001', description: '订单支付', amount: -74, currency: 'HK$' },
  { id: 'tx-002', enterpriseId: 'ent-001', date: '2026-03-19 10:15', orderId: null, description: '额度调整', amount: 500, currency: 'HK$' },
  { id: 'tx-003', enterpriseId: 'ent-001', date: '2026-03-18 09:45', orderId: 'ORD-20260318-003', description: '订单支付', amount: -128, currency: 'HK$' },
  { id: 'tx-004', enterpriseId: 'ent-001', date: '2026-03-15 16:20', orderId: 'ORD-20260315-002', description: '订单支付', amount: -256, currency: 'HK$' },
  { id: 'tx-005', enterpriseId: 'ent-001', date: '2026-03-12 11:00', orderId: 'ORD-20260312-001', description: '订单支付', amount: -185, currency: 'HK$' },
  { id: 'tx-006', enterpriseId: 'ent-001', date: '2026-03-01 00:00', orderId: null, description: '月度额度重置', amount: 50000, currency: 'HK$' },
  // 顺丰国际
  { id: 'tx-101', enterpriseId: 'ent-002', date: '2026-03-21 09:30', orderId: 'ORD-20260321-101', description: '订单支付', amount: -1250, currency: 'THB' },
  { id: 'tx-102', enterpriseId: 'ent-002', date: '2026-03-20 15:45', orderId: 'ORD-20260320-102', description: '订单支付', amount: -890, currency: 'THB' },
  { id: 'tx-103', enterpriseId: 'ent-002', date: '2026-03-18 08:20', orderId: null, description: '额度调整', amount: 5000, currency: 'THB' },
  { id: 'tx-104', enterpriseId: 'ent-002', date: '2026-03-15 14:10', orderId: 'ORD-20260315-103', description: '订单支付', amount: -2100, currency: 'THB' },
  { id: 'tx-105', enterpriseId: 'ent-002', date: '2026-03-01 00:00', orderId: null, description: '月度额度重置', amount: 200000, currency: 'THB' },
  // 极兔快递
  { id: 'tx-201', enterpriseId: 'ent-003', date: '2026-03-22 10:00', orderId: 'ORD-20260322-201', description: '订单支付', amount: -320, currency: 'CNY' },
  { id: 'tx-202', enterpriseId: 'ent-003', date: '2026-03-21 14:30', orderId: 'ORD-20260321-202', description: '订单支付', amount: -580, currency: 'CNY' },
  { id: 'tx-203', enterpriseId: 'ent-003', date: '2026-03-19 09:00', orderId: 'ORD-20260319-203', description: '订单支付', amount: -450, currency: 'CNY' },
  { id: 'tx-204', enterpriseId: 'ent-003', date: '2026-03-01 00:00', orderId: null, description: '月度额度重置', amount: 100000, currency: 'CNY' },
  // Flash Express
  { id: 'tx-301', enterpriseId: 'ent-004', date: '2026-03-23 11:15', orderId: 'ORD-20260323-301', description: '订单支付', amount: -1800, currency: 'THB' },
  { id: 'tx-302', enterpriseId: 'ent-004', date: '2026-03-22 08:45', orderId: 'ORD-20260322-302', description: '订单支付', amount: -950, currency: 'THB' },
  { id: 'tx-303', enterpriseId: 'ent-004', date: '2026-03-01 00:00', orderId: null, description: '月度额度重置', amount: 150000, currency: 'THB' },
];

// ========== Orders ==========
export const adminOrders: AdminOrder[] = [
  // 菜鸟速递 orders
  { orderId: 'ORD-20260320-001', llmOrderId: 'LLM-HK-88001', enterpriseId: 'ent-001', orderDate: '2026-03-20 14:30', country: '香港', vehicleType: 'Van', pickupAddress: '中环皇后大道中 99 号', pickupContact: '李明 +852 6312 3456', dropoffAddress: '尖沙咀广东道 28 号', dropoffContact: '王芳 +852 9876 5432', driverInfo: 'AB 1234 / +852 5111 2222', status: '已完成', lliAmount: 64.35, llmAmount: 74.00, currency: 'HK$' },
  { orderId: 'ORD-20260318-003', llmOrderId: 'LLM-HK-88002', enterpriseId: 'ent-001', orderDate: '2026-03-18 09:45', country: '香港', vehicleType: 'Pickup Truck', pickupAddress: '葵涌工业区 12 号', pickupContact: '陈生 +852 6312 3456', dropoffAddress: '观塘开源道 50 号', dropoffContact: '张太 +852 6234 5678', driverInfo: 'CD 5678 / +852 5222 3333', status: '已完成', lliAmount: 111.30, llmAmount: 128.00, currency: 'HK$' },
  { orderId: 'ORD-20260315-002', llmOrderId: 'LLM-HK-88003', enterpriseId: 'ent-001', orderDate: '2026-03-15 16:20', country: '香港', vehicleType: 'Small Truck', pickupAddress: '新蒲岗大有街 1 号', pickupContact: '刘先生 +852 6312 3456', dropoffAddress: '荃湾德士古道 200 号', dropoffContact: '何小姐 +852 9345 6789', driverInfo: 'EF 9012 / +852 5333 4444', status: '已完成', lliAmount: 222.61, llmAmount: 256.00, currency: 'HK$' },
  { orderId: 'ORD-20260312-001', llmOrderId: 'LLM-HK-88004', enterpriseId: 'ent-001', orderDate: '2026-03-12 11:00', country: '香港', vehicleType: 'Van', pickupAddress: '铜锣湾轩尼诗道 500 号', pickupContact: '赵明 +852 6312 3456', dropoffAddress: '北角英皇道 600 号', dropoffContact: '孙丽 +852 9456 7890', driverInfo: 'GH 3456 / +852 5444 5555', status: '已完成', lliAmount: 160.87, llmAmount: 185.00, currency: 'HK$' },
  { orderId: 'ORD-20260324-005', llmOrderId: 'LLM-HK-88005', enterpriseId: 'ent-001', orderDate: '2026-03-24 08:30', country: '香港', vehicleType: 'Van', pickupAddress: '湾仔港湾道 25 号', pickupContact: '周敏 +852 6312 3456', dropoffAddress: '深水埗长沙湾道 888 号', dropoffContact: '吴刚 +852 9567 8901', driverInfo: 'IJ 7890 / +852 5555 6666', status: '进行中', lliAmount: 82.61, llmAmount: 95.00, currency: 'HK$' },
  // 顺丰国际 orders
  { orderId: 'ORD-20260321-101', llmOrderId: 'LLM-TH-99001', enterpriseId: 'ent-002', orderDate: '2026-03-21 09:30', country: '泰国', vehicleType: 'Van', pickupAddress: 'Sukhumvit Rd, Khlong Toei', pickupContact: 'Somchai +66 812 345 67', dropoffAddress: 'Silom Rd, Bang Rak', dropoffContact: 'Nattaya +66 823 456 78', driverInfo: 'กข 1234 / +66 891 234 567', status: '已完成', lliAmount: 1041.67, llmAmount: 1250.00, currency: 'THB' },
  { orderId: 'ORD-20260320-102', llmOrderId: 'LLM-TH-99002', enterpriseId: 'ent-002', orderDate: '2026-03-20 15:45', country: '泰国', vehicleType: 'Motorcycle', pickupAddress: 'Ratchadaphisek Rd, Din Daeng', pickupContact: 'Pradit +66 812 345 67', dropoffAddress: 'Phahonyothin Rd, Chatuchak', dropoffContact: 'Wanida +66 834 567 89', driverInfo: 'คง 5678 / +66 892 345 678', status: '已完成', lliAmount: 741.67, llmAmount: 890.00, currency: 'THB' },
  { orderId: 'ORD-20260315-103', llmOrderId: 'LLM-TH-99003', enterpriseId: 'ent-002', orderDate: '2026-03-15 14:10', country: '泰国', vehicleType: 'Pickup Truck', pickupAddress: 'Rama IV Rd, Pathum Wan', pickupContact: 'Kittisak +66 812 345 67', dropoffAddress: 'Lat Phrao Rd, Wang Thonglang', dropoffContact: 'Siriporn +66 845 678 90', driverInfo: 'จฉ 9012 / +66 893 456 789', status: '已完成', lliAmount: 1750.00, llmAmount: 2100.00, currency: 'THB' },
  { orderId: 'ORD-20260324-104', llmOrderId: 'LLM-TH-99004', enterpriseId: 'ent-002', orderDate: '2026-03-24 10:00', country: '泰国', vehicleType: 'Van', pickupAddress: 'Charoen Krung Rd, Samphanthawong', pickupContact: 'Apinya +66 812 345 67', dropoffAddress: 'Petchaburi Rd, Ratchathewi', dropoffContact: 'Chalerm +66 856 789 01', driverInfo: 'ชซ 3456 / +66 894 567 890', status: '进行中', lliAmount: 916.67, llmAmount: 1100.00, currency: 'THB' },
  { orderId: 'ORD-20260323-105', llmOrderId: 'LLM-TH-99005', enterpriseId: 'ent-002', orderDate: '2026-03-23 16:30', country: '泰国', vehicleType: '4-Door Car', pickupAddress: 'Wireless Rd, Lumphini', pickupContact: 'Tanawat +66 812 345 67', dropoffAddress: 'Thonglor Soi 13', dropoffContact: 'Parichat +66 867 890 12', driverInfo: 'ฌญ 7890 / +66 895 678 901', status: '已完成', lliAmount: 625.00, llmAmount: 750.00, currency: 'THB' },
  // 极兔快递 orders
  { orderId: 'ORD-20260322-201', llmOrderId: 'LLM-CN-77001', enterpriseId: 'ent-003', orderDate: '2026-03-22 10:00', country: '中国', vehicleType: 'Van', pickupAddress: '深圳市南山区科技园南路 1 号', pickupContact: '张伟 138 0013 8000', dropoffAddress: '深圳市福田区华强北路 88 号', dropoffContact: '李娜 139 0013 9000', driverInfo: '粤B 12345 / 135 1234 5678', status: '已完成', lliAmount: 290.91, llmAmount: 320.00, currency: 'CNY' },
  { orderId: 'ORD-20260321-202', llmOrderId: 'LLM-CN-77002', enterpriseId: 'ent-003', orderDate: '2026-03-21 14:30', country: '中国', vehicleType: 'Pickup Truck', pickupAddress: '广州市天河区体育西路 191 号', pickupContact: '王强 138 0013 8000', dropoffAddress: '广州市番禺区大石街 108 号', dropoffContact: '刘洋 136 0013 6000', driverInfo: '粤A 67890 / 136 5678 9012', status: '已完成', lliAmount: 527.27, llmAmount: 580.00, currency: 'CNY' },
  { orderId: 'ORD-20260319-203', llmOrderId: 'LLM-CN-77003', enterpriseId: 'ent-003', orderDate: '2026-03-19 09:00', country: '中国', vehicleType: 'Small Truck', pickupAddress: '东莞市虎门镇连升路 55 号', pickupContact: '赵磊 138 0013 8000', dropoffAddress: '东莞市厚街镇家具大道 200 号', dropoffContact: '陈芳 137 0013 7000', driverInfo: '粤S 11111 / 137 1111 2222', status: '已完成', lliAmount: 409.09, llmAmount: 450.00, currency: 'CNY' },
  { orderId: 'ORD-20260324-204', llmOrderId: 'LLM-CN-77004', enterpriseId: 'ent-003', orderDate: '2026-03-24 15:00', country: '中国', vehicleType: 'Van', pickupAddress: '深圳市宝安区西乡街道 66 号', pickupContact: '孙涛 138 0013 8000', dropoffAddress: '深圳市龙华区民治街道 100 号', dropoffContact: '周静 138 0013 8001', driverInfo: '粤B 22222 / 138 2222 3333', status: '进行中', lliAmount: 254.55, llmAmount: 280.00, currency: 'CNY' },
  { orderId: 'ORD-20260317-205', llmOrderId: 'LLM-CN-77005', enterpriseId: 'ent-003', orderDate: '2026-03-17 11:30', country: '中国', vehicleType: 'Motorcycle', pickupAddress: '深圳市罗湖区东门步行街 1 号', pickupContact: '吴明 138 0013 8000', dropoffAddress: '深圳市罗湖区国贸大厦', dropoffContact: '郑华 135 0013 5000', driverInfo: '粤B 33333 / 139 3333 4444', status: '已完成', lliAmount: 45.45, llmAmount: 50.00, currency: 'CNY' },
  { orderId: 'ORD-20260314-206', llmOrderId: 'LLM-CN-77006', enterpriseId: 'ent-003', orderDate: '2026-03-14 08:00', country: '中国', vehicleType: 'Van', pickupAddress: '佛山市顺德区大良街道 300 号', pickupContact: '黄鑫 138 0013 8000', dropoffAddress: '佛山市禅城区祖庙路 99 号', dropoffContact: '许丽 134 0013 4000', driverInfo: '粤E 44444 / 134 4444 5555', status: '已完成', lliAmount: 181.82, llmAmount: 200.00, currency: 'CNY' },
  // Flash Express orders
  { orderId: 'ORD-20260323-301', llmOrderId: 'LLM-TH-66001', enterpriseId: 'ent-004', orderDate: '2026-03-23 11:15', country: '泰国', vehicleType: 'Pickup Truck', pickupAddress: 'Bang Na-Trat Rd, Bang Na', pickupContact: 'Anurak +66 912 345 67', dropoffAddress: 'Samut Prakan Industrial Estate', dropoffContact: 'Suwanna +66 923 456 78', driverInfo: 'ฎฏ 1111 / +66 896 789 012', status: '已完成', lliAmount: 1525.42, llmAmount: 1800.00, currency: 'THB' },
  { orderId: 'ORD-20260322-302', llmOrderId: 'LLM-TH-66002', enterpriseId: 'ent-004', orderDate: '2026-03-22 08:45', country: '泰国', vehicleType: 'Van', pickupAddress: 'Ngamwongwan Rd, Nonthaburi', pickupContact: 'Piyapong +66 912 345 67', dropoffAddress: 'Muang Thong Thani, Pak Kret', dropoffContact: 'Ratana +66 934 567 89', driverInfo: 'ฐฑ 2222 / +66 897 890 123', status: '已完成', lliAmount: 805.08, llmAmount: 950.00, currency: 'THB' },
  { orderId: 'ORD-20260324-303', llmOrderId: 'LLM-TH-66003', enterpriseId: 'ent-004', orderDate: '2026-03-24 14:00', country: '泰国', vehicleType: 'Small Truck', pickupAddress: 'Rama II Rd, Samae Dam', pickupContact: 'Worapat +66 912 345 67', dropoffAddress: 'Bangpakong Industrial Park', dropoffContact: 'Jintana +66 945 678 90', driverInfo: 'ฒณ 3333 / +66 898 901 234', status: '进行中', lliAmount: 2118.64, llmAmount: 2500.00, currency: 'THB' },
  { orderId: 'ORD-20260319-304', llmOrderId: 'LLM-TH-66004', enterpriseId: 'ent-004', orderDate: '2026-03-19 13:20', country: '泰国', vehicleType: 'Motorcycle', pickupAddress: 'Siam Square Soi 7', pickupContact: 'Chanin +66 912 345 67', dropoffAddress: 'Ekamai Soi 5', dropoffContact: 'Naruemon +66 956 789 01', driverInfo: 'ดต 4444 / +66 899 012 345', status: '已完成', lliAmount: 423.73, llmAmount: 500.00, currency: 'THB' },
  { orderId: 'ORD-20260316-305', llmOrderId: 'LLM-TH-66005', enterpriseId: 'ent-004', orderDate: '2026-03-16 10:00', country: '泰国', vehicleType: 'Van', pickupAddress: 'Ratchayothin, Chatuchak', pickupContact: 'Boonmee +66 912 345 67', dropoffAddress: 'Don Mueang, Lak Si', dropoffContact: 'Araya +66 967 890 12', driverInfo: 'ถท 5555 / +66 890 123 456', status: '已完成', lliAmount: 677.97, llmAmount: 800.00, currency: 'THB' },
];
