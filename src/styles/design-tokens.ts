/**
 * 企业国际版 — 设计 Token（唯一真相源）
 *
 * 所有颜色、字号、圆角、阴影、间距都在这里定义。
 * 代码和 Figma Variables 均从此文件同步。
 *
 * 命名规则：
 *   色阶 → brand.50 … brand.950
 *   语义 → semantic.info / success / warning / error / neutral
 *   字号 → typography.xs … typography.3xl
 */

// ═══════════════════════════════════════════
// 1. 颜色
// ═══════════════════════════════════════════

/** 品牌蓝 — 主色阶 */
export const brand = {
  50:  '#EEF2FB',
  100: '#DAE3F7',
  200: '#B5C7EF',
  300: '#8AA7E5',
  400: '#5C84DC',
  500: '#3468D8',
  600: '#2257D4',  // ← 主色 Primary
  700: '#1C47AC',  // ← 主色 Hover
  800: '#163884',
  900: '#112A5E',
  950: '#0B1B3D',
} as const;

/** 中性灰 — 与 Tailwind gray 对齐 */
export const neutral = {
  0:   '#FFFFFF',
  50:  '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#030712',
} as const;

/** 语义色 — 状态、反馈 */
export const semantic = {
  info: {
    base:  '#1677FF',
    light: '#E5EDFF',
    desc:  '进行中、信息提示',
  },
  success: {
    base:  '#00A178',
    light: '#DFF3EC',
    desc:  '已完成、成功',
  },
  warning: {
    base:  '#FAAD14',
    light: '#FFF7E6',
    desc:  '警告、注意',
  },
  error: {
    base:  '#EF4444',
    light: '#FEF2F2',
    desc:  '错误、验证失败',
  },
  disabled: {
    base:  '#8990A3',
    light: '#F0F3F7',
    desc:  '已取消、禁用',
  },
} as const;

/** 品牌栏深色（登录页左侧） */
export const brandDark = {
  start: '#0B1D40',
  end:   '#163A6E',
  angle: '153deg',
} as const;

// ═══════════════════════════════════════════
// 2. 字体
// ═══════════════════════════════════════════

/** 字体族 */
export const fontFamily = {
  base:    '"PingFang SC", -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
  price:   '"Alibaba PuHuiTi 3", "DIN Alternate", "Helvetica Neue", Arial, sans-serif',
  brand:   '"FZRuiZhengHeiS-DB-GB", "PingFang SC", sans-serif',
  english: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
} as const;

/** 字号层级 — 精简为 7 级 */
export const fontSize = {
  xs:   { size: '11px',  lineHeight: '16px',  desc: '徽章、脚注、极小标注' },
  sm:   { size: '12px',  lineHeight: '18px',  desc: '状态标签、辅助说明' },
  base: { size: '14px',  lineHeight: '22px',  desc: '正文、表单标签、列表项' },
  md:   { size: '16px',  lineHeight: '24px',  desc: '按钮文字、导航标签、强调正文' },
  lg:   { size: '20px',  lineHeight: '28px',  desc: '页面标题、卡片标题' },
  xl:   { size: '24px',  lineHeight: '32px',  desc: '价格数字、大标题' },
  '2xl': { size: '28px', lineHeight: '36px',  desc: '品牌大标题（登录页 headline）' },
} as const;

/** 字重 */
export const fontWeight = {
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

// ═══════════════════════════════════════════
// 3. 圆角
// ═══════════════════════════════════════════

export const radius = {
  sm:   '4px',   // 状态标签、小元素
  md:   '6px',   // 次要按钮
  base: '8px',   // 输入框、按钮、全局默认（antd borderRadius）
  lg:   '12px',  // 卡片、面板
  xl:   '16px',  // 大卡片、登录卡
  pill: '9999px', // 胶囊形（标签、徽章）
  full: '50%',   // 圆形（头像、指示器）
} as const;

// ═══════════════════════════════════════════
// 4. 阴影
// ═══════════════════════════════════════════

export const shadow = {
  /** 导航栏 — 轻微底边阴影 */
  navbar: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)',

  /** 卡片 — 标准卡片阴影 */
  card: '0 0 0 1px rgba(15,23,42,0.06), 0 8px 32px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06)',

  /** 底部浮动栏 — 上方向阴影 */
  footerBar: '0px -3px 6px 0px rgba(0,0,0,0.06), 0px -6px 16px 0px rgba(0,0,0,0.04), 0px -9px 28px 0px rgba(0,0,0,0.02)',

  /** 弹出层 — DatePicker、Popover 等 */
  popup: '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',

  /** 无阴影 */
  none: 'none',
} as const;

// ═══════════════════════════════════════════
// 5. 间距
// ═══════════════════════════════════════════

export const spacing = {
  0:    '0px',
  1:    '4px',
  1.5:  '6px',
  2:    '8px',
  2.5:  '10px',
  3:    '12px',
  3.5:  '14px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  8:    '32px',
  10:   '40px',
  12:   '48px',
} as const;

// ═══════════════════════════════════════════
// 6. 控件尺寸
// ═══════════════════════════════════════════

export const controlHeight = {
  sm: 32,   // 小控件
  md: 44,   // 标准输入框、按钮（antd controlHeight）
  lg: 54,   // 大操作按钮（下单、确认）
} as const;

// ═══════════════════════════════════════════
// 7. Ant Design 主题映射
// ═══════════════════════════════════════════

/** 直接导入给 ConfigProvider 使用 */
export const antdTheme = {
  token: {
    // ===== 品牌色 =====
    colorPrimary: brand[600],           // 主色：#2257D4
    colorPrimaryHover: brand[700],      // 主色悬停：#1C47AC
    colorPrimaryActive: brand[700],     // 主色激活
    colorPrimaryBg: brand[50],          // 主色背景
    colorPrimaryBgHover: brand[100],    // 主色背景悬停
    colorPrimaryBorder: brand[200],     // 主色边框
    colorPrimaryBorderHover: brand[300],// 主色边框悬停

    // ===== 链接色（不设置，避免覆盖导航栏）=====
    // colorLink: brand[600],           // 注释掉，让链接使用默认或手动控制
    // colorLinkHover: brand[700],
    // colorLinkActive: brand[700],

    // ===== 成功色 =====
    colorSuccess: semantic.success.base,      // #00A178
    colorSuccessBg: semantic.success.light,   // #DFF3EC

    // ===== 警告色 =====
    colorWarning: semantic.warning.base,      // #FAAD14
    colorWarningBg: semantic.warning.light,   // #FFF7E6

    // ===== 错误色 =====
    colorError: semantic.error.base,          // #EF4444
    colorErrorBg: semantic.error.light,       // #FEF2F2

    // ===== 信息色 =====
    colorInfo: semantic.info.base,            // #1677FF
    colorInfoBg: semantic.info.light,         // #E5EDFF

    // ===== 文本色 =====
    colorText: neutral[900],              // 主文本：#111827
    colorTextSecondary: neutral[600],     // 次要文本：#4B5563
    colorTextTertiary: neutral[400],      // 三级文本：#9CA3AF
    colorTextDisabled: neutral[300],      // 禁用文本：#D1D5DB

    // ===== 边框色 =====
    colorBorder: neutral[200],            // 边框：#E5E7EB
    colorBorderSecondary: neutral[100],   // 次要边框：#F3F4F6

    // ===== 背景色 =====
    colorBgContainer: neutral[0],         // 容器背景：#FFFFFF
    colorBgLayout: neutral[50],           // 布局背景：#F9FAFB
    colorBgElevated: neutral[0],          // 浮层背景：#FFFFFF

    // ===== 圆角 =====
    borderRadius: parseInt(radius.base),  // 8px
    borderRadiusLG: parseInt(radius.lg),  // 12px
    borderRadiusSM: parseInt(radius.sm),  // 4px

    // ===== 字体 =====
    fontFamily: fontFamily.base,
    fontSize: parseInt(fontSize.base.size),
    fontSizeHeading1: parseInt(fontSize['2xl'].size),
    fontSizeHeading2: parseInt(fontSize.xl.size),
    fontSizeHeading3: parseInt(fontSize.lg.size),
    fontSizeHeading4: parseInt(fontSize.md.size),
    fontSizeHeading5: parseInt(fontSize.base.size),

    // ===== 控件高度 =====
    controlHeight: controlHeight.md,      // 44px
    controlHeightLG: controlHeight.lg,    // 54px
    controlHeightSM: controlHeight.sm,    // 32px
  },
  components: {
    // ===== 按钮 =====
    Button: {
      colorPrimary: brand[600],
      colorPrimaryHover: brand[700],
      colorPrimaryActive: brand[700],
      primaryShadow: 'none',
      dangerShadow: 'none',
      defaultShadow: 'none',
    },

    // ===== 开关 =====
    Switch: {
      colorPrimary: brand[600],
      colorPrimaryHover: brand[700],
    },

    // ===== 单选框 =====
    Radio: {
      colorPrimary: brand[600],
    },

    // ===== 复选框 =====
    Checkbox: {
      colorPrimary: brand[600],
      colorPrimaryHover: brand[700],
    },

    // ===== 输入框 =====
    Input: {
      controlHeight: controlHeight.md,
      colorPrimaryHover: brand[600],
      colorPrimary: brand[600],
    },

    // ===== 选择器 =====
    Select: {
      controlHeight: controlHeight.md,
      colorPrimary: brand[600],
      colorPrimaryHover: brand[600],
    },

    // ===== 日期选择器 =====
    DatePicker: {
      controlHeight: controlHeight.md,
      colorPrimary: brand[600],
      colorPrimaryHover: brand[700],
    },

    // ===== 表单 =====
    Form: {
      labelColor: neutral[700],
      labelFontSize: parseInt(fontSize.base.size),
    },

    // ===== 表格 =====
    Table: {
      colorPrimary: brand[600],
      headerBg: neutral[50],
    },

    // ===== 标签页 =====
    Tabs: {
      colorPrimary: brand[600],
      colorPrimaryHover: brand[700],
      inkBarColor: brand[600],
      itemHoverColor: neutral[700],
      itemSelectedColor: brand[600],
    },

    // ===== 消息提示 =====
    Message: {
      colorInfo: brand[600],
    },

    // ===== 通知 =====
    Notification: {
      colorInfo: brand[600],
    },

    // ===== 标签 =====
    Tag: {
      colorPrimary: brand[600],
    },
  },
} as const;

// ═══════════════════════════════════════════
// 8. 订单状态色映射
// ═══════════════════════════════════════════

export const statusColors = {
  calling_driver: { color: semantic.info.base,     bg: semantic.info.light },
  in_transit:     { color: semantic.info.base,     bg: semantic.info.light },
  delivering:     { color: semantic.info.base,     bg: semantic.info.light },
  completed:      { color: semantic.success.base,  bg: semantic.success.light },
  cancelled:      { color: semantic.disabled.base, bg: semantic.disabled.light },
} as const;
