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
  DatePicker,
  Radio,
  Space,
  message,
  Alert,
  Divider,
  InputNumber,
  Descriptions,
  Tag,
  Row,
  Col,
  Modal,
  List,
  Empty,
  Popconfirm,
} from 'antd'
import {
  InboxOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  CalculatorOutlined,
  SaveOutlined,
  FileOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import type { UploadProps } from 'antd'

// 草稿存储键
const SUBSIDY_DRAFT_KEY = 'subsidy_apply_drafts'

// 草稿类型
interface SubsidyDraft {
  id: string
  name: string
  data: any
  createTime: string
  updateTime: string
}

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select
const { Dragger } = Upload

// 软件类型列表（而非具体软件产品）
const softwareTypes = [
  { id: 1, name: 'MES系统', description: '制造执行系统', icon: '🏭', color: '#667eea' },
  { id: 2, name: 'ERP系统', description: '企业资源计划系统', icon: '📊', color: '#52c41a' },
  { id: 3, name: 'PLM系统', description: '产品生命周期管理系统', icon: '🔄', color: '#faad14' },
  { id: 4, name: 'SCADA系统', description: '数据采集与监视控制系统', icon: '📡', color: '#1890ff' },
  { id: 5, name: 'WMS系统', description: '仓库管理系统', icon: '📦', color: '#eb2f96' },
  { id: 6, name: 'CRM系统', description: '客户关系管理系统', icon: '👥', color: '#13c2c2' },
  { id: 7, name: 'OA系统', description: '办公自动化系统', icon: '📋', color: '#722ed1' },
  { id: 8, name: '其他工业软件', description: '其他类型的工业软件', icon: '🔧', color: '#8c8c8c' },
]

const subsidyConfig = {
  ratio: 0.5, // 50%补贴比例
  maxAmount: 1000000, // 最高100万
}

export default function SubsidyApply() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const draftId = searchParams.get('draft')
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [selectedSoftwareTypes, setSelectedSoftwareTypes] = useState<any[]>([])
  const [contractAmount, setContractAmount] = useState<number>(0)
  const [softwareAmount, setSoftwareAmount] = useState<number>(0)
  const [draftModalVisible, setDraftModalVisible] = useState(false)
  const [drafts, setDrafts] = useState<SubsidyDraft[]>([])

  const calculatedSubsidy = Math.min(
    Math.floor(softwareAmount * subsidyConfig.ratio),
    subsidyConfig.maxAmount
  )

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

  // 加载草稿
  const loadDrafts = () => {
    const stored = localStorage.getItem(SUBSIDY_DRAFT_KEY)
    if (stored) {
      setDrafts(JSON.parse(stored))
    }
  }

  // 保存草稿
  const handleSaveDraft = async () => {
    try {
      setSaveLoading(true)
      const values = await form.validateFields().catch(() => form.getFieldsValue())
      
      const draft: SubsidyDraft = {
        id: draftId || Date.now().toString(),
        name: selectedSoftwareTypes.length > 0
          ? `${selectedSoftwareTypes.map(s => s.name).join('+')}等${selectedSoftwareTypes.length}个软件`
          : `未命名申报_${new Date().toLocaleDateString()}`,
        data: values,
        createTime: draftId ? (drafts.find(d => d.id === draftId)?.createTime || new Date().toISOString()) : new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }

      const stored = localStorage.getItem(SUBSIDY_DRAFT_KEY)
      let draftList: SubsidyDraft[] = stored ? JSON.parse(stored) : []
      
      const existingIndex = draftList.findIndex(d => d.id === draft.id)
      if (existingIndex >= 0) {
        draftList[existingIndex] = draft
      } else {
        draftList.unshift(draft)
      }

      if (draftList.length > 10) {
        draftList = draftList.slice(0, 10)
      }

      localStorage.setItem(SUBSIDY_DRAFT_KEY, JSON.stringify(draftList))
      setDrafts(draftList)
      message.success('草稿保存成功')
      
      if (!draftId) {
        navigate(`/enterprise/subsidy/apply?draft=${draft.id}`, { replace: true })
      }
    } catch (error) {
      message.error('草稿保存失败')
    } finally {
      setSaveLoading(false)
    }
  }

  // 删除草稿
  const handleDeleteDraft = (id: string) => {
    const stored = localStorage.getItem(SUBSIDY_DRAFT_KEY)
    if (stored) {
      let draftList: SubsidyDraft[] = JSON.parse(stored)
      draftList = draftList.filter(d => d.id !== id)
      localStorage.setItem(SUBSIDY_DRAFT_KEY, JSON.stringify(draftList))
      setDrafts(draftList)
      message.success('草稿删除成功')
    }
  }

  // 使用草稿
  const handleUseDraft = (draft: SubsidyDraft) => {
    navigate(`/enterprise/subsidy/apply?draft=${draft.id}`)
    form.setFieldsValue(draft.data)
    // 恢复软件类型多选状态
    const softwareTypeIds = draft.data.softwareTypes?.split(',').map((id: string) => parseInt(id)) || []
    const restoredTypes = softwareTypes.filter(type => softwareTypeIds.includes(type.id))
    setSelectedSoftwareTypes(restoredTypes)
    setDraftModalVisible(false)
    message.success('草稿加载成功')
  }

  useEffect(() => {
    loadDrafts()
    if (draftId) {
      const stored = localStorage.getItem(SUBSIDY_DRAFT_KEY)
      if (stored) {
        const draftList: SubsidyDraft[] = JSON.parse(stored)
        const draft = draftList.find(d => d.id === draftId)
        if (draft) {
          form.setFieldsValue(draft.data)
          // 恢复软件类型多选状态
          const softwareTypeIds = draft.data.softwareTypes?.split(',').map((id: string) => parseInt(id)) || []
          const restoredTypes = softwareTypes.filter(type => softwareTypeIds.includes(type.id))
          setSelectedSoftwareTypes(restoredTypes)
        }
      }
    }
  }, [draftId])

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        message.success('补贴券申报已提交，等待平台审核')
        navigate('/enterprise/subsidy/list')
      }, 1500)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleSoftwareTypeToggle = (type: any) => {
    setSelectedSoftwareTypes(prev => {
      const exists = prev.find(s => s.id === type.id)
      if (exists) {
        return prev.filter(s => s.id !== type.id)
      } else {
        return [...prev, type]
      }
    })
  }

  const handleSoftwareTypeRemove = (typeId: number) => {
    setSelectedSoftwareTypes(prev => prev.filter(s => s.id !== typeId))
  }

  const steps = [
    { title: '选择软件', icon: <SafetyCertificateOutlined /> },
    { title: '填写信息', icon: <FileTextOutlined /> },
    { title: '上传附件', icon: <UploadOutlined /> },
    { title: '确认提交', icon: <CheckCircleOutlined /> },
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* 步骤标题卡片 */}
            <Card
              style={{
                borderRadius: 16,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SafetyCertificateOutlined style={{ fontSize: 28, color: '#fff' }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0, color: '#fff' }}>选择软件类型</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                    请选择您已采购的工业软件类型，系统将自动计算可申请的补贴金额
                  </Text>
                </div>
              </div>
            </Card>

            {/* 软件类型选择 - 多选卡片 */}
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid var(--border-light)',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Form.Item
                name="softwareTypes"
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>软件类型</span>
                    <span style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 400 }}>
                      （可多选，已选择 {selectedSoftwareTypes.length} 个）
                    </span>
                  </div>
                }
                rules={[
                  {
                    validator: () => {
                      if (selectedSoftwareTypes.length === 0) {
                        return Promise.reject('请至少选择一个软件类型')
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
              >
                <div style={{ display: 'none' }}>
                  <Input value={selectedSoftwareTypes.map(s => s.id).join(',')} />
                </div>
              </Form.Item>

              {/* 软件类型卡片网格 */}
              <Row gutter={[16, 16]}>
                {softwareTypes.map((type) => {
                  const isSelected = selectedSoftwareTypes.find(s => s.id === type.id)
                  return (
                    <Col span={8} key={type.id}>
                      <div
                        onClick={() => handleSoftwareTypeToggle(type)}
                        style={{
                          padding: 20,
                          borderRadius: 12,
                          cursor: 'pointer',
                          border: `2px solid ${isSelected ? type.color : '#e8e8e8'}`,
                          background: isSelected
                            ? `linear-gradient(135deg, ${type.color}15 0%, ${type.color}08 100%)`
                            : '#fafafa',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* 选中标记 */}
                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: type.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckCircleOutlined style={{ fontSize: 14, color: '#fff' }} />
                          </div>
                        )}

                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: 14,
                              background: isSelected
                                ? `linear-gradient(135deg, ${type.color} 0%, ${type.color}dd 100%)`
                                : '#e8e8e8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 24,
                              margin: '0 auto 12px',
                              boxShadow: isSelected ? `0 4px 12px ${type.color}40` : 'none',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {type.icon}
                          </div>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: isSelected ? type.color : 'var(--text-primary)',
                              marginBottom: 4,
                            }}
                          >
                            {type.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: 'var(--text-secondary)',
                              lineHeight: 1.4,
                            }}
                          >
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </Col>
                  )
                })}
              </Row>

              {/* 已选软件类型标签 */}
              {selectedSoftwareTypes.length > 0 && (
                <div
                  style={{
                    marginTop: 24,
                    padding: 20,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #f6ffed 0%, #e6fffb 100%)',
                    border: '1px solid #52c41a40',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#52c41a', marginBottom: 12 }}>
                    已选择的软件类型：
                  </div>
                  <Space size={[12, 12]} wrap>
                    {selectedSoftwareTypes.map((type) => (
                      <Tag
                        key={type.id}
                        closable
                        onClose={() => handleSoftwareTypeRemove(type.id)}
                        style={{
                          padding: '8px 16px',
                          fontSize: 14,
                          borderRadius: 8,
                          background: `${type.color}15`,
                          border: `1px solid ${type.color}40`,
                          color: type.color,
                        }}
                      >
                        <Space>
                          <span>{type.icon}</span>
                          <span style={{ fontWeight: 500 }}>{type.name}</span>
                        </Space>
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}
            </Card>

            {/* 申报类型 - 已隐藏 */}
            <Form.Item
              name="applyType"
              initialValue="first"
              style={{ display: 'none' }}
            >
              <Input type="hidden" />
            </Form.Item>

            {/* 补贴政策说明 */}
            <Card
              style={{
                borderRadius: 16,
                background: 'linear-gradient(135deg, #fff7e6 0%, #fff1d6 100%)',
                border: '1px solid #ffd591',
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <InfoCircleOutlined style={{ fontSize: 20, color: '#fa8c16', marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#d46b08', marginBottom: 8 }}>
                    补贴政策说明
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, color: '#ad6800', lineHeight: 1.8 }}>
                    <li>补贴比例：软件采购金额的 <strong>50%</strong></li>
                    <li>补贴上限：单次申报最高 <strong>100万元</strong></li>
                    <li>申报条件：已与软件企业签订正式合同</li>
                  </ul>
                </div>
              </div>
            </Card>
          </Space>
        )

      case 1:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* 步骤标题卡片 */}
            <Card
              style={{
                borderRadius: 16,
                background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                border: 'none',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileTextOutlined style={{ fontSize: 28, color: '#fff' }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0, color: '#fff' }}>填写合同信息</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                    请如实填写合同相关信息，确保信息准确无误
                  </Text>
                </div>
              </div>
            </Card>

            {/* 合同信息表单 */}
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid var(--border-light)',
              }}
              bodyStyle={{ padding: '24px' }}
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>基本信息</span>}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="contractNo"
                    label={<span style={{ fontWeight: 500 }}>合同编号</span>}
                    rules={[{ required: true, message: '请输入合同编号' }]}
                  >
                    <Input 
                      placeholder="请输入合同编号" 
                      size="large"
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="contractDate"
                    label={<span style={{ fontWeight: 500 }}>合同签订日期</span>}
                    rules={[{ required: true, message: '请选择合同签订日期' }]}
                  >
                    <DatePicker 
                      style={{ width: '100%', borderRadius: 8 }} 
                      size="large" 
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 金额信息 */}
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid var(--border-light)',
              }}
              bodyStyle={{ padding: '24px' }}
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>金额信息</span>}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="contractAmount"
                    label={<span style={{ fontWeight: 500 }}>合同总金额（元）</span>}
                    rules={[{ required: true, message: '请输入合同总金额' }]}
                  >
                    <InputNumber
                      style={{ width: '100%', borderRadius: 8 }}
                      size="large"
                      min={0}
                      precision={2}
                      placeholder="请输入合同总金额"
                      onChange={(value) => setContractAmount(Number(value) || 0)}
                      prefix="¥"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="softwareAmount"
                    label={<span style={{ fontWeight: 500 }}>软件部分金额（元）</span>}
                    rules={[{ required: true, message: '请输入软件部分金额' }]}
                  >
                    <InputNumber
                      style={{ width: '100%', borderRadius: 8 }}
                      size="large"
                      min={0}
                      precision={2}
                      placeholder="请输入软件部分金额"
                      onChange={(value) => setSoftwareAmount(Number(value) || 0)}
                      prefix="¥"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* 补贴计算卡片 */}
              <div
                style={{
                  marginTop: 16,
                  padding: 24,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%)',
                  border: '1px solid #91d5ff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CalculatorOutlined style={{ fontSize: 24, color: '#fff' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
                      补贴金额计算
                    </div>
                    <Row gutter={24}>
                      <Col span={8}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>软件金额</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
                          ¥{softwareAmount.toLocaleString()}
                        </div>
                      </Col>
                      <Col span={8}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>补贴比例</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: '#1890ff' }}>50%</div>
                      </Col>
                      <Col span={8}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>可申请补贴</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#f5222d' }}>
                          ¥{calculatedSubsidy.toLocaleString()}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <Form.Item
                name="applyAmount"
                label={<span style={{ fontWeight: 500, marginTop: 16 }}>申报补贴额度（元）</span>}
                rules={[
                  { required: true, message: '请输入申报补贴额度' },
                  {
                    validator: (_, value) => {
                      if (value && value > calculatedSubsidy) {
                        return Promise.reject('申报额度不能超过可申请补贴金额')
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
                extra={<span style={{ color: '#8c8c8c' }}>申报额度不能超过可申请补贴金额 ¥{calculatedSubsidy.toLocaleString()}</span>}
                style={{ marginTop: 16 }}
              >
                <InputNumber
                  style={{ width: '100%', borderRadius: 8 }}
                  size="large"
                  min={0}
                  max={calculatedSubsidy}
                  precision={2}
                  placeholder="请输入申报补贴额度"
                  prefix="¥"
                />
              </Form.Item>
            </Card>

            {/* 备注说明 */}
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid var(--border-light)',
              }}
              bodyStyle={{ padding: '24px' }}
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>其他信息</span>}
            >
              <Form.Item
                name="remarks"
                label={<span style={{ fontWeight: 500 }}>备注说明</span>}
              >
                <TextArea
                  placeholder="如有其他需要说明的情况，请在此填写"
                  rows={4}
                  showCount
                  maxLength={500}
                  style={{ borderRadius: 8, resize: 'none' }}
                />
              </Form.Item>
            </Card>
          </Space>
        )

      case 2:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* 步骤标题卡片 */}
            <Card
              style={{
                borderRadius: 16,
                background: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)',
                border: 'none',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UploadOutlined style={{ fontSize: 28, color: '#fff' }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0, color: '#fff' }}>上传合同附件</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                    请上传合同扫描件或照片，确保文件清晰可读
                  </Text>
                </div>
              </div>
            </Card>

            {/* 合同扫描件 */}
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid var(--border-light)',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Form.Item
                name="contractFile"
                label={<span style={{ fontSize: 16, fontWeight: 600 }}>合同扫描件 <span style={{ color: '#f5222d' }}>*</span></span>}
                rules={[{ required: true, message: '请上传合同扫描件' }]}
              >
                <Dragger 
                  {...uploadProps} 
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ 
                    borderRadius: 12,
                    border: '2px dashed #d9d9d9',
                    background: '#fafafa',
                  }}
                >
                  <div style={{ padding: '20px 0' }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      <InboxOutlined style={{ fontSize: 36, color: '#fff' }} />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>
                      点击或拖拽文件到此区域上传
                    </p>
                    <p style={{ fontSize: 13, color: '#8c8c8c' }}>
                      支持PDF、JPG、PNG格式，文件大小不超过20MB
                    </p>
                    <p style={{ fontSize: 13, color: '#fa8c16', marginTop: 8 }}>
                      请上传完整的合同扫描件，包含双方签章页
                    </p>
                  </div>
                </Dragger>
              </Form.Item>
            </Card>

            {/* 发票凭证 */}
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid var(--border-light)',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Form.Item
                name="invoiceFile"
                label={<span style={{ fontSize: 16, fontWeight: 600 }}>发票凭证</span>}
              >
                <Dragger 
                  {...uploadProps} 
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ 
                    borderRadius: 12,
                    border: '2px dashed #d9d9d9',
                    background: '#fafafa',
                  }}
                >
                  <div style={{ padding: '20px 0' }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                      }}
                    >
                      <UploadOutlined style={{ fontSize: 36, color: '#fff' }} />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>
                      点击或拖拽文件到此区域上传
                    </p>
                    <p style={{ fontSize: 13, color: '#8c8c8c' }}>
                      支持PDF、JPG、PNG格式，文件大小不超过20MB
                    </p>
                    <p style={{ fontSize: 13, color: '#52c41a', marginTop: 8 }}>
                      请上传软件采购发票扫描件
                    </p>
                  </div>
                </Dragger>
              </Form.Item>
            </Card>

            {/* 其他证明材料 */}
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid var(--border-light)',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Form.Item
                name="otherFiles"
                label={<span style={{ fontSize: 16, fontWeight: 600 }}>其他证明材料</span>}
              >
                <Upload {...uploadProps} multiple>
                  <Button 
                    icon={<UploadOutlined />}
                    size="large"
                    style={{ borderRadius: 8 }}
                  >
                    选择文件
                  </Button>
                </Upload>
                <div style={{ marginTop: 8, fontSize: 13, color: '#8c8c8c' }}>
                  如有其他证明材料，可在此上传
                </div>
              </Form.Item>
            </Card>
          </Space>
        )

      case 3:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* 步骤标题卡片 */}
            <Card
              style={{
                borderRadius: 16,
                background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
                border: 'none',
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircleOutlined style={{ fontSize: 28, color: '#fff' }} />
                </div>
                <div>
                  <Title level={4} style={{ margin: 0, color: '#fff' }}>确认申报信息</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                    请仔细核对以下信息，确认无误后提交申报
                  </Text>
                </div>
              </div>
            </Card>

            {/* 申报信息确认 */}
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid var(--border-light)',
              }}
              bodyStyle={{ padding: 0 }}
              title={<span style={{ fontSize: 16, fontWeight: 600 }}>申报信息汇总</span>}
            >
              <div style={{ padding: '24px' }}>
                {/* 软件类型 - 多选展示 */}
                <div
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #f6ffed 0%, #e6fffb 100%)',
                    border: '1px solid #52c41a40',
                    marginBottom: 24,
                  }}
                >
                  <div style={{ fontSize: 13, color: '#52c41a', marginBottom: 12 }}>
                    申报软件类型（{selectedSoftwareTypes.length}个）
                  </div>
                  <Space size={[12, 12]} wrap>
                    {selectedSoftwareTypes.map((type) => (
                      <div
                        key={type.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 16px',
                          borderRadius: 10,
                          background: `${type.color}15`,
                          border: `1px solid ${type.color}40`,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: `linear-gradient(135deg, ${type.color} 0%, ${type.color}dd 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                          }}
                        >
                          {type.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: type.color }}>
                            {type.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                            {type.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Space>
                </div>

                {/* 信息列表 */}
                <Row gutter={[24, 16]}>
                  <Col span={12}>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 10,
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                      }}
                    >
                      <div style={{ fontSize: 13, color: '#52c41a', marginBottom: 4 }}>合同编号</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {form.getFieldValue('contractNo') || '-'}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 10,
                        background: '#e6f7ff',
                        border: '1px solid #91d5ff',
                      }}
                    >
                      <div style={{ fontSize: 13, color: '#1890ff', marginBottom: 4 }}>合同金额</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                        ¥{contractAmount.toLocaleString()}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 10,
                        background: '#f9f0ff',
                        border: '1px solid #d3adf7',
                      }}
                    >
                      <div style={{ fontSize: 13, color: '#722ed1', marginBottom: 4 }}>软件金额</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                        ¥{softwareAmount.toLocaleString()}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 10,
                        background: '#fff7e6',
                        border: '1px solid #ffd591',
                      }}
                    >
                      <div style={{ fontSize: 13, color: '#fa8c16', marginBottom: 4 }}>可申请补贴</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                        ¥{calculatedSubsidy.toLocaleString()}
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* 申报补贴额度 */}
                <div
                  style={{
                    marginTop: 24,
                    padding: 24,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)',
                    border: '1px solid #ff4d4f',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 14, color: '#cf1322', marginBottom: 8 }}>申报补贴额度</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#f5222d' }}>
                    ¥{Number(form.getFieldValue('applyAmount') || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>

            {/* 提交说明 */}
            <Card
              style={{
                borderRadius: 16,
                background: 'linear-gradient(135deg, #fff7e6 0%, #fff1d6 100%)',
                border: '1px solid #ffd591',
              }}
              bodyStyle={{ padding: '20px 24px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <InfoCircleOutlined style={{ fontSize: 20, color: '#fa8c16', marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#d46b08', marginBottom: 8 }}>
                    提交说明
                  </div>
                  <div style={{ fontSize: 14, color: '#ad6800', lineHeight: 1.8 }}>
                    提交后，平台将在 <strong>1-3个工作日</strong> 内完成审核，审核结果将通过短信和站内信通知您。
                    请确保填写的信息真实有效，如有虚假将承担相应法律责任。
                  </div>
                </div>
              </div>
            </Card>

            {/* 确认声明 */}
            <Form.Item
              name="confirm"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('请确认信息真实有效')),
                },
              ]}
            >
              <div
                style={{
                  padding: 20,
                  background: 'linear-gradient(135deg, #f6ffed 0%, #e6fffb 100%)',
                  borderRadius: 12,
                  border: '1px solid #52c41a40',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                  }}
                >
                  <input type="checkbox" style={{ marginRight: 12, marginTop: 4, width: 16, height: 16 }} />
                  <span style={{ fontSize: 14, lineHeight: 1.6 }}>
                    我确认以上填写的信息真实有效，提交的合同和发票等材料真实合法。
                    如有虚假，愿意承担相应的法律责任。
                  </span>
                </label>
              </div>
            </Form.Item>
          </Space>
        )

      default:
        return null
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SafetyCertificateOutlined style={{ fontSize: 28, color: '#fff' }} />
            </div>
            <div>
              <Title level={4} style={{ margin: 0, color: '#fff' }}>
                {draftId ? '编辑申报草稿' : '补贴券申报'}
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
                申请工业软件采购补贴，享受50%补贴优惠
              </Text>
            </div>
          </div>
          <Space>
            <Button
              icon={<FileOutlined />}
              onClick={() => setDraftModalVisible(true)}
              style={{
                borderRadius: 8,
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
              }}
            >
              草稿箱 ({drafts.length})
            </Button>
            <Button
              icon={<SaveOutlined />}
              onClick={handleSaveDraft}
              loading={saveLoading}
              style={{
                borderRadius: 8,
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                color: '#667eea',
                fontWeight: 500,
              }}
            >
              保存草稿
            </Button>
          </Space>
        </div>
      </Card>

      <Card
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-light)',
        }}
        bodyStyle={{ padding: '32px' }}
      >
        {/* 自定义步骤条 */}
        <div style={{ marginBottom: 40 }}>
          <Steps
            current={currentStep}
            items={steps}
            style={{ maxWidth: 800, margin: '0 auto' }}
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          style={{ maxWidth: 800, margin: '0 auto' }}
        >
          {renderStepContent()}

          <Divider style={{ margin: '40px 0' }} />

          {/* 底部操作按钮 */}
          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {currentStep > 0 ? (
              <Button
                size="large"
                onClick={handlePrev}
                style={{
                  width: 120,
                  borderRadius: 8,
                  height: 44,
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
                  borderRadius: 8,
                  height: 44,
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
                    borderRadius: 8,
                    height: 44,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
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
                    borderRadius: 8,
                    height: 44,
                    background: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)',
                    border: 'none',
                  }}
                >
                  提交申报
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Card>

      {/* 草稿箱弹窗 */}
      <Modal
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
              <FileOutlined style={{ fontSize: 18, color: '#fff' }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600 }}>申报草稿箱</span>
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
            renderItem={(draft) => (
              <List.Item
                style={{
                  padding: '16px 20px',
                  borderRadius: 12,
                  background: '#fafafa',
                  marginBottom: 12,
                  border: '1px solid var(--border-light)',
                }}
                actions={[
                  <Button
                    key="edit"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleUseDraft(draft)}
                    style={{
                      borderRadius: 6,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                    }}
                  >
                    编辑
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="确定删除此草稿？"
                    onConfirm={() => handleDeleteDraft(draft.id)}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      style={{ borderRadius: 6 }}
                    >
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {draft.name}
                    </span>
                  }
                  description={
                    <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        创建时间：{new Date(draft.createTime).toLocaleString()}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>
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
