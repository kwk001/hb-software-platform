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
  { value: 'new', label: '新建系统' },
  { value: 'upgrade', label: '系统升级' },
  { value: 'integration', label: '系统集成' },
  { value: 'custom', label: '定制开发' },
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
  { value: 'urgent', label: '紧急', color: 'red' },
  { value: 'normal', label: '一般', color: 'blue' },
  { value: 'planning', label: '长期规划', color: 'green' },
]

const MyDemands = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedSoftware, setSelectedSoftware] = useState<any>(null)
  const [form] = Form.useForm()

  // 需求列表数据
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
    },
    {
      id: 3,
      title: 'ERP系统升级服务',
      softwareName: '企业资源ERP系统',
      softwareCompany: '武汉云智软件',
      category: 'ERP系统',
      budget: '20-30万',
      status: DEMAND_STATUS.CLOSED,
      publishDate: '2026-03-05',
      views: 156,
    },
  ]

  // 获取状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case DEMAND_STATUS.PENDING:
        return <Tag color="default">待处理</Tag>
      case DEMAND_STATUS.PROCESSING:
        return <Tag color="processing">对接中</Tag>
      case DEMAND_STATUS.PROCESSED:
        return <Tag color="success">已完成</Tag>
      case DEMAND_STATUS.CLOSED:
        return <Tag>已关闭</Tag>
      default:
        return <Tag>{status}</Tag>
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '意向软件',
      dataIndex: 'softwareName',
      key: 'softwareName',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.softwareCompany}</div>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          {record.status === DEMAND_STATUS.PENDING && (
            <Button type="link" size="small" icon={<EditOutlined />}>
              编辑
            </Button>
          )}
          {record.status !== DEMAND_STATUS.PROCESSED && (
            <Popconfirm
              title="确定关闭该需求？"
              onConfirm={() => message.success('需求已关闭')}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
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
      <div style={{ marginBottom: '16px' }}>
        <Search
          placeholder="搜索软件产品"
          allowClear
          style={{ width: 300 }}
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
                borderRadius: '12px',
                border: selectedSoftware?.id === item.id ? '2px solid var(--brand-primary)' : '1px solid var(--border-light)',
                background: selectedSoftware?.id === item.id ? 'var(--brand-primary-bg)' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Avatar size={48} style={{ background: 'var(--brand-primary-bg)', fontSize: '24px' }}>
                  {item.logo}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                    {item.company}
                  </div>
                  <Tag color="blue">{item.category}</Tag>
                  <div style={{ fontSize: '13px', color: '#f5222d', marginTop: '8px' }}>
                    参考价格：{item.price}
                  </div>
                </div>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <Text type="secondary" style={{ fontSize: '13px' }}>
                {item.description}
              </Text>
              {selectedSoftware?.id === item.id && (
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <Tag color="success" icon={<CheckCircleOutlined />}>已选择</Tag>
                </div>
              )}
            </Card>
          </List.Item>
        )}
      />
      {selectedSoftware && (
        <div style={{ marginTop: '16px', padding: '16px', background: 'var(--brand-success-bg)', borderRadius: '8px', border: '1px solid var(--brand-success)' }}>
          <Space>
            <CheckCircleOutlined style={{ color: 'var(--brand-success)' }} />
            <Text strong>已选择：{selectedSoftware.name}</Text>
            <Text style={{ color: 'var(--text-secondary)' }}>({selectedSoftware.company})</Text>
          </Space>
        </div>
      )}
    </div>
  )

  // 步骤2：填写需求信息
  const renderStep2 = () => (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="title"
            label="需求标题"
            rules={[{ required: true, message: '请输入需求标题' }]}
          >
            <Input placeholder="请输入需求标题" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="requirementType"
            label="需求类型"
            rules={[{ required: true, message: '请选择需求类型' }]}
          >
            <Select placeholder="请选择需求类型">
              {requirementTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="budget"
            label="预算范围"
            rules={[{ required: true, message: '请选择预算范围' }]}
          >
            <Select placeholder="请选择预算范围">
              {budgetRanges.map(range => (
                <Option key={range.value} value={range.value}>{range.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="expectedTime"
            label="期望上线时间"
            rules={[{ required: true, message: '请选择期望上线时间' }]}
          >
            <Select placeholder="请选择期望上线时间">
              {expectedTimes.map(time => (
                <Option key={time.value} value={time.value}>{time.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="urgency"
            label="紧急程度"
            rules={[{ required: true, message: '请选择紧急程度' }]}
          >
            <Radio.Group>
              {urgencyLevels.map(level => (
                <Radio.Button key={level.value} value={level.value}>
                  <Tag color={level.color}>{level.label}</Tag>
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="isPublic"
            label="是否公开需求"
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
        label="需求描述"
        rules={[{ required: true, message: '请输入需求描述' }]}
      >
        <TextArea rows={4} placeholder="请详细描述您的需求背景、现状、目标等" />
      </Form.Item>
      <Form.Item
        name="technicalRequirements"
        label="技术要求"
      >
        <TextArea rows={3} placeholder="请描述技术架构、接口要求、性能要求等（选填）" />
      </Form.Item>
      <Form.Item label="需求附件">
        <Upload>
          <Button icon={<UploadOutlined />}>上传需求文档</Button>
        </Upload>
        <div style={{ marginTop: '8px' }}>
          <a href="#" style={{ fontSize: '13px' }}>
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
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <CheckCircleOutlined style={{ fontSize: '48px', color: 'var(--brand-success)' }} />
          <Title level={4} style={{ marginTop: '16px', color: 'var(--text-primary)' }}>请确认需求信息</Title>
        </div>
        <Card style={{ borderRadius: '12px', background: 'var(--bg-tertiary)' }}>
          <div style={{ marginBottom: '16px' }}>
            <Text style={{ color: 'var(--text-tertiary)' }}>意向软件</Text>
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
              {selectedSoftware?.name} ({selectedSoftware?.company})
            </div>
          </div>
          <Divider style={{ margin: '12px 0', borderColor: 'var(--border-light)' }} />
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ color: 'var(--text-tertiary)' }}>需求标题</Text>
                <div style={{ color: 'var(--text-primary)' }}>{formValues.title}</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ color: 'var(--text-tertiary)' }}>需求类型</Text>
                <div style={{ color: 'var(--text-primary)' }}>{requirementTypes.find(t => t.value === formValues.requirementType)?.label}</div>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ color: 'var(--text-tertiary)' }}>预算范围</Text>
                <div style={{ color: 'var(--text-primary)' }}>{budgetRanges.find(r => r.value === formValues.budget)?.label}</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ color: 'var(--text-tertiary)' }}>期望上线时间</Text>
                <div style={{ color: 'var(--text-primary)' }}>{expectedTimes.find(t => t.value === formValues.expectedTime)?.label}</div>
              </div>
            </Col>
          </Row>
          <div style={{ marginBottom: '12px' }}>
            <Text style={{ color: 'var(--text-tertiary)' }}>紧急程度</Text>
            <div>
              <Tag color={urgencyLevels.find(u => u.value === formValues.urgency)?.color}>
                {urgencyLevels.find(u => u.value === formValues.urgency)?.label}
              </Tag>
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <Text style={{ color: 'var(--text-tertiary)' }}>需求描述</Text>
            <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', marginTop: '8px', color: 'var(--text-primary)' }}>
              {formValues.description}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/enterprise')}>
          返回工作台
        </Button>
      </div>

      <Card
        title="我的需求"
        extra={
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                // 下载需求模板
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
            >
              下载模板
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              发布需求
            </Button>
          </Space>
        }
        style={{ borderRadius: '8px' }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={8}>
            <Search
              placeholder="搜索需求标题"
              allowClear
              enterButton={<><SearchOutlined /> 搜索</>}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
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
        />
      </Card>

      {/* 发布需求弹窗 */}
      <Modal
        title="发布需求"
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={null}
        destroyOnClose
      >
        <Steps
          current={currentStep}
          style={{ marginBottom: '24px', marginTop: '16px' }}
          items={steps.map(step => ({ title: step.title, description: step.description }))}
        />

        <div style={{ minHeight: '400px', marginBottom: '24px' }}>
          {currentStep === 0 && renderStep1()}
          {currentStep === 1 && renderStep2()}
          {currentStep === 2 && renderStep3()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
          <Button onClick={handleCancel}>取消</Button>
          <Space>
            {currentStep > 0 && (
              <Button icon={<ArrowLeftOutlinedIcon />} onClick={handlePrev}>
                上一步
              </Button>
            )}
            {currentStep < 2 ? (
              <Button type="primary" icon={<ArrowRightOutlined />} onClick={handleNext}>
                下一步
              </Button>
            ) : (
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleSubmit}>
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
