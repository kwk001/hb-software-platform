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
  Statistic,
  Badge,
  Divider,
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
  ShopOutlined,
  AppstoreOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SafetyCertificateOutlined,
  CopyOutlined,
  SoundOutlined,
  TagsOutlined,
  BellOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { Search } = Input
const { Option } = Select
const { TextArea } = Input

// 消息模板类型
const templateTypes = [
  { value: 'all', label: '全部类型' },
  { value: 'enterprise', label: '企业入驻', icon: <ShopOutlined />, color: '#1890ff', bg: '#e6f7ff' },
  { value: 'software', label: '软件发布', icon: <AppstoreOutlined />, color: '#52c41a', bg: '#f6ffed' },
  { value: 'subsidy', label: '补贴券', icon: <DollarOutlined />, color: '#faad14', bg: '#fffbe6' },
  { value: 'message', label: '留言回复', icon: <MessageOutlined />, color: '#722ed1', bg: '#f9f0ff' },
  { value: 'system', label: '系统通知', icon: <MailOutlined />, color: '#13c2c2', bg: '#e6fffb' },
]

// 通知渠道
const notifyChannels = [
  { value: 'site', label: '站内信', color: '#1890ff', bg: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)', icon: <MessageOutlined /> },
  { value: 'sms', label: '短信', color: '#52c41a', bg: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', icon: <SafetyCertificateOutlined /> },
  { value: 'email', label: '邮件', color: '#722ed1', bg: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)', icon: <MailOutlined /> },
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
    usageCount: 156,
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
    usageCount: 23,
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
    usageCount: 89,
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
    usageCount: 12,
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
    usageCount: 234,
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
    usageCount: 45,
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
    usageCount: 567,
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
    usageCount: 34,
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

  // 统计数据
  const stats = {
    total: templates.length,
    enabled: templates.filter(t => t.enabled).length,
    disabled: templates.filter(t => !t.enabled).length,
    totalUsage: templates.reduce((sum, t) => sum + (t.usageCount || 0), 0),
  }

  // 按类型统计
  const typeStats = templateTypes.filter(t => t.value !== 'all').map(t => ({
    ...t,
    count: templates.filter(template => template.type === t.value).length,
  }))

  const getTypeTag = (type: string) => {
    const typeInfo = templateTypes.find(t => t.value === type)
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
        icon={typeInfo.icon}
      >
        {typeInfo.label}
      </Tag>
    )
  }

  const getChannelTags = (channels: string[]) => {
    return (
      <Space size={8}>
        {channels.map(channel => {
          const channelInfo = notifyChannels.find(c => c.value === channel)
          return channelInfo ? (
            <Tooltip key={channel} title={channelInfo.label}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: channelInfo.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <span style={{ color: '#fff', fontSize: 14 }}>{channelInfo.icon}</span>
              </div>
            </Tooltip>
          ) : null
        })}
      </Space>
    )
  }

  const getEnabledTag = (enabled: boolean) => {
    return enabled ? (
      <Tag style={{
        borderRadius: 6,
        background: '#f6ffed',
        border: '1px solid #b7eb8f',
        color: '#52c41a',
        fontWeight: 500,
      }}>
        <CheckCircleOutlined style={{ marginRight: 4 }} />
        已启用
      </Tag>
    ) : (
      <Tag style={{
        borderRadius: 6,
        background: '#f5f5f5',
        border: '1px solid #d9d9d9',
        color: '#8c8c8c',
        fontWeight: 500,
      }}>
        <CloseCircleOutlined style={{ marginRight: 4 }} />
        已禁用
      </Tag>
    )
  }

  const columns = [
    {
      title: '模板编码',
      dataIndex: 'code',
      key: 'code',
      width: 220,
      render: (text: string) => (
        <div style={{
          padding: '6px 12px',
          background: '#f5f5f5',
          borderRadius: 6,
          fontFamily: 'monospace',
          fontSize: 13,
          fontWeight: 500,
          color: '#595959',
          display: 'inline-block',
        }}>
          {text}
        </div>
      ),
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          }}>
            <FileTextOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 15, display: 'block' }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type: string) => getTypeTag(type),
    },
    {
      title: '通知渠道',
      dataIndex: 'channels',
      key: 'channels',
      width: 140,
      render: (channels: string[]) => getChannelTags(channels),
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 110,
      align: 'center' as const,
      render: (count: number) => (
        <Badge 
          count={count} 
          style={{ 
            backgroundColor: '#1890ff',
            fontSize: 13,
            fontWeight: 600,
            padding: '0 8px',
          }} 
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 110,
      align: 'center' as const,
      render: (enabled: boolean) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleStatusChange(enabled, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            style={{ 
              borderRadius: 6,
              borderColor: '#52c41a',
              color: '#52c41a',
            }}
          >
            预览
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ 
              borderRadius: 6,
              background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
              border: 'none',
            }}
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
      {/* 顶部统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
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
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>模板总数</span>}
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(82, 196, 26, 0.3)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>已启用</span>}
              value={stats.enabled}
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(255, 77, 79, 0.3)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>已禁用</span>}
              value={stats.disabled}
              prefix={<CloseCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
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
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>累计使用</span>}
              value={stats.totalUsage}
              prefix={<SoundOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 类型筛选卡片 */}
      <Card
        style={{
          borderRadius: 16,
          marginBottom: 24,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
        }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Space>
              <TagsOutlined style={{ fontSize: 18, color: '#1890ff' }} />
              <Text strong style={{ fontSize: 15 }}>按类型筛选：</Text>
            </Space>
          </Col>
          <Col flex="auto">
            <Space size={12}>
              <Button
                type={type === 'all' ? 'primary' : 'default'}
                onClick={() => setType('all')}
                style={{ 
                  borderRadius: 8,
                  background: type === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
                  border: type === 'all' ? 'none' : undefined,
                }}
              >
                全部 ({stats.total})
              </Button>
              {typeStats.map(t => (
                <Button
                  key={t.value}
                  type={type === t.value ? 'primary' : 'default'}
                  onClick={() => setType(t.value)}
                  style={{ 
                    borderRadius: 8,
                    background: type === t.value ? t.bg : undefined,
                    borderColor: type === t.value ? t.color : undefined,
                    color: type === t.value ? t.color : undefined,
                  }}
                  icon={t.icon}
                >
                  {t.label} ({t.count})
                </Button>
              ))}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 搜索区域 */}
      <Card
        style={{
          borderRadius: 16,
          marginBottom: 24,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Search
              placeholder="搜索模板名称或编码"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              enterButton={
                <Button type="primary" icon={<SearchOutlined />} style={{ borderRadius: '0 6px 6px 0' }}>
                  搜索
                </Button>
              }
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={24} lg={16} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                style={{ borderRadius: 8 }}
                onClick={() => {
                  setSearchText('')
                  setType('all')
                }}
              >
                重置
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => {
                  setIsEdit(false)
                  setSelectedRecord(null)
                  form.resetFields()
                  setIsModalOpen(true)
                }}
                style={{ 
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                  border: 'none',
                }}
              >
                新增模板
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 表格 */}
      <Card
        style={{
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0',
        }}
        bodyStyle={{ padding: '24px' }}
      >
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
        title={
          <Space>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: isEdit 
                ? 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)' 
                : 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isEdit 
                ? '0 4px 12px rgba(24, 144, 255, 0.3)' 
                : '0 4px 12px rgba(82, 196, 26, 0.3)',
            }}>
              {isEdit ? <EditOutlined style={{ color: '#fff', fontSize: 20 }} /> : <EyeOutlined style={{ color: '#fff', fontSize: 20 }} />}
            </div>
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {isEdit ? '编辑消息模板' : '查看消息模板'}
            </span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={isEdit ? handleSubmit : () => setIsModalOpen(false)}
        okText={isEdit ? '保存' : '关闭'}
        cancelText={isEdit ? '取消' : undefined}
        width={760}
        bodyStyle={{ padding: '24px' }}
        okButtonProps={{
          style: isEdit ? {
            borderRadius: 8,
            background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
            border: 'none',
            height: 40,
            padding: '0 24px',
          } : { borderRadius: 8, height: 40, padding: '0 24px' },
        }}
        cancelButtonProps={{
          style: { borderRadius: 8, height: 40, padding: '0 24px' },
        }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                name="code"
                label={<Text strong style={{ fontSize: 14 }}>模板编码</Text>}
                rules={[{ required: true, message: '请输入模板编码' }]}
              >
                <Input 
                  disabled={!isEdit} 
                  placeholder="如：ENTERPRISE_AUDIT_PASS" 
                  style={{ borderRadius: 8, height: 40 }}
                  prefix={<TagsOutlined style={{ color: '#8c8c8c' }} />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label={<Text strong style={{ fontSize: 14 }}>模板名称</Text>}
                rules={[{ required: true, message: '请输入模板名称' }]}
              >
                <Input 
                  disabled={!isEdit} 
                  placeholder="请输入模板名称" 
                  style={{ borderRadius: 8, height: 40 }}
                  prefix={<FileTextOutlined style={{ color: '#8c8c8c' }} />}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                name="type"
                label={<Text strong style={{ fontSize: 14 }}>模板类型</Text>}
                rules={[{ required: true, message: '请选择模板类型' }]}
              >
                <Select disabled={!isEdit} placeholder="请选择模板类型" size="large">
                  {templateTypes.filter(t => t.value !== 'all').map(t => (
                    <Option key={t.value} value={t.value}>
                      <Space>
                        {t.icon}
                        {t.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="channels"
                label={<Text strong style={{ fontSize: 14 }}>通知渠道</Text>}
                rules={[{ required: true, message: '请选择通知渠道' }]}
              >
                <Select disabled={!isEdit} mode="multiple" placeholder="请选择通知渠道" size="large">
                  {notifyChannels.map(c => (
                    <Option key={c.value} value={c.value}>
                      <Space>
                        <div style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          background: c.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <span style={{ color: '#fff', fontSize: 10 }}>{c.icon}</span>
                        </div>
                        {c.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="title"
            label={<Text strong style={{ fontSize: 14 }}>消息标题</Text>}
            rules={[{ required: true, message: '请输入消息标题' }]}
          >
            <Input 
              disabled={!isEdit} 
              placeholder="请输入消息标题" 
              style={{ borderRadius: 8, height: 40 }}
              prefix={<BellOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Form.Item>
          <Form.Item
            name="content"
            label={<Text strong style={{ fontSize: 14 }}>消息内容</Text>}
            rules={[{ required: true, message: '请输入消息内容' }]}
            extra={
              <Text type="secondary" style={{ fontSize: 12 }}>
                <InfoCircleOutlined style={{ marginRight: 4 }} />
                使用 {'{variableName}'} 格式插入变量，如：{'{enterpriseName}'}
              </Text>
            }
          >
            <TextArea
              disabled={!isEdit}
              rows={5}
              placeholder="请输入消息内容，使用 {变量名} 格式插入变量"
              style={{ borderRadius: 8, fontSize: 14 }}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={<Text strong style={{ fontSize: 14 }}>模板说明</Text>}
          >
            <Input 
              disabled={!isEdit} 
              placeholder="请输入模板说明" 
              style={{ borderRadius: 8, height: 40 }}
            />
          </Form.Item>
          {selectedRecord?.variables && (
            <Form.Item label={<Text strong style={{ fontSize: 14 }}>可用变量</Text>}>
              <div style={{
                padding: 16,
                background: '#f6ffed',
                borderRadius: 8,
                border: '1px solid #b7eb8f',
              }}>
                <Space size={12}>
                  {selectedRecord.variables.map((v: string) => (
                    <Tag 
                      key={v} 
                      color="success"
                      style={{ 
                        borderRadius: 6,
                        padding: '6px 16px',
                        fontSize: 14,
                        fontFamily: 'monospace',
                      }}
                    >
                      <CopyOutlined style={{ marginRight: 6 }} />
                      {'{' + v + '}'}
                    </Tag>
                  ))}
                </Space>
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default MessageTemplate
