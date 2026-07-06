'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useT } from '@/hooks/useT';

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke={active ? '#2257D4' : '#8990A3'} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function OrdersIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke={active ? '#2257D4' : '#8990A3'} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function MineIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-6 h-6" fill="none" stroke={active ? '#2257D4' : '#8990A3'} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

export default function BottomTabBar() {
  const pathname = usePathname();
  const t = useT();

  const tabs = [
    { id: 'home', path: '/', label: t.mine.home, Icon: HomeIcon },
    { id: 'orders', path: '/orders', label: t.mine.ordersTab, Icon: OrdersIcon },
    { id: 'mine', path: '/profile', label: t.mine.mineTab, Icon: MineIcon },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200/80 flex items-stretch"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        const { Icon } = tab;
        return (
          <Link
            key={tab.id}
            href={tab.path}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 cursor-pointer"
          >
            <Icon active={active} />
            <span className={`text-[11px] ${active ? 'text-[#2257D4] font-medium' : 'text-gray-400'}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
