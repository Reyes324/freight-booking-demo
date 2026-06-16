"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Popconfirm, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { shadow } from "@/styles/design-tokens";
import { useLanguage } from "@/contexts/LanguageContext";
import { useT } from "@/hooks/useT";
import { accountPresets, getCurrentAccount, type CurrentAccount } from "@/data/mockData";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useLanguage();
  const t = useT();

  // 当前账号：挂载后从 localStorage 读取，避免 SSR/CSR 不一致
  const [account, setAccount] = useState<CurrentAccount | null>(null);
  useEffect(() => {
    setAccount(getCurrentAccount());
  }, [pathname]);

  const isChild = account?.accountType === "child";

  const tabs = [
    { id: "order", label: t.nav.bookARide, path: "/" },
    { id: "history", label: t.nav.orderHistory, path: "/orders" },
    { id: "wallet", label: t.nav.accountBalance, path: "/wallet" },
    ...(!isChild ? [{ id: "settings", label: "设置", path: "/settings" }] : []),
  ];

  const activeTab = tabs.find(tab => tab.path === pathname)?.id || "";

  // 退出登录处理
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentAccount');
    router.push('/login');
  };

  // Demo：切换账号（写入 localStorage 后回首页模拟重新登录）
  const switchAccount = (presetKey: keyof typeof accountPresets) => {
    localStorage.setItem('currentAccount', JSON.stringify(accountPresets[presetKey]));
    setAccount(accountPresets[presetKey]);
    router.push('/');
  };

  const switchMenu: MenuProps['items'] = [
    { key: 'parent', label: '母账号管理员', onClick: () => switchAccount('parent') },
    { key: 'childVN', label: '越南子账号', onClick: () => switchAccount('childVN') },
    { key: 'childTH', label: '泰国子账号', onClick: () => switchAccount('childTH') },
  ];

  return (
    <>
    <nav
      data-ds="Navbar"
      data-ds-label="顶部导航栏"
      className="h-14 lg:h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6 relative"
      style={{
        boxShadow: shadow.navbar,
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
            src={lang === "en" ? "/logo-complete-en.png" : "/logo-complete.png"}
            alt="LALA i LOGISTICS"
            width={569}
            height={73}
            className={lang === "en" ? "h-12 lg:h-14 w-auto" : "h-5 lg:h-5.5 w-auto"}
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
              data-active={activeTab === tab.id ? "true" : undefined}
              className="relative px-4 py-2.5 text-base font-medium transition-all duration-200 cursor-pointer"
            >
              {tab.label}
              {/* 底部指示线 - 延伸到导航栏底部 */}
              {activeTab === tab.id && (
                <div
                  className="absolute left-0 right-0 h-0.5 z-20"
                  style={{ bottom: '-10px', backgroundColor: '#2257D4' }}
                />
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: User Info + Icons */}
      <div className="flex items-center gap-3">
        {/* 企业名称（桌面端） */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{account?.companyName ?? '菜鸟物流国际'}</span>
          {account?.subAccountName && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {account.subAccountName}
            </span>
          )}
        </div>

        {/* 分隔线（桌面端） */}
        <div className="hidden md:block w-px h-5 bg-gray-200" />

        {/* 功能图标 */}
        <div className="flex items-center gap-2">
          <Popconfirm
            title={t.nav.confirmLogout}
            description={t.nav.confirmLogoutDesc}
            onConfirm={handleLogout}
            okText={t.nav.confirmLogoutOk}
            cancelText={t.common.cancel}
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

      {/* Demo：切换账号悬浮按钮（右下角，与登录页保持一致） */}
      {account && (
        <Dropdown menu={{ items: switchMenu }} placement="topRight" trigger={['click']}>
          <button
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 200,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 13px',
              background: '#fff',
              border: '1px dashed #d9d9d9',
              borderRadius: 8,
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: '#666',
              whiteSpace: 'nowrap',
            }}
            title="演示用：切换母账号 / 子账号"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            切换账号
          </button>
        </Dropdown>
      )}
    </>
  );
}
