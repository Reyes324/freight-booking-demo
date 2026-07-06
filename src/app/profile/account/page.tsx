'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App } from 'antd';
import MobileDetailHeader from '@/components/MobileDetailHeader';
import ProfileContent from '@/components/ProfileContent';
import { getCurrentAccount, type CurrentAccount } from '@/data/mockData';

export default function AccountProfilePage() {
  const router = useRouter();
  const [account, setAccount] = useState<CurrentAccount | null>(null);

  useEffect(() => {
    setAccount(getCurrentAccount());
  }, []);

  // 拉宽到桌面宽度时，回到 /settings 侧边栏页面（账户资料 tab 是默认选中项）
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => {
      if (mql.matches) {
        router.replace('/settings');
      }
    };
    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [router]);

  if (!account) return null;

  return (
    <App>
      <div className="min-h-screen bg-gray-100" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <MobileDetailHeader title="账户资料" />
        <div className="p-4">
          <ProfileContent account={account} />
        </div>
      </div>
    </App>
  );
}
