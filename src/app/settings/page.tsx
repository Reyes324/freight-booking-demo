'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { App, Menu, ConfigProvider } from 'antd';
import Navbar from '@/components/Navbar';
import BottomTabBar from '@/components/BottomTabBar';
import EnterpriseManagementPanel from '@/components/EnterpriseManagementPanel';
import ProfileContent from '@/components/ProfileContent';
import { getCurrentAccount, type CurrentAccount } from '@/data/mockData';

export default function SettingsPage() {
  const router = useRouter();
  const [account, setAccount] = useState<CurrentAccount | null>(null);
  const [activeKey, setActiveKey] = useState('profile');

  useEffect(() => {
    setAccount(getCurrentAccount());
    // 从移动端「子账号管理」二级页拉宽回来时，定位到子账户设置 tab
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'account') {
      setActiveKey('account');
    }
  }, []);

  // 拉窄到移动端宽度时，切回对应的移动端二级页（本页侧边栏布局在窄屏下不可用）
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const handleChange = () => {
      if (mql.matches) {
        router.replace(activeKey === 'account' ? '/profile/sub-accounts' : '/profile/account');
      }
    };
    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [activeKey, router]);

  const isParent = account?.accountType === 'parent';

  const menuItems: { key: string; label: string }[] = [
    { key: 'profile', label: '账户资料' },
    ...(isParent ? [{ key: 'account', label: '子账户设置' }] : []),
  ];

  return (
    <App>
      <div className="h-screen flex flex-col bg-gray-100">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          {/* 左侧导航 */}
          <aside className="w-56 shrink-0 border-r border-gray-200 bg-gray-100 overflow-y-auto pt-4">
            <ConfigProvider
              theme={{
                components: {
                  Menu: {
                    itemBg: 'transparent',
                    itemSelectedBg: 'rgba(34, 87, 212, 0.08)',
                    itemHoverBg: 'rgba(0, 0, 0, 0.05)',
                    itemSelectedColor: '#2257D4',
                    itemColor: '#0F1229',
                    itemHeight: 50,
                    itemPaddingInline: 20,
                    itemMarginInline: 0,
                    itemBorderRadius: 0,
                    fontSize: 15,
                  },
                },
              }}
            >
              <Menu
                mode="inline"
                selectedKeys={[activeKey]}
                onClick={({ key }) => setActiveKey(key)}
                style={{ background: 'transparent', border: 'none' }}
                items={menuItems.map(item => ({
                key: item.key,
                label: <span style={activeKey === item.key ? { fontWeight: 600 } : {}}>{item.label}</span>,
              }))}
              />
            </ConfigProvider>
          </aside>

          {/* 右侧内容 */}
          <main className="flex-1 bg-white overflow-y-auto">
            {account && activeKey === 'profile' && (
              <div style={{ maxWidth: 640 }} className="px-10 py-8 pb-[calc(56px+env(safe-area-inset-bottom)+16px)] lg:pb-8">
                <ProfileContent account={account} />
              </div>
            )}
            {isParent && activeKey === 'account' && (
              <div style={{ maxWidth: 860 }} className="px-10 py-8 pb-[calc(56px+env(safe-area-inset-bottom)+16px)] lg:pb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">子账户设置</h2>
                <EnterpriseManagementPanel />
              </div>
            )}
          </main>
        </div>

        <BottomTabBar />
      </div>
    </App>
  );
}
