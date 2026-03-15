import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  List,
  Progress,
  Tooltip,
} from 'antd'
import {
  AppstoreOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowRightOutlined,
  BellOutlined,
  EyeOutlined,
  DownloadOutlined,
  StarOutlined,
  RocketOutlined,
  BarChartOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import type { CSSProperties } from 'react'

// 设计系统 - 现代极简奢华风格
const designSystem = {
  colors: {
    // 主色调 - 深邃海军蓝
    primary: '#1e3a5f',
    primaryLight: '#2d5a8a',
    primaryDark: '#0f1f33',
    // 强调色 - 琥珀金
    accent: '#d4a574',
    accentLight: '#e8c9a0',
    // 中性色
    background: '#fafbfc',
    surface: '#ffffff',
    surfaceElevated: '#f8f9fa',
    border: '#e8eaed',
    borderLight: '#f0f1f3',
    // 文字色
    textPrimary: '#1a1a2e',
    textSecondary: '#4a4a5a',
    textTertiary: '#8a8a9a',
    // 功能色
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#6366f1',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.04)',
    md: '0 4px 12px rgba(0,0,0,0.06)',
    lg: '0 8px 24px rgba(0,0,0,0.08)',
    xl: '0 12px 40px rgba(0,0,0,0.12)',
    elevated: '0 20px 60px rgba(0,0,0,0.15)',
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
}

// 获取企业类型
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

const { Title, Text, Paragraph } = Typography

// 动画数字组件
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    if (!isVisible) return

    const duration = 1500
    const steps = 40
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return <span>{displayValue.toLocaleString()}{suffix}</span>
}

const styles: Record<string, CSSProperties> = {
  // 欢迎区域 - 蓝色渐变背景
  welcomeCard: {
    borderRadius: designSystem.borderRadius.xxl,
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `${designSystem.shadows.xl}, inset 0 1px 0 rgba(255,255,255,0.1)`,
  },
}

// 根据企业类型获取统计数据 - 使用设计系统颜色
const getStatsData = (enterpriseType: string) => {
  // 工业软件企业(supply)显示软件相关统计
  if (enterpriseType === 'supply') {
    return [
      {
        title: '我的软件',
        value: 3,
        icon: <AppstoreOutlined />,
        color: designSystem.colors.info,
        bgColor: `${designSystem.colors.info}10`,
        link: '/enterprise/software/list',
        trend: '+1',
      },
      {
        title: '软件曝光',
        value: 1256,
        suffix: '次',
        icon: <EyeOutlined />,
        color: designSystem.colors.primaryLight,
        bgColor: `${designSystem.colors.primaryLight}10`,
        link: '/enterprise/software/list',
        trend: '+23%',
      },
    ]
  }

  // 工业制造企业(demand)不显示软件相关统计
  return [
    {
      title: '我的需求',
      value: 2,
      icon: <FileTextOutlined />,
      color: designSystem.colors.success,
      bgColor: `${designSystem.colors.success}10`,
      link: '/enterprise/demands',
      trend: '0',
    },
    {
      title: '补贴券',
      value: 1,
      icon: <SafetyCertificateOutlined />,
      color: designSystem.colors.warning,
      bgColor: `${designSystem.colors.warning}10`,
      link: '/enterprise/subsidy/list',
      trend: '50万',
    },
    {
      title: '留言咨询',
      value: 3,
      icon: <BellOutlined />,
      color: designSystem.colors.primaryLight,
      bgColor: `${designSystem.colors.primaryLight}10`,
      link: '/enterprise/messages',
      trend: '+1',
    },
  ]
}

const notices = [
  { id: 1, title: '2026年补贴券申报即将截止', type: 'urgent', time: '2小时前', icon: <ExclamationCircleOutlined /> },
  { id: 2, title: '您的软件产品审核已通过', type: 'success', time: '1天前', icon: <CheckCircleOutlined /> },
  { id: 3, title: '平台功能更新通知', type: 'info', time: '3天前', icon: <BellOutlined /> },
]

// 根据企业类型获取待办事项
const getTodoList = (enterpriseType: string) => {
  const baseTodos = [
    { id: 1, title: '完善企业信息', status: 'pending', priority: 'high', progress: 60 },
    { id: 3, title: '查看补贴券使用说明', status: 'done', priority: 'low', progress: 100 },
  ]

  // 工业软件企业显示软件相关待办
  if (enterpriseType === 'supply') {
    return [
      ...baseTodos,
      { id: 2, title: '上传软件产品资料', status: 'pending', priority: 'medium', progress: 30 },
    ]
  }

  // 工业制造企业显示需求相关待办
  return [
    ...baseTodos,
    { id: 2, title: '发布数字化转型需求', status: 'pending', priority: 'medium', progress: 30 },
  ]
}

// 根据企业类型获取快捷操作 - 使用设计系统颜色
const getQuickActions = (enterpriseType: string) => {
  // 工业软件企业(supply)
  if (enterpriseType === 'supply') {
    return [
      { title: '发布软件产品', desc: '展示您的工业软件', icon: <RocketOutlined />, link: '/enterprise/software/publish', color: designSystem.colors.info, bgColor: `${designSystem.colors.info}10` },
      { title: '查看政策', desc: '了解最新补贴政策', icon: <RocketOutlined />, link: '/policy', color: designSystem.colors.info, bgColor: `${designSystem.colors.info}10` },
    ]
  }

  // 工业制造企业(demand)
  return [
    { title: '发布需求', desc: '发布数字化转型需求', icon: <FileTextOutlined />, link: '/enterprise/demands', color: designSystem.colors.success, bgColor: `${designSystem.colors.success}10` },
    { title: '申报补贴券', desc: '申请软件采购补贴', icon: <SafetyCertificateOutlined />, link: '/enterprise/subsidy/apply', color: designSystem.colors.warning, bgColor: `${designSystem.colors.warning}10` },
    { title: '留言咨询', desc: '咨询平台相关问题', icon: <BellOutlined />, link: '/enterprise/messages', color: designSystem.colors.primaryLight, bgColor: `${designSystem.colors.primaryLight}10` },
    { title: '查看政策', desc: '了解最新补贴政策', icon: <RocketOutlined />, link: '/policy', color: designSystem.colors.info, bgColor: `${designSystem.colors.info}10` },
  ]
}

// 根据企业类型获取最近活动 - 使用设计系统颜色
const getRecentActivities = (enterpriseType: string) => {
  const baseActivities = [
    {
      id: 2,
      title: '需求发布',
      content: '企业数字化转型需求',
      description: '已上传需求文档，等待平台匹配',
      time: '09:15',
      date: '3月8日',
      type: 'demand',
      icon: <FileTextOutlined />,
      color: designSystem.colors.info,
      bgColor: `${designSystem.colors.info}10`,
      borderColor: `${designSystem.colors.info}30`,
    },
    {
      id: 3,
      title: '补贴申报成功',
      content: '金额50万元',
      description: '补贴券申报已通过审核，资金即将到账',
      time: '16:45',
      date: '3月5日',
      type: 'subsidy',
      icon: <SafetyCertificateOutlined />,
      color: designSystem.colors.warning,
      bgColor: `${designSystem.colors.warning}10`,
      borderColor: `${designSystem.colors.warning}30`,
    },
    {
      id: 4,
      title: '入驻审核通过',
      content: '湖北智造科技有限公司',
      description: '企业资质审核已通过，正式入驻平台',
      time: '10:00',
      date: '3月1日',
      type: 'verify',
      icon: <CheckCircleOutlined />,
      color: designSystem.colors.success,
      bgColor: `${designSystem.colors.success}10`,
      borderColor: `${designSystem.colors.success}30`,
    },
  ]

  // 工业软件企业显示软件发布活动
  if (enterpriseType === 'supply') {
    return [
      {
        id: 1,
        title: '软件发布申请',
        content: '智能制造MES系统',
        description: '已提交软件发布申请，等待平台审核',
        time: '14:30',
        date: '3月10日',
        type: 'publish',
        icon: <RocketOutlined />,
        color: designSystem.colors.primaryLight,
        bgColor: `${designSystem.colors.primaryLight}10`,
        borderColor: `${designSystem.colors.primaryLight}30`,
      },
      ...baseActivities,
    ]
  }

  return baseActivities
}

const mySoftware = [
  { id: 1, name: '智能制造MES系统', status: 'published', views: 234, downloads: 12, rating: 4.8 },
  { id: 2, name: '企业资源ERP系统', status: 'published', views: 567, downloads: 28, rating: 4.6 },
  { id: 3, name: '产品生命周期PLM', status: 'reviewing', views: 0, downloads: 0, rating: 0 },
]

export default function EnterpriseDashboard() {
  const [enterpriseType, setEnterpriseType] = useState<string>('demand')

  // 获取企业类型
  useEffect(() => {
    const type = getEnterpriseType()
    setEnterpriseType(type)
  }, [])

  const statsData = getStatsData(enterpriseType)
  const todoList = getTodoList(enterpriseType)
  const quickActions = getQuickActions(enterpriseType)
  const recentActivities = getRecentActivities(enterpriseType)

  const isSupply = enterpriseType === 'supply'

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return designSystem.colors.error
      case 'medium': return designSystem.colors.warning
      case 'low': return designSystem.colors.success
      default: return designSystem.colors.textTertiary
    }
  }

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span style={{
            padding: '4px 10px',
            background: `${designSystem.colors.success}10`,
            color: designSystem.colors.success,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
          }}>已发布</span>
        )
      case 'reviewing':
        return (
          <span style={{
            padding: '4px 10px',
            background: `${designSystem.colors.info}10`,
            color: designSystem.colors.info,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
          }}>审核中</span>
        )
      case 'rejected':
        return (
          <span style={{
            padding: '4px 10px',
            background: `${designSystem.colors.error}10`,
            color: designSystem.colors.error,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
          }}>已驳回</span>
        )
      default:
        return (
          <span style={{
            padding: '4px 10px',
            background: `${designSystem.colors.textTertiary}10`,
            color: designSystem.colors.textSecondary,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
          }}>草稿</span>
        )
    }
  }

  return (
    <div>
      {/* 欢迎区域 - 极简奢华风格 */}
      <Card style={{ ...styles.welcomeCard, marginBottom: 32 }} bodyStyle={{ padding: '32px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Row gutter={[24, 24]} align="middle">
            <Col flex="auto">
              <Space direction="vertical" size="middle">
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 20,
                    marginBottom: 16,
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}>
                    <CheckCircleOutlined style={{ color: '#fff', fontSize: 14 }} />
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 500, letterSpacing: '0.5px' }}>
                      已入驻企业
                    </span>
                  </div>
                  <Title level={3} style={{
                    color: '#fff',
                    margin: 0,
                    fontSize: 32,
                    fontWeight: 600,
                    letterSpacing: '-0.5px',
                    lineHeight: 1.2,
                  }}>
                    欢迎回来，湖北智造科技有限公司
                  </Title>
                  <Text style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 15,
                    marginTop: 12,
                    display: 'block',
                    fontWeight: 400,
                  }}>
                    今天是 2026年3月13日
                  </Text>
                </div>

                {/* 关键指标 - 极简风格 */}
                <div style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 24,
                }}>
                  {[
                    { label: '待办事项', value: '3', color: '#fbbf24' },
                    { label: '资料完整度', value: '85%', color: '#fff' },
                    { label: '信用评级', value: 'A级', color: '#fff' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding: '12px 20px',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.1)',
                      minWidth: 100,
                      textAlign: 'center',
                    }}>
                      <div style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: item.color,
                        letterSpacing: '-0.5px',
                      }}>{item.value}</div>
                      <div style={{
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.5)',
                        marginTop: 2,
                        fontWeight: 500,
                      }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </Space>
            </Col>

            {/* 右侧操作按钮 */}
            <Col>
              <Space direction="vertical" size="small" style={{ gap: 12 }}>
                {isSupply ? (
                  <Link to="/enterprise/software/publish" style={{ textDecoration: 'none' }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<RocketOutlined />}
                      style={{
                        background: 'var(--bg-card)',
                        color: 'var(--brand-primary)',
                        border: 'none',
                        height: 48,
                        padding: '0 28px',
                        fontWeight: 600,
                        fontSize: 15,
                        borderRadius: 12,
                        boxShadow: 'var(--shadow-md)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                      }}
                    >
                      发布软件
                    </Button>
                  </Link>
                ) : (
                  <Link to="/enterprise/demands" style={{ textDecoration: 'none' }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<FileTextOutlined />}
                      style={{
                        background: 'var(--bg-card)',
                        color: 'var(--brand-primary)',
                        border: 'none',
                        height: 48,
                        padding: '0 28px',
                        fontWeight: 600,
                        fontSize: 15,
                        borderRadius: 12,
                        boxShadow: 'var(--shadow-md)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
                      }}
                    >
                      发布需求
                    </Button>
                  </Link>
                )}
                <Link to="/enterprise/subsidy/apply" style={{ textDecoration: 'none' }}>
                  <Button
                    size="large"
                    icon={<SafetyCertificateOutlined />}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      height: 48,
                      padding: '0 28px',
                      fontWeight: 500,
                      fontSize: 15,
                      borderRadius: 12,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    }}
                  >
                    申报补贴
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
        </div>
      </Card>

      {/* 统计卡片 - 极简奢华风格 */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Link to={stat.link} style={{ textDecoration: 'none', display: 'block' }}>
              <div
                style={{
                  padding: '28px',
                  background: designSystem.colors.surface,
                  borderRadius: designSystem.borderRadius.lg,
                  border: `1px solid ${designSystem.colors.border}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = stat.color
                  e.currentTarget.style.boxShadow = designSystem.shadows.lg
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = designSystem.colors.border
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* 顶部趋势指示 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                  <Text style={{
                    fontSize: 13,
                    color: designSystem.colors.textTertiary,
                    fontWeight: 500,
                    letterSpacing: '0.3px',
                  }}>
                    {stat.title}
                  </Text>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 10px',
                    background: `${designSystem.colors.success}08`,
                    borderRadius: 20,
                  }}>
                    <RiseOutlined style={{ fontSize: 10, color: designSystem.colors.success }} />
                    <span style={{
                      fontSize: 11,
                      color: designSystem.colors.success,
                      fontWeight: 600,
                    }}>{stat.trend}</span>
                  </div>
                </div>

                {/* 数值 */}
                <div style={{ marginBottom: 16 }}>
                  <Text style={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: designSystem.colors.textPrimary,
                    letterSpacing: '-1px',
                    lineHeight: 1,
                  }}>
                    {typeof stat.value === 'number' ? (
                      <AnimatedNumber value={stat.value} suffix={stat.suffix || ''} />
                    ) : (
                      stat.value
                    )}
                  </Text>
                </div>

                {/* 底部图标 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: stat.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.3s ease',
                  }}>
                    <span style={{ color: stat.color, fontSize: 22 }}>
                      {stat.icon}
                    </span>
                  </div>
                  <ArrowRightOutlined style={{
                    fontSize: 16,
                    color: designSystem.colors.textTertiary,
                    transition: 'all 0.3s ease',
                  }} />
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      {/* 快捷入口 - 极简奢华风格 */}
      <div style={{
        padding: '28px',
        background: designSystem.colors.surface,
        borderRadius: designSystem.borderRadius.xl,
        border: `1px solid ${designSystem.colors.border}`,
        marginBottom: 32,
        boxShadow: designSystem.shadows.sm,
      }}>
        {/* 标题 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 24,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${designSystem.colors.primary}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <RocketOutlined style={{ color: designSystem.colors.primary, fontSize: 18 }} />
          </div>
          <span style={{
            fontSize: 17,
            fontWeight: 600,
            color: designSystem.colors.textPrimary,
            letterSpacing: '-0.3px',
          }}>快捷操作</span>
        </div>

        <Row gutter={[16, 16]}>
          {quickActions.map((item, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Link to={item.link} style={{ textDecoration: 'none', display: 'block' }}>
                <div
                  style={{
                    padding: '20px',
                    background: designSystem.colors.surface,
                    borderRadius: designSystem.borderRadius.md,
                    border: `1px solid ${designSystem.colors.borderLight}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = item.color
                    e.currentTarget.style.boxShadow = designSystem.shadows.md
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = designSystem.colors.borderLight
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <Space align="start" size="middle">
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        background: item.bgColor,
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <span style={{ color: item.color, fontSize: 24 }}>{item.icon}</span>
                    </div>
                    <div>
                      <Text style={{
                        display: 'block',
                        fontSize: 15,
                        fontWeight: 600,
                        color: designSystem.colors.textPrimary,
                        marginBottom: 4,
                      }}>{item.title}</Text>
                      <Text style={{
                        fontSize: 13,
                        color: designSystem.colors.textTertiary,
                      }}>{item.desc}</Text>
                    </div>
                  </Space>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {/* 我的软件 - 仅工业软件企业显示 */}
        {isSupply && (
          <Col xs={24} lg={8}>
            <div style={{
              background: designSystem.colors.surface,
              borderRadius: designSystem.borderRadius.xl,
              border: `1px solid ${designSystem.colors.border}`,
              boxShadow: designSystem.shadows.sm,
              overflow: 'hidden',
              height: '100%',
            }}>
              {/* 标题栏 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                borderBottom: `1px solid ${designSystem.colors.borderLight}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AppstoreOutlined style={{ color: designSystem.colors.info, fontSize: 18 }} />
                  <span style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: designSystem.colors.textPrimary,
                  }}>我的软件</span>
                </div>
                <Link to="/enterprise/software/list" style={{
                  color: designSystem.colors.info,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                }}>查看全部</Link>
              </div>
              {/* 内容 */}
              <div style={{ padding: '16px 24px' }}>
                <List
                  dataSource={mySoftware}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '12px 0', borderBottom: `1px solid ${designSystem.colors.borderLight}` }}>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <Text style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: designSystem.colors.textPrimary,
                          }}>{item.name}</Text>
                          {getStatusTag(item.status)}
                        </div>
                        {item.status === 'published' && (
                          <div style={{ display: 'flex', gap: 16 }}>
                            <Tooltip title="浏览量">
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <EyeOutlined style={{ color: designSystem.colors.textTertiary, fontSize: 12 }} />
                                <Text style={{ fontSize: 12, color: designSystem.colors.textTertiary }}>{item.views}</Text>
                              </span>
                            </Tooltip>
                            <Tooltip title="下载量">
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <DownloadOutlined style={{ color: designSystem.colors.textTertiary, fontSize: 12 }} />
                                <Text style={{ fontSize: 12, color: designSystem.colors.textTertiary }}>{item.downloads}</Text>
                              </span>
                            </Tooltip>
                            <Tooltip title="评分">
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <StarOutlined style={{ color: designSystem.colors.warning, fontSize: 12 }} />
                                <Text style={{ fontSize: 12, color: designSystem.colors.warning, fontWeight: 500 }}>{item.rating}</Text>
                              </span>
                            </Tooltip>
                          </div>
                        )}
                        {item.status === 'reviewing' && (
                          <div style={{ marginTop: 8 }}>
                            <Progress percent={60} size="small" strokeColor={designSystem.colors.info} showInfo={false} />
                            <Text style={{ fontSize: 11, color: designSystem.colors.textTertiary }}>审核进度 60%</Text>
                          </div>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </Col>
        )}

        {/* 待办事项 */}
        <Col xs={24} lg={isSupply ? 8 : 12}>
          <div style={{
            background: designSystem.colors.surface,
            borderRadius: designSystem.borderRadius.xl,
            border: `1px solid ${designSystem.colors.border}`,
            boxShadow: designSystem.shadows.sm,
            overflow: 'hidden',
            height: '100%',
          }}>
            {/* 标题栏 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '20px 24px',
              borderBottom: `1px solid ${designSystem.colors.borderLight}`,
            }}>
              <CheckCircleOutlined style={{ color: designSystem.colors.success, fontSize: 18 }} />
              <span style={{
                fontSize: 16,
                fontWeight: 600,
                color: designSystem.colors.textPrimary,
              }}>待办事项</span>
            </div>
            {/* 内容 */}
            <div style={{ padding: '16px 24px' }}>
              <List
                dataSource={todoList}
                renderItem={(item) => (
                  <List.Item style={{ padding: '16px 0', borderBottom: `1px solid ${designSystem.colors.borderLight}` }}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Space>
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: item.status === 'done' ? designSystem.colors.success : getPriorityColor(item.priority),
                            }}
                          />
                          <Text
                            style={{
                              textDecoration: item.status === 'done' ? 'line-through' : 'none',
                              color: item.status === 'done' ? designSystem.colors.textTertiary : designSystem.colors.textPrimary,
                              fontSize: 14,
                              fontWeight: item.status !== 'done' ? 600 : 400,
                            }}
                          >
                            {item.title}
                          </Text>
                        </Space>
                        {item.status !== 'done' && (
                          <span style={{
                            padding: '2px 8px',
                            background: item.priority === 'high' ? `${designSystem.colors.error}10` : item.priority === 'medium' ? `${designSystem.colors.warning}10` : `${designSystem.colors.success}10`,
                            color: item.priority === 'high' ? designSystem.colors.error : item.priority === 'medium' ? designSystem.colors.warning : designSystem.colors.success,
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                          }}>
                            {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                          </span>
                        )}
                      </div>
                      <Progress
                        percent={item.progress}
                        size="small"
                        strokeColor={item.progress === 100 ? designSystem.colors.success : designSystem.colors.info}
                        showInfo={false}
                        style={{ margin: 0 }}
                      />
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Col>

        {/* 通知公告 */}
        <Col xs={24} lg={isSupply ? 8 : 12}>
          <div style={{
            background: designSystem.colors.surface,
            borderRadius: designSystem.borderRadius.xl,
            border: `1px solid ${designSystem.colors.border}`,
            boxShadow: designSystem.shadows.sm,
            overflow: 'hidden',
            height: '100%',
          }}>
            {/* 标题栏 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: `1px solid ${designSystem.colors.borderLight}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <BellOutlined style={{ color: designSystem.colors.warning, fontSize: 18 }} />
                <span style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: designSystem.colors.textPrimary,
                }}>通知公告</span>
              </div>
              <Link to="/policy" style={{
                color: designSystem.colors.info,
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
              }}>查看更多</Link>
            </div>
            {/* 内容 */}
            <div style={{ padding: '16px 24px' }}>
              <List
                dataSource={notices}
                renderItem={(item) => (
                  <List.Item style={{ padding: '16px 0', borderBottom: `1px solid ${designSystem.colors.borderLight}` }}>
                    <Space align="start" style={{ width: '100%' }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: item.type === 'urgent' ? `${designSystem.colors.error}10` : item.type === 'success' ? `${designSystem.colors.success}10` : `${designSystem.colors.info}10`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <span style={{
                          color: item.type === 'urgent' ? designSystem.colors.error : item.type === 'success' ? designSystem.colors.success : designSystem.colors.info,
                          fontSize: 16,
                        }}>
                          {item.icon}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 14,
                          display: 'block',
                          marginBottom: 4,
                          color: designSystem.colors.textPrimary,
                          fontWeight: 500,
                        }}>
                          {item.title}
                        </Text>
                        <Text style={{
                          fontSize: 12,
                          color: designSystem.colors.textTertiary,
                        }}>{item.time}</Text>
                      </div>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* 最近动态 - 极简奢华风格 */}
      <div style={{
        background: designSystem.colors.surface,
        borderRadius: designSystem.borderRadius.xxl,
        border: `1px solid ${designSystem.colors.border}`,
        boxShadow: designSystem.shadows.md,
        overflow: 'hidden',
      }}>
        {/* 标题栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 28px',
          borderBottom: `1px solid ${designSystem.colors.borderLight}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `${designSystem.colors.primary}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BarChartOutlined style={{ color: designSystem.colors.primary, fontSize: 18 }} />
            </div>
            <span style={{
              fontSize: 17,
              fontWeight: 600,
              color: designSystem.colors.textPrimary,
              letterSpacing: '-0.3px',
            }}>最近动态</span>
          </div>
          <Button
            type="text"
            size="small"
            style={{
              color: designSystem.colors.textTertiary,
              fontSize: 13,
              fontWeight: 500,
              padding: '4px 12px',
              borderRadius: 8,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = designSystem.colors.primary
              e.currentTarget.style.background = `${designSystem.colors.primary}10`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = designSystem.colors.textTertiary
              e.currentTarget.style.background = 'transparent'
            }}
          >
            查看全部
          </Button>
        </div>

        {/* 内容区域 */}
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentActivities.map((activity, index) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  padding: '18px 20px',
                  background: designSystem.colors.surface,
                  borderRadius: designSystem.borderRadius.lg,
                  border: `1px solid ${designSystem.colors.borderLight}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = designSystem.colors.surfaceElevated
                  e.currentTarget.style.borderColor = activity.color
                  e.currentTarget.style.boxShadow = designSystem.shadows.md
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  const arrow = e.currentTarget.querySelector('.arrow-icon') as HTMLElement
                  const leftBorder = e.currentTarget.querySelector('.left-border') as HTMLElement
                  if (arrow) {
                    arrow.style.color = activity.color
                    arrow.style.transform = 'translateX(4px)'
                  }
                  if (leftBorder) {
                    leftBorder.style.opacity = '1'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = designSystem.colors.surface
                  e.currentTarget.style.borderColor = designSystem.colors.borderLight
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                  const arrow = e.currentTarget.querySelector('.arrow-icon') as HTMLElement
                  const leftBorder = e.currentTarget.querySelector('.left-border') as HTMLElement
                  if (arrow) {
                    arrow.style.color = designSystem.colors.textTertiary
                    arrow.style.transform = 'translateX(0)'
                  }
                  if (leftBorder) {
                    leftBorder.style.opacity = '0'
                  }
                }}
              >
                {/* 左侧装饰线 */}
                <div
                  className="left-border"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: activity.color,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />

                {/* 左侧时间 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 52, paddingTop: 2 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: designSystem.colors.textSecondary,
                    letterSpacing: '-0.5px',
                  }}>{activity.time}</Text>
                  <Text style={{
                    fontSize: 11,
                    color: designSystem.colors.textTertiary,
                    marginTop: 2,
                    fontWeight: 500,
                  }}>{activity.date}</Text>
                  {index < recentActivities.length - 1 && (
                    <div style={{
                      width: 1.5,
                      height: 28,
                      background: `linear-gradient(to bottom, ${designSystem.colors.border} 0%, ${designSystem.colors.border} 50%, transparent 100%)`,
                      marginTop: 10,
                      borderRadius: 1,
                    }} />
                  )}
                </div>

                {/* 图标 */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: activity.bgColor,
                    border: `2px solid ${activity.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 4px 16px ${activity.color}25`,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <span style={{ color: activity.color, fontSize: 22 }}>
                    {activity.icon}
                  </span>
                </div>

                {/* 内容区域 */}
                <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: designSystem.colors.textPrimary,
                      letterSpacing: '-0.2px',
                    }}>
                      {activity.title}
                    </Text>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: activity.color,
                        boxShadow: `0 0 8px ${activity.color}80`,
                      }}
                    />
                  </div>
                  <Text style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: designSystem.colors.textPrimary,
                    display: 'block',
                    marginBottom: 6,
                    letterSpacing: '-0.2px',
                  }}>
                    {activity.content}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: designSystem.colors.textSecondary,
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}>
                    {activity.description}
                  </Text>
                </div>

                {/* 箭头 */}
                <div
                  className="arrow-icon"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: 4,
                    color: designSystem.colors.textTertiary,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ArrowRightOutlined style={{ fontSize: 16 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
