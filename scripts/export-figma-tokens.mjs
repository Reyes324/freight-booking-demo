/**
 * 企业国际版 → Figma Variables 导入脚本
 * 用法：node scripts/export-figma-tokens.mjs <FILE_KEY>
 *
 * 将 design-tokens.ts 的所有 token 写入 Figma Variables，
 * 生成 3 个 Collection：颜色 / 字体数值 / 间距与形状
 */

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.argv[2];

if (!FILE_KEY) {
  console.error('用法：node scripts/export-figma-tokens.mjs <FILE_KEY>');
  process.exit(1);
}

// ─── 工具函数 ────────────────────────────────────────────────

/** hex → Figma RGBA float */
function hex(h) {
  const c = h.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return { r: +r.toFixed(4), g: +g.toFixed(4), b: +b.toFixed(4), a: 1 };
}

/** px 字符串 → number */
function px(v) { return parseInt(v); }

// ─── Token 数据（与 design-tokens.ts 保持一致）─────────────

const brand = {
  50: '#EEF2FB', 100: '#DAE3F7', 200: '#B5C7EF', 300: '#8AA7E5',
  400: '#5C84DC', 500: '#3468D8', 600: '#2257D4', 700: '#1C47AC',
  800: '#163884', 900: '#112A5E', 950: '#0B1B3D',
};

const neutral = {
  0: '#FFFFFF', 50: '#F9FAFB', 100: '#F3F4F6', 200: '#E5E7EB',
  300: '#D1D5DB', 400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563',
  700: '#374151', 800: '#1F2937', 900: '#111827', 950: '#030712',
};

const semantic = {
  info:     { base: '#1677FF', light: '#E5EDFF' },
  success:  { base: '#00A178', light: '#DFF3EC' },
  warning:  { base: '#FAAD14', light: '#FFF7E6' },
  error:    { base: '#EF4444', light: '#FEF2F2' },
  disabled: { base: '#8990A3', light: '#F0F3F7' },
};

const fontSize = {
  xs:   { size: '11px', lineHeight: '16px' },
  sm:   { size: '12px', lineHeight: '18px' },
  base: { size: '14px', lineHeight: '22px' },
  md:   { size: '16px', lineHeight: '24px' },
  lg:   { size: '20px', lineHeight: '28px' },
  xl:   { size: '24px', lineHeight: '32px' },
  '2xl':{ size: '28px', lineHeight: '36px' },
};

const fontWeight = { normal: 400, medium: 500, semibold: 600, bold: 700 };

const spacing = {
  '0': '0px', '1': '4px', '1-5': '6px', '2': '8px', '2-5': '10px', '3': '12px',
  '3-5': '14px', '4': '16px', '5': '20px', '6': '24px', '8': '32px', '10': '40px', '12': '48px',
};

const radius = {
  sm: '4px', md: '6px', base: '8px', lg: '12px', xl: '16px', pill: '9999px',
};

const controlHeight = { sm: 32, md: 44, lg: 54 };

// ─── 构建 API Payload ─────────────────────────────────────────

let varIdCounter = 1;
const makeId = (prefix) => `${prefix}-${varIdCounter++}`;

// Collection & Mode IDs
const COL_COLOR   = 'col-color';
const COL_FONT    = 'col-font';
const COL_SPACING = 'col-spacing';
const MODE_COLOR   = 'mode-color';
const MODE_FONT    = 'mode-font';
const MODE_SPACING = 'mode-spacing';

const variableCollections = [
  { action: 'CREATE', id: COL_COLOR,   name: '颜色',    initialModeId: MODE_COLOR   },
  { action: 'CREATE', id: COL_FONT,    name: '字体数值',  initialModeId: MODE_FONT    },
  { action: 'CREATE', id: COL_SPACING, name: '间距与形状', initialModeId: MODE_SPACING },
];

const variableModes = [
  { action: 'CREATE', id: MODE_COLOR,   name: '默认', variableCollectionId: COL_COLOR   },
  { action: 'CREATE', id: MODE_FONT,    name: '默认', variableCollectionId: COL_FONT    },
  { action: 'CREATE', id: MODE_SPACING, name: '默认', variableCollectionId: COL_SPACING },
];

const variables = [];
const variableModeValues = [];

function addColor(name, hexVal, collectionId, modeId) {
  const id = makeId('v');
  variables.push({ action: 'CREATE', id, name, variableCollectionId: collectionId, resolvedType: 'COLOR' });
  variableModeValues.push({ variableId: id, modeId, value: hex(hexVal) });
}

function addNumber(name, num, collectionId, modeId) {
  const id = makeId('v');
  variables.push({ action: 'CREATE', id, name, variableCollectionId: collectionId, resolvedType: 'FLOAT' });
  variableModeValues.push({ variableId: id, modeId, value: num });
}

// ── 颜色 Collection ──
for (const [step, hexVal] of Object.entries(brand)) {
  addColor(`brand/${step}`, hexVal, COL_COLOR, MODE_COLOR);
}
for (const [step, hexVal] of Object.entries(neutral)) {
  addColor(`neutral/${step}`, hexVal, COL_COLOR, MODE_COLOR);
}
for (const [name, vals] of Object.entries(semantic)) {
  addColor(`语义/${name}/base`,  vals.base,  COL_COLOR, MODE_COLOR);
  addColor(`语义/${name}/light`, vals.light, COL_COLOR, MODE_COLOR);
}

// ── 字体数值 Collection ──
for (const [level, vals] of Object.entries(fontSize)) {
  addNumber(`fontSize/${level}/size`,       px(vals.size),       COL_FONT, MODE_FONT);
  addNumber(`fontSize/${level}/lineHeight`, px(vals.lineHeight), COL_FONT, MODE_FONT);
}
for (const [name, val] of Object.entries(fontWeight)) {
  addNumber(`fontWeight/${name}`, val, COL_FONT, MODE_FONT);
}

// ── 间距与形状 Collection ──
for (const [step, val] of Object.entries(spacing)) {
  addNumber(`spacing/${step}`, px(val), COL_SPACING, MODE_SPACING);
}
for (const [name, val] of Object.entries(radius)) {
  if (val === '9999px') {
    addNumber(`radius/${name}`, 9999, COL_SPACING, MODE_SPACING);
  } else {
    addNumber(`radius/${name}`, px(val), COL_SPACING, MODE_SPACING);
  }
}
for (const [name, val] of Object.entries(controlHeight)) {
  addNumber(`controlHeight/${name}`, val, COL_SPACING, MODE_SPACING);
}

// ─── 调用 Figma API ───────────────────────────────────────────

const payload = { variableCollections, variableModes, variables, variableModeValues };

console.log(`\n📦 准备写入 Figma 文件：${FILE_KEY}`);
console.log(`   Collections: ${variableCollections.length}`);
console.log(`   Variables:   ${variables.length}`);
console.log(`   Values:      ${variableModeValues.length}\n`);

const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables`, {
  method: 'POST',
  headers: {
    'X-Figma-Token': FIGMA_TOKEN,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

const json = await res.json();

if (!res.ok) {
  console.error('❌ Figma API 错误：', JSON.stringify(json, null, 2));
  process.exit(1);
}

console.log('✅ Variables 写入成功！');
console.log(`   ${variables.length} 个变量已导入 Figma`);
console.log(`\n🔗 打开文件查看：https://www.figma.com/file/${FILE_KEY}`);
