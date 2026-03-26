'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TeamOutlined, FileTextOutlined, TransactionOutlined } from '@ant-design/icons';

const menuItems = [
  {
    key: 'enterprises',
    label: '企业管理',
    icon: <TeamOutlined />,
    href: '/admin/enterprises',
  },
  {
    key: 'orders',
    label: '订单记录',
    icon: <FileTextOutlined />,
    href: '/admin/orders',
  },
  {
    key: 'transactions',
    label: '交易明细',
    icon: <TransactionOutlined />,
    href: '/admin/transactions',
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    document.title = '企业国际运营后台';
    // 设置 admin 专属 favicon
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = '/admin/icon.svg';
    return () => {
      // 离开 admin 时恢复原标题和 favicon
      document.title = '企业国际版 - 货拉拉';
      if (link) link.href = '/favicon.ico';
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-gray-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 mr-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-white">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-base font-semibold">企业国际运营后台</span>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 px-3">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
