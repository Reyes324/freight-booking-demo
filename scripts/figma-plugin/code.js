// 企业国际版 · 设计 Token 导入插件
// 与 design-tokens.ts 保持同步

figma.showUI(__html__, { width: 320, height: 360 });

// ─── 工具函数 ─────────────────────────────────────────────────

function hex(h) {
  const c = h.replace('#', '');
  return {
    r: parseInt(c.slice(0, 2), 16) / 255,
    g: parseInt(c.slice(2, 4), 16) / 255,
    b: parseInt(c.slice(4, 6), 16) / 255,
    a: 1,
  };
}

function log(text) {
  figma.ui.postMessage({ type: 'LOG', text });
}

// ─── Token 数据（与 design-tokens.ts 保持一致）────────────────

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
  'info/base':      '#1677FF', 'info/light':     '#E5EDFF',
  'success/base':   '#00A178', 'success/light':  '#DFF3EC',
  'warning/base':   '#FAAD14', 'warning/light':  '#FFF7E6',
  'error/base':     '#EF4444', 'error/light':    '#FEF2F2',
  'disabled/base':  '#8990A3', 'disabled/light': '#F0F3F7',
};

const fontSizeTokens = {
  'xs/size': 11,  'xs/lineHeight': 16,
  'sm/size': 12,  'sm/lineHeight': 18,
  'base/size': 14, 'base/lineHeight': 22,
  'md/size': 16,  'md/lineHeight': 24,
  'lg/size': 20,  'lg/lineHeight': 28,
  'xl/size': 24,  'xl/lineHeight': 32,
  '2xl/size': 28, '2xl/lineHeight': 36,
};

const fontWeightTokens = {
  normal: 400, medium: 500, semibold: 600, bold: 700,
};

const spacingTokens = {
  '0':   0,  '1':   4,  '1-5': 6,  '2':   8,  '2-5': 10, '3':  12,
  '3-5': 14, '4':  16,  '5':  20,  '6':  24,  '8':   32, '10': 40, '12': 48,
};

const radiusTokens = {
  sm: 4, md: 6, base: 8, lg: 12, xl: 16, pill: 9999,
};

const controlHeightTokens = { sm: 32, md: 44, lg: 54 };

// ─── 主逻辑 ──────────────────────────────────────────────────

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'RUN') return;

  try {
    // ── Collection 1：颜色 ──────────────────────────────────────
    log('📁 创建 Collection：颜色');
    const colColor = figma.variables.createVariableCollection('颜色');
    colColor.renameMode(colColor.defaultModeId, '默认');
    const modeColor = colColor.defaultModeId;
    let count = 0;

    for (const [step, hexVal] of Object.entries(brand)) {
      const v = figma.variables.createVariable(`brand/${step}`, colColor, 'COLOR');
      v.setValueForMode(modeColor, hex(hexVal));
      count++;
    }
    log(`   brand: ${Object.keys(brand).length} 个`);

    for (const [step, hexVal] of Object.entries(neutral)) {
      const v = figma.variables.createVariable(`neutral/${step}`, colColor, 'COLOR');
      v.setValueForMode(modeColor, hex(hexVal));
      count++;
    }
    log(`   neutral: ${Object.keys(neutral).length} 个`);

    for (const [name, hexVal] of Object.entries(semantic)) {
      const v = figma.variables.createVariable(`语义/${name}`, colColor, 'COLOR');
      v.setValueForMode(modeColor, hex(hexVal));
      count++;
    }
    log(`   语义色: ${Object.keys(semantic).length} 个`);
    log(`✅ 颜色 Collection 完成：${count} 个变量`);

    // ── Collection 2：字体数值 ─────────────────────────────────
    log('');
    log('📁 创建 Collection：字体数值');
    const colFont = figma.variables.createVariableCollection('字体数值');
    colFont.renameMode(colFont.defaultModeId, '默认');
    const modeFont = colFont.defaultModeId;
    count = 0;

    for (const [name, val] of Object.entries(fontSizeTokens)) {
      const v = figma.variables.createVariable(`fontSize/${name}`, colFont, 'FLOAT');
      v.setValueForMode(modeFont, val);
      count++;
    }
    for (const [name, val] of Object.entries(fontWeightTokens)) {
      const v = figma.variables.createVariable(`fontWeight/${name}`, colFont, 'FLOAT');
      v.setValueForMode(modeFont, val);
      count++;
    }
    log(`✅ 字体数值 Collection 完成：${count} 个变量`);

    // ── Collection 3：间距与形状 ───────────────────────────────
    log('');
    log('📁 创建 Collection：间距与形状');
    const colSpacing = figma.variables.createVariableCollection('间距与形状');
    colSpacing.renameMode(colSpacing.defaultModeId, '默认');
    const modeSpacing = colSpacing.defaultModeId;
    count = 0;

    for (const [step, val] of Object.entries(spacingTokens)) {
      const v = figma.variables.createVariable(`spacing/${step}`, colSpacing, 'FLOAT');
      v.setValueForMode(modeSpacing, val);
      count++;
    }
    for (const [name, val] of Object.entries(radiusTokens)) {
      const v = figma.variables.createVariable(`radius/${name}`, colSpacing, 'FLOAT');
      v.setValueForMode(modeSpacing, val);
      count++;
    }
    for (const [name, val] of Object.entries(controlHeightTokens)) {
      const v = figma.variables.createVariable(`controlHeight/${name}`, colSpacing, 'FLOAT');
      v.setValueForMode(modeSpacing, val);
      count++;
    }
    log(`✅ 间距与形状 Collection 完成：${count} 个变量`);

    log('');
    log('🎉 全部完成！共导入 73 个 Variables');
    log('   打开 Variables 面板（右侧 ⬡ 图标）查看');

    figma.ui.postMessage({ type: 'DONE' });

  } catch (e) {
    log('❌ 错误：' + e.message);
    figma.ui.postMessage({ type: 'ERROR' });
  }
};
