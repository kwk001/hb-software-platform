import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Space, Dropdown, Badge, Avatar, Typography, theme } from 'antd'
import {
  HomeOutlined,
  ShopOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import type { MenuProps } from 'antd'
import { ThemeToggle } from '../components/ThemeToggle'

const { Header, Sider, Content } = Layout
const { Text } = Typography

type MenuItem = Required<MenuProps>['items'][number]

// 获取企业类型 from localStorage
const getEnterpriseType = (): string => {
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser)
      return user.enterpriseType || 'demand'
    } catch {
      return 'demand'
    }
  }
  return 'demand'
}

// 获取入驻状态 from localStorage
const getApplyStatus = (): string => {
  const currentUser = localStorage.getItem('currentUser')
  console.log('getApplyStatus - currentUser:', currentUser)
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser)
      const username = user.username
      console.log('getApplyStatus - username:', username)
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
      console.log('getApplyStatus - registeredUsers:', registeredUsers)
      const applyStatus = registeredUsers[username]?.applyStatus || ''
      console.log('getApplyStatus - applyStatus:', applyStatus)
      return applyStatus
    } catch (error) {
      console.error('getApplyStatus - error:', error)
      return ''
    }
  }
  return ''
}

// 根据企业类型和入驻状态生成菜单
const getMenuItems = (enterpriseType: string, applyStatus: string): MenuItem[] => {
  const isApproved = applyStatus === 'approved'
  
  const baseItems: MenuItem[] = [
    {
      key: '/enterprise',
      icon: <HomeOutlined />,
      label: <Link to="/enterprise">工作台</Link>,
    },
  ]

  // 根据入驻状态显示不同菜单
  if (isApproved) {
    // 已入驻：显示企业信息
    baseItems.push({
      key: 'enterprise',
      icon: <ShopOutlined />,
      label: '企业入驻',
      children: [
        {
          key: '/enterprise/info',
          label: <Link to="/enterprise/info">企业信息</Link>,
        },
      ],
    })
  } else {
    // 未入驻：显示入驻申请
    baseItems.push({
      key: 'enterprise',
      icon: <ShopOutlined />,
      label: '企业入驻',
      children: [
        {
          key: '/enterprise/apply',
          label: <Link to="/enterprise/apply">入驻申请</Link>,
        },
      ],
    })
  }

  // 只有工业软件企业(supply)才显示软件产品菜单
  if (enterpriseType === 'supply') {
    baseItems.push({
      key: 'software',
      icon: <AppstoreOutlined />,
      label: '软件产品',
      children: [
        {
          key: '/enterprise/software/publish',
          label: <Link to="/enterprise/software/publish">发布软件</Link>,
        },
        {
          key: '/enterprise/software/list',
          label: <Link to="/enterprise/software/list">我的软件</Link>,
        },
      ],
    })
  }

  // 工业制造企业(demand)显示需求对接菜单
  if (enterpriseType === 'demand') {
    baseItems.push({
      key: 'demand',
      icon: <FileTextOutlined />,
      label: '需求对接',
      children: [
        {
          key: '/enterprise/demands',
          label: <Link to="/enterprise/demands">我的需求</Link>,
        },
      ],
    })
  }

  // 只有工业制造企业(demand)才显示补贴券申报菜单
  if (enterpriseType === 'demand') {
    baseItems.push({
      key: 'subsidy',
      icon: <SafetyCertificateOutlined />,
      label: '补贴券',
      children: [
        {
          key: '/enterprise/subsidy/apply',
          label: <Link to="/enterprise/subsidy/apply">申报补贴</Link>,
        },
        {
          key: '/enterprise/subsidy/list',
          label: <Link to="/enterprise/subsidy/list">我的补贴</Link>,
        },
      ],
    })
  }

  // 只有工业制造企业(demand)才显示留言管理菜单
  if (enterpriseType === 'demand') {
    baseItems.push({
      key: '/enterprise/messages',
      icon: <MessageOutlined />,
      label: <Link to="/enterprise/messages">留言咨询</Link>,
    })
  }

  // 消息中心（所有企业都显示）
  baseItems.push({
    key: '/enterprise/message-center',
    icon: <BellOutlined />,
    label: <Link to="/enterprise/message-center">消息中心</Link>,
  })

  // 通知设置（所有企业都显示）
  baseItems.push({
    key: '/enterprise/notification-settings',
    icon: <SettingOutlined />,
    label: <Link to="/enterprise/notification-settings">通知设置</Link>,
  })

  return baseItems
}

const userMenuItems: MenuProps['items'] = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: '个人中心',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: '企业信息',
  },
  {
    type: 'divider',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [enterpriseType, setEnterpriseType] = useState<string>('demand')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  // 获取企业类型并生成菜单
  useEffect(() => {
    const type = getEnterpriseType()
    const status = getApplyStatus()
    setEnterpriseType(type)
    setMenuItems(getMenuItems(type, status))
  }, [])

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
        theme="light"
        width={260}
        style={{
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
          zIndex: 100,
          background: 'var(--bg-primary)',
        }}
      >
        <div
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 20px',
            borderBottom: '1px solid var(--border-light)',
            background: 'var(--bg-secondary)',
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(30, 64, 175, 0.3)',
                flexShrink: 0,
              }}
            >
              <ShopOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            {!collapsed && (
              <div style={{ marginLeft: 12 }}>
                <Text strong style={{ fontSize: 16, color: 'var(--text-primary)', display: 'block' }}>
                  企业中心
                </Text>
                <Text style={{ fontSize: 11, color: 'var(--text-quaternary)' }}>Enterprise Portal</Text>
              </div>
            )}
          </Link>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={enterpriseType === 'supply'
            ? ['enterprise', 'software', 'subsidy']
            : ['enterprise', 'demand', 'subsidy']}
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
            <Badge count={5} size="small" offset={[-2, 2]}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => navigate('/enterprise/message-center')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-quaternary)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)'
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
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 250, 252, 0.9) 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: `
                    0 0 0 1px rgba(255, 255, 255, 0.5) inset,
                    0 1px 2px rgba(0, 0, 0, 0.04),
                    0 2px 4px rgba(0, 0, 0, 0.02)
                  `,
                  transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(252, 252, 254, 1) 100%)'
                  e.currentTarget.style.boxShadow = `
                    0 0 0 1px rgba(255, 255, 255, 0.8) inset,
                    0 1px 2px rgba(0, 0, 0, 0.02),
                    0 4px 8px rgba(0, 0, 0, 0.04),
                    0 8px 16px rgba(0, 0, 0, 0.04)
                  `
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)'
                  e.currentTarget.style.transform = 'translateY(-0.5px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 250, 252, 0.9) 100%)'
                  e.currentTarget.style.boxShadow = `
                    0 0 0 1px rgba(255, 255, 255, 0.5) inset,
                    0 1px 2px rgba(0, 0, 0, 0.04),
                    0 2px 4px rgba(0, 0, 0, 0.02)
                  `
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* 头像 - 双环设计 */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `
                      0 0 0 1px rgba(0, 0, 0, 0.04),
                      inset 0 1px 0 rgba(255, 255, 255, 0.8),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.02)
                    `,
                    position: 'relative',
                  }}
                >
                  {/* 内环 */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f5f5f7 0%, #ebebed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <UserOutlined style={{ fontSize: 14, color: '#86868b' }} />
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
                      border: '2px solid #fff',
                      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.04)',
                    }}
                  />
                </div>

                {/* 用户信息 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <span
                    style={{
                      fontWeight: 590,
                      color: '#1d1d1f',
                      fontSize: 12.5,
                      letterSpacing: '-0.01em',
                      lineHeight: 1.2,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
                    }}
                  >
                    企业用户
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: '#86868b',
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                      lineHeight: 1.2,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
                    }}
                  >
                    {enterpriseType === 'supply' ? '工业软件企业' : '工业制造企业'}
                  </span>
                </div>

                {/* 分隔线 */}
                <div
                  style={{
                    width: 1,
                    height: 16,
                    background: 'rgba(0, 0, 0, 0.06)',
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
                    opacity: 0.35,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <path
                    d="M1.5 1.5L5 4.5L8.5 1.5"
                    stroke="#1d1d1f"
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
