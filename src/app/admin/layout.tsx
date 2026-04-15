'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dropdown, Modal } from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  TransactionOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useCurrentAdmin } from '@/hooks/useAdminAuth';
import { logout } from '@/utils/adminAuth';

const businessMenuItems = [
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

const systemMenuItems = [
  {
    key: 'administrators',
    label: '运营账号管理',
    icon: <UserOutlined />,
    href: '/admin/administrators',
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin } = useCurrentAdmin();

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

  const handleLogout = () => {
    Modal.confirm({
      title: '确认退出登录？',
      content: '退出后需要重新登录才能访问后台管理系统',
      okText: '确认退出',
      cancelText: '取消',
      onOk() {
        logout();
        router.push('/login');
      },
    });
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col shrink-0 overflow-y-auto">
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
          {businessMenuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors no-underline ${
                  isActive ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
                style={{ color: isActive ? '#ffffff' : '#9ca3af' }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          {/* 分隔线 */}
          <div className="my-3 mx-2 border-t border-gray-700"></div>

          {systemMenuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors no-underline ${
                  isActive ? 'bg-gray-800' : 'hover:bg-gray-800'
                }`}
                style={{ color: isActive ? '#ffffff' : '#9ca3af' }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {admin && (
          <div className="p-3 border-t border-gray-800">
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="topLeft">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600">
                  <span className="text-sm font-medium">{admin.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{admin.name}</div>
                  <div className="text-xs text-gray-400 truncate">
                    {admin.role === 'super_admin' ? '超级管理员' : '运营人员'}
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
