import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Row,
  Col,
  message,
  Modal,
  Descriptions,
  Badge,
  Typography,
  DatePicker,
  Tooltip,
  Avatar,
} from 'antd'
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  FilterOutlined,
  CalendarOutlined,
  DollarOutlined,
  TagOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  PhoneOutlined,
  UserOutlined,
  BuildOutlined,
} from '@ant-design/icons'
import type { RangePickerProps } from 'antd/es/date-picker'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker
const { Title, Text } = Typography

// 需求对接状态码（与PRD一致）
// 0: 待处理, 1: 处理中, 2: 已处理, 3: 已关闭
const DEMAND_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  PROCESSED: 2,
  CLOSED: 3,
}

// 需求状态
const demandStatuses = [
  { value: DEMAND_STATUS.PENDING, label: '待处理', color: 'default', bgColor: '#fff2f0', borderColor: '#ffccc7', icon: <ClockCircleOutlined /> },
  { value: DEMAND_STATUS.PROCESSING, label: '对接中', color: 'processing', bgColor: '#e6f4ff', borderColor: '#91caff', icon: <FileTextOutlined /> },
  { value: DEMAND_STATUS.PROCESSED, label: '已完成', color: 'success', bgColor: '#f6ffed', borderColor: '#b7eb8f', icon: <CheckCircleOutlined /> },
  { value: DEMAND_STATUS.CLOSED, label: '已关闭', color: 'default', bgColor: '#f5f5f5', borderColor: '#d9d9d9', icon: <CloseCircleOutlined /> },
]

// 行业列表
const industries = [
  '汽车制造',
  '电子信息',
  '装备制造',
  '钢铁冶金',
  '化工材料',
  '食品饮料',
  '纺织服装',
  '其他',
]

// 模拟需求数据
const demandList = [
  {
    id: 1,
    title: '寻求MES系统供应商',
    enterpriseName: '武汉钢铁集团',
    enterpriseType: 'demand',
    industry: '钢铁冶金',
    softwareName: '智能制造MES系统',
    softwareCompany: '湖北智造科技',
    category: 'MES系统',
    budget: '50-100万',
    status: DEMAND_STATUS.PENDING,
    urgency: 'urgent',
    isPublic: true,
    createTime: '2026-03-10 14:30',
    contactName: '张经理',
    contactPhone: '138****1234',
    description: '我们需要一套MES系统来实现生产过程的数字化管理，包括生产调度、质量管理、设备管理等功能模块。',
    technicalRequirements: '需要支持与现有ERP系统的数据对接，提供标准API接口。',
  },
  {
    id: 2,
    title: '工业数据采集平台开发',
    enterpriseName: '襄阳汽车零部件',
    enterpriseType: 'demand',
    industry: '汽车制造',
    softwareName: '工业物联网平台',
    softwareCompany: '宜昌智联科技',
    category: '物联网',
    budget: '30-50万',
    status: DEMAND_STATUS.PROCESSING,
    urgency: 'normal',
    isPublic: true,
    createTime: '2026-03-09 10:15',
    contactName: '李总',
    contactPhone: '139****5678',
    description: '希望建设工业数据采集平台，实现车间设备的实时数据采集和监控。',
    technicalRequirements: '支持Modbus、OPC UA等工业协议，数据存储至少保留3年。',
  },
  {
    id: 3,
    title: 'ERP系统升级服务',
    enterpriseName: '宜昌化工集团',
    enterpriseType: 'demand',
    industry: '化工材料',
    softwareName: '企业资源ERP系统',
    softwareCompany: '武汉云智软件',
    category: 'ERP系统',
    budget: '20-30万',
    status: DEMAND_STATUS.PROCESSED,
    urgency: 'normal',
    isPublic: false,
    createTime: '2026-03-08 11:20',
    contactName: '王工',
    contactPhone: '137****9012',
    description: '现有ERP系统版本较老，需要进行升级改造。',
    technicalRequirements: '保持现有数据完整性，支持新财税政策。',
    handleResult: '已对接武汉云智软件，预计4月初开始实施。',
    handleTime: '2026-03-09 16:30',
  },
  {
    id: 4,
    title: 'PLM系统选型咨询',
    enterpriseName: '黄石机械制造',
    enterpriseType: 'demand',
    industry: '装备制造',
    softwareName: '产品生命周期PLM',
    softwareCompany: '襄阳创新科技',
    category: 'PLM系统',
    budget: '100-500万',
    status: DEMAND_STATUS.CLOSED,
    urgency: 'planning',
    isPublic: true,
    createTime: '2026-03-05 09:00',
    contactName: '赵经理',
    contactPhone: '136****3456',
    description: '了解PLM系统的功能和实施周期，为明年项目做规划。',
    technicalRequirements: '需要支持三维设计软件集成。',
    closeReason: '企业暂时搁置项目，预计明年重新启动。',
    closeTime: '2026-03-06 10:00',
  },
  {
    id: 5,
    title: '设备数据采集方案咨询',
    enterpriseName: '荆州电子科技',
    enterpriseType: 'demand',
    industry: '电子信息',
    softwareName: '工业物联网平台',
    softwareCompany: '宜昌智联科技',
    category: '物联网',
    budget: '30-50万',
    status: DEMAND_STATUS.PENDING,
    urgency: 'urgent',
    isPublic: true,
    createTime: '2026-03-12 15:45',
    contactName: '陈工',
    contactPhone: '135****7890',
    description: '车间有50台老旧设备，想进行数据采集改造。',
    technicalRequirements: '需要支持老旧设备的通信协议转换。',
  },
]

const DemandSummary = () => {
  const [status, setStatus] = useState('all')
  const [industry, setIndustry] = useState('all')
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedDemand, setSelectedDemand] = useState<any>(null)
  const [handleModalVisible, setHandleModalVisible] = useState(false)

  // 统计数据
  const stats = {
    pending: demandList.filter(d => d.status === DEMAND_STATUS.PENDING).length,
    in_progress: demandList.filter(d => d.status === DEMAND_STATUS.PROCESSING).length,
    finished: demandList.filter(d => d.status === DEMAND_STATUS.PROCESSED).length,
    total: demandList.length,
  }

  const getStatusTag = (status: number) => {
    const statusInfo = demandStatuses.find(s => s.value === status)
    if (!statusInfo) return null
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 6,
        background: statusInfo.bgColor,
        border: `1px solid ${statusInfo.borderColor}`,
        fontSize: 13,
        fontWeight: 500,
        color: statusInfo.color === 'success' ? '#52c41a' : statusInfo.color === 'processing' ? '#1677ff' : '#666',
      }}>
        {statusInfo.icon}
        <span>{statusInfo.label}</span>
      </div>
    )
  }

  const getUrgencyTag = (urgency: string) => {
    const config: Record<string, { color: string; bg: string; border: string; label: string }> = {
      urgent: { color: '#ff4d4f', bg: '#fff2f0', border: '#ffccc7', label: '紧急' },
      normal: { color: '#1677ff', bg: '#e6f4ff', border: '#91caff', label: '一般' },
      planning: { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f', label: '长期规划' },
    }
    const cfg = config[urgency] || config.normal
    return (
      <Tag style={{
        background: cfg.bg,
        borderColor: cfg.border,
        color: cfg.color,
        borderRadius: 4,
        fontWeight: 500,
      }}>
        {cfg.label}
      </Tag>
    )
  }

  const columns = [
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined style={{ color: '#1677ff', fontSize: 16 }} />
          <Text strong style={{ color: '#1f2937', fontSize: 14 }}>{text}</Text>
        </div>
      ),
    },
    {
      title: '企业信息',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={2}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Avatar size="small" icon={<BuildOutlined />} style={{ background: '#1677ff' }} />
            <Text strong style={{ color: '#1f2937' }}>{text}</Text>
          </div>
          <Tag color="blue" style={{ borderRadius: 4, fontSize: 11, margin: 0 }}>{record.industry}</Tag>
        </Space>
      ),
    },
    {
      title: '意向软件',
      dataIndex: 'softwareName',
      key: 'softwareName',
      render: (text: string, record: any) => (
        <Space direction="vertical" size={2}>
          <Text strong style={{ color: '#1677ff' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.softwareCompany}</Text>
        </Space>
      ),
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <DollarOutlined style={{ color: '#faad14' }} />
          <Text strong style={{ color: '#faad14' }}>{text}</Text>
        </div>
      ),
    },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      render: (urgency: string) => getUrgencyTag(urgency),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CalendarOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
          <Text type="secondary" style={{ fontSize: 13 }}>{text}</Text>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
              style={{ borderRadius: 6 }}
            >
              查看
            </Button>
          </Tooltip>
          {record.status !== DEMAND_STATUS.CLOSED && record.status !== DEMAND_STATUS.PROCESSED && (
            <Tooltip title="关闭需求">
              <Button
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleClose(record)}
                style={{ borderRadius: 6 }}
              >
                关闭
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  const handleViewDetail = (record: any) => {
    setSelectedDemand(record)
    setDetailModalVisible(true)
  }

  const handleProcess = (record: any) => {
    setSelectedDemand(record)
    setHandleModalVisible(true)
  }

  const handleClose = (record: any) => {
    message.success(`需求「${record.title}」已关闭`)
  }

  const handleProcessSubmit = () => {
    message.success('处理结果已保存')
    setHandleModalVisible(false)
  }

  // 统计卡片样式
  const statCardStyle = (color: string, bgColor: string) => ({
    borderRadius: 16,
    border: 'none',
    background: bgColor,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  })

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
                需求汇总
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>查看和管理所有企业发布的需求信息</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={statCardStyle('#ff4d4f', 'linear-gradient(135deg, #fff2f0 0%, #fff5f5 100%)')} bodyStyle={{ padding: '20px 24px' }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>待处理</Text>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#ff4d4f15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: '#ff4d4f',
                }}><ClockCircleOutlined /></div>
              </Space>
              <Text style={{ fontSize: 32, fontWeight: 700, color: '#ff4d4f', lineHeight: 1.2 }}>{stats.pending}</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={statCardStyle('#1677ff', 'linear-gradient(135deg, #e6f4ff 0%, #f0f7ff 100%)')} bodyStyle={{ padding: '20px 24px' }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>对接中</Text>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#1677ff15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: '#1677ff',
                }}><FileTextOutlined /></div>
              </Space>
              <Text style={{ fontSize: 32, fontWeight: 700, color: '#1677ff', lineHeight: 1.2 }}>{stats.in_progress}</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={statCardStyle('#52c41a', 'linear-gradient(135deg, #f6ffed 0%, #f0fff0 100%)')} bodyStyle={{ padding: '20px 24px' }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>已完成</Text>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#52c41a15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: '#52c41a',
                }}><CheckCircleOutlined /></div>
              </Space>
              <Text style={{ fontSize: 32, fontWeight: 700, color: '#52c41a', lineHeight: 1.2 }}>{stats.finished}</Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={statCardStyle('#722ed1', 'linear-gradient(135deg, #f9f0ff 0%, #faf5ff 100%)')} bodyStyle={{ padding: '20px 24px' }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>需求总数</Text>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#722ed115',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: '#722ed1',
                }}><BarChartOutlined /></div>
              </Space>
              <Text style={{ fontSize: 32, fontWeight: 700, color: '#722ed1', lineHeight: 1.2 }}>{stats.total}</Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          borderRadius: 16,
          border: '1px solid #e8ecef',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden'
        }}
        title={
          <Space>
            <FilterOutlined style={{ color: '#1677ff' }} />
            <Text strong style={{ fontSize: 16, color: '#1f2937' }}>需求列表</Text>
          </Space>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Search
              placeholder="搜索需求标题或企业名称"
              allowClear
              enterButton={<><SearchOutlined /> 搜索</>}
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Select
              value={status}
              onChange={setStatus}
              style={{ width: '100%', borderRadius: 8 }}
              placeholder="选择状态"
            >
              <Option value="all">全部状态</Option>
              {demandStatuses.map(s => (
                <Option key={s.value} value={s.value}>{s.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Select
              value={industry}
              onChange={setIndustry}
              style={{ width: '100%', borderRadius: 8 }}
              placeholder="选择行业"
            >
              <Option value="all">全部行业</Option>
              {industries.map(i => (
                <Option key={i} value={i}>{i}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <RangePicker style={{ width: '100%', borderRadius: 8 }} placeholder={['开始日期', '结束日期']} />
          </Col>
          <Col xs={24} sm={12} lg={3}>
            <Button icon={<ReloadOutlined />} style={{ width: '100%', borderRadius: 8 }}>
              刷新
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={demandList}
          rowKey="id"
          pagination={{
            total: demandList.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          style={{
            '.ant-table-thead > tr > th': {
              background: '#fafbfc',
              fontWeight: 600,
              color: '#1f2937',
            }
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space>
            <FileTextOutlined style={{ color: '#1677ff' }} />
            <Text strong style={{ fontSize: 16 }}>需求详情</Text>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)} style={{ borderRadius: 6 }}>
            关闭
          </Button>,
        ]}
        width={720}
        bodyStyle={{ padding: '24px' }}
      >
        {selectedDemand && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* 头部信息 */}
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f0f7ff 100%)',
              borderRadius: 12,
              border: '1px solid #e8ecef',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <Avatar size={48} icon={<BuildOutlined />} style={{ background: '#1677ff' }} />
                <div style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: 18, color: '#1f2937', display: 'block', marginBottom: 8 }}>
                    {selectedDemand.title}
                  </Text>
                  <Space size={12}>
                    {getStatusTag(selectedDemand.status)}
                    {getUrgencyTag(selectedDemand.urgency)}
                    <Tag color={selectedDemand.isPublic ? 'green' : 'default'} style={{ borderRadius: 4 }}>
                      {selectedDemand.isPublic ? '公开' : '私密'}
                    </Tag>
                  </Space>
                </div>
              </div>
            </div>

            {/* 企业信息 */}
            <div>
              <Text strong style={{ fontSize: 14, color: '#1f2937', display: 'block', marginBottom: 12 }}>
                <BuildOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                企业信息
              </Text>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div style={{ padding: '12px 16px', background: '#fafbfc', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>企业名称</Text>
                    <Text strong style={{ color: '#1f2937' }}>{selectedDemand.enterpriseName}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ padding: '12px 16px', background: '#fafbfc', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>所属行业</Text>
                    <Tag color="blue" style={{ borderRadius: 4 }}>{selectedDemand.industry}</Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ padding: '12px 16px', background: '#fafbfc', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>联系人</Text>
                    <Space>
                      <UserOutlined style={{ color: '#8c8c8c' }} />
                      <Text strong>{selectedDemand.contactName}</Text>
                    </Space>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ padding: '12px 16px', background: '#fafbfc', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>联系电话</Text>
                    <Space>
                      <PhoneOutlined style={{ color: '#8c8c8c' }} />
                      <Text strong>{selectedDemand.contactPhone}</Text>
                    </Space>
                  </div>
                </Col>
              </Row>
            </div>

            {/* 意向软件 */}
            <div>
              <Text strong style={{ fontSize: 14, color: '#1f2937', display: 'block', marginBottom: 12 }}>
                <TagOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                意向软件
              </Text>
              <Row gutter={[16, 12]}>
                <Col span={12}>
                  <div style={{ padding: '12px 16px', background: '#fafbfc', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>软件名称</Text>
                    <Text strong style={{ color: '#1677ff' }}>{selectedDemand.softwareName}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ padding: '12px 16px', background: '#fafbfc', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>软件企业</Text>
                    <Text strong>{selectedDemand.softwareCompany}</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ padding: '12px 16px', background: '#fafbfc', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>产品类型</Text>
                    <Tag color="cyan" style={{ borderRadius: 4 }}>{selectedDemand.category}</Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ padding: '12px 16px', background: '#fafbfc', borderRadius: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>预算范围</Text>
                    <Space>
                      <DollarOutlined style={{ color: '#faad14' }} />
                      <Text strong style={{ color: '#faad14' }}>{selectedDemand.budget}</Text>
                    </Space>
                  </div>
                </Col>
              </Row>
            </div>

            {/* 需求详情 */}
            <div>
              <Text strong style={{ fontSize: 14, color: '#1f2937', display: 'block', marginBottom: 12 }}>
                <FileTextOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                需求描述
              </Text>
              <div style={{
                padding: '16px',
                background: '#fafbfc',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                lineHeight: 1.8,
              }}>
                <Text>{selectedDemand.description}</Text>
              </div>
            </div>

            {/* 技术要求 */}
            <div>
              <Text strong style={{ fontSize: 14, color: '#1f2937', display: 'block', marginBottom: 12 }}>
                <ExclamationCircleOutlined style={{ marginRight: 8, color: '#1677ff' }} />
                技术要求
              </Text>
              <div style={{
                padding: '16px',
                background: '#fafbfc',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                lineHeight: 1.8,
              }}>
                <Text>{selectedDemand.technicalRequirements || '无'}</Text>
              </div>
            </div>

            {/* 处理信息 */}
            {selectedDemand.handleResult && (
              <div>
                <Text strong style={{ fontSize: 14, color: '#1f2937', display: 'block', marginBottom: 12 }}>
                  <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                  处理结果
                </Text>
                <div style={{
                  padding: '16px',
                  background: '#f6ffed',
                  borderRadius: 8,
                  border: '1px solid #b7eb8f',
                  lineHeight: 1.8,
                }}>
                  <Text>{selectedDemand.handleResult}</Text>
                  {selectedDemand.handleTime && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #b7eb8f' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>处理时间：{selectedDemand.handleTime}</Text>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 关闭原因 */}
            {selectedDemand.closeReason && (
              <div>
                <Text strong style={{ fontSize: 14, color: '#1f2937', display: 'block', marginBottom: 12 }}>
                  <CloseCircleOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
                  关闭原因
                </Text>
                <div style={{
                  padding: '16px',
                  background: '#fff2f0',
                  borderRadius: 8,
                  border: '1px solid #ffccc7',
                  lineHeight: 1.8,
                }}>
                  <Text>{selectedDemand.closeReason}</Text>
                  {selectedDemand.closeTime && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #ffccc7' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>关闭时间：{selectedDemand.closeTime}</Text>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 提交时间 */}
            <div style={{
              padding: '12px 16px',
              background: '#f5f5f5',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <CalendarOutlined style={{ color: '#8c8c8c' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>提交时间：{selectedDemand.createTime}</Text>
            </div>
          </div>
        )}
      </Modal>

      {/* 处理弹窗 */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <Text strong style={{ fontSize: 16 }}>处理需求</Text>
          </Space>
        }
        open={handleModalVisible}
        onCancel={() => setHandleModalVisible(false)}
        onOk={handleProcessSubmit}
        okText="保存"
        cancelText="取消"
        width={600}
        bodyStyle={{ padding: '24px' }}
      >
        {selectedDemand && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f0f7ff 100%)',
              borderRadius: 12,
              border: '1px solid #e8ecef',
            }}>
              <Text strong style={{ fontSize: 16, color: '#1f2937', display: 'block', marginBottom: 8 }}>
                {selectedDemand.title}
              </Text>
              <Space size={16}>
                <Space>
                  <BuildOutlined style={{ color: '#8c8c8c' }} />
                  <Text type="secondary">{selectedDemand.enterpriseName}</Text>
                </Space>
                <Space>
                  <TagOutlined style={{ color: '#8c8c8c' }} />
                  <Text type="secondary">{selectedDemand.softwareName}</Text>
                </Space>
              </Space>
            </div>
            <div>
              <Text strong style={{ fontSize: 14, color: '#1f2937', display: 'block', marginBottom: 8 }}>
                处理结果
              </Text>
              <Input.TextArea
                rows={4}
                placeholder="请输入处理结果..."
                style={{ borderRadius: 8 }}
              />
            </div>
            <div>
              <Text strong style={{ fontSize: 14, color: '#1f2937', display: 'block', marginBottom: 8 }}>
                后续安排
              </Text>
              <Input.TextArea
                rows={3}
                placeholder="请输入后续安排（选填）..."
                style={{ borderRadius: 8 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DemandSummary
