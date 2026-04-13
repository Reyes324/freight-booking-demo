"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogoutOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";

const tabs = [
  { id: "order", label: "下单叫车", path: "/" },
  { id: "history", label: "订单记录", path: "/orders" },
  { id: "wallet", label: "账期余额", path: "/wallet" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = tabs.find(tab => tab.path === pathname)?.id || "";

  // 退出登录处理
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <nav
      className="h-14 lg:h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6 relative"
      style={{
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)',
        overflow: 'visible'
      }}
    >
      {/* Left: Hamburger (mobile) + Logo + Tabs */}
      <div className="flex items-center gap-4 lg:gap-8">
        {/* Hamburger button (mobile only) */}
        <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center cursor-pointer">
          <Image
            src="/logo-complete.png"
            alt="货拉拉 · 企业国际版"
            width={569}
            height={73}
            className="h-5 lg:h-5.5 w-auto"
            priority
          />
        </Link>

        {/* Tabs (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.path}
              prefetch={true}
              className={`relative px-4 py-2.5 text-base font-medium
                         transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {/* 底部指示线 - 延伸到导航栏底部 */}
              {activeTab === tab.id && (
                <div className="absolute left-0 right-0 h-0.5 bg-blue-600 z-20"
                     style={{ bottom: '-10px' }} />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: User Info + Icons */}
      <div className="flex items-center gap-3">
        {/* 企业名称（桌面端显示） */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-gray-600">菜鸟速运</span>
        </div>

        {/* 分隔线（桌面端） */}
        <div className="hidden md:block w-px h-5 bg-gray-200" />

        {/* 功能图标 */}
        <div className="flex items-center gap-2">
          <Popconfirm
            title="确认退出登录"
            description="退出后需要重新登录才能继续使用"
            onConfirm={handleLogout}
            okText="确认退出"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </Popconfirm>
        </div>
      </div>
    </nav>
  );
}
