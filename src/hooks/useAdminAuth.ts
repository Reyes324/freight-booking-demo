/**
 * 管理员认证 Hook（Demo 简化版）
 */

'use client';

import { useEffect, useState } from 'react';
import type { Administrator } from '@/types/auth';
import { getCurrentAdmin } from '@/utils/adminAuth';

interface UseAdminAuthResult {
  admin: Administrator | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  hasPermission: boolean;
}

export function useAdminAuth(): UseAdminAuthResult {
  const [admin, setAdmin] = useState<Administrator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAdmin(getCurrentAdmin());
    setIsLoading(false);
  }, []);

  const isSuperAdmin = admin?.role === 'super_admin';

  return {
    admin,
    isLoading,
    isSuperAdmin,
    hasPermission: true,
  };
}

export function useCurrentAdmin(): {
  admin: Administrator | null;
  isLoggedIn: boolean;
} {
  const [admin, setAdmin] = useState<Administrator | null>(null);

  useEffect(() => {
    setAdmin(getCurrentAdmin());
  }, []);

  return {
    admin,
    isLoggedIn: admin !== null,
  };
}
