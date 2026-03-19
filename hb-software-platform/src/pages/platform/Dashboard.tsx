import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Tag,
  Button,
  Badge,
  List,
  Table,
  Timeline,
  Alert,
  Progress,
  Tooltip,
  Avatar,
} from 'antd'
import {
  ShopOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
  UserOutlined,
  MessageOutlined,
  WarningOutlined,
  RiseOutlined,
  FallOutlined,
  DashboardOutlined,
  BellOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import type { CSSProperties } from 'react'

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

const styles: Record<string, CSSProperties> = {
  // 欢迎区域 - 蓝色渐变背景
  welcomeCard: {
    borderRadius: designSystem.borderRadius.xxl,
    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `${designSystem.shadows.xl}, inset 0 1px 0 rgba(255,255,255,0.15)`,
  },
}

// 统计数据 - 极简风格
const statsData = [
  {
    title: '待审核企业',
    value: 8,
    icon: <ShopOutlined />,
    color: designSystem.colors.accent,
    bgColor: 'rgba(212, 165, 116, 0.08)',
    link: '/platform/audit/enterprise',
    trend: '+2',
  },
  {
    title: '待审核软件',
    value: 12,
    icon: <AppstoreOutlined />,
    color: designSystem.colors.primaryLight,
    bgColor: 'rgba(30, 58, 95, 0.06)',
    link: '/platform/audit/software',
    trend: '+3',
  },
  {
    title: '待审核补贴',
    value: 15,
    icon: <SafetyCertificateOutlined />,
    color: designSystem.colors.success,
    bgColor: 'rgba(5, 150, 105, 0.06)',
    link: '/platform/audit/subsidy',
    trend: '+5',
  },
  {
    title: '今日新增',
    value: 23,
    icon: <UserOutlined />,
    color: designSystem.colors.info,
    bgColor: 'rgba(37, 99, 235, 0.06)',
    link: '/platform/users',
    trend: '+8',
  },
]

// 平台数据概览 - 极简风格
const platformStats = [
  { label: '入驻企业', value: 1286, change: '+12.5%', trend: 'up', icon: <ShopOutlined />, color: designSystem.colors.accent },
  { label: '上架软件', value: 568, change: '+8.3%', trend: 'up', icon: <AppstoreOutlined />, color: designSystem.colors.primaryLight },
  { label: '需求对接', value: 389, change: '+15.7%', trend: 'up', icon: <FileTextOutlined />, color: designSystem.colors.success },
  { label: '补贴总额', value: 5680, suffix: '万', change: '+25.2%', trend: 'up', icon: <SafetyCertificateOutlined />, color: designSystem.colors.info },
]

const pendingAudits = [
  { id: 1, type: '企业入驻', name: '武汉智造科技有限公司', submitTime: '2026-03-13 09:30', applicant: '张三', waitTime: '2小时' },
  { id: 2, type: '软件发布', name: '智能制造MES系统 V2.0', submitTime: '2026-03-13 10:15', applicant: '李四', waitTime: '1.5小时' },
  { id: 3, type: '补贴申报', name: '湖北汽车制造有限公司 - 50万', submitTime: '2026-03-13 11:00', applicant: '王五', waitTime: '1小时' },
  { id: 4, type: '企业入驻', name: '襄阳创新软件有限公司', submitTime: '2026-03-12 16:45', applicant: '赵六', waitTime: '18小时' },
  { id: 5, type: '软件发布', name: '供应链管理系统', submitTime: '2026-03-12 14:20', applicant: '钱七', waitTime: '20小时' },
]

const recentActivities = [
  {
    id: 1,
    title: '企业入驻审核通过',
    content: '武汉智造科技有限公司',
    description: '企业资质审核已通过，已正式入驻平台',
    time: '14:30',
    date: '今天',
    type: 'success',
    icon: <CheckCircleOutlined />,
    color: designSystem.colors.success,
    bgColor: `${designSystem.colors.success}10`,
    borderColor: `${designSystem.colors.success}30`,
  },
  {
    id: 2,
    title: '政策发布',
    content: '2026年工业软件补贴券发放通知',
    description: '新的补贴政策已发布，企业可申请补贴',
    time: '11:00',
    date: '今天',
    type: 'info',
    icon: <BellOutlined />,
    color: designSystem.colors.info,
    bgColor: `${designSystem.colors.info}10`,
    borderColor: `${designSystem.colors.info}30`,
  },
  {
    id: 3,
    title: '软件审核通过',
    content: '智能制造MES系统',
    description: '软件发布审核已通过，已上架展示',
    time: '10:15',
    date: '今天',
    type: 'success',
    icon: <CheckCircleOutlined />,
    color: designSystem.colors.success,
    bgColor: `${designSystem.colors.success}10`,
    borderColor: `${designSystem.colors.success}30`,
  },
  {
    id: 4,
    title: '补贴申报提交',
    content: '湖北汽车制造有限公司',
    description: '提交了50万补贴券申报，待审核',
    time: '09:30',
    date: '今天',
    type: 'warning',
    icon: <WarningOutlined />,
    color: designSystem.colors.warning,
    bgColor: `${designSystem.colors.warning}10`,
    borderColor: `${designSystem.colors.warning}30`,
  },
]

export default function PlatformDashboard() {
  // 表格列定义 - 极简风格
  const columns = [
    {
      title: <span style={{ fontSize: 13, fontWeight: 600, color: designSystem.colors.textSecondary }}>审核类型</span>,
      dataIndex: 'type',
      key: 'type',
      width: 110,
      render: (text: string) => {
        const typeStyles: Record<string, { bg: string; color: string }> = {
          '企业入驻': { bg: `${designSystem.colors.primary}10`, color: designSystem.colors.primary },
          '软件发布': { bg: `${designSystem.colors.success}10`, color: designSystem.colors.success },
          '补贴申报': { bg: `${designSystem.colors.warning}10`, color: designSystem.colors.warning },
        }
        const style = typeStyles[text] || { bg: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }
        return (
          <span style={{
            display: 'inline-block',
            padding: '6px 12px',
            background: style.bg,
            color: style.color,
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
          }}>
            {text}
          </span>
        )
      },
    },
    {
      title: <span style={{ fontSize: 13, fontWeight: 600, color: designSystem.colors.textSecondary }}>申请名称</span>,
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <Text style={{
            fontSize: 14,
            fontWeight: 600,
            color: designSystem.colors.textPrimary,
          }}>{text}</Text>
          <div style={{
            fontSize: 12,
            color: designSystem.colors.textTertiary,
            marginTop: 4,
          }}>申请人：{record.applicant}</div>
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: 13, fontWeight: 600, color: designSystem.colors.textSecondary }}>等待时长</span>,
      dataIndex: 'waitTime',
      key: 'waitTime',
      width: 110,
      render: (text: string, record: any) => (
        <Tooltip title={`提交时间：${record.submitTime}`}>
          <span style={{
            fontSize: 13,
            color: designSystem.colors.textTertiary,
            fontWeight: 500,
          }}>
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: <span style={{ fontSize: 13, fontWeight: 600, color: designSystem.colors.textSecondary }}>操作</span>,
      key: 'action',
      width: 140,
      render: () => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            style={{
              color: designSystem.colors.textTertiary,
              fontSize: 13,
              fontWeight: 500,
              padding: '4px 12px',
            }}
          >
            查看
          </Button>
          <Button
            type="primary"
            size="small"
            style={{
              background: designSystem.colors.primary,
              borderColor: designSystem.colors.primary,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              padding: '4px 16px',
              height: 32,
            }}
          >
            审核
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* 欢迎区域 */}
      <Card style={{ ...styles.welcomeCard, marginBottom: 24 }} bodyStyle={{ padding: '36px 40px' }}>
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 350,
          height: 350,
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: 250,
          height: 250,
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Row gutter={[48, 24]} align="middle">
            <Col flex="auto">
              <Space direction="vertical" size="middle">
                <div>
                  {/* 标签 */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: 20,
                    marginBottom: 20,
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <DashboardOutlined style={{ color: '#a5b4fc', fontSize: 13 }} />
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 500 }}>
                      平台管理后台
                    </span>
                  </div>

                  {/* 标题 */}
                  <Title level={2} style={{
                    color: '#fff',
                    margin: 0,
                    fontSize: 34,
                    fontWeight: 600,
                    letterSpacing: '-0.5px',
                    lineHeight: 1.2,
                  }}>
                    欢迎回来，平台管理员
                  </Title>

                  {/* 副标题 */}
                  <Text style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 14,
                    marginTop: 10,
                    display: 'block',
                  }}>
                    今天是 2026年3月13日，祝您工作愉快
                  </Text>
                </div>

                {/* 关键指标 */}
                <div style={{
                  display: 'flex',
                  gap: 16,
                  marginTop: 8,
                }}>
                  {[
                    { label: '待审核', value: '35', color: '#fde68a', icon: <SafetyCertificateOutlined /> },
                    { label: '今日新增', value: '23', color: '#fff', icon: <RiseOutlined /> },
                    { label: '系统状态', value: '正常', color: '#86efac', icon: <CheckCircleOutlined /> },
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding: '14px 22px',
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: 14,
                      border: '1px solid rgba(255,255,255,0.1)',
                      minWidth: 110,
                      textAlign: 'center',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                    >
                      <div style={{
                        fontSize: 26,
                        fontWeight: 700,
                        color: item.color,
                        letterSpacing: '-0.5px',
                        marginBottom: 4,
                      }}>{item.value}</div>
                      <div style={{
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                      }}>
                        {item.icon}
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Space>
            </Col>

            {/* 右侧操作按钮 */}
            <Col>
              <Space direction="vertical" size="middle" style={{ gap: 12 }}>
                <Link to="/platform/audit/enterprise" style={{ textDecoration: 'none' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CheckCircleOutlined />}
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      borderColor: 'rgba(255,255,255,0.95)',
                      color: '#4f46e5',
                      height: 48,
                      padding: '0 28px',
                      fontWeight: 600,
                      fontSize: 15,
                      borderRadius: 12,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
                    }}
                  >
                    开始审核
                  </Button>
                </Link>
                <Link to="/platform/statistics" style={{ textDecoration: 'none' }}>
                  <Button
                    size="large"
                    icon={<BarChartOutlined />}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      height: 48,
                      padding: '0 28px',
                      fontWeight: 500,
                      fontSize: 15,
                      borderRadius: 12,
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    查看报表
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
                    background: 'rgba(5, 150, 105, 0.08)',
                    borderRadius: 20,
                  }}>
                    <ArrowUpOutlined style={{ fontSize: 10, color: designSystem.colors.success }} />
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
                    <AnimatedNumber value={stat.value} />
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

      {/* 平台数据概览 - 极简风格 */}
      <div style={{
        padding: '32px',
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
          marginBottom: 28,
          paddingBottom: 20,
          borderBottom: `1px solid ${designSystem.colors.borderLight}`,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(30, 58, 95, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <LineChartOutlined style={{ color: designSystem.colors.primary, fontSize: 18 }} />
          </div>
          <span style={{
            fontSize: 17,
            fontWeight: 600,
            color: designSystem.colors.textPrimary,
            letterSpacing: '-0.3px',
          }}>平台数据概览</span>
        </div>

        <Row gutter={[40, 32]}>
          {platformStats.map((stat, index) => (
            <Col xs={12} md={6} key={index}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
              }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `${stat.color}10`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: stat.color, fontSize: 24 }}>
                    {stat.icon}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 13,
                    color: designSystem.colors.textTertiary,
                    fontWeight: 500,
                  }}>{stat.label}</Text>
                  <div style={{ marginTop: 6 }}>
                    <Text style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: designSystem.colors.textPrimary,
                      letterSpacing: '-0.5px',
                    }}>
                      {stat.value.toLocaleString()}{stat.suffix || ''}
                    </Text>
                  </div>
                  <div style={{
                    marginTop: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    {stat.trend === 'up' ? (
                      <RiseOutlined style={{ color: designSystem.colors.success, fontSize: 12 }} />
                    ) : (
                      <FallOutlined style={{ color: designSystem.colors.error, fontSize: 12 }} />
                    )}
                    <span style={{
                      color: stat.trend === 'up' ? designSystem.colors.success : designSystem.colors.error,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {stat.change}
                    </span>
                    <span style={{
                      color: designSystem.colors.textTertiary,
                      fontSize: 11,
                    }}>较上月</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 待审核列表 - 极简风格 */}
      <div style={{
        background: designSystem.colors.surface,
        borderRadius: designSystem.borderRadius.xl,
        border: `1px solid ${designSystem.colors.border}`,
        boxShadow: designSystem.shadows.sm,
        overflow: 'hidden',
        marginBottom: 32,
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
              background: `${designSystem.colors.warning}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ClockCircleOutlined style={{ color: designSystem.colors.warning, fontSize: 18 }} />
            </div>
            <div>
              <span style={{
                fontSize: 17,
                fontWeight: 600,
                color: designSystem.colors.textPrimary,
                letterSpacing: '-0.3px',
              }}>待审核事项</span>
              <span style={{
                marginLeft: 12,
                padding: '4px 10px',
                background: `${designSystem.colors.error}10`,
                color: designSystem.colors.error,
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}>6 条</span>
            </div>
          </div>
          <Link
            to="/platform/audit/enterprise"
            style={{
              color: designSystem.colors.primary,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${designSystem.colors.primary}08`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            查看全部
            <ArrowRightOutlined style={{ fontSize: 12 }} />
          </Link>
        </div>

        {/* 表格 */}
        <div style={{ padding: '8px 12px 16px' }}>
          <Table
            dataSource={pendingAudits}
            columns={columns}
            pagination={false}
            size="small"
            style={{
              background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* 最近动态 - 极简奢华风格 */}
      <div style={{
        background: designSystem.colors.surface,
        borderRadius: designSystem.borderRadius.xl,
        border: `1px solid ${designSystem.colors.border}`,
        boxShadow: designSystem.shadows.sm,
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
              padding: '6px 16px',
              borderRadius: 8,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = designSystem.colors.primary
              e.currentTarget.style.background = `${designSystem.colors.primary}08`
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
        <div style={{ padding: '20px 28px 28px' }}>
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
                  e.currentTarget.style.borderColor = activity.borderColor
                  e.currentTarget.style.boxShadow = `0 4px 20px ${activity.color}12`
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
                  className="left-border"
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
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: activity.bgColor,
                    border: `1.5px solid ${activity.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <span style={{ color: activity.color, fontSize: 20 }}>
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
