'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';
import MobileDetailHeader from '@/components/MobileDetailHeader';
import EnterpriseManagementPanel from '@/components/EnterpriseManagementPanel';
import { getCurrentAccount, type CurrentAccount } from '@/data/mockData';
import { useT } from '@/hooks/useT';

export default function SubAccountsPage() {
  const t = useT();
  const router = useRouter();
  const [account, setAccount] = useState<CurrentAccount | null>(null);

  useEffect(() => {
    setAccount(getCurrentAccount());
  }, []);

  // 子账号管理只有母账号才有；子账号没有这个功能，直接退回「我的」页
  useEffect(() => {
    if (account && account.accountType !== 'parent') {
      router.replace('/profile');
    }
  }, [account, router]);

  // 拉宽到桌面宽度时，回到 /settings 侧边栏页面并定位到子账户设置 tab
  useEffect(() => {
    if (!account || account.accountType !== 'parent') return;
    const mql = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => {
      if (mql.matches) {
        router.replace('/settings?tab=account');
      }
    };
    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [account, router]);

  if (!account || account.accountType !== 'parent') return null;

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
