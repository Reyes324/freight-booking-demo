// 地区号下拉选项
export const countryCodes = [
  { value: '+60', label: '+60 马来西亚' },
  { value: '+84', label: '+84 越南' },
  { value: '+66', label: '+66 泰国' },
  { value: '+62', label: '+62 印尼' },
];

// 币种下拉选项（账期管理统一使用 CNY，此选项仅用于显示参考）
export const currencyOptions = [
  { value: 'CNY', label: 'CNY 人民币' },
  { value: 'MYR', label: 'MYR 马来西亚林吉特' },
  { value: 'VND', label: 'VND 越南盾' },
  { value: 'THB', label: 'THB 泰铢' },
  { value: 'IDR', label: 'IDR 印尼盾' },
];

// 地区号 → 国家 + 币种 映射
// currency: 账期管理币种（统一为 CNY）
// localCurrency: 当地货币（用于订单结算）
export const regionMap: Record<string, { country: string; currency: string; localCurrency: string }> = {
  '+60': { country: '马来西亚', currency: 'CNY', localCurrency: 'MYR' },
  '+84': { country: '越南', currency: 'CNY', localCurrency: 'VND' },
  '+66': { country: '泰国', currency: 'CNY', localCurrency: 'THB' },
  '+62': { country: '印尼', currency: 'CNY', localCurrency: 'IDR' },
};

// 地区号 → 当地货币映射（用于订单结算）
export const localCurrencyMap: Record<string, string> = {
  '+60': 'MYR',
  '+84': 'VND',
  '+66': 'THB',
  '+62': 'IDR',
};

// 地区号 → 手机号位数规则
export const phoneDigitsMap: Record<string, { min: number; max: number }> = {
  '+60': { min: 9,  max: 11 }, // 马来西亚: 9-11位
  '+84': { min: 9,  max: 10 }, // 越南: 9-10位
  '+66': { min: 9,  max: 9 },  // 泰国: 9位
  '+62': { min: 9,  max: 12 }, // 印尼: 9-12位
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
