'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';
import MobileDetailHeader from '@/components/MobileDetailHeader';
import EnterpriseManagementPanel from '@/components/EnterpriseManagementPanel';
import { useT } from '@/hooks/useT';

export default function SubAccountsPage() {
  const t = useT();
  const router = useRouter();

  // 拉宽到桌面宽度时，回到 /settings 侧边栏页面并定位到子账户设置 tab
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => {
      if (mql.matches) {
        router.replace('/settings?tab=account');
      }
    };
    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [router]);

  return (
    <App>
      <div className="min-h-screen bg-gray-100" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <MobileDetailHeader title={t.mine.subAccountManagement} />
        <div className="p-4">
          <EnterpriseManagementPanel />
        </div>
      </div>
    </App>
  );
}
