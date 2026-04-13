'use client';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { antdTheme } from '@/styles/design-tokens';

export default function AntdConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      {children}
    </ConfigProvider>
  );
}
