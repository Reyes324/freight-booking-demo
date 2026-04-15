/**
 * 管理员账号 Mock 数据
 *
 * 数据持久化策略：
 * - 初始数据存储在这里（代码中）
 * - 运行时数据存储在 localStorage（键名：'administrators'）
 * - 首次加载时，如果 localStorage 为空，使用初始数据
 * - 之后所有增删改操作都保存到 localStorage
 */

import type { Administrator } from '@/types/auth';

/**
 * 初始管理员数据（仅在首次加载时使用）
 */
export const initialAdministrators: Administrator[] = [
  {
    id: 'ADM001',
    username: 'admin',
    password: 'Admin@2026',
    role: 'super_admin',
    name: '系统管理员',
    status: 'active',
    cannotBeDeleted: true,
    mustChangePassword: true, // 首次登录强制修改密码
    createdAt: '2026-01-01 00:00:00',
    createdBy: 'SYSTEM',
  },
  {
    id: 'ADM002',
    username: 'operator1',
    password: 'Op123456',
    role: 'admin',
    name: '运营人员1',
    status: 'active',
    createdAt: '2026-02-15 10:30:00',
    createdBy: 'ADM001',
  },
  {
    id: 'ADM003',
    username: 'operator2',
    password: 'Op123456',
    role: 'admin',
    name: '运营人员2',
    status: 'disabled', // 已禁用示例
    createdAt: '2026-03-01 14:20:00',
    createdBy: 'ADM001',
  },
];

const STORAGE_KEY = 'administrators';

/**
 * 从 localStorage 加载管理员列表
 * 如果 localStorage 为空，使用初始数据
 */
export function loadAdministrators(): Administrator[] {
  if (typeof window === 'undefined') {
    return initialAdministrators;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      // 首次加载，保存初始数据到 localStorage
      saveAdministrators(initialAdministrators);
      return initialAdministrators;
    }
  } catch (error) {
    console.error('Failed to load administrators from localStorage:', error);
    return initialAdministrators;
  }
}

/**
 * 保存管理员列表到 localStorage
 */
export function saveAdministrators(administrators: Administrator[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(administrators));
  } catch (error) {
    console.error('Failed to save administrators to localStorage:', error);
  }
}

/**
 * 重置为初始数据（仅用于测试/调试）
 */
export function resetAdministrators(): void {
  saveAdministrators(initialAdministrators);
}
