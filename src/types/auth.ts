/**
 * 管理员认证相关类型定义
 */

export type AdminRole = 'super_admin' | 'admin';
export type AdminStatus = 'active' | 'disabled';

export interface Administrator {
  id: string; // ADM001, ADM002...
  username: string; // 登录账号
  password: string; // 密码
  role: AdminRole; // 角色
  name: string; // 真实姓名
  status: AdminStatus; // 账号状态
  cannotBeDeleted?: boolean; // 初始账号不可删除
  mustChangePassword?: boolean; // 首次登录必须修改密码
  createdAt: string; // 创建时间
  createdBy: string; // 创建人 ID
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: Administrator | null;
}

export interface CreateAdministratorData {
  username: string;
  password: string;
  role: AdminRole;
  name: string;
}
