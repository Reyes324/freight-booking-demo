import type { Rule } from 'antd/es/form';
import { enterprises } from '@/data/adminMockData';
import {
  phoneDigitsMap,
  ENTERPRISE_NAME_MIN_LENGTH,
  ENTERPRISE_NAME_MAX_LENGTH,
  ENTERPRISE_NAME_FORBIDDEN_CHARS,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_PATTERN,
  PREMIUM_RATE_MIN,
  PREMIUM_RATE_MAX,
  CREDIT_LIMIT_MIN,
  CREDIT_LIMIT_MAX,
} from '@/data/enterpriseConstants';

/** 生成企业ID：ENT-YYYYMMDD-XXX */
export function generateEnterpriseId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const datePart = `${y}${m}${d}`;

  // 找到同日最大序号
  const prefix = `ENT-${datePart}-`;
  const existing = enterprises
    .filter((e) => e.id.startsWith(prefix))
    .map((e) => parseInt(e.id.slice(prefix.length), 10))
    .filter((n) => !isNaN(n));

  const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
}

/** 企业名称校验规则 */
export function getEnterpriseNameRules(excludeId?: string): Rule[] {
  return [
    { required: true, message: '请输入企业名称' },
    { min: ENTERPRISE_NAME_MIN_LENGTH, message: `至少 ${ENTERPRISE_NAME_MIN_LENGTH} 个字符` },
    { max: ENTERPRISE_NAME_MAX_LENGTH, message: `最多 ${ENTERPRISE_NAME_MAX_LENGTH} 个字符` },
    {
      validator: (_, value: string) => {
        if (value && ENTERPRISE_NAME_FORBIDDEN_CHARS.test(value)) {
          return Promise.reject('不能包含特殊字符 < > \' " & \\');
        }
        return Promise.resolve();
      },
    },
    {
      validator: (_, value: string) => {
        if (!value) return Promise.resolve();
        const duplicate = enterprises.find(
          (e) => e.name === value.trim() && e.id !== excludeId
        );
        if (duplicate) return Promise.reject('企业名称已存在');
        return Promise.resolve();
      },
    },
  ];
}

/** 手机号校验规则 */
export function getPhoneRules(countryCode: string, excludeId?: string): Rule[] {
  const digits = phoneDigitsMap[countryCode] || { min: 8, max: 11 };
  const digitDesc = digits.min === digits.max
    ? `${digits.min} 位`
    : `${digits.min}-${digits.max} 位`;

  return [
    { required: true, message: '请输入手机号' },
    {
      validator: (_, value: string) => {
        if (!value) return Promise.resolve();
        if (!/^\d+$/.test(value)) return Promise.reject('手机号只能包含数字');
        if (value.length < digits.min || value.length > digits.max) {
          return Promise.reject(`该地区手机号应为 ${digitDesc}`);
        }
        return Promise.resolve();
      },
    },
    {
      validator: (_, value: string) => {
        if (!value) return Promise.resolve();
        const duplicate = enterprises.find(
          (e) => e.phone === value && e.countryCode === countryCode && e.id !== excludeId
        );
        if (duplicate) return Promise.reject('该手机号已被注册');
        return Promise.resolve();
      },
    },
  ];
}

/** 密码校验规则 */
export const passwordRules: Rule[] = [
  { required: true, message: '请输入登录密码' },
  { min: PASSWORD_MIN_LENGTH, message: `至少 ${PASSWORD_MIN_LENGTH} 个字符` },
  { max: PASSWORD_MAX_LENGTH, message: `最多 ${PASSWORD_MAX_LENGTH} 个字符` },
  {
    pattern: PASSWORD_PATTERN,
    message: '密码必须包含字母和数字',
  },
];

/** 溢价系数校验规则 */
export const premiumRateRules: Rule[] = [
  { required: true, message: '请输入溢价系数' },
  {
    type: 'number',
    min: PREMIUM_RATE_MIN,
    max: PREMIUM_RATE_MAX,
    message: `溢价系数范围 ${PREMIUM_RATE_MIN.toFixed(2)} ~ ${PREMIUM_RATE_MAX.toFixed(2)}`,
  },
];

/** 额度校验规则 */
export const creditLimitRules: Rule[] = [
  { required: true, message: '请输入额度' },
  {
    type: 'number',
    min: CREDIT_LIMIT_MIN,
    max: CREDIT_LIMIT_MAX,
    message: `额度范围 ${CREDIT_LIMIT_MIN.toLocaleString()} ~ ${CREDIT_LIMIT_MAX.toLocaleString()}`,
  },
];
