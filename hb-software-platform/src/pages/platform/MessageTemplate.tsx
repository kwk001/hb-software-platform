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
  Form,
  Switch,
  Typography,
  Tooltip,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  MailOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  AppstoreOutlined,
  DollarOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select
const { TextArea } = Input

// 消息模板类型
const templateTypes = [
  { value: 'all', label: '全部类型' },
  { value: 'enterprise', label: '企业入驻', icon: <ShopOutlined /> },
  { value: 'software', label: '软件发布', icon: <AppstoreOutlined /> },
  { value: 'subsidy', label: '补贴券', icon: <DollarOutlined /> },
  { value: 'message', label: '留言回复', icon: <MessageOutlined /> },
  { value: 'system', label: '系统通知', icon: <MailOutlined /> },
]

// 通知渠道
const notifyChannels = [
  { value: 'site', label: '站内信', color: 'blue' },
  { value: 'sms', label: '短信', color: 'green' },
  { value: 'email', label: '邮件', color: 'purple' },
]

// 模拟消息模板数据
const templateList = [
  {
    id: 1,
    code: 'ENTERPRISE_AUDIT_PASS',
    name: '企业入驻审核通过',
    type: 'enterprise',
    title: '企业入驻审核通过通知',
    content: '恭喜！您的企业「{enterpriseName}」入驻申请已通过审核，您现在可以正常使用平台功能。',
    channels: ['site', 'sms'],
    enabled: true,
    variables: ['enterpriseName'],
    description: '企业入驻审核通过时发送',
    createTime: '2026-01-01 00:00:00',
  },
  {
    id: 2,
    code: 'ENTERPRISE_AUDIT_REJECT',
    name: '企业入驻审核驳回',
    type: 'enterprise',
    title: '企业入驻审核未通过',
    content: '您的企业「{enterpriseName}」入驻申请未通过审核，原因：{reason}。请修改后重新提交。',
    channels: ['site', 'sms'],
    enabled: true,
    variables: ['enterpriseName', 'reason'],
    description: '企业入驻审核驳回时发送',
    createTime: '2026-01-01 00:00:00',
  },
  {
    id: 3,
    code: 'SOFTWARE_AUDIT_PASS',
    name: '软件发布审核通过',
    type: 'software',
    title: '软件发布审核通过',
    content: '您发布的软件「{softwareName}」已通过审核，已上架展示。',
    channels: ['site', 'sms'],
    enabled: true,
    variables: ['softwareName'],
    description: '软件发布审核通过时发送',
    createTime: '2026-01-01 00:00:00',
  },
  {
    id: 4,
    code: 'SOFTWARE_AUDIT_REJECT',
    name: '软件发布审核驳回',
    type: 'software',
    title: '软件发布审核未通过',
    content: '您发布的软件「{softwareName}」未通过审核，原因：{reason}。',
    channels: ['site', 'sms'],
    enabled: true,
    variables: ['softwareName', 'reason'],
    description: '软件发布审核驳回时发送',
    createTime: '2026-01-01 00:00:00',
  },
  {
    id: 5,
    code: 'SUBSIDY_AUDIT_PASS',
    name: '补贴券审核通过',
    type: 'subsidy',
    title: '补贴券审核通过',
    content: '您的补贴券申报已通过审核，补贴额度：¥{amount}，请尽快使用。',
    channels: ['site', 'sms'],
    enabled: true,
    variables: ['amount'],
    description: '补贴券审核通过时发送',
    createTime: '2026-01-01 00:00:00',
  },
  {
    id: 6,
    code: 'SUBSIDY_AUDIT_REJECT',
    name: '补贴券审核驳回',
    type: 'subsidy',
    title: '补贴券审核未通过',
    content: '您的补贴券申报未通过审核，原因：{reason}。',
    channels: ['site', 'sms'],
    enabled: true,
    variables: ['reason'],
    description: '补贴券审核驳回时发送',
    createTime: '2026-01-01 00:00:00',
  },
  {
    id: 7,
    code: 'MESSAGE_REPLY',
    name: '留言回复通知',
    type: 'message',
    title: '留言回复通知',
    content: '平台管理员已回复您的留言「{messageTitle}」，请查看。',
    channels: ['site'],
    enabled: true,
    variables: ['messageTitle'],
    description: '平台管理员回复留言时发送',
    createTime: '2026-01-01 00:00:00',
  },
  {
    id: 8,
    code: 'POLICY_PUBLISH',
    name: '政策发布通知',
    type: 'system',
    title: '新政策发布',
    content: '《{policyName}》已发布，请及时查看并申报。',
    channels: ['site'],
    enabled: true,
    variables: ['policyName'],
    description: '新政策支持发布时发送',
    createTime: '2026-01-01 00:00:00',
  },
]

const MessageTemplate = () => {
  const [type, setType] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [form] = Form.useForm()
  const [templates, setTemplates] = useState(templateList)

  const getTypeTag = (type: string) => {
    const typeInfo = templateTypes.find(t => t.value === type)
    return typeInfo ? <Tag icon={typeInfo.icon}>{typeInfo.label}</Tag> : <Tag>{type}</Tag>
  }

  const getChannelTags = (channels: string[]) => {
    return (
      <Space>
        {channels.map(channel => {
          const channelInfo = notifyChannels.find(c => c.value === channel)
          return channelInfo ? (
            <Tag key={channel} color={channelInfo.color}>{channelInfo.label}</Tag>
          ) : null
        })}
      </Space>
    )
  }

  const columns = [
    {
      title: '模板编码',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeTag(type),
    },
    {
      title: '通知渠道',
      dataIndex: 'channels',
      key: 'channels',
      render: (channels: string[]) => getChannelTags(channels),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: any) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleStatusChange(record, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            预览
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  const handleStatusChange = (record: any, enabled: boolean) => {
    const updated = templates.map(t =>
      t.id === record.id ? { ...t, enabled } : t
    )
    setTemplates(updated)
    message.success(`${record.name} 已${enabled ? '启用' : '禁用'}`)
  }

  const handlePreview = (record: any) => {
    setSelectedRecord(record)
    setIsEdit(false)
    setIsModalOpen(true)
    form.setFieldsValue(record)
  }

  const handleEdit = (record: any) => {
    setSelectedRecord(record)
    setIsEdit(true)
    setIsModalOpen(true)
    form.setFieldsValue(record)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      message.success('模板已保存')
      setIsModalOpen(false)
    } catch (error) {
      message.error('请完善表单信息')
    }
  }

  const filteredTemplates = templates.filter(t => {
    if (type !== 'all' && t.type !== type) return false
    if (searchText && !t.name.includes(searchText) && !t.code.includes(searchText)) return false
    return true
  })

  return (
    <div>
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Search
              placeholder="搜索模板名称或编码"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              enterButton={<><SearchOutlined /> 搜索</>}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              value={type}
              onChange={setType}
              style={{ width: '100%' }}
              placeholder="选择类型"
            >
              {templateTypes.map(t => (
                <Option key={t.value} value={t.value}>{t.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} lg={10} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<ReloadOutlined />}>
                刷新
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setIsEdit(false)
                setSelectedRecord(null)
                form.resetFields()
                setIsModalOpen(true)
              }}>
                新增模板
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: '12px' }}>
        <Table
          columns={columns}
          dataSource={filteredTemplates}
          rowKey="id"
          pagination={{
            total: filteredTemplates.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 模板编辑/预览弹窗 */}
      <Modal
        title={isEdit ? '编辑消息模板' : '查看消息模板'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={isEdit ? handleSubmit : () => setIsModalOpen(false)}
        okText={isEdit ? '保存' : '关闭'}
        cancelText={isEdit ? '取消' : undefined}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="模板编码"
                rules={[{ required: true, message: '请输入模板编码' }]}
              >
                <Input disabled={!isEdit} placeholder="如：ENTERPRISE_AUDIT_PASS" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="模板名称"
                rules={[{ required: true, message: '请输入模板名称' }]}
              >
                <Input disabled={!isEdit} placeholder="请输入模板名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="模板类型"
                rules={[{ required: true, message: '请选择模板类型' }]}
              >
                <Select disabled={!isEdit} placeholder="请选择模板类型">
                  {templateTypes.filter(t => t.value !== 'all').map(t => (
                    <Option key={t.value} value={t.value}>{t.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="channels"
                label="通知渠道"
                rules={[{ required: true, message: '请选择通知渠道' }]}
              >
                <Select disabled={!isEdit} mode="multiple" placeholder="请选择通知渠道">
                  {notifyChannels.map(c => (
                    <Option key={c.value} value={c.value}>{c.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="title"
            label="消息标题"
            rules={[{ required: true, message: '请输入消息标题' }]}
          >
            <Input disabled={!isEdit} placeholder="请输入消息标题" />
          </Form.Item>
          <Form.Item
            name="content"
            label="消息内容"
            rules={[{ required: true, message: '请输入消息内容' }]}
            extra={
              <Text type="secondary">
                <InfoCircleOutlined /> 使用 {'{variableName}'} 格式插入变量
              </Text>
            }
          >
            <TextArea
              disabled={!isEdit}
              rows={4}
              placeholder="请输入消息内容，使用 {变量名} 格式插入变量"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="模板说明"
          >
            <Input disabled={!isEdit} placeholder="请输入模板说明" />
          </Form.Item>
          {selectedRecord?.variables && (
            <Form.Item label="可用变量">
              <Space>
                {selectedRecord.variables.map((v: string) => (
                  <Tag key={v} color="blue">{'{' + v + '}'}</Tag>
                ))}
              </Space>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default MessageTemplate
