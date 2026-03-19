import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Popconfirm,
  Modal,
  Form,
  Upload,
  Steps,
  Radio,
  DatePicker,
  List,
  Avatar,
  Typography,
  Divider,
  Statistic,
  Badge,
  Tooltip,
  Progress,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  DownloadOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined as ArrowLeftOutlinedIcon,
  CheckCircleOutlined,
  FileTextOutlined,
  FileAddOutlined,
  ClockCircleOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  EyeFilled,
  BarChartOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'

const { Search } = Input
const { Option } = Select
const { TextArea } = Input
const { Title, Text } = Typography

// 需求对接状态码（与PRD一致）
// 0: 待处理, 1: 处理中, 2: 已处理, 3: 已关闭
const DEMAND_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  PROCESSED: 2,
  CLOSED: 3,
}

// 软件产品列表（模拟数据）
const softwareProducts = [
  {
    id: 1,
    name: '智能制造MES系统',
    company: '湖北智造科技',
    category: 'MES系统',
    price: '50-100万',
    description: '面向离散制造的MES系统，支持生产调度、质量管理、设备管理等功能',
    logo: '🏭',
  },
  {
    id: 2,
    name: '企业资源ERP系统',
    company: '武汉云智软件',
    category: 'ERP系统',
    price: '10-50万',
    description: '集成财务、采购、销售、库存等模块的企业资源计划系统',
    logo: '📊',
  },
  {
    id: 3,
    name: '产品生命周期PLM',
    company: '襄阳创新科技',
    category: 'PLM系统',
    price: '100-500万',
    description: '支持产品全生命周期管理，包括设计、工艺、制造、服务',
    logo: '🔄',
  },
  {
    id: 4,
    name: '工业物联网平台',
    company: '宜昌智联科技',
    category: '物联网',
    price: '30-80万',
    description: '设备数据采集、远程监控、预测性维护一体化平台',
    logo: '📡',
  },
  {
    id: 5,
    name: '智能仓储WMS',
    company: '黄石物流科技',
    category: 'WMS系统',
    price: '20-60万',
    description: '智能仓储管理系统，支持AGV调度、库存优化、波次拣货',
    logo: '📦',
  },
]

// 需求类型
const requirementTypes = [
  { value: 'new', label: '新建系统', color: '#1890ff', bg: '#e6f7ff' },
  { value: 'upgrade', label: '系统升级', color: '#52c41a', bg: '#f6ffed' },
  { value: 'integration', label: '系统集成', color: '#faad14', bg: '#fffbe6' },
  { value: 'custom', label: '定制开发', color: '#722ed1', bg: '#f9f0ff' },
]

// 预算范围
const budgetRanges = [
  { value: '10w', label: '10万以下' },
  { value: '10-50w', label: '10-50万' },
  { value: '50-100w', label: '50-100万' },
  { value: '100-500w', label: '100-500万' },
  { value: '500w+', label: '500万以上' },
]

// 期望上线时间
const expectedTimes = [
  { value: '1m', label: '1个月内' },
  { value: '3m', label: '3个月内' },
  { value: '6m', label: '6个月内' },
  { value: '1y', label: '1年内' },
  { value: '1y+', label: '1年以上' },
]

// 紧急程度
const urgencyLevels = [
  { value: 'urgent', label: '紧急', color: '#ff4d4f', bg: '#fff1f0' },
  { value: 'normal', label: '一般', color: '#1890ff', bg: '#e6f7ff' },
  { value: 'planning', label: '长期规划', color: '#52c41a', bg: '#f6ffed' },
]

// 扩展需求列表数据
const demandList = [
  {
    id: 1,
    title: '寻求MES系统供应商',
    softwareName: '智能制造MES系统',
    softwareCompany: '湖北智造科技',
    category: 'MES系统',
    budget: '50-100万',
    status: DEMAND_STATUS.PENDING,
    publishDate: '2026-03-10',
    views: 128,
    responses: 5,
    requirementType: 'new',
    urgency: 'urgent',
  },
  {
    id: 2,
    title: '工业数据采集平台开发',
    softwareName: '工业物联网平台',
    softwareCompany: '宜昌智联科技',
    category: '物联网',
    budget: '30-50万',
    status: DEMAND_STATUS.PROCESSING,
    publishDate: '2026-03-08',
    views: 96,
    responses: 3,
    requirementType: 'custom',
    urgency: 'normal',
  },
  {
    id: 3,
    title: 'ERP系统升级服务',
    softwareName: '企业资源ERP系统',
    softwareCompany: '武汉云智软件',
    category: 'ERP系统',
    budget: '20-30万',
    status: DEMAND_STATUS.PROCESSED,
    publishDate: '2026-03-05',
    views: 156,
    responses: 8,
    requirementType: 'upgrade',
    urgency: 'planning',
  },
  {
    id: 4,
    title: '智能仓储管理系统',
    softwareName: '智能仓储WMS',
    softwareCompany: '黄石物流科技',
    category: 'WMS系统',
    budget: '40-80万',
    status: DEMAND_STATUS.CLOSED,
    publishDate: '2026-03-01',
    views: 89,
    responses: 2,
    requirementType: 'new',
    urgency: 'normal',
  },
  {
    id: 5,
    title: 'PLM产品生命周期管理',
    softwareName: '产品生命周期PLM',
    softwareCompany: '襄阳创新科技',
    category: 'PLM系统',
    budget: '100-200万',
    status: DEMAND_STATUS.PENDING,
    publishDate: '2026-02-28',
    views: 234,
    responses: 12,
    requirementType: 'integration',
    urgency: 'urgent',
  },
]

const MyDemands = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedSoftware, setSelectedSoftware] = useState<any>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  // 计算统计数据
  const stats = {
    total: demandList.length,
    pending: demandList.filter(d => d.status === DEMAND_STATUS.PENDING).length,
    processing: demandList.filter(d => d.status === DEMAND_STATUS.PROCESSING).length,
    processed: demandList.filter(d => d.status === DEMAND_STATUS.PROCESSED).length,
    closed: demandList.filter(d => d.status === DEMAND_STATUS.CLOSED).length,
    totalViews: demandList.reduce((sum, d) => sum + d.views, 0),
    totalResponses: demandList.reduce((sum, d) => sum + d.responses, 0),
  }

  // 获取状态标签
  const getStatusTag = (status: number) => {
    const statusConfig = {
      [DEMAND_STATUS.PENDING]: { color: '#faad14', bg: '#fffbe6', icon: <ClockCircleOutlined />, text: '待处理' },
      [DEMAND_STATUS.PROCESSING]: { color: '#1890ff', bg: '#e6f7ff', icon: <CheckCircleOutlined />, text: '对接中' },
      [DEMAND_STATUS.PROCESSED]: { color: '#52c41a', bg: '#f6ffed', icon: <CheckSquareOutlined />, text: '已完成' },
      [DEMAND_STATUS.CLOSED]: { color: '#8c8c8c', bg: '#f5f5f5', icon: <CloseCircleOutlined />, text: '已关闭' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig[DEMAND_STATUS.PENDING]
    return (
      <Tag
        style={{
          borderRadius: 6,
          background: config.bg,
          border: `1px solid ${config.color}40`,
          color: config.color,
          fontWeight: 500,
          padding: '4px 12px',
        }}
        icon={config.icon}
      >
        {config.text}
      </Tag>
    )
  }

  // 获取需求类型标签
  const getTypeTag = (type: string) => {
    const typeInfo = requirementTypes.find(t => t.value === type)
    if (!typeInfo) return <Tag>{type}</Tag>
    return (
      <Tag
        style={{
          borderRadius: 6,
          background: typeInfo.bg,
          border: `1px solid ${typeInfo.color}40`,
          color: typeInfo.color,
          fontWeight: 500,
          padding: '4px 12px',
        }}
      >
        {typeInfo.label}
      </Tag>
    )
  }

  // 获取紧急程度标签
  const getUrgencyTag = (urgency: string) => {
    const urgencyInfo = urgencyLevels.find(u => u.value === urgency)
    if (!urgencyInfo) return <Tag>{urgency}</Tag>
    return (
      <Tag
        style={{
          borderRadius: 6,
          background: urgencyInfo.bg,
          border: `1px solid ${urgencyInfo.color}40`,
          color: urgencyInfo.color,
          fontWeight: 500,
          padding: '4px 12px',
        }}
      >
        {urgencyInfo.label}
      </Tag>
    )
  }

  // 表格列定义
  const columns = [
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            <FileTextOutlined style={{ color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>
              {text}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              ID: {record.id.toString().padStart(6, '0')}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '意向软件',
      dataIndex: 'softwareName',
      key: 'softwareName',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{record.softwareCompany}</div>
        </div>
      ),
    },
    {
      title: '类型/紧急度',
      key: 'typeUrgency',
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          {getTypeTag(record.requirementType)}
          {getUrgencyTag(record.urgency)}
        </Space>
      ),
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget: string) => (
        <div style={{ fontWeight: 600, color: '#f5222d', fontSize: 14 }}>
          {budget}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '发布/浏览',
      key: 'publishInfo',
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {record.publishDate}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            <EyeFilled style={{ marginRight: 4 }} />
            {record.views} 次浏览
          </div>
        </div>
      ),
    },
    {
      title: '响应',
      key: 'responses',
      render: (_: any, record: any) => (
        <Tooltip title={`${record.responses} 家供应商响应`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge count={record.responses} style={{ backgroundColor: '#52c41a' }} />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>家响应</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            style={{ color: 'var(--brand-primary)' }}
          >
            查看
          </Button>
          {record.status === DEMAND_STATUS.PENDING && (
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              style={{ color: '#faad14' }}
            >
              编辑
            </Button>
          )}
          {record.status !== DEMAND_STATUS.PROCESSED && (
            <Popconfirm
              title="确定关闭该需求？"
              onConfirm={() => message.success('需求已关闭')}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              >
                关闭
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  const steps = [
    { title: '选择软件', description: '选择意向软件产品' },
    { title: '填写需求', description: '填写详细需求信息' },
    { title: '提交审核', description: '确认并提交需求' },
  ]

  const handleNext = () => {
    if (currentStep === 0 && !selectedSoftware) {
      message.error('请先选择一个软件产品')
      return
    }
    if (currentStep === 1) {
      form.validateFields().then(() => {
        setCurrentStep(currentStep + 1)
      }).catch(() => {
        message.error('请完善需求信息')
      })
      return
    }
    setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    message.success('需求提交成功，平台将尽快处理')
    setIsModalOpen(false)
    setCurrentStep(0)
    setSelectedSoftware(null)
    form.resetFields()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setCurrentStep(0)
    setSelectedSoftware(null)
    form.resetFields()
  }

  // 步骤1：选择软件产品
  const renderStep1 = () => (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Search
          placeholder="搜索软件产品"
          allowClear
          style={{ width: 320 }}
          prefix={<SearchOutlined style={{ color: 'var(--text-tertiary)' }} />}
        />
      </div>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
        dataSource={softwareProducts}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              onClick={() => setSelectedSoftware(item)}
              style={{
                borderRadius: 16,
                border: selectedSoftware?.id === item.id ? '2px solid #1890ff' : '1px solid var(--border-light)',
                background: selectedSoftware?.id === item.id ? '#e6f7ff' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedSoftware?.id === item.id ? '0 4px 12px rgba(24, 144, 255, 0.15)' : 'var(--shadow-sm)',
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <Avatar
                  size={56}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '28px',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  {item.logo}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px', color: 'var(--text-primary)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {item.company}
                  </div>
                  <Tag
                    style={{
                      borderRadius: 6,
                      background: '#e6f7ff',
                      border: '1px solid #1890ff40',
                      color: '#1890ff',
                      fontWeight: 500,
                    }}
                  >
                    {item.category}
                  </Tag>
                  <div style={{ fontSize: '14px', color: '#f5222d', marginTop: '10px', fontWeight: 600 }}>
                    参考价格：{item.price}
                  </div>
                </div>
              </div>
              <Divider style={{ margin: '16px 0' }} />
              <Text type="secondary" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                {item.description}
              </Text>
              {selectedSoftware?.id === item.id && (
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Tag
                    color="success"
                    icon={<CheckCircleOutlined />}
                    style={{ borderRadius: 6, padding: '4px 16px', fontSize: 14 }}
                  >
                    已选择
                  </Tag>
                </div>
              )}
            </Card>
          </List.Item>
        )}
      />
      {selectedSoftware && (
        <div
          style={{
            marginTop: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f6ffed 0%, #e6fffb 100%)',
            borderRadius: 12,
            border: '1px solid #52c41a40',
          }}
        >
          <Space size="large">
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
            <div>
              <Text strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>已选择：{selectedSoftware.name}</Text>
              <Text style={{ color: 'var(--text-secondary)', marginLeft: 12 }}>({selectedSoftware.company})</Text>
            </div>
          </Space>
        </div>
      )}
    </div>
  )

  // 步骤2：填写需求信息
  const renderStep2 = () => (
    <Form form={form} layout="vertical">
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="title"
            label={<span style={{ fontWeight: 500 }}>需求标题</span>}
            rules={[{ required: true, message: '请输入需求标题' }]}
          >
            <Input
              placeholder="请输入需求标题"
              style={{ borderRadius: 8, height: 40 }}
              prefix={<FileTextOutlined style={{ color: 'var(--text-tertiary)' }} />}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="requirementType"
            label={<span style={{ fontWeight: 500 }}>需求类型</span>}
            rules={[{ required: true, message: '请选择需求类型' }]}
          >
            <Select
              placeholder="请选择需求类型"
              style={{ borderRadius: 8, height: 40 }}
            >
              {requirementTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  <Tag
                    style={{
                      borderRadius: 4,
                      background: type.bg,
                      border: `1px solid ${type.color}40`,
                      color: type.color,
                      marginRight: 8,
                    }}
                  >
                    {type.label}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="budget"
            label={<span style={{ fontWeight: 500 }}>预算范围</span>}
            rules={[{ required: true, message: '请选择预算范围' }]}
          >
            <Select
              placeholder="请选择预算范围"
              style={{ borderRadius: 8, height: 40 }}
            >
              {budgetRanges.map(range => (
                <Option key={range.value} value={range.value}>{range.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="expectedTime"
            label={<span style={{ fontWeight: 500 }}>期望上线时间</span>}
            rules={[{ required: true, message: '请选择期望上线时间' }]}
          >
            <Select
              placeholder="请选择期望上线时间"
              style={{ borderRadius: 8, height: 40 }}
            >
              {expectedTimes.map(time => (
                <Option key={time.value} value={time.value}>{time.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="urgency"
            label={<span style={{ fontWeight: 500 }}>紧急程度</span>}
            rules={[{ required: true, message: '请选择紧急程度' }]}
          >
            <Radio.Group>
              <Space>
                {urgencyLevels.map(level => (
                  <Radio.Button
                    key={level.value}
                    value={level.value}
                    style={{
                      borderRadius: 8,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Tag
                      style={{
                        borderRadius: 4,
                        background: level.bg,
                        border: `1px solid ${level.color}40`,
                        color: level.color,
                        margin: 0,
                      }}
                    >
                      {level.label}
                    </Tag>
                  </Radio.Button>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="isPublic"
            label={<span style={{ fontWeight: 500 }}>是否公开需求</span>}
            rules={[{ required: true, message: '请选择是否公开' }]}
          >
            <Radio.Group>
              <Radio value={true}>公开（其他企业可见）</Radio>
              <Radio value={false}>私密（仅平台可见）</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="description"
        label={<span style={{ fontWeight: 500 }}>需求描述</span>}
        rules={[{ required: true, message: '请输入需求描述' }]}
      >
        <TextArea
          rows={4}
          placeholder="请详细描述您的需求背景、现状、目标等"
          style={{ borderRadius: 8, resize: 'none' }}
        />
      </Form.Item>
      <Form.Item
        name="technicalRequirements"
        label={<span style={{ fontWeight: 500 }}>技术要求</span>}
      >
        <TextArea
          rows={3}
          placeholder="请描述技术架构、接口要求、性能要求等（选填）"
          style={{ borderRadius: 8, resize: 'none' }}
        />
      </Form.Item>
      <Form.Item label={<span style={{ fontWeight: 500 }}>需求附件</span>}>
        <Upload>
          <Button
            icon={<UploadOutlined />}
            style={{ borderRadius: 8, height: 40 }}
          >
            上传需求文档
          </Button>
        </Upload>
        <div style={{ marginTop: '12px' }}>
          <a href="#" style={{ fontSize: '13px', color: 'var(--brand-primary)' }}>
            <DownloadOutlined /> 下载需求模板
          </a>
        </div>
      </Form.Item>
    </Form>
  )

  // 步骤3：确认提交
  const renderStep3 = () => {
    const formValues = form.getFieldsValue()
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(82, 196, 26, 0.3)',
            }}
          >
            <CheckCircleOutlined style={{ fontSize: 40, color: '#fff' }} />
          </div>
          <Title level={4} style={{ marginTop: 16, color: 'var(--text-primary)' }}>请确认需求信息</Title>
          <Text type="secondary">确认无误后提交，平台将尽快为您匹配合适的供应商</Text>
        </div>
        <Card
          style={{
            borderRadius: 16,
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-light)',
          }}
          bodyStyle={{ padding: '24px' }}
        >
          <div style={{ marginBottom: '20px' }}>
            <Text style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>意向软件</Text>
            <div style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginTop: 6 }}>
              {selectedSoftware?.name} ({selectedSoftware?.company})
            </div>
          </div>
          <Divider style={{ margin: '16px 0', borderColor: 'var(--border-light)' }} />
          <Row gutter={24}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <Text style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>需求标题</Text>
                <div style={{ color: 'var(--text-primary)', fontSize: 15, marginTop: 6, fontWeight: 500 }}>
                  {formValues.title}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <Text style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>需求类型</Text>
                <div style={{ marginTop: 6 }}>
                  {getTypeTag(formValues.requirementType)}
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <Text style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>预算范围</Text>
                <div style={{ color: '#f5222d', fontSize: 15, marginTop: 6, fontWeight: 600 }}>
                  {budgetRanges.find(r => r.value === formValues.budget)?.label}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '16px' }}>
                <Text style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>期望上线时间</Text>
                <div style={{ color: 'var(--text-primary)', fontSize: 15, marginTop: 6, fontWeight: 500 }}>
                  {expectedTimes.find(t => t.value === formValues.expectedTime)?.label}
                </div>
              </div>
            </Col>
          </Row>
          <div style={{ marginBottom: '16px' }}>
            <Text style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>紧急程度</Text>
            <div style={{ marginTop: 6 }}>
              {getUrgencyTag(formValues.urgency)}
            </div>
          </div>
          <div>
            <Text style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>需求描述</Text>
            <div
              style={{
                background: 'var(--bg-card)',
                padding: '16px',
                borderRadius: 12,
                marginTop: 10,
                color: 'var(--text-primary)',
                lineHeight: 1.8,
                border: '1px solid var(--border-light)',
              }}
            >
              {formValues.description}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 - 已隐藏 */}
      {/*
      <div style={{ marginBottom: '32px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/enterprise')}
          style={{
            borderRadius: 8,
            height: 36,
            marginBottom: 16,
          }}
        >
          返回工作台
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            }}
          >
            <FileTextOutlined style={{ fontSize: 28, color: '#fff' }} />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: 'var(--text-primary)' }}>我的需求</Title>
            <Text type="secondary">管理您的软件需求，跟踪对接进度</Text>
          </div>
        </div>
      </div>
      */}

      {/* 统计卡片 - 已隐藏 */}
      {/*
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>需求总数</span>}
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiseOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>本月新增 2 个</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(250, 173, 20, 0.3)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>待处理</span>}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>等待平台审核</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>对接中</span>}
              value={stats.processing}
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>正在与供应商沟通</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(82, 196, 26, 0.3)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>已完成</span>}
              value={stats.processed}
              prefix={<CheckSquareOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>成功对接</span>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(240, 147, 251, 0.3)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>累计浏览量</span>}
              value={stats.totalViews}
              prefix={<EyeFilled style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
            <div style={{ marginTop: 12 }}>
              <Progress
                percent={75}
                size="small"
                strokeColor="#fff"
                trailColor="rgba(255,255,255,0.3)"
                showInfo={false}
              />
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 8 }}>
                较上月增长 23%
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(79, 172, 254, 0.3)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>供应商响应</span>}
              value={stats.totalResponses}
              prefix={<BarChartOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
            <div style={{ marginTop: 12 }}>
              <Progress
                percent={60}
                size="small"
                strokeColor="#fff"
                trailColor="rgba(255,255,255,0.3)"
                showInfo={false}
              />
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 8 }}>
                平均每个需求 {Math.round(stats.totalResponses / stats.total)} 个响应
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(250, 112, 154, 0.3)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>已关闭</span>}
              value={stats.closed}
              prefix={<CloseCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FallOutlined style={{ color: 'rgba(255,255,255,0.7)' }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>本月关闭 1 个</span>
            </div>
          </Card>
        </Col>
      </Row>
      */}

      {/* 主内容区 */}
      <Card
        style={{
          borderRadius: 16,
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
        }}
        bodyStyle={{ padding: '24px' }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileTextOutlined style={{ fontSize: 18, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>需求列表</span>
          </div>
        }
        extra={
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                const templateContent = `需求对接模板

一、企业基本信息
企业名称：
所属行业：
企业规模：
联系人：
联系电话：

二、需求信息
需求标题：
需求类型：□新建系统 □系统升级 □系统集成 □定制开发
预算范围：
期望上线时间：
紧急程度：□紧急 □一般 □长期规划

三、需求描述
1. 项目背景：
2. 功能需求：
3. 技术要求：
4. 其他说明：

四、附件清单
□ 需求规格说明书
□ 现有系统资料
□ 其他相关资料

填写日期：____年____月____日
`
                const blob = new Blob([templateContent], { type: 'text/plain;charset=utf-8' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = '需求对接模板.txt'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
                message.success('模板下载成功')
              }}
              style={{ borderRadius: 8, height: 40 }}
            >
              下载模板
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              style={{
                borderRadius: 8,
                height: 40,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}
            >
              发布需求
            </Button>
          </Space>
        }
      >
        {/* 筛选区域 */}
        <div
          style={{
            background: 'var(--bg-tertiary)',
            borderRadius: 12,
            padding: '20px',
            marginBottom: 24,
            border: '1px solid var(--border-light)',
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} lg={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SearchOutlined style={{ color: 'var(--text-tertiary)' }} />
                <Search
                  placeholder="搜索需求标题"
                  allowClear
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileTextOutlined style={{ color: 'var(--text-tertiary)' }} />
                <Select
                  value={status}
                  onChange={setStatus}
                  style={{ width: '100%' }}
                  placeholder="选择状态"
                >
                  <Option value="all">全部状态</Option>
                  <Option value="pending">待处理</Option>
                  <Option value="in_progress">对接中</Option>
                  <Option value="finished">已完成</Option>
                  <Option value="closed">已关闭</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AppstoreOutlined style={{ color: 'var(--text-tertiary)' }} />
                <Select
                  value={selectedType}
                  onChange={setSelectedType}
                  style={{ width: '100%' }}
                  placeholder="需求类型"
                >
                  <Option value="all">全部类型</Option>
                  {requirementTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <Tag
                        style={{
                          borderRadius: 4,
                          background: type.bg,
                          border: `1px solid ${type.color}40`,
                          color: type.color,
                          margin: 0,
                        }}
                      >
                        {type.label}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
        </div>

        {/* 表格 */}
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
              background: 'var(--bg-tertiary)',
              fontWeight: 600,
              color: 'var(--text-primary)',
            },
          }}
        />
      </Card>

      {/* 发布需求弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileAddOutlined style={{ fontSize: 20, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600 }}>发布需求</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        width={900}
        footer={null}
        destroyOnClose
        style={{ borderRadius: 16 }}
      >
        <Steps
          current={currentStep}
          style={{ marginBottom: '32px', marginTop: '24px' }}
          items={steps.map(step => ({ title: step.title, description: step.description }))}
        />

        <div style={{ minHeight: '400px', marginBottom: '24px' }}>
          {currentStep === 0 && renderStep1()}
          {currentStep === 1 && renderStep2()}
          {currentStep === 2 && renderStep3()}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '20px',
          }}
        >
          <Button
            onClick={handleCancel}
            style={{ borderRadius: 8, height: 40 }}
          >
            取消
          </Button>
          <Space>
            {currentStep > 0 && (
              <Button
                icon={<ArrowLeftOutlinedIcon />}
                onClick={handlePrev}
                style={{ borderRadius: 8, height: 40 }}
              >
                上一步
              </Button>
            )}
            {currentStep < 2 ? (
              <Button
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={handleNext}
                style={{
                  borderRadius: 8,
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                下一步
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={handleSubmit}
                style={{
                  borderRadius: 8,
                  height: 40,
                  background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                  border: 'none',
                }}
              >
                提交需求
              </Button>
            )}
          </Space>
        </div>
      </Modal>
    </div>
  )
}

export default MyDemands