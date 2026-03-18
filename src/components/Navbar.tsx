"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SettingOutlined, QuestionCircleOutlined } from "@ant-design/icons";

const tabs = [
  { id: "order", label: "下单叫车", path: "/" },
  { id: "history", label: "订单记录", path: "/orders" },
  { id: "wallet", label: "我的钱包", path: "/wallet" },
];

export default function Navbar() {
  const pathname = usePathname();
  const activeTab = tabs.find(tab => tab.path === pathname)?.id || "";

  return (
    <nav className="h-14 lg:h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6">
      {/* Left: Hamburger (mobile) + Logo + Tabs */}
      <div className="flex items-center gap-4 lg:gap-8">
        {/* Hamburger button (mobile only) */}
        <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo-complete.png"
            alt="货拉拉 · 企业国际版"
            width={569}
            height={73}
            className="h-6 w-auto"
            priority
          />
        </div>

        {/* Tabs (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.path}
              className={`px-4 py-2.5 text-base font-medium rounded-lg
                         transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-4">
        <Link
          href="/settings"
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <SettingOutlined className="text-gray-500 text-lg" />
        </Link>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
          <QuestionCircleOutlined className="text-gray-500 text-lg" />
        </button>
      </div>
    </nav>
  );
}
