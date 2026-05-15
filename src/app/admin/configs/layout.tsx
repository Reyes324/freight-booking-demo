'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs } from 'antd';
import { CarOutlined, AlertOutlined } from '@ant-design/icons';

const tabs = [
  { key: '/admin/configs/vehicles',    label: '车型数据配置', icon: <CarOutlined /> },
  { key: '/admin/configs/error-codes', label: 'API 错误码配置', icon: <AlertOutlined /> },
];

export default function ConfigsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeKey = tabs.find(t => pathname.startsWith(t.key))?.key ?? tabs[0].key;

  return (
    <div>
      <div className="mb-0">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">配置中心</h1>
        <Tabs
          activeKey={activeKey}
          onChange={(key) => router.push(key)}
          items={tabs.map(t => ({
            key: t.key,
            label: (
              <span className="flex items-center gap-1.5">
                {t.icon}
                {t.label}
              </span>
            ),
          }))}
          className="mb-0"
        />
      </div>
      <div className="pt-4">{children}</div>
    </div>
  );
}
