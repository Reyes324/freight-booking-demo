import type { Metadata } from "next";
import Script from "next/script";
import AntdConfigProvider from "@/components/AntdConfigProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "企业国际版 - 货拉拉",
  description: "企业国际版货运叫车下单应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 预加载高德地图安全密钥 */}
        <Script
          id="amap-security"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window._AMapSecurityConfig = {
                securityJsCode: 'd9745521ba8369dae7b32418f52c1c7d'
              };
            `,
          }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900">
        <AntdConfigProvider>
          {children}
        </AntdConfigProvider>

        {/* 全局加载高德地图 JS API - 只加载一次 */}
        <Script
          src="https://webapi.amap.com/maps?v=2.0&key=901cb477294958c0c8ae86f5f7536438"
          strategy="beforeInteractive"
        />

        <Script
          src="https://mcp.figma.com/mcp/html-to-design/capture.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
