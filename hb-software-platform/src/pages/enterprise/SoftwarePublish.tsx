import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Steps,
  Upload,
  Radio,
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
    { title: '基本信息', icon: <InfoCircleOutlined /> },
    { title: '功能介绍', icon: <FileTextOutlined /> },
    { title: '附件上传', icon: <UploadOutlined /> },
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="软件基本信息"
              description="请填写软件的基本信息，这些信息将展示在平台门户上供制造企业浏览。"
              type="info"
              showIcon
            />

            <Form.Item
              name="name"
              label="软件名称"
              rules={[{ required: true, message: '请输入软件名称' }]}
            >
              <Input placeholder="请输入软件产品名称" size="large" />
            </Form.Item>

            <Form.Item
              name="category"
              label="软件类别"
              rules={[{ required: true, message: '请选择软件类别' }]}
            >
              <Select placeholder="请选择软件类别" size="large">
                {softwareCategories.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="industries"
              label="适用行业"
              rules={[{ required: true, message: '请选择适用行业' }]}
            >
              <Select mode="multiple" placeholder="请选择适用行业" size="large">
                {industries.map((ind) => (
                  <Option key={ind.value} value={ind.value}>
                    {ind.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="deployment"
              label="部署方式"
              rules={[{ required: true, message: '请选择部署方式' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  {deploymentTypes.map((type) => (
                    <Radio key={type.value} value={type.value}>
                      {type.label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="priceRange"
              label="价格区间"
              rules={[{ required: true, message: '请选择价格区间' }]}
            >
              <Select placeholder="请选择价格区间" size="large">
                {priceRanges.map((price) => (
                  <Option key={price.value} value={price.value}>
                    {price.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="brief"
              label="软件简介"
              rules={[{ required: true, message: '请输入软件简介' }]}
            >
              <TextArea
                placeholder="请简要介绍软件的核心功能和特点"
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Space>
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
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            {draftId ? '编辑软件草稿' : '发布软件产品'}
            {draftId && <Tag color="orange" style={{ marginLeft: 12 }}>草稿模式</Tag>}
          </Title>
          <Space>
            <Button 
              icon={<FileOutlined />}
              onClick={() => setDraftModalVisible(true)}
            >
              草稿箱 ({drafts.length})
            </Button>
            <Button 
              icon={<SaveOutlined />}
              onClick={handleSaveDraft}
              loading={saveLoading}
            >
              保存草稿
            </Button>
          </Space>
        </div>
      </Card>

      <Card style={{ borderRadius: 12 }}>
        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 40 }}
        />

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          style={{ maxWidth: 800, margin: '0 auto' }}
        >
          {renderStepContent()}

          <Divider style={{ margin: '40px 0' }} />

          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            {currentStep > 0 ? (
              <Button size="large" onClick={handlePrev} style={{ width: 120 }}>
                <ArrowLeftOutlined /> 上一步
              </Button>
            ) : (
              <div />
            )}

            <Space>
              <Button
                size="large"
                onClick={handleSaveDraft}
                loading={saveLoading}
                icon={<SaveOutlined />}
              >
                保存草稿
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleNext}
                  style={{ width: 120 }}
                >
                  下一步 <ArrowRightOutlined />
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                  loading={loading}
                  style={{ width: 160 }}
                >
                  提交审核
                </Button>
              )}
            </Space>
          </Space>
        </Form>
      </Card>

      {/* 草稿箱弹窗 */}
      <Modal
        title="草稿箱"
        open={draftModalVisible}
        onCancel={() => setDraftModalVisible(false)}
        footer={null}
        width={600}
      >
        {drafts.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无草稿"
          />
        ) : (
          <List
            dataSource={drafts}
            renderItem={(draft) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleUseDraft(draft)}
                  >
                    编辑
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="确定删除此草稿？"
                    onConfirm={() => handleDeleteDraft(draft.id)}
                  >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={draft.name}
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">
                        创建时间：{new Date(draft.createTime).toLocaleString()}
                      </Text>
                      <Text type="secondary">
                        更新时间：{new Date(draft.updateTime).toLocaleString()}
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
