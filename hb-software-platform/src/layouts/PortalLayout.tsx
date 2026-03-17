import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Badge, Avatar, Dropdown } from 'antd'
import {
  DesktopOutlined,
  UserOutlined,
  DownOutlined,
  BellOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '../components/ThemeToggle'

const { Content } = Layout

// 专业级导航栏样式 - 使用 CSS 变量支持主题切换
const navStyles = `
  /* 导航栏容器 */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 72px;
    background: var(--bg-header);
    backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--border-light);
    z-index: 1000;
  }
  
  .navbar-container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 40px;
  }
  
  /* Logo - 靠左对齐 */
  .navbar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }
  
  .navbar-logo-icon {
    width: 36px;
    height: 36px;
    background: var(--gradient-primary);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  
  /* Logo图标光晕动效 */
  .navbar-logo-icon::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: logoShimmer 2.5s infinite;
    pointer-events: none;
  }
  
  @keyframes logoShimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 200%;
    }
  }
  
  .navbar-logo-text {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  
  .navbar-logo-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.4;
  }
  
  .navbar-logo-subtitle {
    font-size: 11px;
    font-weight: 400;
    color: var(--text-tertiary);
    letter-spacing: 0.02em;
  }
  
  /* 导航菜单 - 居中 */
  .navbar-nav {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .navbar-nav .ant-menu {
    background: transparent;
    border: none;
    display: flex;
    gap: 4px;
  }
  
  .navbar-nav .ant-menu-item {
    height: 40px;
    line-height: 40px;
    padding: 0 20px !important;
    margin: 0 !important;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 450;
    color: var(--text-secondary) !important;
    background: transparent !important;
    border: none !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  /* 导航项悬停微动效 - 下划线从中心展开 */
  .navbar-nav .ant-menu-item::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--gradient-primary);
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(-50%);
  }
  
  .navbar-nav .ant-menu-item:hover {
    color: var(--text-primary) !important;
    background: var(--menu-hover) !important;
    transform: translateY(-1px);
  }
  
  .navbar-nav .ant-menu-item:hover::after {
    width: 60%;
  }
  
  .navbar-nav .ant-menu-item-selected {
    color: var(--text-primary) !important;
    font-weight: 500;
    background: var(--menu-active) !important;
  }
  
  .navbar-nav .ant-menu-item-selected::after {
    width: 60%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  /* 右侧操作区 - 靠右对齐 */
  .navbar-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }
  
  .navbar-btn-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .navbar-btn-icon:hover {
    background: var(--menu-hover);
    color: var(--text-primary);
  }
  
  .navbar-btn-text {
    height: 36px;
    padding: 0 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 450;
    color: var(--text-primary);
    background: transparent;
    border: 1px solid var(--border-medium);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .navbar-btn-text:hover {
    background: var(--menu-hover);
    border-color: var(--border-dark);
  }
  
  .navbar-btn-primary {
    height: 36px;
    padding: 0 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    background: var(--brand-primary);
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .navbar-btn-primary:hover {
    background: var(--brand-primary-dark);
  }
  
  /* 用户卡片 */
  .navbar-user {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px 4px 4px;
    border-radius: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .navbar-user:hover {
    background: var(--bg-card-hover);
  }
  
  .navbar-user .ant-avatar {
    width: 28px;
    height: 28px;
    background: var(--gradient-primary) !important;
  }
  
  /* 内容区域 */
  .main-content {
    padding-top: 72px !important;
    min-height: 100vh;
  }
`

const menuItems: MenuProps['items'] = [
  { key: '/', label: <Link to="/">首页</Link> },
  { key: '/software', label: <Link to="/software">软件中心</Link> },
  { key: '/policy', label: <Link to="/policy">政策活动中心</Link> },
  { key: '/demand', label: <Link to="/demand">需求广场</Link> },
]

const userMenuItems: MenuProps['items'] = [
  { key: 'profile', label: '个人中心' },
  { key: 'settings', label: '账号设置' },
  { key: 'logout', label: '退出登录' },
]

export default function PortalLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    setIsLoggedIn(!!currentUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <style>{navStyles}</style>
      
      {/* 导航栏 */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <DesktopOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <div className="navbar-logo-text">
              <span className="navbar-logo-title">湖北省工业软件公共服务平台</span>
              <span className="navbar-logo-subtitle">HUBEI INDUSTRIAL SOFTWARE</span>
            </div>
          </Link>

          {/* 导航菜单 */}
          <div className="navbar-nav">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              overflowedIndicator={null}
            />
          </div>

          {/* 右侧操作区 */}
          <div className="navbar-actions">
            <button className="navbar-btn-icon">
              <ThemeToggle size="small" />
            </button>
            
            {isLoggedIn ? (
              <>
                <Badge count={5} size="small">
                  <button className="navbar-btn-icon">
                    <BellOutlined style={{ fontSize: 16 }} />
                  </button>
                </Badge>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <div className="navbar-user">
                    <Avatar icon={<UserOutlined />} size="small" />
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>企业用户</span>
                    <DownOutlined style={{ fontSize: 10, color: 'var(--text-tertiary)' }} />
                  </div>
                </Dropdown>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="navbar-btn-text">登录</button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button className="navbar-btn-primary">注册入驻</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 内容区域 */}
      <Content className="main-content">
        <Outlet />
      </Content>
    </Layout>
  )
}
