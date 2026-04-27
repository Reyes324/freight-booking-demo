'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  UserOutlined,
  FileTextOutlined,
  GlobalOutlined,
  BellOutlined,
  ShopOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useT } from '@/hooks/useT';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useT();
  const pathname = usePathname();

  const menuGroups = [
    {
      title: t.settings.layout.userAccount,
      items: [
        { id: 'profile', label: t.settings.profile.title, path: '/settings/profile', icon: <UserOutlined /> },
        { id: 'orders', label: t.settings.orders.title, path: '/settings/orders', icon: <FileTextOutlined /> },
        { id: 'location', label: t.settings.location.title, path: '/settings/location', icon: <GlobalOutlined /> },
        { id: 'notification', label: t.settings.notification.title, path: '/settings/notification', icon: <BellOutlined /> },
        { id: 'business', label: t.settings.business.title, path: '/settings/business', icon: <ShopOutlined /> },
      ],
    },
    {
      title: t.settings.layout.aboutUs,
      items: [
        { id: 'terms', label: t.settings.terms.title, path: '/settings/terms', icon: <InfoCircleOutlined /> },
      ],
    },
  ];

  const handleLogout = () => {
    console.log('退出登录');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 */}
        <aside className="hidden lg:block w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto subtle-scroll">
          <div className="p-6 flex flex-col h-full">
            <div className="space-y-6 flex-1">
            {menuGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-medium text-gray-900 mb-3">
                  {group.title}
                </h2>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.path}
                          prefetch={true}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                                     text-sm transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <span className="text-base">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            </div>

            {/* 退出登录按钮 - 固定在底部 */}
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-red-600
                         hover:bg-red-50 transition-all duration-200 cursor-pointer
                         border border-red-200 text-center"
            >
              {t.settings.layout.logout}
            </button>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 overflow-y-auto subtle-scroll bg-white">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
