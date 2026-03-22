import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Row,
  Col,
  message,
  Form,
  Upload,
  Steps,
  Radio,
  Typography,
  Divider,
  Breadcrumb,
} from 'antd'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UploadOutlined,
  DownloadOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  FormOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ToolOutlined,
  DatabaseOutlined,
  CloudOutlined,
  SafetyOutlined,
  RocketOutlined,
  LayoutOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'

const { Search } = Input
const { Option } = Select
const { TextArea } = Input
const { Title, Text } = Typography

// 软件类型配置 - 带图标和颜色
const softwareCategories = [
  { 
    value: 'cad', 
    label: 'CAD设计软件', 
    color: '#6366f1',
    bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    lightBg: '#eef2ff',
    icon: <LayoutOutlined />,
    description: '二维/三维设计、参数化建模'
  },
  { 
    value: 'cam', 
    label: 'CAM制造软件', 
    color: '#06b6d4',
    bg: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
    lightBg: '#ecfeff',
    icon: <ToolOutlined />,
    description: '数控编程、加工仿真'
  },
  { 
    value: 'cae', 
    label: 'CAE仿真软件', 
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    lightBg: '#f5f3ff',
    icon: <AppstoreOutlined />,
    description: '有限元分析、流体仿真'
  },
  { 
    value: 'mes', 
    label: 'MES生产执行', 
    color: '#10b981',
    bg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    lightBg: '#ecfdf5',
    icon: <DatabaseOutlined />,
    description: '生产调度、质量管理'
  },
  { 
    value: 'erp', 
    label: 'ERP管理系统', 
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    lightBg: '#fffbeb',
    icon: <CloudOutlined />,
    description: '财务、采购、销售管理'
  },
  { 
    value: 'plm', 
    label: 'PLM生命周期', 
    color: '#ec4899',
    bg: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
    lightBg: '#fdf2f8',
    icon: <NodeIndexOutlined />,
    description: '产品数据、流程管理'
  },
  { 
    value: 'scm', 
    label: 'SCM供应链', 
    color: '#14b8a6',
    bg: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
    lightBg: '#f0fdfa',
    icon: <SafetyOutlined />,
    description: '供应商、物流管理'
  },
  { 
    value: 'iot', 
    label: '工业物联网', 
    color: '#3b82f6',
    bg: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    lightBg: '#eff6ff',
    icon: <RocketOutlined />,
    description: '设备互联、数据采集'
  },
]

// 需求类型
const requirementTypes = [
  { value: 'integration', label: '系统集成', color: '#6366f1', bg: '#eef2ff' },
  { value: 'customization', label: '定制开发', color: '#10b981', bg: '#ecfdf5' },
  { value: 'consulting', label: '技术咨询', color: '#f59e0b', bg: '#fffbeb' },
  { value: 'training', label: '培训服务', color: '#8b5cf6', bg: '#f5f3ff' },
  { value: 'maintenance', label: '运维支持', color: '#06b6d4', bg: '#ecfeff' },
]

// 预算范围
const budgetRanges = [
  { value: '10w', label: '10万以下' },
  { value: '10-50w', label: '10-50万' },
  { value: '50-100w', label: '50-100万' },
  { value: '100-500w', label: '100-500万' },
  { value: '500w+', label: '500万以上' },
]

// 期望时间
const expectedTimes = [
  { value: '1month', label: '1个月内' },
  { value: '3months', label: '3个月内' },
  { value: '6months', label: '6个月内' },
  { value: '1year', label: '1年内' },
  { value: 'flexible', label: '时间灵活' },
]

// 紧急程度
const urgencyLevels = [
  { value: 'urgent', label: '紧急', color: '#ef4444', bg: '#fef2f2' },
  { value: 'high', label: '高', color: '#f97316', bg: '#fff7ed' },
  { value: 'normal', label: '一般', color: '#3b82f6', bg: '#eff6ff' },
  { value: 'low', label: '低', color: '#6b7280', bg: '#f9fafb' },
]

const DemandPublish = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [form] = Form.useForm()

  const steps = [
    { title: '选择类型', description: '选择软件类型' },
    { title: '填写需求', description: '填写详细需求' },
    { title: '提交审核', description: '确认并提交' },
  ]

  const handleNext = () => {
    if (currentStep === 0 && !selectedCategory) {
      message.error('请先选择一个软件类型')
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
    message.success('需求提交成功，平台将尽快为您匹配供应商')
    navigate('/enterprise/demands')
  }

  const handleCancel = () => {
    navigate('/enterprise/demands')
  }

  // 步骤1：选择软件类型
  const renderStep1 = () => (
    <div>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 15 }}>
          请选择您需要的工业软件类型，我们将为您匹配合适的供应商
        </Text>
      </div>
      <Row gutter={[20, 20]}>
        {softwareCategories.map((cat) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={cat.value}>
            <Card
              hoverable
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                borderRadius: 16,
                border: selectedCategory === cat.value 
                  ? `2px solid ${cat.color}` 
                  : '1px solid #e5e7eb',
                background: selectedCategory === cat.value ? cat.lightBg : '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: selectedCategory === cat.value 
                  ? `0 8px 24px ${cat.color}30` 
                  : '0 2px 8px rgba(0,0,0,0.04)',
                height: '100%',
              }}
              bodyStyle={{ padding: '24px' }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat.value) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat.value) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                }
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: cat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: 28,
                    color: '#fff',
                    boxShadow: `0 8px 20px ${cat.color}40`,
                  }}
                >
                  {cat.icon}
                </div>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: 16, 
                  marginBottom: 8,
                  color: selectedCategory === cat.value ? cat.color : '#1f2937'
                }}>
                  {cat.label}
                </div>
                <div style={{ 
                  fontSize: 13, 
                  color: '#6b7280',
                  lineHeight: 1.5
                }}>
                  {cat.description}
                </div>
                {selectedCategory === cat.value && (
                  <div style={{ marginTop: 16 }}>
                    <Tag
                      style={{
                        borderRadius: 20,
                        background: cat.color,
                        border: 'none',
                        color: '#fff',
                        padding: '4px 16px',
                        fontSize: 13,
                      }}
                    >
                      <CheckCircleOutlined style={{ marginRight: 4 }} />
                      已选择
                    </Tag>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      {selectedCategory && (
        <div
          style={{
            marginTop: '32px',
            padding: '20px 24px',
            background: '#f0fdf4',
            borderRadius: 12,
            border: '1px solid #86efac',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space size="middle">
            <CheckCircleOutlined style={{ color: '#22c55e', fontSize: 24 }} />
            <div>
              <Text strong style={{ fontSize: 16, color: '#166534' }}>
                已选择：{softwareCategories.find(c => c.value === selectedCategory)?.label}
              </Text>
              <Text style={{ color: '#15803d', marginLeft: 12 }}>
                {softwareCategories.find(c => c.value === selectedCategory)?.description}
              </Text>
            </div>
          </Space>
          <Button 
            type="link" 
            onClick={() => setSelectedCategory(null)}
            style={{ color: '#16a34a' }}
          >
            重新选择
          </Button>
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
            label={<span style={{ fontWeight: 600, fontSize: 14 }}>需求标题</span>}
            rules={[{ required: true, message: '请输入需求标题' }]}
          >
            <Input
              placeholder="请输入需求标题"
              style={{ 
                borderRadius: 10, 
                height: 44,
                borderColor: '#e5e7eb',
              }}
              prefix={<FileTextOutlined style={{ color: '#9ca3af' }} />}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="requirementType"
            label={<span style={{ fontWeight: 600, fontSize: 14 }}>需求类型</span>}
            rules={[{ required: true, message: '请选择需求类型' }]}
          >
            <Select
              placeholder="请选择需求类型"
              style={{ borderRadius: 10, height: 44 }}
              dropdownStyle={{ borderRadius: 10 }}
            >
              {requirementTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  <Tag
                    style={{
                      borderRadius: 6,
                      background: type.bg,
                      border: `1px solid ${type.color}30`,
                      color: type.color,
                      margin: 0,
                      fontWeight: 500,
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
            label={<span style={{ fontWeight: 600, fontSize: 14 }}>预算范围</span>}
            rules={[{ required: true, message: '请选择预算范围' }]}
          >
            <Select
              placeholder="请选择预算范围"
              style={{ borderRadius: 10, height: 44 }}
              dropdownStyle={{ borderRadius: 10 }}
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
            label={<span style={{ fontWeight: 600, fontSize: 14 }}>期望上线时间</span>}
            rules={[{ required: true, message: '请选择期望上线时间' }]}
          >
            <Select
              placeholder="请选择期望上线时间"
              style={{ borderRadius: 10, height: 44 }}
              dropdownStyle={{ borderRadius: 10 }}
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
            label={<span style={{ fontWeight: 600, fontSize: 14 }}>紧急程度</span>}
            rules={[{ required: true, message: '请选择紧急程度' }]}
          >
            <Radio.Group>
              <Space wrap>
                {urgencyLevels.map(level => (
                  <Radio.Button
                    key={level.value}
                    value={level.value}
                    style={{
                      borderRadius: 8,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      borderColor: level.color,
                      color: level.color,
                    }}
                  >
                    {level.label}
                  </Radio.Button>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="isPublic"
            label={<span style={{ fontWeight: 600, fontSize: 14 }}>是否公开需求</span>}
            rules={[{ required: true, message: '请选择是否公开' }]}
          >
            <Radio.Group>
              <Radio value={true} style={{ marginRight: 24 }}>
                <Space direction="vertical" size={0}>
                  <span style={{ fontWeight: 500 }}>公开</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>其他企业可见</span>
                </Space>
              </Radio>
              <Radio value={false}>
                <Space direction="vertical" size={0}>
                  <span style={{ fontWeight: 500 }}>私密</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>仅平台可见</span>
                </Space>
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="description"
        label={<span style={{ fontWeight: 600, fontSize: 14 }}>需求描述</span>}
        rules={[{ required: true, message: '请输入需求描述' }]}
      >
        <TextArea
          rows={4}
          placeholder="请详细描述您的需求背景、现状、目标等"
          style={{ 
            borderRadius: 10, 
            resize: 'none',
            borderColor: '#e5e7eb',
          }}
        />
      </Form.Item>
      <Form.Item
        name="technicalRequirements"
        label={<span style={{ fontWeight: 600, fontSize: 14 }}>技术要求</span>}
      >
        <TextArea
          rows={3}
          placeholder="请描述技术架构、接口要求、性能要求等（选填）"
          style={{ 
            borderRadius: 10, 
            resize: 'none',
            borderColor: '#e5e7eb',
          }}
        />
      </Form.Item>
      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 14 }}>需求附件</span>}>
        <Upload.Dragger
          style={{
            borderRadius: 12,
            border: '2px dashed #d1d5db',
            background: '#f9fafb',
            padding: '20px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <UploadOutlined style={{ fontSize: 32, color: '#9ca3af', marginBottom: 12 }} />
            <div style={{ fontSize: 15, color: '#374151', marginBottom: 4 }}>
              点击或拖拽文件到此处上传
            </div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>
              支持 PDF、Word、Excel 等格式文件
            </div>
          </div>
        </Upload.Dragger>
        <div style={{ marginTop: '12px' }}>
          <a href="#" style={{ fontSize: '13px', color: '#6366f1', fontWeight: 500 }}>
            <DownloadOutlined style={{ marginRight: 4 }} /> 下载需求模板
          </a>
        </div>
      </Form.Item>
    </Form>
  )

  // 步骤3：确认提交
  const renderStep3 = () => {
    const formValues = form.getFieldsValue()
    const selectedCat = softwareCategories.find(c => c.value === selectedCategory)
    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 12px 32px rgba(34, 197, 94, 0.3)',
            }}
          >
            <CheckCircleOutlined style={{ fontSize: 44, color: '#fff' }} />
          </div>
          <Title level={4} style={{ margin: 0, color: '#1f2937', marginBottom: 8 }}>
            请确认需求信息
          </Title>
          <Text type="secondary" style={{ fontSize: 15 }}>
            确认无误后提交，平台将尽快为您匹配合适的供应商
          </Text>
        </div>
        <Card
          style={{
            borderRadius: 16,
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <div style={{ marginBottom: '24px' }}>
            <Text type="secondary" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              软件类型
            </Text>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: selectedCat?.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  color: '#fff',
                }}
              >
                {selectedCat?.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#1f2937' }}>
                  {selectedCat?.label}
                </div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>
                  {selectedCat?.description}
                </div>
              </div>
            </div>
          </div>
          <Divider style={{ margin: '20px 0' }} />
          <Row gutter={32}>
            <Col span={12}>
              <div style={{ marginBottom: '20px' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>需求标题</Text>
                <div style={{ marginTop: 6, fontWeight: 600, fontSize: 15, color: '#1f2937' }}>
                  {formValues.title}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '20px' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>需求类型</Text>
                <div style={{ marginTop: 6 }}>
                  {formValues.requirementType && (
                    <Tag
                      style={{
                        borderRadius: 6,
                        background: requirementTypes.find(t => t.value === formValues.requirementType)?.bg,
                        border: 'none',
                        color: requirementTypes.find(t => t.value === formValues.requirementType)?.color,
                        fontWeight: 500,
                        padding: '4px 12px',
                      }}
                    >
                      {requirementTypes.find(t => t.value === formValues.requirementType)?.label}
                    </Tag>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={12}>
              <div style={{ marginBottom: '20px' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>预算范围</Text>
                <div style={{ marginTop: 6, fontWeight: 600, fontSize: 15, color: '#1f2937' }}>
                  {budgetRanges.find(r => r.value === formValues.budget)?.label}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '20px' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>期望时间</Text>
                <div style={{ marginTop: 6, fontWeight: 600, fontSize: 15, color: '#1f2937' }}>
                  {expectedTimes.find(t => t.value === formValues.expectedTime)?.label}
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={12}>
              <div style={{ marginBottom: '20px' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>紧急程度</Text>
                <div style={{ marginTop: 6 }}>
                  {formValues.urgency && (
                    <Tag
                      style={{
                        borderRadius: 6,
                        background: urgencyLevels.find(u => u.value === formValues.urgency)?.bg,
                        border: 'none',
                        color: urgencyLevels.find(u => u.value === formValues.urgency)?.color,
                        fontWeight: 500,
                        padding: '4px 12px',
                      }}
                    >
                      {urgencyLevels.find(u => u.value === formValues.urgency)?.label}
                    </Tag>
                  )}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: '20px' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>公开状态</Text>
                <div style={{ marginTop: 6, fontWeight: 600, fontSize: 15, color: '#1f2937' }}>
                  {formValues.isPublic ? (
                    <span style={{ color: '#22c55e' }}>公开（其他企业可见）</span>
                  ) : (
                    <span style={{ color: '#6b7280' }}>私密（仅平台可见）</span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <Divider style={{ margin: '20px 0' }} />
          <div style={{ marginBottom: '20px' }}>
            <Text type="secondary" style={{ fontSize: 13 }}>需求描述</Text>
            <div style={{ 
              marginTop: 8, 
              padding: '16px', 
              background: '#fff', 
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              lineHeight: 1.8,
              color: '#374151'
            }}>
              {formValues.description}
            </div>
          </div>
          {formValues.technicalRequirements && (
            <div>
              <Text type="secondary" style={{ fontSize: 13 }}>技术要求</Text>
              <div style={{ 
                marginTop: 8, 
                padding: '16px', 
                background: '#fff', 
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                lineHeight: 1.8,
                color: '#374151'
              }}>
                {formValues.technicalRequirements}
              </div>
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '24px 0 48px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* 面包屑导航 */}
        <Breadcrumb 
          style={{ marginBottom: 24 }}
          items={[
            { title: <><HomeOutlined /> 首页</>, href: '/' },
            { title: '企业工作台', href: '/enterprise' },
            { title: '我的需求', href: '/enterprise/demands' },
            { title: '发布需求' },
          ]}
        />

        {/* 页面标题 */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleCancel}
              style={{ 
                borderRadius: 10, 
                height: 40,
                borderColor: '#d1d5db',
              }}
            >
              返回
            </Button>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              }}
            >
              <FormOutlined style={{ fontSize: 24, color: '#fff' }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
                发布需求
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                填写您的数字化转型需求，平台将为您匹配合适的软件供应商
              </Text>
            </div>
          </div>
        </div>

        {/* 步骤条 */}
        <Card
          style={{
            borderRadius: 20,
            marginBottom: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid #e5e7eb',
          }}
          bodyStyle={{ padding: '40px' }}
        >
          <Steps
            current={currentStep}
            style={{ marginBottom: '40px' }}
            items={steps.map(step => ({ 
              title: step.title, 
              description: step.description 
            }))}
          />

          <div style={{ minHeight: '400px', marginBottom: '32px' }}>
            {currentStep === 0 && renderStep1()}
            {currentStep === 1 && renderStep2()}
            {currentStep === 2 && renderStep3()}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '24px',
            }}
          >
            <Button
              onClick={handleCancel}
              style={{ 
                borderRadius: 10, 
                height: 44,
                padding: '0 24px',
                borderColor: '#d1d5db',
              }}
            >
              取消
            </Button>
            <Space>
              {currentStep > 0 && (
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handlePrev}
                  style={{ 
                    borderRadius: 10, 
                    height: 44,
                    padding: '0 24px',
                    borderColor: '#d1d5db',
                  }}
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
                    borderRadius: 10,
                    height: 44,
                    padding: '0 28px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
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
                    borderRadius: 10,
                    height: 44,
                    padding: '0 28px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.35)',
                  }}
                >
                  提交需求
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DemandPublish
