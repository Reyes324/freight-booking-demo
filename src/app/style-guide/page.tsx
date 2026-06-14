"use client";

import { useState, useCallback } from "react";
import UsageViewer, { type UsagePage } from "./UsageViewer";
import { Button, Input, Select, InputNumber, Form, Tag, Table, Modal, message, Drawer, Empty, Skeleton, Spin, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ExclamationCircleOutlined, LogoutOutlined, CheckOutlined, CopyOutlined, SearchOutlined, PlusOutlined, DownloadOutlined, ArrowLeftOutlined, InfoCircleOutlined, UserOutlined, TeamOutlined, FileTextOutlined, TransactionOutlined } from "@ant-design/icons";
import { fontSize, radius, shadow, spacing, statusColors, zIndex, motion, iconSize } from "@/styles/design-tokens";
import OrderStatusTag from "@/components/OrderStatusTag";

// ─────────────────────────────────────────────
// 颜色系统数据（来源：Figma Design System — Colors，共 16 色）
// ─────────────────────────────────────────────

const COLOR_SYSTEM = [
  {
    group: "品牌色",
    desc: "按钮、链接、选中状态的主色调",
    colors: [
      { token: "Brand/Primary", hex: "#2257D4", name: "主品牌色",   usage: "按钮、链接、Tab 选中态、进行中状态文字",           codeRef: "antdTheme.colorPrimary · Navbar 激活线" },
      { token: "Brand/Hover",   hex: "#1C47AC", name: "品牌色悬停", usage: "按钮悬停/按下态（Ant Design 必需）",               codeRef: "antdTheme.colorPrimaryHover" },
      { token: "Brand/Accent",  hex: "#FF6600", name: "品牌强调色", usage: "等待呼叫司机状态标签、运营活动标签、优先订单价格强调", codeRef: "colorTokens.brandAccent · statusColors.calling_driver" },
    ],
  },
  {
    group: "文本与图标",
    desc: "从深到浅的文字和图标层级，数字越小越深",
    colors: [
      { token: "Ink/T10", hex: "#0F1229", name: "一级文案", usage: "页面标题、弹窗标题、重要数字",         codeRef: "colorTokens.inkT10 · ⚠ 代码里多处用 text-gray-900（#111827）偏差" },
      { token: "Ink/T20", hex: "#252B47", name: "一级图标", usage: "导航主图标、功能入口图标",             codeRef: "colorTokens.inkT20 · 目前未显式使用" },
      { token: "Ink/T30", hex: "#454C66", name: "二级文案", usage: "正文、表单标签、列表项文字",           codeRef: "colorTokens.inkT30 · ⚠ 代码里多处用 text-gray-600（#4B5563）偏差" },
      { token: "Ink/T40", hex: "#656C85", name: "二级图标", usage: "次要功能图标、表单内图标",             codeRef: "colorTokens.inkT40 · 目前未显式使用" },
      { token: "Ink/T50", hex: "#8990A3", name: "三级文案", usage: "placeholder、辅助说明、禁用态文字",   codeRef: "colorTokens.inkT50 · OrderStatusTag disabled · ⚠ 代码多处用 text-gray-400（#9CA3AF）偏差" },
      { token: "Ink/T60", hex: "#ABB2C2", name: "三级图标", usage: "装饰性图标、空状态图标",               codeRef: "colorTokens.inkT60 · 目前未显式使用" },
    ],
  },
  {
    group: "边框与背景",
    desc: "输入框、分割线、卡片背景等基础元素",
    colors: [
      { token: "Surface/Border",     hex: "#C5CCDB", name: "线性按钮边框", usage: "输入框边框、线性按钮描边",           codeRef: "colorTokens.surfaceBorder · administrators.tsx Tag 描边" },
      { token: "Surface/Divider",    hex: "#EBEFF5", name: "分割线",       usage: "分割线、表格行线、页面底色",         codeRef: "colorTokens.surfaceDivider · ⚠ 代码多处用 border-gray-200（#E5E7EB）偏差" },
      { token: "Surface/BrandLight", hex: "#EEF2FB", name: "品牌浅底",     usage: "进行中/呼叫司机状态标签底色",       codeRef: "colorTokens.surfaceBrandLight · administrators.tsx Tag 底色" },
      { token: "Surface/White",      hex: "#FFFFFF", name: "白色",         usage: "卡片背景、输入框背景、弹窗背景",     codeRef: "antdTheme.colorBgContainer" },
    ],
  },
  {
    group: "状态色",
    desc: "订单状态、操作反馈的语义化颜色",
    colors: [
      { token: "Status/Success",      hex: "#00A178", name: "成功色",   usage: "已完成状态文字、成功操作反馈",   codeRef: "colorTokens.statusSuccess · OrderStatusTag completed" },
      { token: "Status/SuccessLight", hex: "#DFF3EC", name: "成功浅底", usage: "已完成状态标签底色",             codeRef: "colorTokens.statusSuccessLight · OrderStatusTag completed bg" },
      { token: "Status/Error",        hex: "#F23041", name: "失败色",   usage: "已取消状态、错误提示、表单校验", codeRef: "colorTokens.statusError · orders statusConfig 已取消" },
      { token: "Status/Warning",      hex: "#F59314", name: "警告色",   usage: "警告提示、待处理状态（预留）",   codeRef: "colorTokens.statusWarning · 目前未使用" },
    ],
  },
];

const COLOR_VIOLATIONS = [
  { file: "admin/orders/page.tsx:156",        was: "#FF6600", fixed: "#2257D4", note: "正在呼叫司机 — 橙色不在规范，已修复为 Brand/Primary" },
  { file: "admin/enterprises/page.tsx:134",   was: "text-blue-600",  fixed: "text-[#2257D4]", note: "表格链接 — Tailwind 默认蓝非品牌蓝，已修复" },
  { file: "admin/* 多处",                     was: "text-gray-900 / text-gray-400 等",  fixed: "colorTokens.inkT*", note: "Tailwind gray 色值与 Ink Token 不对齐（如 gray-900=#111827 vs Ink/T10=#0F1229），待逐步迁移" },
  { file: "admin/layout.tsx",                 was: "bg-gray-900 bg-gray-800",           fixed: "— 保留",            note: "后台侧边栏深色背景，属有意设计，不在 16 色规范范围" },
  { file: "login/page.tsx",                   was: "自定义 CSS 变量（部分偏差）",        fixed: "— 待评估",          note: "登录页独立视觉风格，低优先级" },
];

// ─────────────────────────────────────────────
// 工具
// ─────────────────────────────────────────────

function useClipboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };
  return { copy, copied };
}

// ─────────────────────────────────────────────
// 导航
// ─────────────────────────────────────────────

const NAV = [
  { id: "colors",     label: "颜色系统"   },
  { id: "typography", label: "字体排版"   },
  { id: "spacing",    label: "间距 & 圆角" },
  { id: "buttons",    label: "按钮"       },
  { id: "inputs",     label: "表单输入框" },
  { id: "status",     label: "状态标签"   },
  { id: "table",      label: "表格行"     },
  { id: "modal",      label: "Modal"      },
  { id: "navbar",     label: "导航栏"     },
  { id: "empty",         label: "空状态"     },
  { id: "drawer",        label: "Drawer"     },
  { id: "toast",         label: "Toast 消息" },
  { id: "skeleton",      label: "Skeleton"   },
  { id: "pagination",    label: "Pagination" },
  { id: "icons",         label: "图标系统"   },
  { id: "search-filter", label: "搜索筛选栏" },
];

// ─────────────────────────────────────────────
// Section 卡片容器
// ─────────────────────────────────────────────

function Section({ id, index, title, source, usage, onViewUsage, children }: {
  id: string; index: number; title: string; source: string;
  usage?: UsagePage[]; onViewUsage?: (name: string, pages: UsagePage[]) => void;
  children: React.ReactNode;
}) {
  const idx = String(index).padStart(2, "0");
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-2xl bg-white overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)" }}
    >
      {/* 卡片 header 条 */}
      <div className="relative flex items-center justify-between px-8 py-5 bg-[#F8F7F6] border-b border-[#ECEAE8] overflow-hidden">
        <span
          className="absolute right-6 top-1/2 -translate-y-1/2 font-mono font-bold text-[#ECEAE8] select-none pointer-events-none"
          style={{ fontSize: "72px", lineHeight: 1, letterSpacing: "-0.04em" }}
          aria-hidden
        >
          {idx}
        </span>
        <div className="flex items-center gap-4 relative z-10">
          <span className="font-mono text-xs text-[#2257D4] bg-[#EEF2FB] px-2 py-0.5 rounded-md">
            {idx}
          </span>
          <h2 className="text-base font-semibold text-neutral-800 tracking-tight">{title}</h2>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          {usage && usage.length > 0 && onViewUsage && (
            <button
              onClick={() => onViewUsage(title, usage)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-[#2257D4] bg-[#EEF2FB] hover:bg-[#dce8f8] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2257D4]" />
              查看真实用例 {usage.length} 处
            </button>
          )}
          <p className="font-mono text-[10px] text-neutral-400 hidden md:block">{source}</p>
        </div>
      </div>
      <div className="p-8">{children}</div>
    </section>
  );
}

// ─────────────────────────────────────────────
// 颜色卡片
// ─────────────────────────────────────────────

function ColorCard({ token, hex, name, usage, codeRef }: { token: string; hex: string; name: string; usage: string; codeRef: string }) {
  const { copy, copied } = useClipboard();
  const isLight = ["#FFFFFF", "#EBEFF5", "#EEF2FB", "#DFF3EC"].includes(hex);
  const hasWarning = codeRef.includes("⚠");
  return (
    <button
      onClick={() => copy(hex)}
      className="group/c flex items-start gap-4 w-full text-left px-4 py-3.5 rounded-xl border bg-white transition-all hover:shadow-sm"
      style={{ borderColor: hasWarning ? "#FDE68A" : "#ECEAE8" }}
    >
      <div
        className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
        style={{ backgroundColor: hex, border: isLight ? "1px solid #ECEAE8" : "none" }}
      >
        {copied === hex && (
          <CheckOutlined style={{ color: isLight ? "#2257D4" : "#fff", fontSize: 12 }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xs text-neutral-700 font-medium">{token}</span>
          <span className="text-xs text-neutral-400">{name}</span>
          <span className="font-mono text-[10px] text-neutral-300 ml-auto shrink-0">{hex}</span>
        </div>
        <div className="text-[11px] text-neutral-500 mt-0.5">{usage}</div>
        <div className={`font-mono text-[10px] mt-1 ${hasWarning ? "text-amber-500" : "text-neutral-300"}`}>{codeRef}</div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// Token 行
// ─────────────────────────────────────────────

function TokenRow({ name, value, children }: { name: string; value: string; children?: React.ReactNode }) {
  const { copy, copied } = useClipboard();
  return (
    <div className="flex items-center gap-4 py-3 border-b border-neutral-50 last:border-0 group/token">
      <span className="font-mono text-xs text-neutral-400 w-24 shrink-0">{name}</span>
      {children}
      <button
        onClick={() => copy(value)}
        className="ml-auto flex items-center gap-1.5 font-mono text-xs text-neutral-400 hover:text-neutral-700 transition-colors"
      >
        {value}
        {copied === value
          ? <CheckOutlined className="text-green-500 text-[10px]" />
          : <CopyOutlined className="text-[10px] opacity-0 group-hover/token:opacity-100 transition-opacity" />
        }
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// 使用规则块
// ─────────────────────────────────────────────

function RuleBlock({ rules, avoid }: { rules: string[]; avoid?: string[] }) {
  return (
    <div className="mt-6 pt-5 border-t border-[#ECEAE8]">
      <div className={`grid gap-6 ${avoid && avoid.length > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
        <div>
          <p className="text-[10px] font-mono text-[#2257D4] uppercase tracking-widest mb-3">使用规则</p>
          <ul className="space-y-2">
            {rules.map((r, i) => (
              <li key={i} className="flex gap-2 text-[11px] text-neutral-600 leading-relaxed">
                <span className="text-[#2257D4] shrink-0 font-bold mt-0.5">›</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        {avoid && avoid.length > 0 && (
          <div>
            <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-3">避免</p>
            <ul className="space-y-2">
              {avoid.map((r, i) => (
                <li key={i} className="flex gap-2 text-[11px] text-neutral-500 leading-relaxed">
                  <span className="text-red-400 shrink-0 font-bold mt-0.5">›</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 表格数据
// ─────────────────────────────────────────────

const TABLE_COLS: ColumnsType<object> = [
  { title: "下单时间",   dataIndex: "date",    width: 110 },
  { title: "企业客户",   dataIndex: "ent",     width: 120 },
  { title: "国家",       dataIndex: "country", width: 80  },
  { title: "车型",       dataIndex: "vehicle", width: 130 },
  {
    title: "状态", dataIndex: "status", width: 110,
    render: (v: string) => {
      const cfg: Record<string, string> = { "配送中": "#2257D4", "已完成": "default", "已取消": "#F23041" };
      return <Tag color={cfg[v] ?? "default"}>{v}</Tag>;
    },
  },
  { title: "LLI 账单金额", dataIndex: "amount", width: 140 },
];

const TABLE_DATA = [
  { key: 1, date: "12-15 09:30", ent: "菜鸟速递",  country: "泰国",   vehicle: "4.2 米厢车", status: "配送中", amount: "THB 680.00"   },
  { key: 2, date: "12-15 08:15", ent: "顺丰国际",  country: "越南",   vehicle: "2 吨货车",   status: "已完成", amount: "VND 850,000"  },
  { key: 3, date: "12-14 17:00", ent: "极兔快递",  country: "马来西亚", vehicle: "1 吨货车", status: "已取消", amount: "MYR 120.00"   },
];

// ─────────────────────────────────────────────
// 主页面
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Usage Map 配置
// ─────────────────────────────────────────────
const USAGE_MAP: Record<string, UsagePage[]> = {
  "表格行": [
    {
      url: "/orders",
      label: "订单列表",
      selector: '[data-ds="Table"]',
      snippet: `<Table\n  columns={columns}\n  dataSource={filteredOrders}\n  rowKey="orderId"\n  pagination={{ pageSize: 10, showTotal: ... }}\n  onRow={(record) => ({ onClick: () => openDrawer(record) })}\n  scroll={{ x: 'max-content' }}\n/>`,
    },
    {
      url: "/wallet",
      label: "钱包交易记录",
      selector: '[data-ds="Table"]',
      snippet: `<Table\n  columns={columns}\n  dataSource={filteredTransactions}\n  rowKey="id"\n  pagination={{ pageSize: 15, showTotal: ... }}\n  locale={{ emptyText: <Empty ... /> }}\n/>`,
    },
  ],
  "导航栏": [
    {
      url: "/orders",
      label: "订单列表页",
      selector: '[data-ds="Navbar"]',
      snippet: `// components/Navbar.tsx\n<nav data-ds="Navbar" className="h-16 border-b bg-white ...">\n  {/* Logo + Tab 导航 + 用户信息 */}\n</nav>`,
    },
    {
      url: "/wallet",
      label: "钱包页",
      selector: '[data-ds="Navbar"]',
      snippet: `// Navbar 组件在所有前台页面自动渲染\n// 通过 layout.tsx 全局引入`,
    },
  ],
  "订单状态标签": [
    {
      url: "/orders",
      label: "订单列表",
      selector: '[data-ds="OrderStatusTag"]',
      snippet: `// components/OrderStatusTag.tsx\n<OrderStatusTag status={order.status} />\n\n// 状态色来自 design-tokens.ts statusColors\n// 支持: calling_driver / in_transit\n//       delivering / completed / cancelled`,
    },
  ],
  "表单输入框": [
    {
      url: "/orders",
      label: "订单搜索",
      selector: '[data-ds="Input"]',
      snippet: `<Input\n  placeholder="搜索订单号"\n  prefix={<SearchOutlined />}\n  allowClear\n  className="max-w-[500px]"\n  value={searchText}\n  onChange={(e) => setSearchText(e.target.value)}\n/>`,
    },
  ],
  "空状态": [
    {
      url: "/wallet",
      label: "钱包无交易记录",
      selector: '[data-ds="Table"]',
      snippet: `<Table\n  locale={{\n    emptyText: (\n      <Empty\n        image={Empty.PRESENTED_IMAGE_SIMPLE}\n        description="暂无交易记录"\n      />\n    ),\n  }}\n/>`,
    },
  ],
};

export default function StyleGuidePage() {
  const [auditOpen, setAuditOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [usageViewer, setUsageViewer] = useState<{ name: string; pages: UsagePage[] } | null>(null);

  const handleViewUsage = useCallback((name: string, pages: UsagePage[]) => {
    setUsageViewer({ name, pages });
  }, []);

  const handleCancelDemo = () => {
    Modal.confirm({
      title: "确认取消订单",
      icon: <ExclamationCircleOutlined />,
      content: "取消后司机将停止服务，本次订单费用将根据实际行程结算。",
      okText: "确认取消",
      cancelText: "返回",
      okButtonProps: { danger: true },
      onOk() { message.success("订单已取消"); },
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ECEAE8" }}>
      {/* ── 顶部栏 ── */}
      <header
        className="fixed top-0 left-0 right-0 z-30 h-11 flex items-center px-6"
        style={{
          backgroundColor: "rgba(236,234,232,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-[#2257D4] flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-white/80" />
          </div>
          <span className="text-sm font-semibold text-neutral-800 tracking-tight">设计规范</span>
          <span className="text-neutral-400 select-none text-xs">/</span>
          <span className="text-xs text-neutral-500">企业国际版</span>
        </div>
        <div className="ml-auto font-mono text-[10px] text-neutral-400">
          src/styles/design-tokens.ts
        </div>
      </header>

      <div className="pt-11 flex">
        {/* ── 左侧导航 ── */}
        <aside
          className="fixed left-0 top-11 bottom-0 w-52 overflow-y-auto bg-white"
          style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.05)" }}
        >
          <nav className="p-4 space-y-0.5">
            {NAV.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F8F7F6] transition-all"
              >
                <span
                  className="font-mono text-[10px] w-5 shrink-0"
                  style={{ color: "#2257D4", opacity: 0.5 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="text-sm text-neutral-700 group-hover:text-neutral-900 font-medium transition-colors">
                  {item.label}
                </div>
              </a>
            ))}

            <div className="pt-5 mt-3 border-t border-neutral-100">
              <div className="px-3 py-2 text-[10px] text-neutral-300 font-mono">
                改组件后刷新自动同步
              </div>
            </div>
          </nav>
        </aside>

        {/* ── 主内容 ── */}
        <main className="ml-52 flex-1 max-w-5xl px-8 py-8 space-y-5">

          {/* 01 颜色系统 */}
          <Section id="colors" index={1} title="颜色系统" source="Figma Variables → design-tokens.ts · 共 16 色">
            <div className="space-y-8">
              {COLOR_SYSTEM.map(group => (
                <div key={group.group}>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-sm font-semibold text-neutral-700">{group.group}</span>
                    <span className="text-xs text-neutral-400">{group.desc}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.colors.map(c => (
                      <ColorCard key={c.token} {...c} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] px-5 py-4 text-[11px] text-neutral-500 leading-relaxed">
                💡 点击任意色块复制 hex 值 · 引用时 import <code className="font-mono bg-neutral-100 px-1 rounded">colorTokens</code> from design-tokens.ts，不要直接写色值 · ⚠ 标注表示当前代码存在偏差
              </div>

              <div className="flex items-center gap-3">
                <Button size="small" onClick={() => setAuditOpen(true)}>
                  查看用色审计
                </Button>
                <span className="text-[11px] text-neutral-400">{COLOR_VIOLATIONS.length} 处偏差记录</span>
              </div>
              <RuleBlock
                rules={[
                  "引用颜色必须 import colorTokens，不能写裸 hex（如 #2257D4 应写 colorTokens.brandPrimary）",
                  "Tailwind gray-* 色值与 Ink token 不对齐（gray-900=#111827 vs Ink/T10=#0F1229），新代码一律用 colorTokens",
                  "antdTheme 的状态色（colorSuccess / colorError 等）已绑定 colorTokens，不要重复覆盖",
                ]}
                avoid={[
                  "不要在组件代码里直接写 brand.50 / neutral.200 等色阶值，那是给 antdTheme 用的 primitive 层",
                  "后台侧边栏 bg-gray-900 是有意设计，不在 16 色规范范围，不要「统一」进来",
                ]}
              />
            </div>
          </Section>

          {/* 02 字体排版 */}
          <Section id="typography" index={2} title="字体排版" source="design-tokens.ts → fontSize / fontWeight / fontFamily">
            <div className="rounded-xl overflow-hidden border border-[#ECEAE8]">
              {Object.entries(fontSize).map(([k, v], i) => (
                <div key={k} className={`flex items-center gap-6 px-5 py-4 ${i % 2 === 0 ? "bg-white" : "bg-[#F8F7F6]"}`}>
                  <span className="font-mono text-[10px] text-neutral-300 w-8 shrink-0">{k}</span>
                  <span className="font-mono text-[10px] text-neutral-400 w-28 shrink-0">{v.size} / {v.lineHeight}</span>
                  <span style={{ fontSize: v.size, lineHeight: v.lineHeight }} className="text-neutral-900 font-medium flex-1">
                    企业国际版 · Enterprise Logistics
                  </span>
                  <span className="text-[10px] text-neutral-400 shrink-0">{v.desc}</span>
                </div>
              ))}
            </div>
            <RuleBlock
              rules={[
                "用 fontSize scale 里的值，不自定义 px 数字",
                "页面/弹窗标题用 heading，卡片小标题用 subheading，表单标签/正文用 body，时间戳/辅助说明用 caption",
                "相邻层级之间至少差一个 scale，避免视觉上区分不明显",
              ]}
              avoid={[
                "不要为了对齐 UI 稿随意调 font-size，先校验是否用错了 scale",
                "不要给正文内容用 heading scale（过重），给标题用 caption scale（过轻）",
              ]}
            />
          </Section>

          {/* 03 间距 & 圆角 */}
          <Section id="spacing" index={3} title="间距 & 圆角 & 阴影" source="design-tokens.ts → spacing / radius / shadow / zIndex / motion">
            {/* 间距 — 三分类 */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-neutral-600 mb-3">Spacing</p>
              <p className="text-[11px] text-neutral-400 mb-4">按使用场景分三类：inset（组件内 padding）· stack（元素间 gap）· layout（页面级间距）</p>
              <div className="grid grid-cols-3 gap-4">
                {(["inset", "stack", "layout"] as const).map(cat => (
                  <div key={cat} className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                    <p className="text-[10px] font-mono text-[#2257D4] uppercase tracking-widest mb-3">{cat}</p>
                    <div className="space-y-2">
                      {Object.entries(spacing[cat]).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-neutral-400 w-8 shrink-0">{k}</span>
                          <div className="h-2.5 bg-[#2257D4]/25 rounded-sm shrink-0" style={{ width: v }} />
                          <span className="font-mono text-[10px] text-neutral-400 ml-auto">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* 圆角 */}
              <div className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-3">Radius</p>
                <div className="space-y-1">
                  {Object.entries(radius).map(([k, v]) => (
                    <TokenRow key={k} name={k} value={v}>
                      <div className="w-9 h-5 bg-[#2257D4]/10 border border-[#2257D4]/20" style={{ borderRadius: v }} />
                    </TokenRow>
                  ))}
                </div>
              </div>

              {/* 阴影 */}
              <div className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-3">Shadow</p>
                <div className="space-y-4">
                  {Object.entries(shadow).filter(([k]) => k !== "none").map(([k, v]) => (
                    <div key={k} className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-neutral-400 w-16 shrink-0">{k}</span>
                      <div className="w-12 h-8 bg-white rounded-lg shrink-0" style={{ boxShadow: v }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* z-index & motion */}
              <div className="space-y-4">
                <div className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-3">Z-Index</p>
                  <div className="space-y-1">
                    {Object.entries(zIndex).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between py-1 border-b border-neutral-100 last:border-0">
                        <span className="font-mono text-[10px] text-neutral-400">{k}</span>
                        <span className="font-mono text-[10px] text-neutral-600">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-3">Motion / Duration</p>
                  <div className="space-y-1">
                    {Object.entries(motion.duration).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between py-1 border-b border-neutral-100 last:border-0">
                        <span className="font-mono text-[10px] text-neutral-400">{k}</span>
                        <span className="font-mono text-[10px] text-neutral-600">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-3">Icon Size</p>
                  <div className="space-y-1">
                    {Object.entries(iconSize).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3 py-1 border-b border-neutral-100 last:border-0">
                        <span className="font-mono text-[10px] text-neutral-400 w-6">{k}</span>
                        <div className="bg-[#2257D4]/20 rounded-sm" style={{ width: v, height: v }} />
                        <span className="font-mono text-[10px] text-neutral-600 ml-auto">{v}px</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <RuleBlock
              rules={[
                "inset 用于组件内部 padding（按钮、卡片、输入框）；stack 用于同级元素之间 gap；layout 用于页面区块间距",
                "圆角：按钮/输入框用 radius.md，卡片/弹窗用 radius.lg，标签/徽章用 radius.pill",
                "阴影：卡片用 shadow.card，底部操作栏用 shadow.footerBar，弹出层用 shadow.popup",
                "z-index 直接用 zIndex token，不要写魔法数字（如 z-[999]）",
              ]}
              avoid={[
                "不要混用 inset 和 stack：卡片内容之间的间距是 stack，卡片自身的内边距是 inset",
                "不要用 layout 间距做组件内部间距，数值太大会撑破布局",
              ]}
            />
          </Section>

          {/* 04 按钮 */}
          <Section id="buttons" index={4} title="按钮" source="components/AntdConfigProvider → antdTheme.components.Button">
            <div className="divide-y divide-neutral-50">
              {[
                { label: "Primary", desc: 'type="primary" — 主操作，唯一强调色', items: [
                  <Button type="primary" key="1">立即下单</Button>,
                  <Button type="primary" size="large" key="2">立即下单 Large</Button>,
                  <Button type="primary" size="small" key="3">Small</Button>,
                  <Button type="primary" disabled key="4">禁用</Button>,
                  <Button type="primary" loading key="5">加载中</Button>,
                ]},
                { label: "Default", desc: 'type="default" — 次级操作，灰边框', items: [
                  <Button key="1">确认</Button>,
                  <Button size="large" key="2">确认 Large</Button>,
                  <Button disabled key="3">禁用</Button>,
                ]},
                { label: "Text & Link", desc: 'type="text" / "link" — 轻量操作', items: [
                  <Button type="text" key="1">重新选择</Button>,
                  <Button type="link" key="2">查看详情 →</Button>,
                  <Button type="text" disabled key="3">禁用</Button>,
                ]},
                { label: "Danger", desc: 'danger=true — 不可逆破坏性操作（配合 Modal.confirm）', items: [
                  <Button danger type="primary" key="1">确认取消</Button>,
                  <Button danger key="2">取消订单</Button>,
                ]},
              ].map(group => (
                <div key={group.label} className="flex gap-6 items-start py-5 first:pt-0 last:pb-0">
                  <div className="w-28 shrink-0">
                    <div className="text-sm font-semibold text-neutral-700">{group.label}</div>
                    <div className="text-[10px] text-neutral-400 leading-relaxed mt-1">{group.desc}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap pt-0.5">
                    {group.items}
                  </div>
                </div>
              ))}
            </div>
            <RuleBlock
              rules={[
                "每个视图最多一个 Primary 按钮，是该视图的唯一主 CTA（如「确认下单」）",
                "不可逆操作（取消订单）用 danger primary + Modal.confirm 二次确认，不能直接执行",
                "提交请求期间必须显示 Loading 状态，防止用户重复点击",
                "操作列（表格内）的按钮用 type=\"link\"，轻量跳转用 type=\"link\"，无背景内联操作用 type=\"text\"",
              ]}
              avoid={[
                "不要在同一视图堆叠多个 Primary（会稀释主操作的视觉权重）",
                "不要用裸 Button danger 直接执行危险操作，必须配合确认弹窗",
                "不要在没有 Loading 的情况下提交表单（用户无法感知进度）",
              ]}
            />
          </Section>

          {/* 05 表单输入框 */}
          <Section id="inputs" index={5} title="表单输入框" source="admin/enterprises/create → Ant Design Form + Input + Select + InputNumber" usage={USAGE_MAP["表单输入框"]} onViewUsage={handleViewUsage}>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-[10px] font-mono text-neutral-400 mb-4 uppercase tracking-widest">Input States</p>
                <Form layout="vertical">
                  <Form.Item label="默认"><Input placeholder="请输入企业名称" /></Form.Item>
                  <Form.Item label="有值"><Input defaultValue="菜鸟速递" /></Form.Item>
                  <Form.Item label="禁用"><Input placeholder="禁用状态" disabled /></Form.Item>
                  <Form.Item label="密码"><Input.Password placeholder="8-20位，须含字母和数字" /></Form.Item>
                  <Form.Item label="错误" validateStatus="error" help="企业名称不能为空">
                    <Input placeholder="请输入企业名称" />
                  </Form.Item>
                </Form>
              </div>
              <div>
                <p className="text-[10px] font-mono text-neutral-400 mb-4 uppercase tracking-widest">Select & Combo</p>
                <Form layout="vertical">
                  <Form.Item label="国家/地区">
                    <Select defaultValue="+60" options={[
                      { label: "马来西亚 +60", value: "+60" },
                      { label: "泰国 +66", value: "+66" },
                      { label: "越南 +84", value: "+84" },
                    ]} />
                  </Form.Item>
                  <Form.Item label="手机号">
                    <div className="flex gap-2">
                      <Select defaultValue="+60" style={{ width: 100 }} options={[
                        { label: "+60", value: "+60" },
                        { label: "+66", value: "+66" },
                      ]} />
                      <Input placeholder="请输入手机号" className="flex-1" />
                    </div>
                  </Form.Item>
                  <Form.Item label="账期额度（人民币）">
                    <InputNumber min={0} style={{ width: "100%" }} addonBefore="CNY" placeholder="0" />
                  </Form.Item>
                  <Form.Item label="溢价系数">
                    <InputNumber min={1} step={0.01} precision={2} defaultValue={1.00} style={{ width: "100%" }} />
                  </Form.Item>
                </Form>
              </div>
              <div>
                <p className="text-[10px] font-mono text-neutral-400 mb-4 uppercase tracking-widest">完整示例</p>
                <div className="rounded-xl border border-[#ECEAE8] p-5 bg-[#F8F7F6]">
                  <Form layout="vertical">
                    <Form.Item label="企业名称" required>
                      <Input defaultValue="菜鸟速递" />
                    </Form.Item>
                    <Form.Item label="登录手机号" required>
                      <div className="flex gap-2">
                        <Select defaultValue="+60" style={{ width: 100 }} options={[{ label: "+60", value: "+60" }]} />
                        <Input defaultValue="138 0000 0000" className="flex-1" />
                      </div>
                    </Form.Item>
                    <Form.Item label="账期额度">
                      <InputNumber defaultValue={50000} style={{ width: "100%" }} addonBefore="CNY" />
                    </Form.Item>
                    <div className="flex justify-end gap-2 pt-1">
                      <Button>取消</Button>
                      <Button type="primary">创建企业</Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <RuleBlock
              rules={[
                "所有字段必须有 Form.Item label，不能只靠 placeholder 传达字段含义",
                "区码 + 手机号：用 Select(style={{width:100}}) + Input(flex-1) 组合，不用 addonBefore（布局更灵活）",
                "金额类 InputNumber 必须加 addonBefore 货币符号（CNY / THB / VND 等），明确货币单位",
                "错误状态：validateStatus=\"error\" + help 提示文案，说明具体原因（如「手机号格式不正确」）",
              ]}
              avoid={[
                "不要只有 placeholder 没有 label（placeholder 消失后用户找不到字段含义）",
                "不要用 addonBefore 做区码选择（宽度固定，无法选择，语义上是输入前缀而非选择器）",
                "不要省略 required 标记和校验——企业创建、下单确认都是关键操作",
              ]}
            />
          </Section>

          {/* 06 状态标签 */}
          <Section id="status" index={6} title="订单状态标签" source="components/OrderStatusTag.tsx → design-tokens.statusColors" usage={USAGE_MAP["订单状态标签"]} onViewUsage={handleViewUsage}>
            <div className="rounded-xl border border-[#ECEAE8] overflow-hidden">
              {Object.keys(statusColors).map((status, i) => (
                <div key={status} className={`flex items-center gap-6 px-5 py-4 ${i % 2 === 0 ? "bg-white" : "bg-[#F8F7F6]"}`}>
                  <OrderStatusTag status={status as keyof typeof statusColors} />
                  <span className="font-mono text-xs text-neutral-400">{status}</span>
                  <span className="text-xs text-neutral-400 ml-auto">
                    {statusColors[status as keyof typeof statusColors].color}
                  </span>
                </div>
              ))}
              <div className="px-5 py-3 bg-amber-50/60 border-t border-amber-100">
                <p className="text-[10px] text-amber-600">
                  ⚠ admin/orders 表格的状态用 Ant Design <code className="bg-amber-100 px-1 rounded">&lt;Tag color=&#123;hex&#125;&gt;</code>，
                  与此组件是两套体系，不可混用。
                </p>
              </div>
            </div>
            <RuleBlock
              rules={[
                "用户侧页面（/orders）用 OrderStatusTag 组件，引用 statusColors token",
                "后台管理页面（/admin/orders）用 Ant Design <Tag color={hex}>，两套体系各自独立",
                "颜色由 statusColors 统一管理，不要给 OrderStatusTag 手动传 color / backgroundColor",
                "新增订单状态时，先在 design-tokens.ts 的 statusColors 里定义，再让组件引用",
              ]}
              avoid={[
                "不要把 OrderStatusTag 用在后台表格里（颜色体系不同，视觉会不一致）",
                "不要在业务代码里写 if(status==='completed') color='#00A178'，状态和颜色的映射只在 statusColors 里维护",
              ]}
            />
          </Section>

          {/* 07 表格行 */}
          <Section id="table" index={7} title="表格行" source="admin/orders/page.tsx → Ant Design Table，行高 56px" usage={USAGE_MAP["表格行"]} onViewUsage={handleViewUsage}>
            <div className="rounded-xl border border-[#ECEAE8] overflow-hidden">
              <Table columns={TABLE_COLS} dataSource={TABLE_DATA} pagination={false} size="middle" />
            </div>
            <RuleBlock
              rules={[
                "统一使用 size=\"middle\"（行高适中，信息密度合理，与设计稿对齐）",
                "行可点击展开详情时，加 rowClassName=\"cursor-pointer\" 给用户视觉反馈",
                "操作列的按钮用 type=\"link\"（轻量，不抢主 CTA 的视觉权重）",
                "表格无数据时必须配空状态（见 Section 10），不能留空白区域",
                "分页用 showTotal 显示总条数，pageSize 默认 15",
              ]}
              avoid={[
                "不要用 size=\"small\"（信息密度过高，移动端和小屏体验差）",
                "不要在操作列放 Primary 按钮（操作列不是主 CTA）",
                "不要省略空状态——无数据时空白表格让用户以为页面没加载完",
              ]}
            />
          </Section>

          {/* 08 Modal */}
          <Section id="modal" index={8} title="Modal 确认框" source="handleCancelOrder → Modal.confirm，okButtonProps: { danger: true }">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Button danger type="primary" onClick={handleCancelDemo}>触发确认框</Button>
                <span className="text-sm text-neutral-400">点击查看真实 Modal 效果</span>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-[#ECEAE8]">
                {[
                  ["触发条件", "订单状态为 calling_driver / in_transit / delivering"],
                  ["确认按钮", "danger 红色，文案「确认取消」"],
                  ["取消按钮", "默认灰边框，文案「返回」（避免语义混淆）"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-[#F8F7F6] rounded-xl p-4">
                    <div className="font-mono text-[10px] text-neutral-400 mb-2">{k}</div>
                    <div className="text-sm text-neutral-600">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <RuleBlock
              rules={[
                "不可逆的全局操作用 Modal.confirm，不要自己写 <Modal open={...}>（避免重复维护 state）",
                "危险操作必须加 okButtonProps: {{ danger: true }}，让用户意识到风险",
                "cancelText 避免写「取消」——在「取消订单」场景下语义混淆，改用「返回」",
                "与 Popconfirm 的区分：Popconfirm 锚定在触发元素旁（轻量，如退出登录）；Modal 是全局中断式弹窗（重量，如取消订单）",
              ]}
              avoid={[
                "不要在 Modal 里嵌套另一个 Modal.confirm（层级混乱，用户无法判断优先级）",
                "不要用 Modal 做纯展示（用 Drawer 代替，侧边展示不打断主流程）",
                "不要省略 icon——ExclamationCircleOutlined 给用户视觉上的危险预警",
              ]}
            />
          </Section>

          {/* 09 导航栏 */}
          <Section id="navbar" index={9} title="导航栏" source="components/Navbar.tsx → h-16 桌面端，shadow.navbar" usage={USAGE_MAP["导航栏"]} onViewUsage={handleViewUsage}>
            <div className="space-y-6">
              {[
                { label: "默认（无 active tab）", active: "" },
                { label: "激活状态（立即叫车）",  active: "立即叫车" },
              ].map(({ label, active }) => (
                <div key={label}>
                  <p className="font-mono text-[10px] text-neutral-400 mb-3">{label}</p>
                  <div className="rounded-xl overflow-hidden border border-[#ECEAE8]">
                    <nav className="h-16 bg-white flex items-center justify-between px-6" style={{ boxShadow: shadow.navbar }}>
                      <div className="flex items-center gap-8">
                        <div className="bg-orange-500 text-white text-xs font-medium px-3 py-1.5 rounded-md leading-none">
                          货拉拉企业国际版
                        </div>
                        <div className="flex items-center">
                          {["立即叫车", "历史订单", "账户余额"].map(tab => (
                            <div key={tab} className="relative">
                              <span className={`block px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                                tab === active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
                              }`}>{tab}</span>
                              {tab === active && (
                                <div className="absolute left-0 right-0 h-0.5 bg-[#2257D4]" style={{ bottom: "-8px" }} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-600">菜鸟物流国际</span>
                        <div className="w-px h-5 bg-neutral-200" />
                        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
                          <LogoutOutlined className="text-neutral-500 text-sm" />
                        </button>
                      </div>
                    </nav>
                  </div>
                </div>
              ))}
            </div>
            <RuleBlock
              rules={[
                "只用于顶层三个页面（立即叫车 / 历史订单 / 账户余额），登录页不用",
                "Tab 激活底线颜色固定为 brandPrimary（#2257D4），不可更改",
                "退出登录必须用 Popconfirm 包裹，不能点击即退出",
                "语言切换在导航栏内，登录页另有独立实现——两处各自维护，不要共用",
              ]}
              avoid={[
                "不要在非顶层页面（如下单确认、订单详情）显示导航栏——这些页面用二级导航（返回 + 标题）",
                "不要修改导航栏高度（h-16 固定），内容区的 padding-top 依赖这个高度",
              ]}
            />
          </Section>

          {/* 10 空状态 */}
          <Section id="empty" index={10} title="空状态" source="antd Empty → wallet/page.tsx · Table locale.emptyText" usage={USAGE_MAP["空状态"]} onViewUsage={handleViewUsage}>
            <div className="grid grid-cols-3 gap-5">
              {/* 表格无数据 */}
              <div>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">表格无数据</p>
                <div className="rounded-xl border border-[#ECEAE8] overflow-hidden">
                  <Table
                    columns={TABLE_COLS}
                    dataSource={[]}
                    pagination={false}
                    size="middle"
                    locale={{
                      emptyText: (
                        <div className="py-8">
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={<span className="text-sm text-neutral-400">暂无订单记录</span>}
                          />
                        </div>
                      ),
                    }}
                  />
                </div>
              </div>

              {/* 搜索无结果 */}
              <div>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">搜索无结果</p>
                <div className="rounded-xl border border-[#ECEAE8] p-8 flex flex-col items-center justify-center gap-4 bg-white">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span className="text-sm text-neutral-400">未找到匹配的企业</span>}
                  />
                  <Button size="small" type="link">清除筛选条件</Button>
                </div>
              </div>

              {/* 使用说明 */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">使用说明</p>
                {[
                  ["image", "固定用 Empty.PRESENTED_IMAGE_SIMPLE（小图）不用默认大图"],
                  ["description", "说明具体原因，如「暂无交易记录」而非「暂无数据」"],
                  ["搜索无结果", "额外提供「清除筛选条件」引导操作（type=\"link\" Button）"],
                  ["嵌入位置", "Table 用 locale.emptyText，页面级用 Empty 组件直接渲染"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                    <div className="font-mono text-[10px] text-neutral-400 mb-1">{k}</div>
                    <div className="text-[11px] text-neutral-600 leading-relaxed">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <RuleBlock
              rules={[
                "表格 / 列表无数据时必须有空状态，不能让用户看到空白区域",
                "用 Empty.PRESENTED_IMAGE_SIMPLE（小图），视觉上更轻量，适合嵌入表格",
                "description 文案说清楚原因，让用户知道「为什么空」",
                "搜索 / 筛选无结果时，提供「清除筛选条件」引导，避免用户死路",
              ]}
              avoid={[
                "不要用默认大图（Empty 不加 image 属性）——在表格里显示过重，视觉比例失调",
                "不要只写「暂无数据」——用户不知道是没有数据还是加载失败",
                "不要省略搜索无结果的引导操作——用户会以为搜索功能坏了",
              ]}
            />
          </Section>

          {/* 11 Drawer */}
          <Section id="drawer" index={11} title="Drawer 侧边抽屉" source="antd Drawer → OrderDrawer.tsx · 用色审计">
            <div className="grid grid-cols-3 gap-5">
              {/* 触发演示 */}
              <div className="col-span-2 space-y-4">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">订单详情 Drawer（右侧，width=640）</p>
                <div className="rounded-xl border border-[#ECEAE8] p-6 bg-[#F8F7F6] flex flex-col gap-4">
                  {/* 模拟触发场景 */}
                  <div className="rounded-lg bg-white border border-[#ECEAE8] overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#ECEAE8] flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-400">订单列表</span>
                      <span className="text-[10px] text-neutral-300 font-mono">点击行 → 打开 Drawer</span>
                    </div>
                    {[
                      { id: "O2025-001", ent: "菜鸟速递", status: "配送中", amount: "THB 680.00" },
                      { id: "O2025-002", ent: "顺丰国际", status: "已完成", amount: "VND 850,000" },
                    ].map((row) => (
                      <button
                        key={row.id}
                        onClick={() => setDrawerOpen(true)}
                        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-[#F8F7F6] border-b border-[#ECEAE8] last:border-0 transition-colors group"
                      >
                        <span className="font-mono text-xs text-neutral-500 w-24 shrink-0">{row.id}</span>
                        <span className="text-sm text-neutral-700 flex-1">{row.ent}</span>
                        <Tag color={row.status === "配送中" ? "#2257D4" : "default"} className="text-xs">{row.status}</Tag>
                        <span className="text-xs text-neutral-500 w-24 text-right shrink-0">{row.amount}</span>
                        <span className="text-[10px] text-[#2257D4] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">详情 →</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => setDrawerOpen(true)}>打开订单详情</Button>
                    <span className="text-[11px] text-neutral-400 self-center">placement="right" · width=640</span>
                  </div>
                </div>
              </div>

              {/* 规格说明 */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">规格说明</p>
                {[
                  ["placement", "固定 right（右侧），不用 left/top/bottom"],
                  ["width", "标准 640px；信息密度低用 480px"],
                  ["title", "说明内容，如「订单详情」而非「详情」"],
                  ["extra", "放次要操作，如「导出 PDF」"],
                  ["onClose", "必须绑定关闭函数，支持 Esc / 遮罩关闭"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                    <div className="font-mono text-[10px] text-neutral-400 mb-1">{k}</div>
                    <div className="text-[11px] text-neutral-600 leading-relaxed">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <RuleBlock
              rules={[
                "详情查看用 Drawer，需要用户决策的操作用 Modal",
                "width=640 为标准宽度，保证内容区域足够展示多列信息",
                "title 写明内容类型，extra 放低优先级操作",
                "支持键盘关闭（Esc），遮罩点击关闭",
              ]}
              avoid={[
                "不要在 Drawer 里嵌套另一个 Drawer——用户失去空间感",
                "不要把主要操作（确认/提交）放在 extra——用户找不到",
                "不要用 placement=left——与面包屑导航冲突，视觉混乱",
              ]}
            />
          </Section>

          {/* 12 Toast */}
          <Section id="toast" index={12} title="Toast 消息" source="antd message → message.success / error / warning / info">
            <div className="grid grid-cols-2 gap-8">
              {/* 4 种类型演示 */}
              <div className="space-y-4">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">4 种类型</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: "success", label: "操作成功", color: "#00A178", bg: "#DFF3EC", example: "订单已取消" },
                    { type: "error",   label: "操作失败", color: "#F23041", bg: "#FEE2E5", example: "提交失败，请重试" },
                    { type: "warning", label: "警告提示", color: "#F59314", bg: "#FEF3CD", example: "账期余额不足" },
                    { type: "info",    label: "一般通知", color: "#2257D4", bg: "#EEF2FB", example: "正在处理中..." },
                  ].map(({ type, label, color, bg, example }) => (
                    <button
                      key={type}
                      onClick={() => (message as unknown as Record<string, (s: string) => void>)[type](example)}
                      className="rounded-xl border p-4 text-left transition-all hover:shadow-sm active:scale-[0.98]"
                      style={{ borderColor: color + "33", backgroundColor: bg }}
                    >
                      <div className="font-mono text-[10px] mb-1" style={{ color }}>{type}</div>
                      <div className="text-xs font-medium text-neutral-700 mb-1">{label}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">"{example}"</div>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-neutral-400 font-mono">↑ 点击按钮触发真实 Toast</p>
              </div>

              {/* 时机说明 */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">使用时机</p>
                {[
                  ["success", "操作完成后立即反馈，如「订单已取消」「已复制」"],
                  ["error",   "操作失败后说明原因，如「提交失败，请检查网络」"],
                  ["warning", "用户需要注意但不需要立即处理，如「余额即将不足」"],
                  ["info",    "非关键性通知，如「正在导出，请稍候」"],
                  ["duration", "默认 3s，重要错误用 5s（第三参数传数字）"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                    <div className="font-mono text-[10px] text-neutral-400 mb-1">{k}</div>
                    <div className="text-[11px] text-neutral-600 leading-relaxed">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <RuleBlock
              rules={[
                "轻量操作反馈用 message（Toast），需要确认的破坏性操作用 Modal.confirm",
                "success / error 是最常用的两种，warning / info 按需使用",
                "文案简短直接：「订单已取消」比「您的订单已被成功取消」好",
                "错误 Toast 文案要说明原因或引导操作",
              ]}
              avoid={[
                "不要用 Modal.alert 替代 Toast——弹窗打断用户流程",
                "不要只写「操作失败」——用户不知道下一步该怎么做",
                "不要在同一操作连续触发多个 Toast——用一条合并",
              ]}
            />
          </Section>

          {/* 13 Skeleton */}
          <Section id="skeleton" index={13} title="Loading / Skeleton" source="antd Skeleton · Spin → 数据加载占位">
            <div className="grid grid-cols-2 gap-8">
              {/* Skeleton 演示 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Skeleton 占位</p>
                  <button
                    onClick={() => {
                      setSkeletonLoading(true);
                      setTimeout(() => setSkeletonLoading(false), 2000);
                    }}
                    className="text-[10px] font-mono text-[#2257D4] hover:underline"
                  >
                    {skeletonLoading ? "加载中..." : "重新播放 →"}
                  </button>
                </div>
                <div className="rounded-xl border border-[#ECEAE8] overflow-hidden">
                  <Skeleton
                    loading={skeletonLoading}
                    active
                    avatar={{ shape: "square", size: 40 }}
                    paragraph={{ rows: 3 }}
                    className="p-4"
                  >
                    <div className="p-4 flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#EEF2FB] flex items-center justify-center shrink-0">
                        <span className="text-[#2257D4] text-xs font-bold">菜</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-neutral-800 mb-1">菜鸟速递</div>
                        <div className="text-xs text-neutral-500">E001 · 泰国 · 月账期 CNY 50,000</div>
                        <div className="text-xs text-neutral-400 mt-1">剩余额度 CNY 32,450.00</div>
                      </div>
                    </div>
                  </Skeleton>
                </div>

                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-6">Spin 操作等待</p>
                <div className="rounded-xl border border-[#ECEAE8] p-6 bg-[#F8F7F6] flex items-center gap-6">
                  <Spin size="small" />
                  <div className="text-xs text-neutral-500">小 · 按钮内加载中</div>
                  <Spin />
                  <div className="text-xs text-neutral-500">默认 · 局部区域</div>
                  <Spin size="large" />
                  <div className="text-xs text-neutral-500">大 · 全页加载</div>
                </div>
              </div>

              {/* 使用说明 */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">使用说明</p>
                {[
                  ["Skeleton", "数据首次加载时占位，保持页面布局稳定，避免闪烁"],
                  ["active",   "Skeleton 必须加 active 属性，开启动画表示正在加载"],
                  ["Spin",     "操作触发后的等待状态（提交、导出），不是数据加载"],
                  ["尺寸",     "Spin: small=按钮内 / default=卡片局部 / large=全页"],
                  ["超时",     "加载超过 10s 应显示错误状态，不能一直 spinning"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                    <div className="font-mono text-[10px] text-neutral-400 mb-1">{k}</div>
                    <div className="text-[11px] text-neutral-600 leading-relaxed">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <RuleBlock
              rules={[
                "数据首次加载用 Skeleton，保持页面结构稳定，避免内容抖动",
                "Skeleton 形状应与真实内容匹配（有头像就加 avatar，多行内容调 rows）",
                "操作等待（提交、导出）用 Spin 而非 Skeleton",
                "加载完成后立即切换，不要加人工延迟",
              ]}
              avoid={[
                "不要用空白页面等待数据——Skeleton 比空白好 10 倍",
                "不要在已有数据的刷新时用 Skeleton——用 Spin 覆盖即可",
                "不要让 Spin 无限转——超时必须提供错误状态和重试",
              ]}
            />
          </Section>

          {/* 14 Pagination */}
          <Section id="pagination" index={14} title="分页 Pagination" source="antd Pagination → Table.pagination · orders / enterprises">
            <div className="grid grid-cols-3 gap-8">
              {/* 分页演示 */}
              <div className="col-span-2 space-y-6">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">标准分页（含总数）</p>
                <div className="rounded-xl border border-[#ECEAE8] p-5 bg-white space-y-5">
                  <Pagination
                    total={87}
                    pageSize={15}
                    current={2}
                    showTotal={(total) => `共 ${total} 条订单`}
                    showSizeChanger={false}
                  />
                  <div className="border-t border-[#ECEAE8] pt-4">
                    <p className="text-[10px] font-mono text-neutral-400 mb-3">含每页条数切换（企业列表）</p>
                    <Pagination
                      total={42}
                      pageSize={10}
                      current={1}
                      showTotal={(total) => `共 ${total} 家企业`}
                      showSizeChanger
                      pageSizeOptions={[10, 20, 50]}
                    />
                  </div>
                  <div className="border-t border-[#ECEAE8] pt-4">
                    <p className="text-[10px] font-mono text-neutral-400 mb-3">嵌入 Table（推荐写法）</p>
                    <div className="font-mono text-[11px] text-neutral-500 bg-[#F8F7F6] rounded-lg p-3 leading-relaxed">
                      {`<Table`}<br />
                      {`  pagination={{`}<br />
                      {`    pageSize: 15,`}<br />
                      {`    showTotal: (total) => \`共 \${total} 条\`,`}<br />
                      {`  }}`}<br />
                      {`/>`}
                    </div>
                  </div>
                </div>
              </div>

              {/* 规格说明 */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">规格说明</p>
                {[
                  ["pageSize", "订单列表 15 条；企业列表 10 条；交易记录 20 条"],
                  ["showTotal", "必须显示总数，格式「共 N 条订单」"],
                  ["showSizeChanger", "默认关闭；企业/交易管理页可开启"],
                  ["嵌入方式", "优先用 Table pagination 属性，避免单独维护状态"],
                  ["数据量小", "< 10 条时隐藏分页（pagination={false}）"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                    <div className="font-mono text-[10px] text-neutral-400 mb-1">{k}</div>
                    <div className="text-[11px] text-neutral-600 leading-relaxed">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <RuleBlock
              rules={[
                "Table 必须配 showTotal，让用户知道数据总量",
                "pageSize 按业务场景选择：订单 15 / 企业 10 / 交易 20",
                "数据量 < 10 条时关闭分页（pagination={false}），避免空页面",
                "分页状态应反映在 URL query 参数，支持刷新保留页码",
              ]}
              avoid={[
                "不要全部用默认 10 条——订单一页 10 条翻页太频繁",
                "不要省略 showTotal——用户不知道总共有多少数据",
                "不要在数据量 < 2 页时还显示分页——视觉噪音",
              ]}
            />
          </Section>

          {/* 15 图标系统 */}
          <Section id="icons" index={15} title="图标系统" source="@ant-design/icons → iconSize token · design-tokens.ts">
            <div className="space-y-6">
              {/* 图标尺寸规范 */}
              <div>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">尺寸规范（iconSize token）</p>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { key: "xs", px: 12, desc: "标签内内联图标" },
                    { key: "sm", px: 16, desc: "大多数 UI 图标" },
                    { key: "md", px: 20, desc: "功能操作图标" },
                    { key: "lg", px: 24, desc: "功能性大图标" },
                    { key: "xl", px: 32, desc: "空状态图标" },
                  ].map(({ key, px, desc }) => (
                    <div key={key} className="rounded-xl border border-[#ECEAE8] bg-white p-4 flex flex-col items-center gap-3">
                      <SearchOutlined style={{ fontSize: px, color: "#2257D4" }} />
                      <div className="text-center">
                        <div className="font-mono text-xs text-neutral-700 font-medium">{key}</div>
                        <div className="font-mono text-[10px] text-neutral-400">{px}px</div>
                        <div className="text-[10px] text-neutral-500 mt-1">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 项目用图标清单 */}
              <div>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">项目在用图标（全量）</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      group: "导航 & 操作",
                      icons: [
                        { name: "SearchOutlined",           icon: <SearchOutlined />,           usage: "搜索框 prefix，sm=16" },
                        { name: "PlusOutlined",             icon: <PlusOutlined />,             usage: "新建按钮，sm=16" },
                        { name: "DownloadOutlined",         icon: <DownloadOutlined />,         usage: "导出 Excel，sm=16" },
                        { name: "ArrowLeftOutlined",        icon: <ArrowLeftOutlined />,        usage: "返回按钮，sm=16" },
                        { name: "LogoutOutlined",           icon: <LogoutOutlined />,           usage: "退出登录，md=20" },
                      ],
                    },
                    {
                      group: "状态 & 反馈",
                      icons: [
                        { name: "ExclamationCircleOutlined", icon: <ExclamationCircleOutlined />, usage: "Modal.confirm icon，md=20" },
                        { name: "InfoCircleOutlined",        icon: <InfoCircleOutlined />,        usage: "Tooltip 帮助提示，sm=16" },
                        { name: "UserOutlined",              icon: <UserOutlined />,              usage: "账号/用户，sm=16" },
                        { name: "TeamOutlined",              icon: <TeamOutlined />,              usage: "企业管理导航，sm=16" },
                        { name: "FileTextOutlined",          icon: <FileTextOutlined />,          usage: "订单文档，sm=16" },
                        { name: "TransactionOutlined",       icon: <TransactionOutlined />,       usage: "交易记录导航，sm=16" },
                      ],
                    },
                  ].map(({ group, icons }) => (
                    <div key={group}>
                      <p className="text-[10px] font-mono text-neutral-300 mb-2">{group}</p>
                      <div className="rounded-xl border border-[#ECEAE8] overflow-hidden">
                        {icons.map(({ name, icon, usage }, i) => (
                          <div key={name} className={`flex items-center gap-4 px-4 py-3 border-b border-[#ECEAE8] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F8F7F6]"}`}>
                            <span className="text-neutral-600 w-5 flex items-center justify-center shrink-0" style={{ fontSize: 16 }}>{icon}</span>
                            <span className="font-mono text-xs text-neutral-600 flex-1">{name}</span>
                            <span className="text-[10px] text-neutral-400">{usage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <RuleBlock
              rules={[
                "尺寸统一用 iconSize token：sm(16) 用于 UI 图标，md(20) 用于操作入口",
                "颜色跟随上下文：默认 Ink/T50(#8990A3)，激活/交互态 Brand/Primary(#2257D4)",
                "Search prefix 图标固定用 text-gray-400，与 placeholder 同级视觉重量",
                "所有图标来自 @ant-design/icons，统一 Outlined 风格，不混用 Filled",
              ]}
              avoid={[
                "不要用 fontSize 硬编码图标大小——用 iconSize token",
                "不要混用 Outlined 和 Filled（Filled 只用于状态填充，如 StarFilled）",
                "不要把图标放在没有语义的地方——每个图标必须有明确功能含义",
              ]}
            />
          </Section>

          {/* 16 搜索筛选栏 */}
          <Section id="search-filter" index={16} title="搜索筛选栏" source="admin/orders/page.tsx · admin/enterprises/page.tsx">
            <div className="space-y-6">
              {/* 订单列表筛选栏 */}
              <div>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">订单列表（多条件筛选）</p>
                <div className="rounded-xl border border-[#ECEAE8] bg-[#F8F7F6] p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Input
                      placeholder="搜索单号"
                      prefix={<SearchOutlined className="text-gray-400" />}
                      allowClear
                      style={{ width: 200 }}
                    />
                    <Input
                      placeholder="搜索地址"
                      prefix={<SearchOutlined className="text-gray-400" />}
                      allowClear
                      style={{ width: 200 }}
                    />
                    <Select
                      placeholder="供应商"
                      allowClear
                      style={{ width: 160 }}
                      options={[{ value: "huolala", label: "货拉拉" }, { value: "lalamove", label: "Lalamove" }]}
                    />
                    <Select
                      placeholder="国家"
                      allowClear
                      style={{ width: 120 }}
                      options={[{ value: "TH", label: "泰国" }, { value: "VN", label: "越南" }, { value: "MY", label: "马来西亚" }]}
                    />
                    <Select
                      placeholder="状态"
                      allowClear
                      style={{ width: 130 }}
                      options={[{ value: "in_transit", label: "配送中" }, { value: "completed", label: "已完成" }, { value: "cancelled", label: "已取消" }]}
                    />
                  </div>
                </div>
              </div>

              {/* 企业列表筛选栏 */}
              <div>
                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-4">企业列表（单搜索框 + 操作按钮）</p>
                <div className="rounded-xl border border-[#ECEAE8] bg-[#F8F7F6] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Input
                      placeholder="搜索企业名称"
                      prefix={<SearchOutlined className="text-gray-400" />}
                      allowClear
                      style={{ width: 280 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />}>新建企业</Button>
                  </div>
                </div>
              </div>

              {/* 结构说明 */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["布局", "flex items-center gap-3 flex-wrap，不换行时 gap=12px"],
                  ["Input 宽度", "单号/地址搜索 200px；企业名搜索 280px；固定宽度不拉伸"],
                  ["Select 宽度", "按内容最长选项定宽：2 字 120px / 3 字 130px / 4 字 160px"],
                  ["allowClear", "所有筛选项必须加 allowClear，方便重置单个条件"],
                  ["按钮位置", "操作按钮（新建/导出）放筛选栏右端，用 ml-auto 推到最右"],
                  ["状态同步", "筛选条件用 useMemo 派生 filtered 数据，不直接修改原数据"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-[#F8F7F6] border border-[#ECEAE8] p-4">
                    <div className="font-mono text-[10px] text-neutral-400 mb-1">{k}</div>
                    <div className="text-[11px] text-neutral-600 leading-relaxed">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <RuleBlock
              rules={[
                "所有筛选条件必须加 allowClear，支持逐个重置",
                "搜索框用 prefix={<SearchOutlined />}，颜色固定 text-gray-400",
                "筛选逻辑用 useMemo 派生 filtered 列表，避免直接改状态",
                "操作按钮（新建/导出）放在筛选栏最右端，视觉对齐 Table 右边界",
              ]}
              avoid={[
                "不要用 onChange 触发接口请求——先用本地 filter，需要服务端筛选时再改",
                "不要省略 allowClear——用户无法单独清除某个筛选条件会很烦",
                "不要把搜索框宽度设为 100%——在宽屏上过长，固定宽度更易对齐",
              ]}
            />
          </Section>

          <div className="h-16" />
        </main>
      </div>

      {/* Drawer Section 演示弹窗 */}
      <Drawer
        title="订单详情"
        placement="right"
        width={640}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={<Button size="small" type="text" icon={<LogoutOutlined />}>导出 PDF</Button>}
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-[#ECEAE8] overflow-hidden">
            {[
              ["订单编号", "O2025-001"],
              ["企业客户", "菜鸟速递"],
              ["下单时间", "2025-12-15 09:30"],
              ["国家", "泰国"],
              ["车型", "4.2 米厢车"],
              ["订单状态", "配送中"],
              ["订单金额", "THB 680.00 ≈ CNY 140.21"],
            ].map(([label, value], i) => (
              <div key={label} className={`flex justify-between px-4 py-3 text-sm border-b border-[#ECEAE8] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F8F7F6]"}`}>
                <span className="text-neutral-500">{label}</span>
                <span className="text-neutral-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-[#EEF2FB] border border-[#2257D4]/20 p-4 text-xs text-[#2257D4]">
            这是 Drawer Section (11) 的演示弹窗，展示标准 width=640 · placement=right 样式
          </div>
        </div>
      </Drawer>

      {/* Usage Viewer */}
      <UsageViewer
        open={!!usageViewer}
        onClose={() => setUsageViewer(null)}
        componentName={usageViewer?.name ?? ""}
        pages={usageViewer?.pages ?? []}
      />

      {/* 用色审计 Drawer */}
      <Drawer
        title="用色审计"
        placement="right"
        width={640}
        open={auditOpen}
        onClose={() => setAuditOpen(false)}
        extra={<span className="text-xs text-neutral-400">当前代码与规范的偏差记录</span>}
      >
        <div className="rounded-xl border border-[#ECEAE8] overflow-hidden">
          <div className="grid grid-cols-3 gap-0 text-[10px] font-mono text-neutral-400 px-4 py-2 bg-[#F8F7F6] border-b border-[#ECEAE8]">
            <span>文件位置</span><span>原用色</span><span>状态 / 说明</span>
          </div>
          {COLOR_VIOLATIONS.map((v, i) => (
            <div key={i} className={`grid grid-cols-3 gap-0 px-4 py-3 text-[11px] border-b border-[#ECEAE8] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F8F7F6]"}`}>
              <span className="font-mono text-neutral-500 pr-4 truncate">{v.file}</span>
              <span className="font-mono pr-4">
                <span className="text-red-400">{v.was}</span>
                {v.fixed !== "— 保留" && v.fixed !== "— 待评估" && (
                  <span className="text-neutral-300"> → <span className="text-green-600">{v.fixed}</span></span>
                )}
              </span>
              <span className={v.fixed === "— 保留" || v.fixed === "— 待评估" ? "text-neutral-400" : v.note.includes("已修复") ? "text-green-600" : "text-amber-500"}>
                {v.note}
              </span>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
