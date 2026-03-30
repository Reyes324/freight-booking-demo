// 地区号下拉选项
export const countryCodes = [
  { value: '+852', label: '+852 香港' },
  { value: '+66', label: '+66 泰国' },
  { value: '+86', label: '+86 中国' },
  { value: '+65', label: '+65 新加坡' },
  { value: '+60', label: '+60 马来西亚' },
];

// 币种下拉选项（账期管理统一使用 CNY，此选项仅用于显示）
export const currencyOptions = [
  { value: 'CNY', label: 'CNY 人民币' },  // CNY 置顶
  { value: 'HK$', label: 'HK$ 港币' },
  { value: 'THB', label: 'THB 泰铢' },
  { value: 'SGD', label: 'SGD 新加坡元' },
  { value: 'MYR', label: 'MYR 马来西亚林吉特' },
];

// 地区号 → 国家 + 币种 映射
// currency: 账期管理币种（统一为 CNY）
// localCurrency: 当地货币（用于订单结算）
export const regionMap: Record<string, { country: string; currency: string; localCurrency: string }> = {
  '+852': { country: '香港', currency: 'CNY', localCurrency: 'HKD' },
  '+66':  { country: '泰国', currency: 'CNY', localCurrency: 'THB' },
  '+86':  { country: '中国', currency: 'CNY', localCurrency: 'CNY' },
  '+65':  { country: '新加坡', currency: 'CNY', localCurrency: 'SGD' },
  '+60':  { country: '马来西亚', currency: 'CNY', localCurrency: 'MYR' },
};

// 地区号 → 当地货币映射（用于订单结算）
export const localCurrencyMap: Record<string, string> = {
  '+852': 'HKD',
  '+66': 'THB',
  '+86': 'CNY',
  '+65': 'SGD',
  '+60': 'MYR',
};

// 地区号 → 手机号位数规则
export const phoneDigitsMap: Record<string, { min: number; max: number }> = {
  '+852': { min: 8, max: 8 },
  '+66':  { min: 9, max: 9 },
  '+86':  { min: 11, max: 11 },
  '+65':  { min: 8, max: 8 },
  '+60':  { min: 10, max: 11 },
};

// 校验常量
export const ENTERPRISE_NAME_MAX_LENGTH = 50;
export const ENTERPRISE_NAME_MIN_LENGTH = 2;
export const ENTERPRISE_NAME_FORBIDDEN_CHARS = /[<>'"&\\]/;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export const PREMIUM_RATE_MIN = 1.00;
export const PREMIUM_RATE_MAX = 3.00;

export const CREDIT_LIMIT_MIN = 0;
export const CREDIT_LIMIT_MAX = 10000000;
