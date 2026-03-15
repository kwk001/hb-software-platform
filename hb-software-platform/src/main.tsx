import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import './styles/themes/index.css'

// Ant Design 主题配置 - 与 CSS 变量保持一致
const antdTheme = {
  token: {
    // 品牌色 - Indigo
    colorPrimary: '#6366f1',
    colorPrimaryHover: '#818cf8',
    colorPrimaryActive: '#4f46e5',

    // 功能色
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#06b6d4',

    // 圆角
    borderRadius: 8,
    borderRadiusSM: 4,
    borderRadiusLG: 12,
    borderRadiusXL: 16,

    // 字体
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,

    // 间距
    paddingXS: 4,
    paddingSM: 8,
    padding: 16,
    paddingMD: 16,
    paddingLG: 24,
    paddingXL: 32,

    // 控制组件高度
    controlHeight: 36,
    controlHeightSM: 28,
    controlHeightLG: 44,
  },
  components: {
    Button: {
      borderRadius: 8,
      paddingInline: 24,
      paddingBlock: 8,
    },
    Card: {
      borderRadius: 12,
      paddingLG: 24,
    },
    Input: {
      borderRadius: 8,
      paddingInline: 12,
      paddingBlock: 8,
    },
    Table: {
      borderRadius: 12,
    },
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 8,
    },
    Tag: {
      borderRadius: 6,
    },
    Badge: {
      borderRadius: 10,
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={antdTheme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>,
)
