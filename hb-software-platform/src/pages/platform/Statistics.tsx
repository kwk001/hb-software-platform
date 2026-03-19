import { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  DatePicker,
  Select,
  Button,
  Space,
  Table,
  Tabs,
  Progress,
  Tag,
  Badge,
  theme,
} from 'antd'
import {
  DownloadOutlined,
  ShopOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import type { RangePickerProps } from 'antd/es/date-picker'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select
const { useToken } = theme

// ==================== 数据概览 - 核心运营指标 ====================
const overviewStats = [
  { title: '入驻企业总数', value: 128, change: '+12', trend: 'up', icon: <ShopOutlined />, color: '#1677ff', bgColor: 'linear-gradient(135deg, #e6f4ff 0%, #f0f7ff 100%)', borderColor: '#1677ff' },
  { title: '上架软件总数', value: 256, change: '+28', trend: 'up', icon: <AppstoreOutlined />, color: '#52c41a', bgColor: 'linear-gradient(135deg, #f6ffed 0%, #f0fff0 100%)', borderColor: '#52c41a' },
  { title: '发布需求数', value: 89, change: '+15', trend: 'up', icon: <SafetyCertificateOutlined />, color: '#faad14', bgColor: 'linear-gradient(135deg, #fffbe6 0%, #fffbf0 100%)', borderColor: '#faad14' },
  { title: '补贴申报总额', value: '3200万', change: '+800万', trend: 'up', icon: <DollarOutlined />, color: '#eb2f96', bgColor: 'linear-gradient(135deg, #fff0f6 0%, #fff5f8 100%)', borderColor: '#eb2f96' },
]

// 企业类型分布
const enterpriseTypeData = [
  { type: '工业制造企业', count: 86, percentage: 67 },
  { type: '工业软件企业', count: 42, percentage: 33 },
]

// 软件行业分布（按使用软件的企业行业统计）
const softwareCategoryData = [
  { category: '汽车制造', count: 68, percentage: 27 },
  { category: '电子信息', count: 52, percentage: 20 },
  { category: '装备制造', count: 45, percentage: 18 },
  { category: '化工行业', count: 38, percentage: 15 },
  { category: '其他行业', count: 53, percentage: 20 },
]

// 平台活跃趋势（近6个月）
const platformActivityData = [
  { month: '2025-10', newManufacturing: 5, newSoftware: 3, newSoftwarePublish: 15, newDemands: 12, subsidyApplyAmount: 280, subsidyApprovedAmount: 220 },
  { month: '2025-11', newManufacturing: 8, newSoftware: 4, newSoftwarePublish: 22, newDemands: 18, subsidyApplyAmount: 320, subsidyApprovedAmount: 260 },
  { month: '2025-12', newManufacturing: 4, newSoftware: 2, newSoftwarePublish: 18, newDemands: 15, subsidyApplyAmount: 450, subsidyApprovedAmount: 380 },
  { month: '2026-01', newManufacturing: 3, newSoftware: 2, newSoftwarePublish: 8, newDemands: 10, subsidyApplyAmount: 380, subsidyApprovedAmount: 300 },
  { month: '2026-02', newManufacturing: 3, newSoftware: 1, newSoftwarePublish: 6, newDemands: 14, subsidyApplyAmount: 420, subsidyApprovedAmount: 350 },
  { month: '2026-03', newManufacturing: 2, newSoftware: 1, newSoftwarePublish: 4, newDemands: 20, subsidyApplyAmount: 350, subsidyApprovedAmount: 280 },
]

// ==================== 企业入驻统计 ====================
const enterpriseStatsData = [
  { month: '2025-10', newEnterprises: 8, totalEnterprises: 98, approved: 6, pending: 2 },
  { month: '2025-11', newEnterprises: 12, totalEnterprises: 110, approved: 10, pending: 2 },
  { month: '2025-12', newEnterprises: 6, totalEnterprises: 116, approved: 5, pending: 1 },
  { month: '2026-01', newEnterprises: 5, totalEnterprises: 121, approved: 4, pending: 1 },
  { month: '2026-02', newEnterprises: 4, totalEnterprises: 125, approved: 3, pending: 1 },
  { month: '2026-03', newEnterprises: 3, totalEnterprises: 128, approved: 3, pending: 0 },
]

// 企业地区分布
const enterpriseRegionData = [
  { region: '武汉市', count: 56, percentage: 44 },
  { region: '襄阳市', count: 28, percentage: 22 },
  { region: '宜昌市', count: 18, percentage: 14 },
  { region: '荆州市', count: 12, percentage: 9 },
  { region: '其他地区', count: 14, percentage: 11 },
]

// 企业行业分布
const enterpriseIndustryData = [
  { industry: '汽车制造', count: 24, percentage: 19 },
  { industry: '电子信息', count: 22, percentage: 17 },
  { industry: '装备制造', count: 20, percentage: 16 },
  { industry: '化工', count: 18, percentage: 14 },
  { industry: '食品', count: 15, percentage: 12 },
  { industry: '纺织', count: 12, percentage: 9 },
  { industry: '其他', count: 17, percentage: 13 },
]

// 入驻审核状态
const enterpriseAuditData = [
  { status: '已入驻', count: 98, percentage: 77, color: 'success' },
  { status: '待审核', count: 22, percentage: 17, color: 'warning' },
  { status: '已驳回', count: 8, percentage: 6, color: 'error' },
]

// ==================== 软件发布统计 ====================
const softwareStatsData = [
  { month: '2025-10', newSoftware: 15, totalSoftware: 198, views: 680 },
  { month: '2025-11', newSoftware: 22, totalSoftware: 220, views: 820 },
  { month: '2025-12', newSoftware: 18, totalSoftware: 238, views: 950 },
  { month: '2026-01', newSoftware: 8, totalSoftware: 246, views: 780 },
  { month: '2026-02', newSoftware: 6, totalSoftware: 252, views: 890 },
  { month: '2026-03', newSoftware: 4, totalSoftware: 256, views: 1050 },
]

// 热门软件排行（按浏览量/关注度统计）
const topSoftwareData = [
  { rank: 1, name: '智能制造MES系统', company: '武汉智造科技', views: 1256, industry: '汽车制造', publishTime: '2025-08' },
  { rank: 2, name: '企业资源ERP系统', company: '襄阳创新软件', views: 986, industry: '电子信息', publishTime: '2025-09' },
  { rank: 3, name: '供应链管理系统', company: '宜昌数字科技', views: 856, industry: '装备制造', publishTime: '2025-07' },
  { rank: 4, name: '产品生命周期PLM', company: '武汉云智软件', views: 728, industry: '汽车制造', publishTime: '2025-10' },
  { rank: 5, name: '质量管理系统QMS', company: '襄阳创新软件', views: 652, industry: '装备制造', publishTime: '2025-06' },
]

// 软件审核状态
const softwareAuditData = [
  { status: '已上架', count: 198, percentage: 80, color: 'success' },
  { status: '待审核', count: 42, percentage: 17, color: 'warning' },
  { status: '已下架', count: 8, percentage: 3, color: 'default' },
]

// ==================== 需求对接统计 ====================
const demandStatsData = [
  { month: '2025-10', newDemands: 12, completedDemands: 8, processing: 4 },
  { month: '2025-11', newDemands: 18, completedDemands: 12, processing: 6 },
  { month: '2025-12', newDemands: 15, completedDemands: 10, processing: 5 },
  { month: '2026-01', newDemands: 10, completedDemands: 7, processing: 3 },
  { month: '2026-02', newDemands: 14, completedDemands: 9, processing: 5 },
  { month: '2026-03', newDemands: 20, completedDemands: 15, processing: 5 },
]

// 热门需求类型（按产品类型统计）
const topDemandTypes = [
  { type: 'MES系统', count: 25, percentage: 28 },
  { type: 'ERP系统', count: 20, percentage: 22 },
  { type: '质量管理系统', count: 15, percentage: 17 },
  { type: '供应链系统', count: 12, percentage: 13 },
  { type: '数据分析平台', count: 10, percentage: 11 },
  { type: '其他', count: 7, percentage: 9 },
]

// ==================== 补贴券统计 ====================
const subsidyStatsData = [
  { month: '2025-10', applications: 15, approved: 12, amount: 280 },
  { month: '2025-11', applications: 18, approved: 15, amount: 320 },
  { month: '2025-12', applications: 25, approved: 20, amount: 450 },
  { month: '2026-01', applications: 20, approved: 16, amount: 380 },
  { month: '2026-02', applications: 22, approved: 18, amount: 420 },
  { month: '2026-03', applications: 28, approved: 22, amount: 350 },
]

// 补贴券状态分布
const subsidyStatusData = [
  { status: '审核通过', count: 98, percentage: 53, color: 'success' },
  { status: '待审核', count: 45, percentage: 24, color: 'warning' },
  { status: '已驳回', count: 28, percentage: 15, color: 'error' },
  { status: '已退还', count: 15, percentage: 8, color: 'default' },
]

// 补贴券行业分布
const subsidyIndustryData = [
  { industry: '汽车制造', count: 35, applyAmount: 980, approvedAmount: 850, refundedAmount: 80 },
  { industry: '电子信息', count: 28, applyAmount: 720, approvedAmount: 620, refundedAmount: 50 },
  { industry: '装备制造', count: 25, applyAmount: 650, approvedAmount: 580, refundedAmount: 40 },
  { industry: '化工', count: 18, applyAmount: 420, approvedAmount: 350, refundedAmount: 30 },
  { industry: '其他', count: 22, applyAmount: 430, approvedAmount: 380, refundedAmount: 25 },
]

// ==================== 留言统计 ====================
const messageStatsData = [
  { month: '2025-10', newMessages: 18, repliedMessages: 15, avgReplyTime: 8 },
  { month: '2025-11', newMessages: 22, repliedMessages: 20, avgReplyTime: 6 },
  { month: '2025-12', newMessages: 25, repliedMessages: 22, avgReplyTime: 7 },
  { month: '2026-01', newMessages: 20, repliedMessages: 18, avgReplyTime: 9 },
  { month: '2026-02', newMessages: 28, repliedMessages: 25, avgReplyTime: 5 },
  { month: '2026-03', newMessages: 32, repliedMessages: 28, avgReplyTime: 6 },
]

// 留言状态分布
const messageStatusData = [
  { status: '已回复', count: 68, percentage: 62, color: 'success' },
  { status: '待处理', count: 35, percentage: 32, color: 'warning' },
  { status: '已关闭', count: 7, percentage: 6, color: 'default' },
]

// 留言类型分布
const messageTypeData = [
  { type: '政策咨询', count: 45, percentage: 36 },
  { type: '补贴申请', count: 38, percentage: 30 },
  { type: '软件推荐', count: 20, percentage: 16 },
  { type: '技术支持', count: 15, percentage: 12 },
  { type: '其他', count: 8, percentage: 6 },
]

// ==================== 政策阅读统计 ====================
const policyStatsData = [
  { policyName: '2026年度湖北省工业软件补贴券政策', views: 1256, enterprises: 89, readRate: 70 },
  { policyName: '工业软件企业入驻优惠政策', views: 986, enterprises: 68, readRate: 53 },
  { policyName: '智能制造转型升级补贴政策', views: 856, enterprises: 62, readRate: 48 },
  { policyName: '中小企业数字化转型支持政策', views: 756, enterprises: 58, readRate: 45 },
  { policyName: '工业软件人才培养计划', views: 658, enterprises: 45, readRate: 35 },
]

// 政策类型分布
const policyTypeData = [
  { type: '补贴政策', count: 12, views: 3200 },
  { type: '入驻政策', count: 8, views: 1800 },
  { type: '扶持政策', count: 6, views: 1200 },
  { type: '其他政策', count: 4, views: 600 },
]

// 政策阅读趋势
const policyTrendData = [
  { month: '2025-10', views: 680, newPolicies: 2 },
  { month: '2025-11', views: 820, newPolicies: 1 },
  { month: '2025-12', views: 950, newPolicies: 3 },
  { month: '2026-01', views: 780, newPolicies: 1 },
  { month: '2026-02', views: 890, newPolicies: 2 },
  { month: '2026-03', views: 1050, newPolicies: 2 },
]

export default function Statistics() {
  const [timeRange, setTimeRange] = useState('month')
  const [activeTab, setActiveTab] = useState('overview')
  const { token } = useToken()

  // 热门软件表格列
  const softwareColumns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 60, render: (rank: number) => (
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: rank <= 3 ? 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)' : '#f0f0f0',
        color: rank <= 3 ? '#fff' : '#666',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: rank <= 3 ? 14 : 12,
      }}>{rank}</div>
    )},
    { title: '软件名称', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong style={{ color: '#1f2937' }}>{text}</Text> },
    { title: '软件企业', dataIndex: 'company', key: 'company', render: (text: string) => <Text type="secondary">{text}</Text> },
    { title: '适用行业', dataIndex: 'industry', key: 'industry', render: (text: string) => <Tag color="blue" style={{ borderRadius: 4 }}>{text}</Tag> },
    { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime', render: (text: string) => <Text type="secondary">{text}</Text> },
    { title: '浏览量', dataIndex: 'views', key: 'views', render: (v: number) => (
      <Space>
        <EyeOutlined style={{ color: '#1677ff' }} />
        <Text strong style={{ color: '#1677ff' }}>{v.toLocaleString()}</Text>
      </Space>
    )},
  ]

  // 政策阅读表格列
  const policyColumns = [
    { title: '政策名称', dataIndex: 'policyName', key: 'policyName', render: (text: string) => <Text strong style={{ color: '#1f2937' }}>{text}</Text> },
    { title: '阅读次数', dataIndex: 'views', key: 'views', render: (v: number) => (
      <Space>
        <EyeOutlined style={{ color: '#1677ff' }} />
        <Text style={{ color: '#1677ff' }}>{v.toLocaleString()}</Text>
      </Space>
    )},
    { title: '阅读企业', dataIndex: 'enterprises', key: 'enterprises', render: (v: number) => <Text>{v} 家</Text> },
    { title: '阅读率', dataIndex: 'readRate', key: 'readRate', render: (v: number) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Progress percent={v} size="small" style={{ width: 80 }} strokeColor="#1677ff" />
        <Text strong>{v}%</Text>
      </div>
    )},
  ]

  // 统计卡片样式
  const statCardStyle = (stat: any) => ({
    borderRadius: 16,
    border: `1px solid ${stat.borderColor}20`,
    background: stat.bgColor,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
  })

  // 内容卡片样式
  const contentCardStyle = {
    borderRadius: 12,
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  }

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <Card style={{ 
        marginBottom: 24, 
        borderRadius: 16, 
        border: '1px solid #e8ecef',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)'
      }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Title level={4} style={{ margin: 0, color: '#1f2937', fontWeight: 600 }}>
                <BarChartOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                报表中心
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>平台运营数据统计与分析</Text>
            </Space>
          </Col>
          <Col>
            <Space size={12}>
              <RangePicker style={{ borderRadius: 8 }} />
              <Select value={timeRange} onChange={setTimeRange} style={{ width: 120, borderRadius: 8 }}>
                <Option value="day">按日</Option>
                <Option value="week">按周</Option>
                <Option value="month">按月</Option>
                <Option value="year">按年</Option>
              </Select>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                style={{ 
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(22, 119, 255, 0.3)'
                }}
              >
                导出报表
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 核心指标概览 */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        {overviewStats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              hoverable 
              style={statCardStyle(stat)}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>{stat.title}</Text>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    color: stat.color,
                  }}>{stat.icon}</div>
                </Space>
                <div>
                  <Text style={{ fontSize: 32, fontWeight: 700, color: '#1f2937', lineHeight: 1.2 }}>{stat.value}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: stat.trend === 'up' ? '#f6ffed' : '#fff2f0',
                    color: stat.trend === 'up' ? '#52c41a' : '#f5222d',
                    fontSize: 12,
                    fontWeight: 600,
                  }}>
                    {stat.trend === 'up' ? <RiseOutlined /> : <FallOutlined />} {stat.change}
                  </span>
                  <Text type="secondary" style={{ fontSize: 12 }}>较上期</Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 详细报表标签页 */}
      <Card style={{ 
        borderRadius: 16, 
        border: '1px solid #e8ecef',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          type="card"
          className="statistics-tabs"
        >
          {/* 数据概览 */}
          <Tabs.TabPane tab={<Space><PieChartOutlined />数据概览</Space>} key="overview">
            <Row gutter={[20, 20]}>
              {/* 平台活跃趋势 */}
              <Col xs={24}>
                <Card title="平台活跃趋势" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Table
                    dataSource={platformActivityData}
                    columns={[
                      { title: '月份', dataIndex: 'month', key: 'month', render: (v: string) => <Text strong style={{ color: '#1f2937' }}>{v}</Text> },
                      { title: '新增制造企业', dataIndex: 'newManufacturing', key: 'newManufacturing', render: (v: number) => <Tag color="blue" style={{ borderRadius: 4, fontWeight: 500 }}>+{v}</Tag> },
                      { title: '新增软件企业', dataIndex: 'newSoftware', key: 'newSoftware', render: (v: number) => <Tag color="cyan" style={{ borderRadius: 4, fontWeight: 500 }}>+{v}</Tag> },
                      { title: '新增软件发布', dataIndex: 'newSoftwarePublish', key: 'newSoftwarePublish', render: (v: number) => <Tag color="green" style={{ borderRadius: 4, fontWeight: 500 }}>+{v}</Tag> },
                      { title: '新增需求', dataIndex: 'newDemands', key: 'newDemands', render: (v: number) => <Tag color="orange" style={{ borderRadius: 4, fontWeight: 500 }}>+{v}</Tag> },
                      { title: '申报补贴券(万元)', dataIndex: 'subsidyApplyAmount', key: 'subsidyApplyAmount', render: (v: number) => <Text strong style={{ color: '#eb2f96' }}>{v}</Text> },
                      { title: '补贴券通过(万元)', dataIndex: 'subsidyApprovedAmount', key: 'subsidyApprovedAmount', render: (v: number) => <Text strong style={{ color: '#52c41a' }}>{v}</Text> },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              {/* 企业类型分布 */}
              <Col xs={24} lg={12}>
                <Card title="企业类型分布" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  {enterpriseTypeData.map((item, index) => (
                    <div key={index} style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, color: '#1f2937' }}>{item.type}</Text>
                        <Text strong style={{ fontSize: 16, color: '#1677ff' }}>{item.count} 家 ({item.percentage}%)</Text>
                      </div>
                      <Progress 
                        percent={item.percentage} 
                        strokeColor={index === 0 ? { from: '#1677ff', to: '#4096ff' } : { from: '#52c41a', to: '#73d13d' }}
                        strokeWidth={10}
                        showInfo={false}
                        style={{ borderRadius: 5 }}
                      />
                    </div>
                  ))}
                </Card>
              </Col>
              {/* 软件行业分布 */}
              <Col xs={24} lg={12}>
                <Card title="软件行业分布" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  {softwareCategoryData.map((item, index) => (
                    <div key={index} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                        <Text style={{ fontSize: 13, color: '#4b5563' }}>{item.category}</Text>
                        <Text style={{ fontSize: 13, color: '#6b7280' }}>{item.count} 个 ({item.percentage}%)</Text>
                      </div>
                      <Progress percent={item.percentage} size="small" strokeColor="#1677ff" />
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          {/* 企业入驻统计 */}
          <Tabs.TabPane tab={<Space><ShopOutlined />企业入驻统计</Space>} key="enterprise">
            <Row gutter={[20, 20]}>
              {/* 入驻趋势 */}
              <Col xs={24} lg={12}>
                <Card title="企业入驻趋势" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Table
                    dataSource={enterpriseStatsData}
                    columns={[
                      { title: '月份', dataIndex: 'month', key: 'month', render: (v: string) => <Text strong style={{ color: '#1f2937' }}>{v}</Text> },
                      { title: '新增企业', dataIndex: 'newEnterprises', key: 'newEnterprises', render: (v: number) => <Tag color="blue" style={{ borderRadius: 4, fontWeight: 500 }}>+{v}</Tag> },
                      { title: '累计企业', dataIndex: 'totalEnterprises', key: 'totalEnterprises', render: (v: number) => <Text strong>{v}</Text> },
                      { title: '已入驻', dataIndex: 'approved', key: 'approved', render: (v: number) => <Tag color="green" style={{ borderRadius: 4 }}>{v}</Tag> },
                      { title: '待审核', dataIndex: 'pending', key: 'pending', render: (v: number) => <Tag color="orange" style={{ borderRadius: 4 }}>{v}</Tag> },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              {/* 审核状态分布 */}
              <Col xs={24} lg={12}>
                <Card title="入驻审核状态" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  {enterpriseAuditData.map((item, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                        <Tag color={item.color} style={{ borderRadius: 4, fontSize: 13, padding: '2px 10px' }}>{item.status}</Tag>
                        <Text strong style={{ fontSize: 15 }}>{item.count} 家 ({item.percentage}%)</Text>
                      </div>
                      <Progress 
                        percent={item.percentage} 
                        size="small" 
                        strokeColor={item.color === 'success' ? '#52c41a' : item.color === 'warning' ? '#faad14' : '#f5222d'} 
                      />
                    </div>
                  ))}
                </Card>
              </Col>
              {/* 地区分布 */}
              <Col xs={24} lg={12}>
                <Card title="企业地区分布" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  {enterpriseRegionData.map((item, index) => (
                    <div key={index} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ fontSize: 13 }}>{item.region}</Text>
                        <Text strong style={{ fontSize: 13 }}>{item.count} 家 ({item.percentage}%)</Text>
                      </div>
                      <Progress percent={item.percentage} size="small" strokeColor="#52c41a" />
                    </div>
                  ))}
                </Card>
              </Col>
              {/* 行业分布 */}
              <Col xs={24} lg={12}>
                <Card title="企业行业分布" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Row gutter={[12, 12]}>
                    {enterpriseIndustryData.map((item, index) => (
                      <Col xs={12} key={index}>
                        <Card 
                          size="small" 
                          style={{ 
                            textAlign: 'center', 
                            borderRadius: 10,
                            border: '1px solid #f0f0f0',
                            background: '#fafbfc'
                          }}
                          bodyStyle={{ padding: '12px 8px' }}
                        >
                          <Text strong style={{ fontSize: 22, color: '#1677ff', display: 'block', marginBottom: 4 }}>{item.count}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>{item.industry}</Text>
                          <Progress percent={item.percentage} size="small" showInfo={false} style={{ marginTop: 8 }} />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          {/* 软件发布统计 */}
          <Tabs.TabPane tab={<Space><AppstoreOutlined />软件发布统计</Space>} key="software">
            <Row gutter={[20, 20]}>
              {/* 发布趋势 */}
              <Col xs={24} lg={12}>
                <Card title="软件发布趋势" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Table
                    dataSource={softwareStatsData}
                    columns={[
                      { title: '月份', dataIndex: 'month', key: 'month', render: (v: string) => <Text strong style={{ color: '#1f2937' }}>{v}</Text> },
                      { title: '新增软件', dataIndex: 'newSoftware', key: 'newSoftware', render: (v: number) => <Tag color="blue" style={{ borderRadius: 4, fontWeight: 500 }}>+{v}</Tag> },
                      { title: '累计软件', dataIndex: 'totalSoftware', key: 'totalSoftware', render: (v: number) => <Text strong>{v}</Text> },
                      { title: '浏览量', dataIndex: 'views', key: 'views', render: (v: number) => <Tag color="green" style={{ borderRadius: 4 }}>{v.toLocaleString()}</Tag> },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              {/* 审核状态 */}
              <Col xs={24} lg={12}>
                <Card title="软件审核状态" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  {softwareAuditData.map((item, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                        <Tag color={item.color} style={{ borderRadius: 4, fontSize: 13, padding: '2px 10px' }}>{item.status}</Tag>
                        <Text strong style={{ fontSize: 15 }}>{item.count} 个 ({item.percentage}%)</Text>
                      </div>
                      <Progress percent={item.percentage} size="small" />
                    </div>
                  ))}
                </Card>
              </Col>
              {/* 热门软件排行 */}
              <Col xs={24}>
                <Card title="热门软件排行" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Table
                    columns={softwareColumns}
                    dataSource={topSoftwareData}
                    rowKey="rank"
                    pagination={false}
                  />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          {/* 需求对接统计 */}
          <Tabs.TabPane tab={<Space><SafetyCertificateOutlined />需求对接统计</Space>} key="demand">
            <Row gutter={[20, 20]}>
              {/* 需求趋势 */}
              <Col xs={24} lg={12}>
                <Card title="需求发布趋势" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Table
                    dataSource={demandStatsData}
                    columns={[
                      { title: '月份', dataIndex: 'month', key: 'month', render: (v: string) => <Text strong style={{ color: '#1f2937' }}>{v}</Text> },
                      { title: '新增需求', dataIndex: 'newDemands', key: 'newDemands', render: (v: number) => <Tag color="blue" style={{ borderRadius: 4, fontWeight: 500 }}>+{v}</Tag> },
                      { title: '已完成', dataIndex: 'completedDemands', key: 'completedDemands', render: (v: number) => <Tag color="green" style={{ borderRadius: 4 }}>{v}</Tag> },
                      { title: '对接中', dataIndex: 'processing', key: 'processing', render: (v: number) => <Tag color="orange" style={{ borderRadius: 4 }}>{v}</Tag> },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              {/* 热门需求类型 */}
              <Col xs={24} lg={12}>
                <Card title="热门需求类型" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  {topDemandTypes.map((item, index) => (
                    <div key={index} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                        <Text style={{ fontSize: 13 }}>{item.type}</Text>
                        <Text strong style={{ fontSize: 13 }}>{item.count} 个 ({item.percentage}%)</Text>
                      </div>
                      <Progress percent={item.percentage} size="small" strokeColor="#eb2f96" />
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          {/* 补贴券统计 */}
          <Tabs.TabPane tab={<Space><DollarOutlined />补贴券统计</Space>} key="subsidy">
            <Row gutter={[20, 20]}>
              {/* 申报趋势 */}
              <Col xs={24} lg={12}>
                <Card title="补贴券申报趋势" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Table
                    dataSource={subsidyStatsData}
                    columns={[
                      { title: '月份', dataIndex: 'month', key: 'month', render: (v: string) => <Text strong style={{ color: '#1f2937' }}>{v}</Text> },
                      { title: '申报数', dataIndex: 'applications', key: 'applications', render: (v: number) => <Tag color="blue" style={{ borderRadius: 4 }}>{v}</Tag> },
                      { title: '通过数', dataIndex: 'approved', key: 'approved', render: (v: number) => <Tag color="green" style={{ borderRadius: 4 }}>{v}</Tag> },
                      { title: '金额(万元)', dataIndex: 'amount', key: 'amount', render: (v: number) => <Text strong style={{ color: '#eb2f96' }}>{v}</Text> },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              {/* 状态分布 */}
              <Col xs={24} lg={12}>
                <Card title="补贴券状态分布" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  {subsidyStatusData.map((item, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                        <Tag color={item.color} style={{ borderRadius: 4, fontSize: 13, padding: '2px 10px' }}>{item.status}</Tag>
                        <Text strong style={{ fontSize: 15 }}>{item.count} 个 ({item.percentage}%)</Text>
                      </div>
                      <Progress percent={item.percentage} size="small" />
                    </div>
                  ))}
                </Card>
              </Col>
              {/* 行业分布 */}
              <Col xs={24}>
                <Card title="补贴券行业分布" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Table
                    dataSource={subsidyIndustryData}
                    columns={[
                      { title: '行业', dataIndex: 'industry', key: 'industry', render: (v: string) => <Text strong>{v}</Text> },
                      { title: '申报数量', dataIndex: 'count', key: 'count', render: (v: number) => <Tag color="blue" style={{ borderRadius: 4 }}>{v}</Tag> },
                      { title: '申报金额(万元)', dataIndex: 'applyAmount', key: 'applyAmount', render: (v: number) => <Text>{v}</Text> },
                      { title: '审核通过金额(万元)', dataIndex: 'approvedAmount', key: 'approvedAmount', render: (v: number) => <Text strong style={{ color: '#52c41a' }}>{v}</Text> },
                      { title: '已退回金额(万元)', dataIndex: 'refundedAmount', key: 'refundedAmount', render: (v: number) => <Text strong style={{ color: '#faad14' }}>{v}</Text> },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          {/* 留言统计 */}
          <Tabs.TabPane tab={<Space><LineChartOutlined />留言统计</Space>} key="message">
            <Row gutter={[20, 20]}>
              {/* 留言趋势 */}
              <Col xs={24} lg={12}>
                <Card title="留言处理趋势" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Table
                    dataSource={messageStatsData}
                    columns={[
                      { title: '月份', dataIndex: 'month', key: 'month', render: (v: string) => <Text strong style={{ color: '#1f2937' }}>{v}</Text> },
                      { title: '新增留言', dataIndex: 'newMessages', key: 'newMessages', render: (v: number) => <Tag color="blue" style={{ borderRadius: 4 }}>+{v}</Tag> },
                      { title: '已回复', dataIndex: 'repliedMessages', key: 'repliedMessages', render: (v: number) => <Tag color="green" style={{ borderRadius: 4 }}>{v}</Tag> },
                      { title: '平均响应(小时)', dataIndex: 'avgReplyTime', key: 'avgReplyTime', render: (v: number) => <Text>{v}h</Text> },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              {/* 状态分布 */}
              <Col xs={24} lg={12}>
                <Card title="留言状态分布" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  {messageStatusData.map((item, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                        <Tag color={item.color} style={{ borderRadius: 4, fontSize: 13, padding: '2px 10px' }}>{item.status}</Tag>
                        <Text strong style={{ fontSize: 15 }}>{item.count} 条 ({item.percentage}%)</Text>
                      </div>
                      <Progress percent={item.percentage} size="small" />
                    </div>
                  ))}
                </Card>
              </Col>
              {/* 类型分布 */}
              <Col xs={24}>
                <Card title="留言类型分布" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Row gutter={[16, 16]}>
                    {messageTypeData.map((item, index) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        <Card 
                          size="small" 
                          style={{ 
                            textAlign: 'center', 
                            borderRadius: 12,
                            border: '1px solid #f0f0f0',
                            background: 'linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%)',
                            transition: 'all 0.3s ease',
                          }}
                          bodyStyle={{ padding: '16px 12px' }}
                          hoverable
                        >
                          <Text strong style={{ fontSize: 28, color: '#1677ff', display: 'block', marginBottom: 6 }}>{item.count}</Text>
                          <Text type="secondary" style={{ fontSize: 13 }}>{item.type}</Text>
                          <Progress percent={item.percentage} size="small" showInfo={false} style={{ marginTop: 10 }} />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>

          {/* 政策阅读统计 */}
          <Tabs.TabPane tab={<Space><BarChartOutlined />政策阅读统计</Space>} key="policy">
            <Row gutter={[20, 20]}>
              {/* 政策阅读排行 */}
              <Col xs={24}>
                <Card title="政策阅读排行" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Table
                    columns={policyColumns}
                    dataSource={policyStatsData}
                    rowKey="policyName"
                    pagination={false}
                  />
                </Card>
              </Col>
              {/* 类型分布 */}
              <Col xs={24} lg={12}>
                <Card title="政策类型分布" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Row gutter={[16, 16]}>
                    {policyTypeData.map((item, index) => (
                      <Col xs={12} key={index}>
                        <Card 
                          size="small" 
                          style={{ 
                            textAlign: 'center', 
                            borderRadius: 12,
                            border: '1px solid #f0f0f0',
                            background: index === 0 ? 'linear-gradient(135deg, #fff0f6 0%, #fff5f8 100%)' : 'linear-gradient(135deg, #e6f4ff 0%, #f0f7ff 100%)',
                          }}
                          bodyStyle={{ padding: '16px 12px' }}
                        >
                          <Text strong style={{ fontSize: 32, color: index === 0 ? '#eb2f96' : '#1677ff', display: 'block', marginBottom: 4 }}>{item.count}</Text>
                          <div><Text type="secondary" style={{ fontSize: 13 }}>{item.type}</Text></div>
                          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>{item.views.toLocaleString()} 次阅读</Text>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
              {/* 阅读趋势 */}
              <Col xs={24} lg={12}>
                <Card title="政策阅读趋势" style={contentCardStyle} headStyle={{ fontWeight: 600, color: '#1f2937' }}>
                  <Table
                    dataSource={policyTrendData}
                    columns={[
                      { title: '月份', dataIndex: 'month', key: 'month', render: (v: string) => <Text strong style={{ color: '#1f2937' }}>{v}</Text> },
                      { title: '阅读次数', dataIndex: 'views', key: 'views', render: (v: number) => <Tag color="blue" style={{ borderRadius: 4 }}>{v.toLocaleString()}</Tag> },
                      { title: '新增政策', dataIndex: 'newPolicies', key: 'newPolicies', render: (v: number) => <Tag color="green" style={{ borderRadius: 4 }}>+{v}</Tag> },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  )
}
