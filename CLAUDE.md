# 企业国际版 — 项目规范

## 设计系统真相源

颜色、字号、圆角、阴影等 Token 全部在 `src/styles/design-tokens.ts`。
修改或引用设计值时，先读这个文件，不要自己编。

品牌色速查：
- 主蓝：`#2257D4`（blue-600）
- Hover：`#1C47AC`（blue-700）
- 文字一级：`#0F1229`（gray-900）
- 文字二级：`#454C66`（gray-700）
- 文字辅助：`#8990A3`（gray-400）

## Figma 标准 Helper（每次写 use_figma 必须用这个，不要自己重写）

```javascript
// ── 加载字体（每个脚本开头必须调用）──
async function loadFonts() {
  await figma.loadFontAsync({ family: "PingFang SC", style: "Regular" });
  await figma.loadFontAsync({ family: "PingFang SC", style: "Medium" });
  await figma.loadFontAsync({ family: "PingFang SC", style: "Semibold" });
}

// ── makeFrame ──
// 规则：w/h 都必须 > 0，AUTO sizing 用 primaryAxisSizingMode/counterAxisSizingMode 覆盖
// 不要传 h=0（resize 会静默失败，frame 停在 100px）
function makeFrame(name, w, h, opts = {}) {
  const f = figma.createFrame();
  f.name = name;
  f.fills = opts.fills !== undefined ? opts.fills : [];
  if (opts.cornerRadius !== undefined) f.cornerRadius = opts.cornerRadius;
  f.layoutMode = opts.lm || 'VERTICAL';
  f.primaryAxisAlignItems = opts.primary || 'MIN';
  // counterAxisAlignItems 只接受 'MIN'|'MAX'|'CENTER'|'BASELINE'，不接受 'STRETCH'
  f.counterAxisAlignItems = opts.counter || 'MIN';
  f.itemSpacing = opts.gap || 0;
  f.paddingTop    = opts.pt ?? opts.p ?? 0;
  f.paddingBottom = opts.pb ?? opts.p ?? 0;
  f.paddingLeft   = opts.pl ?? opts.p ?? 0;
  f.paddingRight  = opts.pr ?? opts.p ?? 0;
  f.resize(w, h); // 先 resize，再设 sizing mode
  f.primaryAxisSizingMode   = opts.primarySizing   || 'FIXED';
  f.counterAxisSizingMode   = opts.counterSizing   || 'FIXED';
  if (opts.stroke) {
    f.strokes = [{ type: 'SOLID', color: opts.stroke }];
    f.strokeWeight = opts.strokeW || 1;
    f.strokeAlign = 'INSIDE';
  }
  if (opts.effects) f.effects = opts.effects;
  return f;
}

// ── makeText ──
function makeText(chars, size, style, color, name) {
  const t = figma.createText();
  t.fontName = { family: "PingFang SC", style };
  t.fontSize = size;
  t.characters = chars;
  t.fills = [{ type: 'SOLID', color }];
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  if (name) t.name = name;
  return t;
}

// ── makeSolid：带 opacity 的纯色 fill（不能用 fills[0].opacity = x，是 read-only）──
function makeSolid(color, opacity = 1) {
  return { type: 'SOLID', color, opacity };
}

// ── reorderSections：建完所有节点后统一调用，不能边建边算 y ──
// 原因：AUTO sizing 的 frame 在执行期 .height 返回初始值，不是真实高度
function reorderSections(page, nameOrder, x = 80, startY = 80, gap = 80) {
  let y = startY;
  for (const name of nameOrder) {
    const node = page.children.find(n => n.name === name);
    if (!node) continue;
    node.x = x;
    node.y = y;
    y += Math.round(node.height) + gap;
  }
}

// ── KV 行标准结构（flex justify-between 等效）──
// 用 MIN + layoutGrow=1，不用 SPACE_BETWEEN（行为不可预测）
function makeKVRow(name, labelText, valueText, w, C) {
  const row = makeFrame(name, w, 20, { lm: 'HORIZONTAL', primary: 'MIN', counter: 'CENTER', primarySizing: 'FIXED', counterSizing: 'AUTO' });
  const label = makeText(labelText, 14, 'Regular', C.gray400, 'label');
  label.layoutGrow = 0;
  const value = makeText(valueText, 14, 'Regular', C.gray900, 'value');
  value.layoutGrow = 1;
  value.textAlignHorizontal = 'RIGHT';
  row.appendChild(label);
  row.appendChild(value);
  return row;
}
```

### 使用约定

- 每个 `use_figma` 调用开头：复制上面 helper，`await loadFonts()`
- 所有 frame 必须先 `resize(w, h)`（w/h 均 > 0），再设 sizing mode
- 需要高度自动的 Section：`resize(1280, 200)` 然后 `primaryAxisSizingMode = 'AUTO'`
- 最后单独调用 `reorderSections()` 排布所有 Section

---

## Figma 操作规范

**每次操作 Figma 前必须遵守，违反会导致反复返工。**

### 1. 禁止绝对定位
所有 frame 必须用 auto layout，禁止 `layoutMode: NONE`。

KV 行标准结构：
```
容器（VERTICAL, itemSpacing=8）
  └─ 行（HORIZONTAL, primary=MIN）
       ├─ label（layoutGrow=0, textAlign=LEFT）
       └─ value（layoutGrow=1, textAlign=RIGHT）
```
用 `MIN + layoutGrow=1 + textAlignHorizontal=RIGHT`，不要用 `SPACE_BETWEEN`。

### 2. Frame resize 必须 w 和 h 都大于 0

`f.resize(w, h)` 在 h=0 时不执行，frame 停在默认 100px 宽。
需要高度 AUTO 的 frame，先 `resize(1280, 100)` 再设 `primaryAxisSizingMode = 'AUTO'`，不能传 h=0。

### 3. Section 排列必须统一重排
禁止边建 Section 边用 `lastSection.y + lastSection.height` 计算位置。
AUTO sizing 的 frame 在执行期间 `.height` 返回的是初始值，不是真实高度。

**正确做法**：建完所有节点后，单独运行一次重排：
```javascript
const order = ['Section / A', 'Section / B', 'Section / C'];
let y = 80;
for (const name of order) {
  const node = page.children.find(n => n.name === name);
  node.x = 80;
  node.y = y;
  y += Math.round(node.height) + 80;
}
```

### 3. 画组件前必须先读源码
不靠想象，读对应 `.tsx` 文件提取：布局（flex/justify）、颜色（Tailwind class）、尺寸（h-/w-/px-）、真实数据（mockData）。
读完后把核查摘要告诉用户确认，再开始画。

## 两套状态颜色体系，不能混用

| 位置 | 组件 | 颜色逻辑 |
|---|---|---|
| `admin/orders/page.tsx` 表格 | Ant Design `<Tag color={hex}>` | 配送中/前往装货地 = `#2257D4`蓝；已完成 = `default`灰；已取消 = `#F23041`红 |
| `components/OrderDrawer.tsx` | 自定义 `OrderStatusTag` | 有独立的颜色 token，见 `design-tokens.ts` |

画 Figma 时必须先确认当前场景用的是哪套，不能互相套用。

## 代码修改规范

- 修改术语/文案后，询问"需要检查其他页面吗"，不主动全局搜索
- 颜色不一致不自动标记为问题，询问用户是否需要纳入系统
- 账期金额统一显示 CNY，订单金额显示当地货币 + CNY 换算
