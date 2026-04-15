/**
 * 管理员账号管理工具函数（Demo 简化版）
 */

import type { Administrator, CreateAdministratorData, AdminStatus } from '@/types/auth';
import { loadAdministrators, saveAdministrators } from '@/data/adminAuthData';
import { getCurrentAdmin } from '@/utils/adminAuth';

/**
 * 生成管理员 ID
 */
export function generateAdministratorId(): string {
  const administrators = loadAdministrators();
  const maxId = administrators.reduce((max, admin) => {
    const num = parseInt(admin.id.replace('ADM', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `ADM${String(maxId + 1).padStart(3, '0')}`;
}

/**
 * 验证账号唯一性
 */
export function validateUsername(username: string, excludeId?: string): boolean {
  const administrators = loadAdministrators();
  return !administrators.some(
    (admin) => admin.username === username && admin.id !== excludeId
  );
}

/**
 * 创建管理员
 */
export function createAdministrator(
  data: CreateAdministratorData,
  creatorId: string
): { success: boolean; administrator?: Administrator; error?: string } {
  const { username, password, role, name } = data;

  if (!validateUsername(username)) {
    return { success: false, error: '账号已存在' };
  }

  try {
    const administrators = loadAdministrators();
    const newAdmin: Administrator = {
      id: generateAdministratorId(),
      username,
      password,
      role,
      name,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      createdBy: creatorId,
    };

    administrators.push(newAdmin);
    saveAdministrators(administrators);
    return { success: true, administrator: newAdmin };
  } catch {
    return { success: false, error: '创建失败' };
  }
}

/**
 * 更新管理员状态
 */
export function updateAdministratorStatus(
  id: string,
  status: AdminStatus
): { success: boolean; error?: string } {
  try {
    const administrators = loadAdministrators();
    const index = administrators.findIndex((a) => a.id === id);
    if (index === -1) return { success: false, error: '管理员不存在' };

    const current = getCurrentAdmin();
    if (current && current.id === id && status === 'disabled') {
      return { success: false, error: '不能禁用自己' };
    }

    administrators[index].status = status;
    saveAdministrators(administrators);
    return { success: true };
  } catch {
    return { success: false, error: '操作失败' };
  }
}

/**
 * 删除管理员
 */
export function deleteAdministrator(id: string): { success: boolean; error?: string } {
  try {
    const administrators = loadAdministrators();
    const admin = administrators.find((a) => a.id === id);
    if (!admin) return { success: false, error: '管理员不存在' };
    if (admin.cannotBeDeleted) return { success: false, error: '该账号不可删除' };

    const current = getCurrentAdmin();
    if (current && current.id === id) return { success: false, error: '不能删除自己' };

    saveAdministrators(administrators.filter((a) => a.id !== id));
    return { success: true };
  } catch {
    return { success: false, error: '删除失败' };
  }
}

/**
 * 获取所有管理员
 */
export function getAllAdministrators(): Administrator[] {
  return loadAdministrators();
}

/**
 * 搜索管理员
 */
export function searchAdministrators(keyword: string): Administrator[] {
  const administrators = loadAdministrators();
  if (!keyword.trim()) return administrators;
  const q = keyword.toLowerCase();
  return administrators.filter(
    (a) => a.username.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
  );
}

/**
 * 更新管理员信息（姓名、密码）
 */
export function updateAdministratorInfo(
  id: string,
  data: { name?: string; password?: string }
): { success: boolean; error?: string } {
  try {
    const administrators = loadAdministrators();
    const index = administrators.findIndex((a) => a.id === id);
    if (index === -1) return { success: false, error: '管理员不存在' };

    const admin = administrators[index];
    if (admin.cannotBeDeleted) return { success: false, error: '不能修改初始账号' };

    // 更新姓名
    if (data.name) {
      administrators[index].name = data.name;
    }

    // 更新密码（如果提供）
    if (data.password) {
      administrators[index].password = data.password;
    }

    saveAdministrators(administrators);
    return { success: true };
  } catch {
    return { success: false, error: '更新失败' };
  }
}
