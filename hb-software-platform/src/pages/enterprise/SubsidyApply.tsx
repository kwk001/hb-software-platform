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

const softwareList = [
  { id: 1, name: '智能制造MES系统', company: '湖北智造科技', price: '50-100万' },
  { id: 2, name: '企业资源ERP系统', company: '武汉云智软件', price: '10-50万' },
  { id: 3, name: '产品生命周期PLM', company: '襄阳创新科技', price: '100-500万' },
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
  const [selectedSoftware, setSelectedSoftware] = useState<any>(null)
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
        name: selectedSoftware?.name || `未命名申报_${new Date().toLocaleDateString()}`,
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

  const handleSoftwareChange = (value: number) => {
    const software = softwareList.find(s => s.id === value)
    setSelectedSoftware(software)
    form.setFieldsValue({ softwareCompany: software?.company })
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
            <Alert
              message="选择申报软件"
              description="请选择您已采购的工业软件产品，系统将自动计算可申请的补贴金额。"
              type="info"
              showIcon
            />

            <Form.Item
              name="softwareId"
              label="选择软件"
              rules={[{ required: true, message: '请选择软件' }]}
            >
              <Select
                placeholder="请选择已采购的软件产品"
                size="large"
                onChange={handleSoftwareChange}
              >
                {softwareList.map((software) => (
                  <Option key={software.id} value={software.id}>
                    {software.name} - {software.company}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedSoftware && (
              <Card style={{ background: 'var(--brand-success-bg)', border: '1px solid var(--brand-success)' }}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="软件名称">{selectedSoftware.name}</Descriptions.Item>
                  <Descriptions.Item label="软件企业">{selectedSoftware.company}</Descriptions.Item>
                  <Descriptions.Item label="参考价格">{selectedSoftware.price}</Descriptions.Item>
                </Descriptions>
              </Card>
            )}

            <Form.Item
              name="applyType"
              label="申报类型"
              rules={[{ required: true, message: '请选择申报类型' }]}
              initialValue="first"
            >
              <Radio.Group>
                <Radio value="first">首次申报</Radio>
                <Radio value="additional">追加申报</Radio>
              </Radio.Group>
            </Form.Item>

            <Alert
              message="补贴政策说明"
              description={
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>补贴比例：软件采购金额的50%</li>
                  <li>补贴上限：单次申报最高100万元</li>
                  <li>申报条件：已与软件企业签订正式合同</li>
                </ul>
              }
              type="warning"
              showIcon
            />
          </Space>
        )

      case 1:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="填写合同信息"
              description="请如实填写合同相关信息，确保信息准确无误。"
              type="info"
              showIcon
            />

            <Form.Item
              name="softwareCompany"
              label="软件企业"
            >
              <Input disabled size="large" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="contractNo"
                  label="合同编号"
                  rules={[{ required: true, message: '请输入合同编号' }]}
                >
                  <Input placeholder="请输入合同编号" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="contractDate"
                  label="合同签订日期"
                  rules={[{ required: true, message: '请选择合同签订日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="contractAmount"
                  label="合同总金额（元）"
                  rules={[{ required: true, message: '请输入合同总金额' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
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
                  label="软件部分金额（元）"
                  rules={[{ required: true, message: '请输入软件部分金额' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
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

            <Card style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
              <Space align="start">
                <CalculatorOutlined style={{ fontSize: 24, color: '#1677ff' }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>补贴金额计算</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text>软件金额：¥{softwareAmount.toLocaleString()}</Text>
                    <br />
                    <Text>补贴比例：50%</Text>
                    <br />
                    <Text strong style={{ fontSize: 18, color: '#f5222d' }}>
                      可申请补贴：¥{calculatedSubsidy.toLocaleString()}
                    </Text>
                  </div>
                </div>
              </Space>
            </Card>

            <Form.Item
              name="applyAmount"
              label="申报补贴额度（元）"
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
              extra={`申报额度不能超过可申请补贴金额 ¥${calculatedSubsidy.toLocaleString()}`}
            >
              <InputNumber
                style={{ width: '100%' }}
                size="large"
                min={0}
                max={calculatedSubsidy}
                precision={2}
                placeholder="请输入申报补贴额度"
                prefix="¥"
              />
            </Form.Item>

            <Form.Item
              name="remarks"
              label="备注说明"
            >
              <TextArea
                placeholder="如有其他需要说明的情况，请在此填写"
                rows={3}
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
              message="上传合同附件"
              description="请上传合同扫描件或照片，确保文件清晰可读。"
              type="info"
              showIcon
            />

            <Form.Item
              name="contractFile"
              label="合同扫描件"
              rules={[{ required: true, message: '请上传合同扫描件' }]}
              extra="支持PDF、JPG、PNG格式，文件大小不超过20MB"
            >
              <Dragger {...uploadProps} accept=".pdf,.jpg,.jpeg,.png">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: 48, color: '#1677ff' }} />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">请上传完整的合同扫描件，包含双方签章页</p>
              </Dragger>
            </Form.Item>

            <Form.Item
              name="invoiceFile"
              label="发票凭证"
              extra="支持PDF、JPG、PNG格式，文件大小不超过20MB"
            >
              <Dragger {...uploadProps} accept=".pdf,.jpg,.jpeg,.png">
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">请上传软件采购发票扫描件</p>
              </Dragger>
            </Form.Item>

            <Form.Item
              name="otherFiles"
              label="其他证明材料"
              extra="如有其他证明材料，可在此上传"
            >
              <Upload {...uploadProps} multiple>
                <Button icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
            </Form.Item>
          </Space>
        )

      case 3:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="确认申报信息"
              description="请仔细核对以下信息，确认无误后提交申报。"
              type="info"
              showIcon
            />

            <Card title="申报信息确认" style={{ borderRadius: 8 }}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="申报软件">
                  {selectedSoftware?.name}
                </Descriptions.Item>
                <Descriptions.Item label="软件企业">
                  {selectedSoftware?.company}
                </Descriptions.Item>
                <Descriptions.Item label="合同编号">
                  {form.getFieldValue('contractNo')}
                </Descriptions.Item>
                <Descriptions.Item label="合同金额">
                  ¥{contractAmount.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="软件金额">
                  ¥{softwareAmount.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="可申请补贴">
                  ¥{calculatedSubsidy.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="申报补贴额度">
                  <Text strong style={{ color: '#f5222d', fontSize: 18 }}>
                    ¥{Number(form.getFieldValue('applyAmount') || 0).toLocaleString()}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Alert
              message="提交说明"
              description="提交后，平台将在1-3个工作日内完成审核，审核结果将通过短信和站内信通知您。"
              type="warning"
              showIcon
            />

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
              <div style={{ padding: 16, background: 'var(--brand-success-bg)', borderRadius: 8 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  <input type="checkbox" style={{ marginRight: 8, marginTop: 4 }} />
                  <span>
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
    <div>
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            {draftId ? '编辑申报草稿' : '补贴券申报'}
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
                  提交申报
                </Button>
              )}
            </Space>
          </Space>
        </Form>
      </Card>

      {/* 草稿箱弹窗 */}
      <Modal
        title="申报草稿箱"
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
