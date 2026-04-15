/**
 * 管理员认证工具函数（Demo 简化版）
 */

import type { Administrator } from '@/types/auth';

const CURRENT_ADMIN_KEY = 'currentAdmin';

// Demo 默认管理员
const DEFAULT_ADMIN: Administrator = {
  id: 'ADM001',
  username: 'admin',
  password: 'Admin@2026',
  role: 'super_admin',
  name: '系统管理员',
  status: 'active',
  cannotBeDeleted: true,
  createdAt: '2026-01-01 00:00:00',
  createdBy: 'SYSTEM',
};

/**
 * 获取当前登录的管理员（简化版，不做严格验证）
 */
export function getCurrentAdmin(): Administrator | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CURRENT_ADMIN_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as Administrator;
  } catch {
    return null;
  }
}

/**
 * 登录（Demo 简化版）
 */
export function login(credentials: { username: string; password: string }): {
  success: boolean;
  admin?: Administrator;
  error?: string;
} {
  // Demo 模式：直接登录成功
  const admin = { ...DEFAULT_ADMIN };

  try {
    localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(admin));
    document.cookie = 'auth=true; path=/; max-age=86400';
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, error: '登录失败' };
  }

  return { success: true, admin };
}

/**
 * 退出登录
 */
export function logout(): void {
  try {
    localStorage.removeItem(CURRENT_ADMIN_KEY);
    document.cookie = 'auth=; path=/; max-age=0';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

/**
 * 修改密码（Demo 空实现）
 */
export function changePassword(
  oldPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  return { success: true };
}
