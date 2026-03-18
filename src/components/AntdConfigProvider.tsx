'use client';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export default function AntdConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#2257d4', // 项目主色 blue-600
          borderRadius: 8,
        },
        components: {
          Switch: {
            colorPrimary: '#2257d4',
            colorPrimaryHover: '#1c47ac',
          },
          Button: {
            colorPrimary: '#2257d4',
            colorPrimaryHover: '#1c47ac',
          },
          Radio: {
            colorPrimary: '#2257d4',
          },
          Input: {
            controlHeight: 44,
          },
          Select: {
            controlHeight: 44,
          },
          Form: {
            labelColor: 'rgb(55 65 81)', // gray-700
            labelFontSize: 14,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
