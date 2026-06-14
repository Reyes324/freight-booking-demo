# 企业国际版 — 设计系统 Roadmap

## 目标

1. **找全组件**：建立每个组件与产品场景的完整对应关系
2. **定义使用规则**：让设计师和开发看到说明就知道怎么用

交付物：`/style-guide` 页面 = 这个产品的组件使用说明书，组件完整、场景对应、规则清晰。

---

## 当前进展

> 更新日期：2026-04-29

- ✅ `/style-guide` 基础框架搭建（卡片布局、侧边导航）
- ✅ `colorTokens` 语义层建立（design-tokens.ts，18 色，含 brandAccent + surfaceDisabled）
- ✅ Phase 3 Token 体系全量完成（见下方详情）
- ✅ Phase 1 用户侧组件盘点完成（4 页面，组件清单已建立）
- ✅ Phase 2 命名规范完成（已正式文档化）
- 🟡 Phase 4 组件文档进行中（基础层展示完成，规则待补全）

---

## Phase 1 — 组件盘点

**目标**：扫描产品所有页面，建立「组件 ↔ 场景」对应表

> 行业最佳实践：先做全量审计（audit），再建规范，避免规范脱离实际。

**✅ 完成标准**：打开 style-guide 任意一个组件 Section，能在下方清单里找到它对应的分类、出现页面和场景描述。清单里每一行都有明确的「出现页面」，没有空白。

每个组件需要明确：
- 出现在哪些页面/场景
- 每个场景下的变体或状态差异
- 场景之间规则是否一致

**已盘点的页面（用户侧）：**
- [x] 用户侧 /（下单页）
- [x] 用户侧 /orders（历史订单）
- [x] 用户侧 /wallet（账户余额）
- [x] /login（登录页）

---

### 用户侧组件清单

> 分类依据：Ant Design 组件分类规范（General / Navigation / Data Entry / Data Display / Feedback）

#### 通用（General）

| 组件 | 出现页面 | 变体/状态 | 备注 |
|---|---|---|---|
| 按钮（Button） | 全部页面 | Primary（下单确认、登录提交）/ Default（次要操作）/ Danger（Modal/Popconfirm 确认）/ Loading（提交中） | Ant Design Button，底部操作栏内的按钮属于底部操作栏 Pattern，不在此列 |

#### 导航（Navigation）

| 组件 | 出现页面 | 变体/状态 | 备注 |
|---|---|---|---|
| 顶部导航栏（Navbar） | 下单页、历史订单、账户余额 | 固定顶部，含 Tab 切换/用户信息/语言切换/退出 | 登录页不用，有独立语言切换 |
| 二级页面顶部导航 | 下单确认步骤、订单详情抽屉 | 返回按钮 + 页面标题，固定在区域顶部 | 自定义，非 Ant Design PageHeader |

#### 数据录入（Data Entry）

| 组件 | 出现页面 | 变体/状态 | 备注 |
|---|---|---|---|
| 地址输入框（RouteSection） | 下单页 | 起点/终点两个，支持地图选点 | 专属组件，非通用 Input |
| 搜索框（Input） | 历史订单 | 单行，带前缀图标，可清除 | Ant Design Input |
| 联系电话输入（OrderContactPhone） | 下单确认页 | 含区号选择 + 电话号码，有错误状态 | — |
| 司机备注输入（DriverNoteInput） | 下单确认页 | 多行文本，可选填 | — |
| 密码输入框 | 登录页 | 含显示/隐藏切换，有错误状态 | 登录专属，非 Ant Design |
| 手机号 + 区码选择（登录） | 登录页 | 区码下拉 + 电话输入，有错误状态 | 与 OrderContactPhone 逻辑类似但独立实现，⚠️ 建议统一 |
| 车型选择器（VehicleSelector） | 下单页 | 卡片式单选，含车型图、名称、载重 | — |
| 附加服务选择（AdditionalServices） | 下单页 | checkbox 单选 + 分组单选两种形态 | 条件显示（选了车型才出现） |
| 支付方式选择器（PaymentMethodSelector） | 下单确认页 | 月账期单选（当前只有一种） | — |
| 日期时间选择器（DateTimePicker） | 下单确认页 | 可选，不选则立即出发 | — |
| 日期范围选择器（RangePicker） | 账户余额 | 双日期区间选择 | Ant Design RangePicker |
| 语言切换下拉（登录） | 登录页 | 悬浮下拉，含国旗 + 语言名 | 登录页专属 |

#### 数据展示（Data Display）

| 组件 | 出现页面 | 变体/状态 | 备注 |
|---|---|---|---|
| 表格（Table） | 历史订单、账户余额 | 历史订单带行点击展开抽屉；账户余额带空状态 Empty | Ant Design Table |
| 分页（Pagination） | 历史订单、账户余额 | 嵌在 Table 内，显示总条数 | — |
| 订单状态标签（OrderStatusTag） | 历史订单 | 多状态：配送中/已完成/已取消等，各有颜色 | 自定义组件，有独立颜色体系 |
| 气泡卡片（Popover） | 下单页底部栏、下单确认底部栏 | 价格明细展开，hover 触发 | Ant Design Popover |
| 地址详情气泡（AddressDetailsPopover） | 下单页地址输入 | 填写详细地址，点击触发 | 自定义，基于 Popover |
| 账期余额卡片 | 账户余额 | 大字金额 + 额度上限，含汇率说明小字 | 自定义，非 Ant Design Card |
| 订单摘要卡片（OrderSummary） | 下单确认页 | 含起终点、车型、总价 | — |
| 空状态（Empty） | 账户余额（无交易记录时） | 图示 + 说明文字 | Ant Design Empty |

#### 反馈（Feedback）

| 组件 | 出现页面 | 变体/状态 | 备注 |
|---|---|---|---|
| 确认弹窗（Modal.confirm） | 历史订单（取消订单） | 危险操作确认，含 danger 按钮 | Ant Design Modal |
| 气泡确认（Popconfirm） | 导航栏退出登录 | 危险操作确认，锚定在触发元素上，含 danger 按钮 | Ant Design Popconfirm，与 Modal.confirm 意图相同但形态不同 |
| 操作结果提示（message） | 历史订单（取消成功/失败） | success / error 两种，顶部短暂出现 | Ant Design message，即 Toast |
| 全局错误提示条（GlobalAlert） | 下单页（配置步骤、确认步骤） | 吸顶悬浮，error 类型，可关闭 | 自定义，非 Ant Design Alert |
| 订单详情抽屉（OrderDrawer） | 历史订单 | 右侧滑入，含子流程视图切换 | Ant Design Drawer |
| 子流程弹窗（OrderDrawer 内） | 历史订单（抽屉内操作） | PickupProofModal / ContactOperatorModal / ChangeDriverModal / AddressDetailsModal | 各自独立 Modal |

#### 骨架 & 加载（Feedback — Loading）

| 组件 | 出现页面 | 变体/状态 | 备注 |
|---|---|---|---|
| 价格栏骨架屏（PricingFooterSkeleton） | 下单页（价格计算中） | 占位动画，替代 PricingFooter | 自定义 Skeleton |

#### 底部操作栏（自定义，无 Ant Design 对应）

| 组件 | 出现页面 | 变体/状态 | 备注 |
|---|---|---|---|
| 价格栏 + 下一步（PricingFooter） | 下单页（选完地址+车型后出现） | 正常态 | 固定在左侧面板底部 |
| 确认提交底部栏（ConfirmationFooter） | 下单确认页 | 含总价 + 「确认下单」按钮，提交中状态 | ⚠️ 与 PricingFooter 结构相近，建议统一 |

---

### ⚠️ 待决策问题（Phase 4 开始前需解决）

1. **区码+手机号输入**：登录页和下单确认页各实现了一套——建议统一为一个组件
2. **底部操作栏**：PricingFooter 和 ConfirmationFooter 结构相近——建议抽象为通用 BottomActionBar
3. **表格空状态**：历史订单无数据时的 Empty 状态需补充（账户余额已有）

---

## Phase 2 — 命名规范（Naming Convention）

**目标**：确定 token、组件、文档的统一命名格式，让任何人写代码或查文档都用同一套词汇

> 行业最佳实践：命名规范要在大量实现之前确立，否则后期重命名成本极高。

**✅ 完成标准**：新写一个组件或 token 时，不需要问"这个怎么命名"——查本文档就有明确答案。现有代码里的命名与规范一致，无例外。

---

### 正式规范

#### Token 命名
- 格式：**camelCase**（已在 colorTokens 中实现，全面沿用）
- 语义前缀：`brand*`（品牌色）、`ink*`（文本图标）、`surface*`（背景边框）、`status*`（状态色）
- 示例：`brandPrimary`、`inkT10`、`surfaceDivider`、`statusError`
- Tailwind 扩展：**不做**，colorTokens 已满足"改一处全局生效"的需求

#### 组件命名
- 组件名：**PascalCase 英文**（`OrderStatusTag`、`PricingFooter`）
- 文件名：**PascalCase 英文**（`OrderStatusTag.tsx`）—— 与组件名保持一致
- Figma 组件名：**与代码组件名保持一致**（方便 Phase 5 同步，不维护中英文对照表）

#### 语言规范
- **代码、组件名、Figma 组件名**：英文（技术要求，无例外）
- **style-guide 文档、Section 标题、使用规则说明**：中文（阅读场景，面向设计师和开发）
- **代码注释**：英文

#### 不适用范围
- 页面内展示的文案（按钮文字、标签名等）：跟随产品语言设置，不属于命名规范

---

## Phase 3 — Token 基础对齐 ✅ 完成

**目标**：design-tokens.ts 完整覆盖所有设计决策所需 token，三层结构清晰

> 行业最佳实践：三层 token 结构 —— Primitive（色阶）→ Semantic（语义）→ Component（组件专属）

**完成内容：**
- [x] 三层结构：`brand/neutral 色阶` → `colorTokens 18色` → `statusColors 组件层`
- [x] 删除旧 `semantic` 层（与 colorTokens 并存歧义），统一为 colorTokens
- [x] 加入 Brand/Accent `#FF6600`（brandAccent）+ `surfaceDisabled`
- [x] statusColors 全量引用 colorTokens，无硬编码 hex
- [x] antdTheme 状态色引用 colorTokens（colorSuccess/Warning/Error/Info）
- [x] 新增 `letterSpacing` · `iconSize` · `motion` · `zIndex` 四类 token
- [x] `spacing` 改为三分类：inset（组件内 padding）/ stack（元素间 gap）/ layout（页面级）
- [x] zIndex 对齐 Ant Design 官方值：tooltip=1070, dropdown=1050, toast=1010, popover=1030
- [x] style-guide 间距 Section 更新为三分类展示 + zIndex/motion/iconSize 可视化
- [x] 用色审计移入 Drawer 浮层（不平铺在主页面）

**待后续处理：**
- [ ] text-gray-* 统一迁移到 Ink token（admin/* 多处，低优先级，逐步迁移）

---

## Phase 4 — 组件文档（/style-guide 主体）

**目标**：按 Phase 1 清单逐个补全每个 Section

> 行业最佳实践：style-guide 分两个层级。**Foundations（基础层）** 记录字体/间距/颜色等设计决策；**Components（组件层）** 记录有交互行为的 UI 单元。两者平级但性质不同，不要混在一起。

**✅ 完成标准**：Phase 1 清单里每一个组件都有对应的 Section；每个 Section 包含真实渲染、场景列表、使用规则、token 引用四项，缺一不可。设计师或开发拿到 style-guide 不需要问任何问题就能知道怎么用。

每个 Section 包含：
- 组件/样式真实渲染（所有变体/状态）
- 出现的场景列表（对应 Phase 1 盘点结果）
- 使用规则（什么时候用、什么时候不该用）
- 使用了哪些 token

---

**Foundations 基础层（设计决策，无交互行为）**
- 🟡 颜色系统（展示完成，用色审计 Drawer 待做）
- 🟡 字体排版（展示有，使用规则未写）
- 🟡 间距 & 圆角 & 阴影（展示有，规则未写）
- 🔲 图标系统（待补充：列出产品内所有实际使用的图标，标注来源和使用场景）

**Components 组件层（有交互行为的 UI 单元，按 Phase 1 清单）**

*导航*
- 🟡 顶部导航栏（展示有，规则未写）

*数据录入*
- 🟡 表单输入框（展示有，规则未写）
- 🔲 地址输入框（待补充）
- 🔲 日期时间选择器（待补充）
- 🔲 附加服务选择（待补充）

*数据展示*
- 🟡 表格（展示有，规则未写）
- 🟡 状态标签（展示有，两套体系说明待完善）
- 🔲 气泡卡片 Popover（待补充）
- 🔲 空状态 Empty（待补充）
- 🔲 分页 Pagination（待补充）

*反馈*
- 🟡 Modal 确认框（展示有，规则未写）
- 🔲 Drawer 侧边抽屉（待补充）
- 🔲 Toast 消息（待补充）
- 🔲 骨架屏 Skeleton（待补充）

*底部操作栏*
- 🔲 底部操作栏（待补充，先解决 Phase 1 待决策问题 ②）

---

## Phase 5 — Figma 组件库同步

**目标**：代码组件文档稳定后，Figma 建对应 Component 与代码保持一致

> 行业最佳实践：代码是真相源，Figma 是同步产物，不反向。

**✅ 完成标准**：Figma 里每个 Component 都能在代码里找到对应文件；颜色全部绑定 Variables，不存在手动填色的 frame；设计师改 token 后 Figma 页面颜色自动更新。

- [ ] 将现有 Figma frame 转为 Component
- [ ] 按 colorTokens 绑定 Figma Variables
- [ ] 建立 Code Connect 映射（可选，后期）

---

## 工作原则

> ⭐ **最高原则 — 最佳实践优先**：遇到任何设计决策，优先查阅行业成熟方案（Ant Design 规范、Material Design、主流 SaaS 产品）而不是自己推导。MVP 要解决的问题别人都经历过，直接套用成熟经验，不重复发明轮子。

- **代码优先**：design-tokens.ts 是唯一真相源，Figma 对照代码同步
- **命名先于实现**：新增 token 或组件，先确定名称符合命名规范再写代码
- **改项目文件前必须确认**：任何 src/ 修改，列出具体内容等用户确认后再执行
- **每次开始先对照此文档**：确认当前阶段和优先级，避免陷入细节
