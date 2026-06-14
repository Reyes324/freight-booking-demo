/**
 * 企业国际版 — 设计 Token（唯一真相源）
 *
 * 三层结构：
 *   Primitive  → brand / neutral 色阶，给 antdTheme 用
 *   Semantic   → colorTokens，Figma 语义色，业务组件直接引用这层
 *   Component  → statusColors，组件专属映射
 *
 * 其余 token：字体、间距、圆角、阴影、图标尺寸、动效、层级
 */

// ═══════════════════════════════════════════
// 1. Primitive 色阶（给 antdTheme 用，业务组件不要直接引）
// ═══════════════════════════════════════════

/** 品牌蓝色阶 */
export const brand = {
  50:  '#EEF2FB',
  100: '#DAE3F7',
  200: '#B5C7EF',
  300: '#8AA7E5',
  400: '#5C84DC',
  500: '#3468D8',
  600: '#2257D4',  // ← Primary
  700: '#1C47AC',  // ← Hover
  800: '#163884',
  900: '#112A5E',
  950: '#0B1B3D',
} as const;

/** 中性灰色阶 */
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

/** 品牌栏深色（登录页左侧，独立于 16 色语义系统） */
export const brandDark = {
  start: '#0B1D40',
  end:   '#163A6E',
  angle: '153deg',
} as const;

// ═══════════════════════════════════════════
// 2. Semantic 颜色 Token（唯一业务组件用色层）
//    对应 Figma Variables，共 18 色
// ═══════════════════════════════════════════

export const colorTokens = {
  // ── 品牌色 ──────────────────────────────
  brandPrimary:     '#2257D4',  // Brand/Primary      主按钮、链接、Tab 选中、进行中状态
  brandHover:       '#1C47AC',  // Brand/Hover        按钮悬停/按下态
  brandAccent:      '#FF6600',  // Brand/Accent       呼叫司机标签、运营活动标签、优先订单强调
  brandAccentLight: '#FFF0E5',  // Brand/AccentLight  呼叫司机标签底色

  // ── 文本与图标（数字越小越深）────────────
  inkT10: '#0F1229',  // Ink/T10  一级文案：页面标题、弹窗标题、重要数字
  inkT20: '#252B47',  // Ink/T20  一级图标：导航主图标、功能入口图标
  inkT30: '#454C66',  // Ink/T30  二级文案：正文、表单标签、列表项
  inkT40: '#656C85',  // Ink/T40  二级图标：次要功能图标、表单内图标
  inkT50: '#8990A3',  // Ink/T50  三级文案：placeholder、辅助说明、禁用态文字
  inkT60: '#ABB2C2',  // Ink/T60  三级图标：装饰性图标、空状态图标

  // ── 边框与背景 ───────────────────────────
  surfaceBorder:     '#C5CCDB',  // Surface/Border     输入框边框、线性按钮描边
  surfaceDivider:    '#EBEFF5',  // Surface/Divider    分割线、表格行线
  surfaceBrandLight: '#EEF2FB',  // Surface/BrandLight 进行中状态标签底色
  surfaceWhite:      '#FFFFFF',  // Surface/White      卡片背景、输入框背景、弹窗背景
  surfaceDisabled:   '#F0F3F7',  // Surface/Disabled   禁用/已取消状态底色

  // ── 状态色 ───────────────────────────────
  statusSuccess:      '#00A178',  // Status/Success      已完成状态文字、成功反馈
  statusSuccessLight: '#DFF3EC',  // Status/SuccessLight 已完成状态标签底色
  statusError:        '#F23041',  // Status/Error        已取消状态、错误提示、表单校验
  statusWarning:      '#F59314',  // Status/Warning      警告提示
} as const;

// ═══════════════════════════════════════════
// 3. Component Token — 订单状态色映射
// ═══════════════════════════════════════════

export const statusColors = {
  calling_driver: { color: colorTokens.brandAccent,      bg: colorTokens.brandAccentLight },
  in_transit:     { color: colorTokens.brandPrimary,     bg: colorTokens.surfaceBrandLight },
  delivering:     { color: colorTokens.brandPrimary,     bg: colorTokens.surfaceBrandLight },
  completed:      { color: colorTokens.statusSuccess,    bg: colorTokens.statusSuccessLight },
  cancelled:      { color: colorTokens.inkT50,           bg: colorTokens.surfaceDisabled },
} as const;

// ═══════════════════════════════════════════
// 4. 字体
// ═══════════════════════════════════════════

export const fontFamily = {
  base:    '"PingFang SC", -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif',
  price:   '"Alibaba PuHuiTi 3", "DIN Alternate", "Helvetica Neue", Arial, sans-serif',
  brand:   '"FZRuiZhengHeiS-DB-GB", "PingFang SC", sans-serif',
  english: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
} as const;

export const fontSize = {
  xs:    { size: '11px', lineHeight: '16px', desc: '徽章、脚注、极小标注' },
  sm:    { size: '12px', lineHeight: '18px', desc: '状态标签、辅助说明' },
  base:  { size: '14px', lineHeight: '22px', desc: '正文、表单标签、列表项' },
  md:    { size: '16px', lineHeight: '24px', desc: '按钮文字、导航标签、强调正文' },
  lg:    { size: '20px', lineHeight: '28px', desc: '页面标题、卡片标题' },
  xl:    { size: '24px', lineHeight: '32px', desc: '价格数字、大标题' },
  '2xl': { size: '28px', lineHeight: '36px', desc: '品牌大标题（登录页 headline）' },
} as const;

export const fontWeight = {
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
} as const;

export const letterSpacing = {
  tight:  '-0.3px',  // 标题
  normal: '0',       // 正文默认
  wide:   '0.04em',  // 全大写标签、徽章
} as const;

// ═══════════════════════════════════════════
// 5. 圆角
// ═══════════════════════════════════════════

export const radius = {
  sm:   '4px',    // 状态标签、小元素
  md:   '6px',    // 次要按钮
  base: '8px',    // 输入框、按钮、全局默认
  lg:   '12px',   // 卡片、面板
  xl:   '16px',   // 大卡片、登录卡
  pill: '9999px', // 胶囊形（标签、徽章）
  full: '50%',    // 圆形（头像、指示器）
} as const;

// ═══════════════════════════════════════════
// 6. 阴影
// ═══════════════════════════════════════════

export const shadow = {
  navbar:    '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)',
  card:      '0 0 0 1px rgba(15,23,42,0.06), 0 8px 32px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06)',
  footerBar: '0px -3px 6px 0px rgba(0,0,0,0.06), 0px -6px 16px 0px rgba(0,0,0,0.04), 0px -9px 28px 0px rgba(0,0,0,0.02)',
  popup:     '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
  none:      'none',
} as const;

// ═══════════════════════════════════════════
// 7. 间距（按使用场景分类）
// ═══════════════════════════════════════════

export const spacing = {
  /** 组件内部 padding（inset） */
  inset: {
    xs:   '4px',   // 标签内边距、小徽章
    sm:   '8px',   // 按钮 padding-y、输入框内边距
    md:   '12px',  // 卡片内边距（小）
    lg:   '16px',  // 卡片内边距（标准）
    xl:   '24px',  // 大卡片、弹窗内边距
    '2xl': '32px', // 页面内容区域内边距
  },
  /** 同级元素之间 gap / margin（stack） */
  stack: {
    xs:   '4px',   // 图标和文字之间
    sm:   '8px',   // label 和 input 之间
    md:   '12px',  // 表单项之间
    lg:   '16px',  // 卡片内各区块之间
    xl:   '24px',  // Section 内各组件之间
    '2xl': '32px', // 大区块之间
    '3xl': '48px', // 页面级大区块之间
  },
  /** 页面级布局间距（layout） */
  layout: {
    sm: '24px',  // 移动端页面边距
    md: '32px',  // 桌面端内容区域间距
    lg: '48px',  // 大 Section 之间
    xl: '64px',  // 页面顶部留白
  },
} as const;

// ═══════════════════════════════════════════
// 8. 图标尺寸
// ═══════════════════════════════════════════

export const iconSize = {
  xs: 12,  // 标签内内联图标
  sm: 16,  // 大多数 UI 图标（SearchOutlined 等）
  md: 20,  // 标准操作图标（退出、功能入口）
  lg: 24,  // 功能性大图标
  xl: 32,  // 空状态图标
} as const;

// ═══════════════════════════════════════════
// 9. 控件尺寸
// ═══════════════════════════════════════════

export const controlHeight = {
  sm: 32,  // 小控件
  md: 44,  // 标准输入框、按钮
  lg: 54,  // 大操作按钮（下单、确认）
} as const;

// ═══════════════════════════════════════════
// 10. 动效
// ═══════════════════════════════════════════

export const motion = {
  duration: {
    fast: '100ms',  // hover 态切换
    base: '200ms',  // 大多数过渡（Ant Design 默认）
    slow: '300ms',  // Drawer 滑入、页面切换
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',  // 标准缓动
    in:      'cubic-bezier(0.4, 0, 1, 1)',    // 退出动画
    out:     'cubic-bezier(0, 0, 0.2, 1)',    // 进入动画
  },
} as const;

// ═══════════════════════════════════════════
// 11. 层级（对齐 Ant Design z-index 规范）
// ═══════════════════════════════════════════

export const zIndex = {
  base:     0,
  navbar:   30,    // 顶部导航（低于所有浮层）
  sticky:   100,   // 吸顶元素（GlobalAlert）
  popover:  1030,  // Popover、气泡卡片
  drawer:   1000,  // 侧边抽屉
  modal:    1000,  // 弹窗
  dropdown: 1050,  // 下拉菜单（高于 modal/drawer）
  toast:    1010,  // message 提示
  tooltip:  1070,  // Tooltip（最高）
} as const;

// ═══════════════════════════════════════════
// 12. Ant Design 主题映射
// ═══════════════════════════════════════════

export const antdTheme = {
  token: {
    // ===== 品牌色 =====
    colorPrimary:             brand[600],
    colorPrimaryHover:        brand[700],
    colorPrimaryActive:       brand[700],
    colorPrimaryBg:           brand[50],
    colorPrimaryBgHover:      brand[100],
    colorPrimaryBorder:       brand[200],
    colorPrimaryBorderHover:  brand[300],

    // ===== 状态色（统一引用 colorTokens）=====
    colorSuccess:   colorTokens.statusSuccess,
    colorSuccessBg: colorTokens.statusSuccessLight,
    colorWarning:   colorTokens.statusWarning,
    colorWarningBg: '#FFF7E6',
    colorError:     colorTokens.statusError,
    colorErrorBg:   '#FEF2F2',
    colorInfo:      colorTokens.brandPrimary,
    colorInfoBg:    colorTokens.surfaceBrandLight,

    // ===== 文本色 =====
    colorText:         neutral[900],
    colorTextSecondary: neutral[600],
    colorTextTertiary:  neutral[400],
    colorTextDisabled:  neutral[300],

    // ===== 边框色 =====
    colorBorder:          neutral[200],
    colorBorderSecondary: neutral[100],

    // ===== 背景色 =====
    colorBgContainer: neutral[0],
    colorBgLayout:    neutral[50],
    colorBgElevated:  neutral[0],

    // ===== 圆角 =====
    borderRadius:   parseInt(radius.base),
    borderRadiusLG: parseInt(radius.lg),
    borderRadiusSM: parseInt(radius.sm),

    // ===== 字体 =====
    fontFamily:         fontFamily.base,
    fontSize:           parseInt(fontSize.base.size),
    fontSizeHeading1:   parseInt(fontSize['2xl'].size),
    fontSizeHeading2:   parseInt(fontSize.xl.size),
    fontSizeHeading3:   parseInt(fontSize.lg.size),
    fontSizeHeading4:   parseInt(fontSize.md.size),
    fontSizeHeading5:   parseInt(fontSize.base.size),

    // ===== 控件高度 =====
    controlHeight:   controlHeight.md,
    controlHeightLG: controlHeight.lg,
    controlHeightSM: controlHeight.sm,
  },
  components: {
    Button: {
      colorPrimary:       brand[600],
      colorPrimaryHover:  brand[700],
      colorPrimaryActive: brand[700],
      primaryShadow: 'none',
      dangerShadow:  'none',
      defaultShadow: 'none',
    },
    Switch: {
      colorPrimary:      brand[600],
      colorPrimaryHover: brand[700],
    },
    Radio: {
      colorPrimary: brand[600],
    },
    Checkbox: {
      colorPrimary:      brand[600],
      colorPrimaryHover: brand[700],
    },
    Input: {
      controlHeight:     controlHeight.md,
      colorPrimaryHover: brand[600],
      colorPrimary:      brand[600],
    },
    Select: {
      controlHeight:     controlHeight.md,
      colorPrimary:      brand[600],
      colorPrimaryHover: brand[600],
    },
    DatePicker: {
      controlHeight:     controlHeight.md,
      colorPrimary:      brand[600],
      colorPrimaryHover: brand[700],
    },
    Form: {
      labelColor:    neutral[700],
      labelFontSize: parseInt(fontSize.base.size),
    },
    Table: {
      colorPrimary: brand[600],
      headerBg:     neutral[50],
    },
    Tabs: {
      colorPrimary:      brand[600],
      colorPrimaryHover: brand[700],
      inkBarColor:       brand[600],
      itemHoverColor:    neutral[700],
      itemSelectedColor: brand[600],
    },
    Message: {
      colorInfo: brand[600],
    },
    Notification: {
      colorInfo: brand[600],
    },
    Tag: {
      colorPrimary: brand[600],
    },
  },
} as const;
