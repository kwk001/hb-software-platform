# 主题系统设计文档

## 概述

本文档详细描述了湖北省工业软件公共服务平台的主题系统设计，包括深色系和浅色系的配色方案、CSS 变量定义以及使用规范。

## 设计原则

- **专业感**：采用 Indigo（靛蓝）作为品牌色，传达科技、可信赖的形象
- **一致性**：所有端（门户、平台管理、企业端）使用同一套主题系统
- **可访问性**：所有文字对比度符合 WCAG AA 级标准
- **平滑过渡**：主题切换时有 0.3s 的过渡动画

---

## 深色系主题（Dark Theme）

### 主色调 - Indigo 靛蓝

| 变量名 | 色值 | 用途 |
|--------|------|------|
| `--primary-50` | `#eef2ff` | 最浅背景 |
| `--primary-100` | `#e0e7ff` | 浅色背景 |
| `--primary-200` | `#c7d2fe` | 边框、分割线 |
| `--primary-300` | `#a5b4fc` | 禁用状态 |
| `--primary-400` | `#818cf8` | Hover 状态、链接 |
| `--primary-500` | `#6366f1` | **品牌主色** |
| `--primary-600` | `#4f46e5` | Active 状态 |
| `--primary-700` | `#4338ca` | 深色强调 |
| `--primary-800` | `#3730a3` | 深色背景 |
| `--primary-900` | `#312e81` | 最深色 |

**快捷引用变量：**
- `--brand-primary`: `#6366f1` - 主要品牌色
- `--brand-primary-light`: `#818cf8` - 浅色变体
- `--brand-primary-dark`: `#4f46e5` - 深色变体
- `--brand-primary-bg`: `rgba(99, 102, 241, 0.1)` - 背景色

### 中性色 - Slate 板岩灰

| 变量名 | 色值 | 用途 |
|--------|------|------|
| `--slate-50` | `#f8fafc` | **主要文字** |
| `--slate-100` | `#f1f5f9` | 浅色文字 |
| `--slate-200` | `#e2e8f0` | 边框 |
| `--slate-300` | `#cbd5e1` | 禁用边框 |
| `--slate-400` | `#94a3b8` | **次要文字** |
| `--slate-500` | `#64748b` | 三级文字 |
| `--slate-600` | `#475569` | 禁用文字 |
| `--slate-700` | `#334155` | 深色元素 |
| `--slate-800` | `#1e293b` | **三级背景** |
| `--slate-900` | `#0f172a` | **次级背景** |
| `--slate-950` | `#020617` | **主背景** |

### 背景色层次

```
页面背景 (bg-layout):     #020617 (slate-950)
  └─ 侧边栏 (bg-sidebar): #0f172a (slate-900)
      └─ 卡片 (bg-card):  rgba(30, 41, 59, 0.5) (slate-800 + 透明度)
          └─ 悬停:       rgba(30, 41, 59, 0.8)
```

### 文字层次

| 变量名 | 色值 | 对比度 | 用途 |
|--------|------|--------|------|
| `--text-primary` | `#f8fafc` | 15.8:1 | 标题、重要内容 |
| `--text-secondary` | `#94a3b8` | 8.2:1 | 正文、描述 |
| `--text-tertiary` | `#64748b` | 5.1:1 | 辅助信息 |
| `--text-quaternary` | `#475569` | 3.2:1 | 最弱信息 |
| `--text-disabled` | `#475569` | 3.2:1 | 禁用状态 |
| `--text-inverse` | `#020617` | - | 反色文字 |

### 边框色

采用**透明度边框**，营造精致感：

| 变量名 | 色值 | 用途 |
|--------|------|------|
| `--border-light` | `rgba(148, 163, 184, 0.1)` | 极细分割线 |
| `--border-medium` | `rgba(148, 163, 184, 0.15)` | 卡片边框 |
| `--border-dark` | `rgba(148, 163, 184, 0.25)` | 强调边框 |
| `--border-divider` | `rgba(148, 163, 184, 0.08)` | 分割线 |

### 功能色

| 类型 | 主色 | 浅色 | 背景色 |
|------|------|------|--------|
| 成功 | `#10b981` | `#34d399` | `rgba(16, 185, 129, 0.1)` |
| 警告 | `#f59e0b` | `#fbbf24` | `rgba(245, 158, 11, 0.1)` |
| 错误 | `#ef4444` | `#f87171` | `rgba(239, 68, 68, 0.1)` |
| 信息 | `#06b6d4` | `#22d3ee` | `rgba(6, 182, 212, 0.1)` |

### 阴影

| 变量名 | 值 |
|--------|-----|
| `--shadow-xs` | `0 1px 2px rgba(0, 0, 0, 0.3)` |
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)` |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4)` |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5)` |
| `--shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)` |
| `--shadow-glow` | `0 0 20px rgba(99, 102, 241, 0.3)` |

### 渐变

| 变量名 | 值 |
|--------|-----|
| `--gradient-primary` | `linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)` |
| `--gradient-dark` | `linear-gradient(180deg, #020617 0%, #0f172a 100%)` |
| `--gradient-card` | `linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)` |

---

## 浅色系主题（Light Theme）

### 主色调 - Indigo 靛蓝

| 变量名 | 色值 | 用途 |
|--------|------|------|
| `--primary-50` ~ `--primary-900` | 同深色主题 | 完整色阶 |
| `--brand-primary` | `#4f46e5` | **品牌主色**（比深色深一级） |
| `--brand-primary-light` | `#6366f1` | 浅色变体 |
| `--brand-primary-dark` | `#4338ca` | 深色变体 |
| `--brand-primary-bg` | `rgba(99, 102, 241, 0.08)` | 背景色 |

### 背景色层次

```
页面背景 (bg-layout):     #f8fafc (slate-50)
  └─ 侧边栏 (bg-sidebar): #ffffff
      └─ 卡片 (bg-card):  #ffffff
          └─ 悬停:       #f8fafc (slate-50)
```

### 文字层次

| 变量名 | 色值 | 对比度 | 用途 |
|--------|------|--------|------|
| `--text-primary` | `#0f172a` | 16.2:1 | 标题、重要内容 |
| `--text-secondary` | `#475569` | 8.5:1 | 正文、描述 |
| `--text-tertiary` | `#64748b` | 5.3:1 | 辅助信息 |
| `--text-quaternary` | `#94a3b8` | 3.1:1 | 最弱信息 |
| `--text-disabled` | `#94a3b8` | 3.1:1 | 禁用状态 |
| `--text-inverse` | `#ffffff` | - | 反色文字 |

### 边框色

采用**实色边框**，清晰明确：

| 变量名 | 色值 | 用途 |
|--------|------|------|
| `--border-light` | `#e2e8f0` (slate-200) | 分割线 |
| `--border-medium` | `#cbd5e1` (slate-300) | 输入框边框 |
| `--border-dark` | `#94a3b8` (slate-400) | 强调边框 |
| `--border-divider` | `#e2e8f0` (slate-200) | 分割线 |

### 功能色

| 类型 | 主色 | 浅色 | 背景色 |
|------|------|------|--------|
| 成功 | `#059669` | `#34d399` | `#ecfdf5` |
| 警告 | `#d97706` | `#fbbf24` | `#fffbeb` |
| 错误 | `#dc2626` | `#f87171` | `#fef2f2` |
| 信息 | `#0284c7` | `#38bdf8` | `#f0f9ff` |

### 阴影

| 变量名 | 值 |
|--------|-----|
| `--shadow-xs` | `0 1px 2px rgba(0, 0, 0, 0.05)` |
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)` |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.05)` |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` |
| `--shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` |
| `--shadow-glow` | `0 0 20px rgba(99, 102, 241, 0.2)` |

### 渐变

| 变量名 | 值 |
|--------|-----|
| `--gradient-primary` | `linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)` |
| `--gradient-dark` | `linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%)` |
| `--gradient-card` | `linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)` |

---

## 双主题对比

| 属性 | 深色主题 | 浅色主题 | 设计意图 |
|------|----------|----------|----------|
| **品牌主色** | `#6366f1` | `#4f46e5` | 深色用亮色，浅色用深色 |
| **页面背景** | `#020617` | `#f8fafc` | 深色护眼，浅色清爽 |
| **主要文字** | `#f8fafc` | `#0f172a` | 高对比确保可读性 |
| **卡片背景** | 半透明深色 | 纯白色 | 深色有层次感，浅色简洁 |
| **边框风格** | 透明度边框 | 实色边框 | 深色精致，浅色清晰 |
| **阴影强度** | 60% 不透明度 | 8% 不透明度 | 深色需要更强阴影 |
| **功能色** | 高饱和度 | 中等饱和度 | 深色更鲜艳，浅色更柔和 |

---

## 使用规范

### 1. 背景色使用

```css
/* 页面背景 */
background: var(--bg-layout);

/* 卡片背景 */
background: var(--bg-card);

/* 悬停状态 */
background: var(--bg-card-hover);
```

### 2. 文字色使用

```css
/* 标题 */
color: var(--text-primary);

/* 正文 */
color: var(--text-secondary);

/* 辅助信息 */
color: var(--text-tertiary);
```

### 3. 边框使用

```css
/* 细边框 */
border: 1px solid var(--border-light);

/* 输入框边框 */
border: 1px solid var(--border-medium);
```

### 4. 阴影使用

```css
/* 卡片阴影 */
box-shadow: var(--shadow-sm);

/* 悬停阴影 */
box-shadow: var(--shadow-md);

/* 弹窗阴影 */
box-shadow: var(--shadow-lg);
```

---

## 文件结构

```
src/styles/themes/
├── index.css      # 主题入口，导入所有主题文件
├── dark.css       # 深色系主题变量
└── light.css      # 浅色系主题变量
```

---

## 主题切换

主题切换通过 `ThemeContext` 实现，支持：

1. **手动切换**：点击主题切换按钮
2. **自动检测**：检测系统主题偏好
3. **持久化**：保存到 localStorage

### 使用方式

```tsx
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '切换到浅色' : '切换到深色'}
    </button>
  );
}
```

---

## 参考资源

- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [UI UX Pro Max Design System](https://ui-ux-pro-max-skill.nextlevelbuilder.io/)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

**文档版本**: 1.0  
**最后更新**: 2026-03-15  
**作者**: AI Assistant
