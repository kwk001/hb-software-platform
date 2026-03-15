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
  List,
  Empty,
} from 'antd'
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  ShopOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  FileTextOutlined,
  MessageOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

// 模拟数据 - 概览统计
const overviewStats = [
  { title: '入驻企业总数', value: 128, change: '+12', trend: 'up', icon: <ShopOutlined />, color: '#1677ff' },
  { title: '上架软件总数', value: 256, change: '+28', trend: 'up', icon: <AppstoreOutlined />, color: '#52c41a' },
  { title: '需求对接数', value: 89, change: '+15', trend: 'up', icon: <SafetyCertificateOutlined />, color: '#faad14' },
  { title: '补贴发放总额', value: '3200万', change: '+800万', trend: 'up', icon: <DollarOutlined />, color: '#eb2f96' },
]

// 企业类型分布
const enterpriseTypeData = [
  { type: '工业制造企业', count: 86, percentage: 67 },
  { type: '工业软件企业', count: 42, percentage: 33 },
]

// 软件类别分布
const softwareCategoryData = [
  { category: '生产管控', count: 68, percentage: 27 },
  { category: '经营管理', count: 52, percentage: 20 },
  { category: '供应链', count: 45, percentage: 18 },
  { category: '研发设计', count: 38, percentage: 15 },
  { category: '其他', count: 53, percentage: 20 },
]

// 补贴发放趋势
const subsidyTrendData = [
  { month: '2025-10', amount: 280 },
  { month: '2025-11', amount: 320 },
  { month: '2025-12', amount: 450 },
  { month: '2026-01', amount: 380 },
  { month: '2026-02', amount: 420 },
  { month: '2026-03', amount: 350 },
]

// 热销软件排行
const topSoftwareData = [
  { rank: 1, name: '智能制造MES系统', company: '武汉智造科技', sales: 45, amount: '2250万' },
  { rank: 2, name: '企业资源ERP系统', company: '襄阳创新软件', sales: 38, amount: '1520万' },
  { rank: 3, name: '供应链管理系统', company: '宜昌数字科技', sales: 32, amount: '1280万' },
  { rank: 4, name: '产品生命周期PLM', company: '武汉云智软件', sales: 28, amount: '1960万' },
  { rank: 5, name: '质量管理系统QMS', company: '襄阳创新软件', sales: 25, amount: '875万' },
]

// 企业入驻统计
const enterpriseStatsData = [
  { month: '2025-10', newEnterprises: 8, totalEnterprises: 98 },
  { month: '2025-11', newEnterprises: 12, totalEnterprises: 110 },
  { month: '2025-12', newEnterprises: 6, totalEnterprises: 116 },
  { month: '2026-01', newEnterprises: 5, totalEnterprises: 121 },
  { month: '2026-02', newEnterprises: 4, totalEnterprises: 125 },
  { month: '2026-03', newEnterprises: 3, totalEnterprises: 128 },
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

// 软件发布统计
const softwareStatsData = [
  { month: '2025-10', newSoftware: 15, totalSoftware: 198 },
  { month: '2025-11', newSoftware: 22, totalSoftware: 220 },
  { month: '2025-12', newSoftware: 18, totalSoftware: 238 },
  { month: '2026-01', newSoftware: 8, totalSoftware: 246 },
  { month: '2026-02', newSoftware: 6, totalSoftware: 252 },
  { month: '2026-03', newSoftware: 4, totalSoftware: 256 },
]

// 需求对接统计
const demandStatsData = [
  { month: '2025-10', newDemands: 12, completedDemands: 8 },
  { month: '2025-11', newDemands: 18, completedDemands: 12 },
  { month: '2025-12', newDemands: 15, completedDemands: 10 },
  { month: '2026-01', newDemands: 10, completedDemands: 7 },
  { month: '2026-02', newDemands: 14, completedDemands: 9 },
  { month: '2026-03', newDemands: 20, completedDemands: 15 },
]

// 需求状态分布
const demandStatusData = [
  { status: '待处理', count: 15, percentage: 17, color: 'default' },
  { status: '对接中', count: 32, percentage: 36, color: 'processing' },
  { status: '已完成', count: 28, percentage: 31, color: 'success' },
  { status: '已关闭', count: 14, percentage: 16, color: 'default' },
]

// 需求行业分布
const demandIndustryData = [
  { industry: '汽车制造', count: 18, percentage: 20 },
  { industry: '电子信息', count: 16, percentage: 18 },
  { industry: '装备制造', count: 15, percentage: 17 },
  { industry: '化工', count: 12, percentage: 13 },
  { industry: '食品', count: 10, percentage: 11 },
  { industry: '其他', count: 18, percentage: 21 },
]

// 补贴券统计
const subsidyStatsData = [
  { month: '2025-10', applications: 25, approved: 20, amount: 280 },
  { month: '2025-11', applications: 30, approved: 26, amount: 320 },
  { month: '2025-12', applications: 35, approved: 30, amount: 450 },
  { month: '2026-01', applications: 28, approved: 24, amount: 380 },
  { month: '2026-02', applications: 32, approved: 28, amount: 420 },
  { month: '2026-03', applications: 30, approved: 25, amount: 350 },
]

// 补贴券状态分布
const subsidyStatusData = [
  { status: '待审核', count: 45, percentage: 18, color: 'warning' },
  { status: '审核中', count: 32, percentage: 13, color: 'processing' },
  { status: '审核通过', count: 98, percentage: 40, color: 'success' },
  { status: '已驳回', count: 28, percentage: 11, color: 'error' },
  { status: '已使用', count: 35, percentage: 14, color: 'blue' },
  { status: '已退还', count: 10, percentage: 4, color: 'default' },
]

// 留言统计
const messageStatsData = [
  { month: '2025-10', newMessages: 18, repliedMessages: 15 },
  { month: '2025-11', newMessages: 22, repliedMessages: 20 },
  { month: '2025-12', newMessages: 25, repliedMessages: 22 },
  { month: '2026-01', newMessages: 20, repliedMessages: 18 },
  { month: '2026-02', newMessages: 28, repliedMessages: 25 },
  { month: '2026-03', newMessages: 32, repliedMessages: 28 },
]

// 留言状态分布
const messageStatusData = [
  { status: '待处理', count: 25, percentage: 20, color: 'warning' },
  { status: '处理中', count: 18, percentage: 14, color: 'processing' },
  { status: '已回复', count: 68, percentage: 54, color: 'success' },
  { status: '已关闭', count: 15, percentage: 12, color: 'default' },
]

// 政策阅读统计
const policyStatsData = [
  { policyName: '2026年度湖北省工业软件补贴券政策', views: 1256, enterprises: 89, readRate: 70 },
  { policyName: '工业软件企业入驻优惠政策', views: 986, enterprises: 68, readRate: 53 },
  { policyName: '智能制造转型升级补贴政策', views: 856, enterprises: 62, readRate: 48 },
  { policyName: '中小企业数字化转型支持政策', views: 756, enterprises: 58, readRate: 45 },
  { policyName: '工业软件人才培养计划', views: 658, enterprises: 45, readRate: 35 },
]

export default function Statistics() {
  const [timeRange, setTimeRange] = useState('month')
  const [activeTab, setActiveTab] = useState('overview')

  const softwareColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank: number) => (
        <Text strong style={{ 
          color: rank <= 3 ? '#f5222d' : '#666',
          fontSize: rank <= 3 ? 18 : 14 
        }}>
          {rank}
        </Text>
      ),
    },
    {
      title: '软件名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '软件企业',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '销售数量',
      dataIndex: 'sales',
      key: 'sales',
      render: (sales: number) => (
        <Text style={{ color: '#1677ff' }}>{sales} 套</Text>
      ),
    },
    {
      title: '销售金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => (
        <Text strong style={{ color: '#f5222d' }}>{amount}</Text>
      ),
    },
  ]

  const policyColumns = [
    {
      title: '政策名称',
      dataIndex: 'policyName',
      key: 'policyName',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '阅读次数',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => (
        <Text style={{ color: '#1677ff' }}><EyeOutlined /> {views}</Text>
      ),
    },
    {
      title: '阅读企业数',
      dataIndex: 'enterprises',
      key: 'enterprises',
      render: (enterprises: number) => (
        <Text><TeamOutlined /> {enterprises} 家</Text>
      ),
    },
    {
      title: '阅读率',
      dataIndex: 'readRate',
      key: 'readRate',
      render: (rate: number) => (
        <Progress percent={rate} size="small" style={{ width: 100 }} />
      ),
    },
  ]

  return (
    <div>
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>报表中心</Title>
          </Col>
          <Col>
            <Space>
              <RangePicker />
              <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
                <Option value="day">按日</Option>
                <Option value="week">按周</Option>
                <Option value="month">按月</Option>
                <Option value="year">按年</Option>
              </Select>
              <Button icon={<DownloadOutlined />}>导出报表</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 概览统计 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {overviewStats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable style={{ borderRadius: 12 }}>
              <Statistic
                title={
                  <Space>
                    <span style={{ color: stat.color, fontSize: 20 }}>{stat.icon}</span>
                    <Text>{stat.title}</Text>
                  </Space>
                }
                value={stat.value}
                valueStyle={{ color: stat.color, fontSize: 28, fontWeight: 600 }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">较上期 </Text>
                {stat.trend === 'up' ? (
                  <Text style={{ color: '#52c41a' }}>
                    <RiseOutlined /> {stat.change}
                  </Text>
                ) : (
                  <Text style={{ color: '#f5222d' }}>
                    <FallOutlined /> {stat.change}
                  </Text>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 详细报表 */}
      <Card style={{ borderRadius: 12 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: '数据概览',
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="企业类型分布" style={{ borderRadius: 8 }}>
                      {enterpriseTypeData.map((item, index) => (
                        <div key={index} style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <Text>{item.type}</Text>
                            <Text strong>{item.count} 家 ({item.percentage}%)</Text>
                          </div>
                          <Progress percent={item.percentage} strokeColor={index === 0 ? '#1677ff' : '#52c41a'} />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="软件类别分布" style={{ borderRadius: 8 }}>
                      {softwareCategoryData.map((item, index) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text>{item.category}</Text>
                            <Text>{item.count} 个 ({item.percentage}%)</Text>
                          </div>
                          <Progress percent={item.percentage} size="small" />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card title="补贴发放趋势（万元）" style={{ borderRadius: 8 }}>
                      <Row gutter={[16, 16]}>
                        {subsidyTrendData.map((item, index) => (
                          <Col key={index} style={{ textAlign: 'center' }}>
                            <div style={{ 
                              height: item.amount / 5, 
                              background: '#1677ff', 
                              borderRadius: '4px 4px 0 0',
                              minHeight: 20,
                              maxHeight: 100,
                            }} />
                            <div style={{ marginTop: 8 }}>
                              <Text strong>{item.amount}</Text>
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>{item.month}</Text>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'enterprise',
              label: '企业入驻统计',
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="新增企业趋势" style={{ borderRadius: 8 }}>
                      <Table
                        dataSource={enterpriseStatsData}
                        columns={[
                          { title: '月份', dataIndex: 'month', key: 'month' },
                          { title: '新增企业', dataIndex: 'newEnterprises', key: 'newEnterprises', render: (v: number) => <Tag color="blue">+{v}</Tag> },
                          { title: '累计企业', dataIndex: 'totalEnterprises', key: 'totalEnterprises' },
                        ]}
                        pagination={false}
                        size="small"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="企业地区分布" style={{ borderRadius: 8 }}>
                      {enterpriseRegionData.map((item, index) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text>{item.region}</Text>
                            <Text strong>{item.count} 家 ({item.percentage}%)</Text>
                          </div>
                          <Progress percent={item.percentage} size="small" strokeColor="#52c41a" />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card title="企业行业分布" style={{ borderRadius: 8 }}>
                      <Row gutter={[16, 16]}>
                        {enterpriseIndustryData.map((item, index) => (
                          <Col xs={24} sm={12} md={8} lg={6} key={index}>
                            <Card size="small" style={{ textAlign: 'center' }}>
                              <Text strong style={{ fontSize: 24, color: '#1677ff' }}>{item.count}</Text>
                              <div><Text type="secondary">{item.industry}</Text></div>
                              <Progress percent={item.percentage} size="small" showInfo={false} />
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'software',
              label: '软件发布统计',
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="软件发布趋势" style={{ borderRadius: 8 }}>
                      <Table
                        dataSource={softwareStatsData}
                        columns={[
                          { title: '月份', dataIndex: 'month', key: 'month' },
                          { title: '新增软件', dataIndex: 'newSoftware', key: 'newSoftware', render: (v: number) => <Tag color="green">+{v}</Tag> },
                          { title: '累计软件', dataIndex: 'totalSoftware', key: 'totalSoftware' },
                        ]}
                        pagination={false}
                        size="small"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="软件类别分布" style={{ borderRadius: 8 }}>
                      {softwareCategoryData.map((item, index) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Text>{item.category}</Text>
                            <Text strong>{item.count} 个 ({item.percentage}%)</Text>
                          </div>
                          <Progress percent={item.percentage} size="small" strokeColor="#faad14" />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card title="热销软件排行" style={{ borderRadius: 8 }}>
                      <Table
                        columns={softwareColumns}
                        dataSource={topSoftwareData}
                        rowKey="rank"
                        pagination={false}
                      />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'demand',
              label: '需求对接统计',
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="需求发布趋势" style={{ borderRadius: 8 }}>
                      <Table
                        dataSource={demandStatsData}
                        columns={[
                          { title: '月份', dataIndex: 'month', key: 'month' },
                          { title: '新增需求', dataIndex: 'newDemands', key: 'newDemands', render: (v: number) => <Tag color="blue">+{v}</Tag> },
                          { title: '完成需求', dataIndex: 'completedDemands', key: 'completedDemands', render: (v: number) => <Tag color="green">{v}</Tag> },
                        ]}
                        pagination={false}
                        size="small"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="需求状态分布" style={{ borderRadius: 8 }}>
                      {demandStatusData.map((item, index) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Tag color={item.color}>{item.status}</Tag>
                            <Text strong>{item.count} 个 ({item.percentage}%)</Text>
                          </div>
                          <Progress percent={item.percentage} size="small" />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card title="需求行业分布" style={{ borderRadius: 8 }}>
                      <Row gutter={[16, 16]}>
                        {demandIndustryData.map((item, index) => (
                          <Col xs={24} sm={12} md={8} lg={6} key={index}>
                            <Card size="small" style={{ textAlign: 'center' }}>
                              <Text strong style={{ fontSize: 24, color: '#eb2f96' }}>{item.count}</Text>
                              <div><Text type="secondary">{item.industry}</Text></div>
                              <Progress percent={item.percentage} size="small" showInfo={false} strokeColor="#eb2f96" />
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'subsidy',
              label: '补贴券统计',
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="补贴申报趋势" style={{ borderRadius: 8 }}>
                      <Table
                        dataSource={subsidyStatsData}
                        columns={[
                          { title: '月份', dataIndex: 'month', key: 'month' },
                          { title: '申报数', dataIndex: 'applications', key: 'applications' },
                          { title: '通过数', dataIndex: 'approved', key: 'approved', render: (v: number) => <Tag color="green">{v}</Tag> },
                          { title: '金额(万)', dataIndex: 'amount', key: 'amount', render: (v: number) => <Text strong style={{ color: '#f5222d' }}>{v}</Text> },
                        ]}
                        pagination={false}
                        size="small"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="补贴券状态分布" style={{ borderRadius: 8 }}>
                      {subsidyStatusData.map((item, index) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Tag color={item.color}>{item.status}</Tag>
                            <Text strong>{item.count} 个 ({item.percentage}%)</Text>
                          </div>
                          <Progress percent={item.percentage} size="small" />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card title="补贴发放趋势（万元）" style={{ borderRadius: 8 }}>
                      <Row gutter={[16, 16]}>
                        {subsidyTrendData.map((item, index) => (
                          <Col key={index} style={{ textAlign: 'center' }}>
                            <div style={{ 
                              height: item.amount / 5, 
                              background: '#eb2f96', 
                              borderRadius: '4px 4px 0 0',
                              minHeight: 20,
                              maxHeight: 100,
                            }} />
                            <div style={{ marginTop: 8 }}>
                              <Text strong>{item.amount}</Text>
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>{item.month}</Text>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'message',
              label: '留言统计',
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card title="留言处理趋势" style={{ borderRadius: 8 }}>
                      <Table
                        dataSource={messageStatsData}
                        columns={[
                          { title: '月份', dataIndex: 'month', key: 'month' },
                          { title: '新增留言', dataIndex: 'newMessages', key: 'newMessages', render: (v: number) => <Tag color="blue">+{v}</Tag> },
                          { title: '已回复', dataIndex: 'repliedMessages', key: 'repliedMessages', render: (v: number) => <Tag color="green">{v}</Tag> },
                        ]}
                        pagination={false}
                        size="small"
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="留言状态分布" style={{ borderRadius: 8 }}>
                      {messageStatusData.map((item, index) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Tag color={item.color}>{item.status}</Tag>
                            <Text strong>{item.count} 条 ({item.percentage}%)</Text>
                          </div>
                          <Progress percent={item.percentage} size="small" />
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col xs={24}>
                    <Card title="留言处理时效" style={{ borderRadius: 8, background: 'var(--bg-card)' }}>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8}>
                          <Card size="small" style={{ textAlign: 'center', background: 'var(--brand-success-bg)' }}>
                            <CheckCircleOutlined style={{ fontSize: 32, color: 'var(--brand-success)' }} />
                            <div style={{ marginTop: 8 }}>
                              <Text strong style={{ fontSize: 24, color: 'var(--brand-success)' }}>85%</Text>
                            </div>
                            <Text style={{ color: 'var(--text-secondary)' }}>24小时内回复</Text>
                          </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Card size="small" style={{ textAlign: 'center', background: 'var(--brand-warning-bg)' }}>
                            <ClockCircleOutlined style={{ fontSize: 32, color: 'var(--brand-warning)' }} />
                            <div style={{ marginTop: 8 }}>
                              <Text strong style={{ fontSize: 24, color: 'var(--brand-warning)' }}>12%</Text>
                            </div>
                            <Text style={{ color: 'var(--text-secondary)' }}>48小时内回复</Text>
                          </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Card size="small" style={{ textAlign: 'center', background: 'var(--brand-error-bg)' }}>
                            <CloseCircleOutlined style={{ fontSize: 32, color: 'var(--brand-error)' }} />
                            <div style={{ marginTop: 8 }}>
                              <Text strong style={{ fontSize: 24, color: 'var(--brand-error)' }}>3%</Text>
                            </div>
                            <Text style={{ color: 'var(--text-secondary)' }}>超过48小时</Text>
                          </Card>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'policy',
              label: '政策阅读统计',
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24}>
                    <Card title="政策阅读排行" style={{ borderRadius: 8 }}>
                      <Table
                        columns={policyColumns}
                        dataSource={policyStatsData}
                        rowKey="policyName"
                        pagination={false}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="政策类型分布" style={{ borderRadius: 8 }}>
                      <Row gutter={[16, 16]}>
                        <Col xs={12}>
                          <Card size="small" style={{ textAlign: 'center' }}>
                            <DollarOutlined style={{ fontSize: 32, color: '#eb2f96' }} />
                            <div style={{ marginTop: 8 }}>
                              <Text strong style={{ fontSize: 24 }}>12</Text>
                            </div>
                            <Text type="secondary">补贴政策</Text>
                          </Card>
                        </Col>
                        <Col xs={12}>
                          <Card size="small" style={{ textAlign: 'center' }}>
                            <ShopOutlined style={{ fontSize: 32, color: '#1677ff' }} />
                            <div style={{ marginTop: 8 }}>
                              <Text strong style={{ fontSize: 24 }}>8</Text>
                            </div>
                            <Text type="secondary">入驻政策</Text>
                          </Card>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="政策阅读趋势" style={{ borderRadius: 8 }}>
                      <div style={{ textAlign: 'center', padding: 20 }}>
                        <LineChartOutlined style={{ fontSize: 48, color: '#1677ff' }} />
                        <Text style={{ display: 'block', marginTop: 16 }}>政策阅读量逐月增长 15%</Text>
                      </div>
                    </Card>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}
