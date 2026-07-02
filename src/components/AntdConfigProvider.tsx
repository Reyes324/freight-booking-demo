'use client';

import { ConfigProvider, App } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import zhCN from 'antd/locale/zh_CN';
import { antdTheme } from '@/styles/design-tokens';

export default function AntdConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyleProvider layer>
      <ConfigProvider locale={zhCN} theme={antdTheme}>
        <App>
          {children}
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
}
