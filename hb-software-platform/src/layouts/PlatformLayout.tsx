import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Space, Dropdown, Badge, Avatar, Typography } from 'antd'
import {
  HomeOutlined,
  ShopOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  FileTextOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  FileProtectOutlined,
  MessageOutlined,
  SafetyOutlined,
  MailOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import type { MenuProps } from 'antd'
import { ThemeToggle } from '../components/ThemeToggle'

const { Header, Sider, Content } = Layout
const { Text } = Typography

type MenuItem = Required<MenuProps>['items'][number]

const menuItems: MenuItem[] = [
  {
    key: '/platform',
    icon: <HomeOutlined />,
    label: <Link to="/platform">工作台</Link>,
  },
  {
    key: 'audit',
    icon: <SafetyCertificateOutlined />,
    label: '审核管理',
    children: [
      {
        key: '/platform/audit/enterprise',
        label: <Link to="/platform/audit/enterprise">企业审核</Link>,
      },
      {
        key: '/platform/audit/software',
        label: <Link to="/platform/audit/software">软件审核</Link>,
      },
      {
        key: '/platform/audit/subsidy',
        label: <Link to="/platform/audit/subsidy">补贴券审核</Link>,
      },
    ],
  },
  {
    key: '/platform/demands',
    icon: <SafetyOutlined />,
    label: <Link to="/platform/demands">需求汇总</Link>,
  },
  {
    key: 'statistics',
    icon: <BarChartOutlined />,
    label: <Link to="/platform/statistics">报表中心</Link>,
  },
  {
    key: 'policy',
    icon: <FileTextOutlined />,
    label: <Link to="/platform/policy">政策管理</Link>,
  },
  {
    key: '/platform/messages',
    icon: <MessageOutlined />,
    label: <Link to="/platform/messages">留言管理</Link>,
  },
  {
    key: 'message',
    icon: <MailOutlined />,
    label: '消息管理',
    children: [
      {
        key: '/platform/message-template',
        label: <Link to="/platform/message-template">消息模板</Link>,
      },
      {
        key: '/platform/message-send',
        label: <Link to="/platform/message-send">消息发送</Link>,
      },
      {
        key: '/platform/message-record',
        label: <Link to="/platform/message-record">发送记录</Link>,
      },
    ],
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      {
        key: '/platform/users',
        label: <Link to="/platform/users">用户管理</Link>,
      },
      {
        key: '/platform/dict',
        label: <Link to="/platform/dict">数据字典</Link>,
      },
      {
        key: '/platform/role',
        label: <Link to="/platform/role">角色管理</Link>,
      },
      {
        key: '/platform/logs/operation',
        label: <Link to="/platform/logs/operation">操作日志</Link>,
      },
      {
        key: '/platform/logs/login',
        label: <Link to="/platform/logs/login">登录日志</Link>,
      },
    ],
  },
]

const userMenuItems: MenuProps['items'] = [
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
]

export default function PlatformLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      navigate('/login')
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        style={{
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.08)',
          zIndex: 100,
          background: '#fff',
        }}
      >
        <div
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid #f1f5f9',
            background: '#fff',
          }}
        >
          <Link to="/platform" style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                flexShrink: 0,
              }}
            >
              <SettingOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            {!collapsed && (
              <div style={{ marginLeft: 12 }}>
                <Text strong style={{ fontSize: 16, color: '#1e293b', display: 'block' }}>
                  平台管理
                </Text>
                <Text style={{ fontSize: 11, color: '#94a3b8' }}>Admin Portal</Text>
              </div>
            )}
          </Link>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['audit', 'system']}
          items={menuItems}
          style={{
            border: 'none',
            padding: '12px 8px',
            background: 'transparent',
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: 'var(--bg-header)',
            backdropFilter: 'blur(10px)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
            height: 72,
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 16,
              width: 40,
              height: 40,
              borderRadius: 10,
              transition: 'all 0.3s ease',
              color: 'var(--text-primary)',
            }}
          />

          <Space size="large">
            <ThemeToggle size="middle" />
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              title="返回门户首页"
              onClick={() => navigate('/')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <HomeOutlined style={{ fontSize: 18, color: 'var(--text-tertiary)' }} />
            </div>
            <Badge count={12} size="small" offset={[-2, 2]} color="#ef4444">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => navigate('/platform/messages')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <BellOutlined style={{ fontSize: 18, color: 'var(--text-tertiary)' }} />
              </div>
            </Badge>
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleMenuClick }}
              placement="bottomRight"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  padding: '4px 4px 4px 4px',
                  borderRadius: 24,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card-hover)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  e.currentTarget.style.borderColor = 'var(--border-medium)'
                  e.currentTarget.style.transform = 'translateY(-0.5px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                  e.currentTarget.style.borderColor = 'var(--border-light)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* 头像 - 双环设计 */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-xs)',
                    position: 'relative',
                  }}
                >
                  {/* 内环 */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--bg-quaternary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UserOutlined style={{ fontSize: 14, color: 'var(--text-tertiary)' }} />
                  </div>
                  {/* 在线状态指示 */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#34c759',
                      border: '2px solid var(--bg-card)',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  />
                </div>

                {/* 用户信息 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <span
                    style={{
                      fontWeight: 590,
                      color: 'var(--text-primary)',
                      fontSize: 12.5,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.2,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
                    }}
                  >
                    平台管理员
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: 'var(--text-quaternary)',
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                      lineHeight: 1.2,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
                    }}
                  >
                    超级管理员
                  </span>
                </div>

                {/* 分隔线 */}
                <div
                  style={{
                    width: 1,
                    height: 16,
                    background: 'var(--border-light)',
                    margin: '0 2px',
                  }}
                />

                {/* 下拉箭头 */}
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  style={{
                    opacity: 0.5,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <path
                    d="M1.5 1.5L5 4.5L8.5 1.5"
                    stroke="var(--text-tertiary)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: 24, background: 'transparent' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
