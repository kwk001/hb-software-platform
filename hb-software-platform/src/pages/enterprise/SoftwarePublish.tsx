import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Upload,
  Radio,
  Checkbox,
  Space,
  message,
  Alert,
  Divider,
  Modal,
  List,
  Tag,
  Empty,
  Popconfirm,
  Result,
} from 'antd'
import {
  InboxOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UploadOutlined,
  SaveOutlined,
  FileOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select
const { Dragger } = Upload

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

const softwareCategories = [
  { value: 'MES', label: '制造执行系统(MES)' },
  { value: 'ERP', label: '企业资源计划(ERP)' },
  { value: 'PLM', label: '产品生命周期管理(PLM)' },
  { value: 'SCM', label: '供应链管理(SCM)' },
  { value: 'CRM', label: '客户关系管理(CRM)' },
  { value: 'WMS', label: '仓储管理系统(WMS)' },
  { value: 'QMS', label: '质量管理系统(QMS)' },
  { value: 'APS', label: '高级计划排程(APS)' },
  { value: 'BI', label: '商业智能(BI)' },
  { value: 'OTHER', label: '其他' },
]

const industries = [
  { value: 'automotive', label: '汽车制造' },
  { value: 'electronics', label: '电子制造' },
  { value: 'machinery', label: '机械制造' },
  { value: 'chemical', label: '化工行业' },
  { value: 'food', label: '食品加工' },
  { value: 'textile', label: '纺织服装' },
  { value: 'pharmaceutical', label: '医药制造' },
  { value: 'metallurgy', label: '冶金行业' },
  { value: 'all', label: '全行业' },
]

const priceRanges = [
  { value: '0-10', label: '10万以下' },
  { value: '10-50', label: '10-50万' },
  { value: '50-100', label: '50-100万' },
  { value: '100-500', label: '100-500万' },
  { value: '500+', label: '500万以上' },
]

const deploymentTypes = [
  { value: 'private', label: '私有化部署' },
  { value: 'saas', label: 'SaaS云服务' },
  { value: 'hybrid', label: '混合部署' },
]

// 草稿存储键
const DRAFT_STORAGE_KEY = 'software_publish_drafts'

// 草稿类型
interface SoftwareDraft {
  id: string
  name: string
  data: any
  createTime: string
  updateTime: string
}

export default function SoftwarePublish() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const draftId = searchParams.get('draft')
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [draftModalVisible, setDraftModalVisible] = useState(false)
  const [drafts, setDrafts] = useState<SoftwareDraft[]>([])
  const [enterpriseType, setEnterpriseType] = useState<string>('demand')

  // 检查企业类型，只有工业软件企业才能访问
  useEffect(() => {
    const type = getEnterpriseType()
    setEnterpriseType(type)
    if (type !== 'supply') {
      message.error('只有工业软件企业才能发布软件产品')
      navigate('/enterprise')
    }
  }, [navigate])

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    action: '/api/upload',
    onChange(info) {
      const { status } = info.file
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  const handleNext = async () => {
    try {
      await form.validateFields()
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 加载草稿列表
  const loadDrafts = () => {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (stored) {
      setDrafts(JSON.parse(stored))
    }
  }

  // 加载指定草稿
  const loadDraft = (id: string) => {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (stored) {
      const draftList: SoftwareDraft[] = JSON.parse(stored)
      const draft = draftList.find(d => d.id === id)
      if (draft) {
        form.setFieldsValue(draft.data)
        message.success('草稿加载成功')
      }
    }
  }

  // 保存草稿
  const handleSaveDraft = async () => {
    try {
      setSaveLoading(true)
      const values = await form.validateFields().catch(() => form.getFieldsValue())
      
      const draft: SoftwareDraft = {
        id: draftId || Date.now().toString(),
        name: values.name || `未命名软件_${new Date().toLocaleDateString()}`,
        data: values,
        createTime: draftId ? (drafts.find(d => d.id === draftId)?.createTime || new Date().toISOString()) : new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }

      const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
      let draftList: SoftwareDraft[] = stored ? JSON.parse(stored) : []
      
      // 更新或添加草稿
      const existingIndex = draftList.findIndex(d => d.id === draft.id)
      if (existingIndex >= 0) {
        draftList[existingIndex] = draft
      } else {
        draftList.unshift(draft)
      }

      // 最多保存10个草稿
      if (draftList.length > 10) {
        draftList = draftList.slice(0, 10)
      }

      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftList))
      setDrafts(draftList)
      
      message.success('草稿保存成功')
      
      // 如果是新草稿，更新URL
      if (!draftId) {
        navigate(`/enterprise/software/publish?draft=${draft.id}`, { replace: true })
      }
    } catch (error) {
      message.error('草稿保存失败')
    } finally {
      setSaveLoading(false)
    }
  }

  // 删除草稿
  const handleDeleteDraft = (id: string) => {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (stored) {
      let draftList: SoftwareDraft[] = JSON.parse(stored)
      draftList = draftList.filter(d => d.id !== id)
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftList))
      setDrafts(draftList)
      message.success('草稿删除成功')
    }
  }

  // 使用草稿
  const handleUseDraft = (draft: SoftwareDraft) => {
    navigate(`/enterprise/software/publish?draft=${draft.id}`)
    form.setFieldsValue(draft.data)
    setDraftModalVisible(false)
    message.success('草稿加载成功')
  }

  useEffect(() => {
    loadDrafts()
    if (draftId) {
      loadDraft(draftId)
    }
  }, [draftId])

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      setLoading(true)
      // 模拟提交
      setTimeout(() => {
        setLoading(false)
        message.success('软件发布申请已提交，等待平台审核')
        navigate('/enterprise/software/list')
      }, 1500)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const steps = [
    { title: '基本信息', icon: <InfoCircleOutlined />, description: '填写软件基本信息' },
    { title: '功能介绍', icon: <FileTextOutlined />, description: '描述软件功能特点' },
    { title: '附件上传', icon: <UploadOutlined />, description: '上传产品相关资料' },
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* 步骤标题 */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                borderRadius: 20,
                marginBottom: 16,
              }}>
                <InfoCircleOutlined style={{ color: '#fff', fontSize: 14 }} />
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>软件基本信息</span>
              </div>
              <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
                请填写软件的基本信息，这些信息将展示在平台门户上供制造企业浏览
              </p>
            </div>

            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Form.Item
                name="name"
                label={<span style={{ fontWeight: 500, color: '#1e293b' }}>软件名称</span>}
                rules={[{ required: true, message: '请输入软件名称' }]}
              >
                <Input 
                  placeholder="请输入软件产品名称" 
                  size="large"
                  style={{ borderRadius: 10, height: 48 }}
                />
              </Form.Item>

              <Form.Item
                name="category"
                label={<span style={{ fontWeight: 500, color: '#1e293b' }}>软件类别</span>}
                rules={[{ required: true, message: '请选择软件类别' }]}
              >
                <Select 
                  placeholder="请选择软件类别" 
                  size="large"
                  style={{ borderRadius: 10 }}
                  dropdownStyle={{ borderRadius: 10 }}
                >
                  {softwareCategories.map((cat) => (
                    <Option key={cat.value} value={cat.value}>
                      {cat.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="industries"
                label={<span style={{ fontWeight: 500, color: '#1e293b' }}>适用行业</span>}
                rules={[{ required: true, message: '请选择适用行业' }]}
              >
                <Select 
                  mode="multiple" 
                  placeholder="请选择适用行业" 
                  size="large"
                  style={{ borderRadius: 10 }}
                  dropdownStyle={{ borderRadius: 10 }}
                  tagRender={(props) => {
                    const { label, closable, onClose } = props
                    return (
                      <Tag
                        closable={closable}
                        onClose={onClose}
                        style={{
                          background: '#e0e7ff',
                          color: '#4f46e5',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 10px',
                          fontSize: 13,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        {label}
                      </Tag>
                    )
                  }}
                >
                  {industries.map((ind) => (
                    <Option key={ind.value} value={ind.value}>
                      {ind.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="deployment"
                label={<span style={{ fontWeight: 500, color: '#1e293b' }}>部署方式</span>}
                rules={[{ required: true, message: '请选择部署方式' }]}
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {deploymentTypes.map((type) => (
                      <div
                        key={type.value}
                        style={{
                          padding: '12px 16px',
                          background: '#f8fafc',
                          borderRadius: 10,
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f1f5f9'
                          e.currentTarget.style.borderColor = '#cbd5e1'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#f8fafc'
                          e.currentTarget.style.borderColor = '#e2e8f0'
                        }}
                      >
                        <Checkbox value={type.value} style={{ width: '100%' }}>
                          <span style={{ fontSize: 14, color: '#334155' }}>{type.label}</span>
                        </Checkbox>
                      </div>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                name="priceRange"
                label={<span style={{ fontWeight: 500, color: '#1e293b' }}>价格区间</span>}
                rules={[{ required: true, message: '请选择价格区间' }]}
              >
                <Select 
                  placeholder="请选择价格区间" 
                  size="large"
                  style={{ borderRadius: 10 }}
                  dropdownStyle={{ borderRadius: 10 }}
                >
                  {priceRanges.map((price) => (
                    <Option key={price.value} value={price.value}>
                      {price.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="brief"
                label={<span style={{ fontWeight: 500, color: '#1e293b' }}>软件简介</span>}
                rules={[{ required: true, message: '请输入软件简介' }]}
              >
                <TextArea
                  placeholder="请简要介绍软件的核心功能和特点"
                  rows={4}
                  showCount
                  maxLength={500}
                  style={{ borderRadius: 10, resize: 'none' }}
                />
              </Form.Item>
            </Space>
          </div>
        )

      case 1:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="功能详细介绍"
              description="请详细介绍软件的功能模块、技术架构和成功案例，帮助制造企业更好地了解您的产品。"
              type="info"
              showIcon
            />

            <Form.Item
              name="features"
              label="功能模块"
              rules={[{ required: true, message: '请输入功能模块介绍' }]}
            >
              <TextArea
                placeholder="请详细介绍软件的功能模块，如：生产管理、质量管理、设备管理等"
                rows={6}
                showCount
                maxLength={2000}
              />
            </Form.Item>

            <Form.Item
              name="architecture"
              label="技术架构"
            >
              <TextArea
                placeholder="请介绍软件的技术架构，如：微服务架构、云原生、支持的数据库等"
                rows={4}
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item
              name="cases"
              label="成功案例"
            >
              <TextArea
                placeholder="请介绍软件的成功应用案例，包括客户名称、应用场景和效果"
                rows={4}
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <Form.Item
              name="advantages"
              label="产品优势"
            >
              <TextArea
                placeholder="请介绍软件的核心竞争优势"
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Space>
        )

      case 2:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="附件上传"
              description="请上传软件相关的产品手册、演示视频等资料，帮助用户更全面地了解您的产品。"
              type="info"
              showIcon
            />

            <Form.Item
              name="manual"
              label="产品手册"
              extra="支持PDF格式，文件大小不超过50MB"
            >
              <Dragger {...uploadProps} accept=".pdf">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: 48, color: '#1677ff' }} />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">支持PDF格式的产品手册、白皮书等文档</p>
              </Dragger>
            </Form.Item>

            <Form.Item
              name="video"
              label="演示视频"
              extra="支持MP4格式，文件大小不超过500MB"
            >
              <Dragger {...uploadProps} accept=".mp4,.mov">
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                </p>
                <p className="ant-upload-text">点击或拖拽视频文件到此区域上传</p>
                <p className="ant-upload-hint">支持产品演示视频、操作教程等</p>
              </Dragger>
            </Form.Item>

            <Form.Item
              name="images"
              label="产品截图"
              extra="支持JPG、PNG格式，最多上传10张"
            >
              <Upload
                {...uploadProps}
                listType="picture-card"
                accept=".jpg,.jpeg,.png"
                multiple
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              </Upload>
            </Form.Item>
          </Space>
        )

      default:
        return null
    }
  }

  // 如果不是软件企业，显示无权限页面
  if (enterpriseType !== 'supply') {
    return (
      <Result
        status="403"
        title="无权限访问"
        subTitle="抱歉，只有工业软件企业才能发布软件产品。"
        extra={
          <Button type="primary" onClick={() => navigate('/enterprise')}>
            返回工作台
          </Button>
        }
      />
    )
  }

  return (
    <div>
      {/* 页面头部 */}
      <Card 
        style={{ 
          marginBottom: 24, 
          borderRadius: 16,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
        }}
        bodyStyle={{ padding: '24px 32px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ margin: 0, color: '#1e293b', fontWeight: 600 }}>
              {draftId ? '编辑软件草稿' : '发布软件产品'}
            </Title>
            <Text style={{ color: '#64748b', fontSize: 13, marginTop: 4, display: 'block' }}>
              完善软件信息，让更多制造企业发现您的产品
            </Text>
          </div>
          <Space size="middle">
            {draftId && (
              <Tag color="orange" style={{ padding: '4px 12px', fontSize: 13 }}>
                草稿模式
              </Tag>
            )}
            <Button 
              icon={<FileOutlined />}
              onClick={() => setDraftModalVisible(true)}
              style={{ borderRadius: 8, height: 40 }}
            >
              草稿箱 ({drafts.length})
            </Button>
            <Button 
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveDraft}
              loading={saveLoading}
              style={{ 
                borderRadius: 8, 
                height: 40,
                background: '#4f46e5',
                borderColor: '#4f46e5',
              }}
            >
              保存草稿
            </Button>
          </Space>
        </div>
      </Card>

      {/* 步骤条 */}
      <Card 
        style={{ 
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        {/* 自定义步骤条 */}
        <div style={{ marginBottom: 48, padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
            {/* 连接线 */}
            <div style={{
              position: 'absolute',
              top: 20,
              left: '16.67%',
              right: '16.67%',
              height: 2,
              background: '#e2e8f0',
              zIndex: 0,
            }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
                width: currentStep === 0 ? '0%' : currentStep === 1 ? '50%' : '100%',
                transition: 'width 0.4s ease',
              }} />
            </div>

            {steps.map((step, index) => {
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              const isPending = index > currentStep

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 1,
                    flex: 1,
                  }}
                >
                  {/* 步骤图标 */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isActive
                        ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
                        : isCompleted
                        ? '#4f46e5'
                        : '#f1f5f9',
                      border: isActive
                        ? '3px solid #c7d2fe'
                        : isCompleted
                        ? 'none'
                        : '2px solid #e2e8f0',
                      boxShadow: isActive
                        ? '0 4px 14px rgba(79, 70, 229, 0.4)'
                        : isCompleted
                        ? '0 2px 8px rgba(79, 70, 229, 0.3)'
                        : 'none',
                      transition: 'all 0.3s ease',
                      marginBottom: 12,
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircleOutlined style={{ color: '#fff', fontSize: 20 }} />
                    ) : (
                      <span style={{
                        color: isActive ? '#fff' : '#94a3b8',
                        fontSize: 16,
                        fontWeight: 600,
                      }}>
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* 步骤标题 */}
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#4f46e5' : isCompleted ? '#1e293b' : '#94a3b8',
                      marginBottom: 4,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {step.title}
                  </span>

                  {/* 步骤描述 */}
                  <span
                    style={{
                      fontSize: 12,
                      color: isActive ? '#64748b' : isCompleted ? '#64748b' : '#cbd5e1',
                      textAlign: 'center',
                      maxWidth: 120,
                      lineHeight: 1.4,
                    }}
                  >
                    {step.description}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          style={{ maxWidth: 800, margin: '0 auto' }}
        >
          {renderStepContent()}

          <Divider style={{ margin: '48px 0' }} />

          {/* 底部操作按钮 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {currentStep > 0 ? (
              <Button 
                size="large" 
                onClick={handlePrev} 
                style={{ 
                  width: 120, 
                  borderRadius: 10,
                  height: 44,
                  borderColor: '#cbd5e1',
                  color: '#64748b',
                }}
              >
                <ArrowLeftOutlined /> 上一步
              </Button>
            ) : (
              <div />
            )}

            <Space size="middle">
              <Button
                size="large"
                onClick={handleSaveDraft}
                loading={saveLoading}
                icon={<SaveOutlined />}
                style={{ 
                  borderRadius: 10, 
                  height: 44,
                  borderColor: '#cbd5e1',
                }}
              >
                保存草稿
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleNext}
                  style={{ 
                    width: 120, 
                    borderRadius: 10,
                    height: 44,
                    background: '#4f46e5',
                    borderColor: '#4f46e5',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                  }}
                >
                  下一步 <ArrowRightOutlined />
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                  loading={loading}
                  style={{ 
                    width: 160, 
                    borderRadius: 10,
                    height: 44,
                    background: '#4f46e5',
                    borderColor: '#4f46e5',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                  }}
                >
                  提交审核
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Card>

      {/* 草稿箱弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileOutlined style={{ color: '#4f46e5' }} />
            <span>草稿箱</span>
          </div>
        }
        open={draftModalVisible}
        onCancel={() => setDraftModalVisible(false)}
        footer={null}
        width={640}
        bodyStyle={{ padding: '24px' }}
      >
        {drafts.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无草稿"
            style={{ padding: '40px 0' }}
          />
        ) : (
          <List
            dataSource={drafts}
            style={{ maxHeight: 400, overflow: 'auto' }}
            renderItem={(draft) => (
              <List.Item
                style={{
                  padding: '16px 20px',
                  marginBottom: 12,
                  background: '#f8fafc',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                }}
                actions={[
                  <Button
                    key="edit"
                    type="primary"
                    ghost
                    icon={<EditOutlined />}
                    onClick={() => handleUseDraft(draft)}
                    style={{ borderRadius: 6 }}
                  >
                    编辑
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="确定删除此草稿？"
                    onConfirm={() => handleDeleteDraft(draft.id)}
                  >
                    <Button 
                      type="link" 
                      danger 
                      icon={<DeleteOutlined />}
                      style={{ padding: '4px 8px' }}
                    >
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Text strong style={{ fontSize: 15, color: '#1e293b' }}>
                      {draft.name}
                    </Text>
                  }
                  description={
                    <Space direction="vertical" size={2} style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        创建：{new Date(draft.createTime).toLocaleString()}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        更新：{new Date(draft.updateTime).toLocaleString()}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  )
}
