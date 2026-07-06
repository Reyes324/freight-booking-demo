'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App, Popconfirm } from 'antd';
import Navbar from '@/components/Navbar';
import BottomTabBar from '@/components/BottomTabBar';
import BalanceSummaryCard from '@/components/BalanceSummaryCard';
import MobileListGroup from '@/components/MobileListGroup';
import MobileListRow from '@/components/MobileListRow';
import { getCurrentAccount, mockSubAccounts, type CurrentAccount, type SubAccount } from '@/data/mockData';
import { useT } from '@/hooks/useT';

function ProfileBody() {
  const t = useT();
  const router = useRouter();
  const [account, setAccount] = useState<CurrentAccount | null>(null);

  useEffect(() => {
    setAccount(getCurrentAccount());
  }, []);

  const isParent = account?.accountType === 'parent';
  const isChild = account?.accountType === 'child';
  const childAccount: SubAccount | undefined = isChild
    ? mockSubAccounts.find((s) => s.id === account?.accountId)
    : undefined;

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentAccount');
    router.push('/login');
  };

  if (!account) return null;

  return (
    <div className="p-4 space-y-4">
      {/* 移动端左上角企业名称（桌面端由 Navbar 展示，这里不重复） */}
      <div
        className="lg:hidden text-lg font-semibold text-gray-900"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {account.companyName}
        {account.subAccountName ? ` · ${account.subAccountName}` : ''}
      </div>

      <BalanceSummaryCard
        isParent={isParent}
        isChild={isChild}
        childAccount={childAccount}
        detailHref="/wallet"
      />

      <MobileListGroup>
        <MobileListRow label="账户资料" onClick={() => router.push('/profile/account')} />
        {isParent && (
          <MobileListRow
            label={t.mine.subAccountManagement}
            onClick={() => router.push('/profile/sub-accounts')}
          />
        )}
      </MobileListGroup>

      <MobileListGroup>
        <Popconfirm
          title={t.nav.confirmLogout}
          description={t.nav.confirmLogoutDesc}
          onConfirm={handleLogout}
          okText={t.nav.confirmLogoutOk}
          cancelText={t.common.cancel}
          okButtonProps={{ danger: true }}
        >
          <MobileListRow label={t.settings.layout.logout} danger />
        </Popconfirm>
      </MobileListGroup>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <App>
      <div className="min-h-screen bg-gray-100 pb-[calc(56px+env(safe-area-inset-bottom)+16px)] lg:pb-0">
        <div className="hidden lg:block">
          <Navbar />
        </div>
        <ProfileBody />
        <BottomTabBar />
      </div>
    </App>
  );
}
