import { useState } from 'react'
import {
  Card,
  Table,
  Tag,
  Space,
  Input,
  Select,
  Button,
  DatePicker,
  Row,
  Col,
  Modal,
  Avatar,
  Typography,
  Badge,
  Tooltip,
  Statistic,
  Progress,
  Divider,
} from 'antd'
import {
  EyeOutlined,
  SearchOutlined,
  MessageOutlined,
  MailOutlined,
  MobileOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  UserOutlined,
  TeamOutlined,
  SendOutlined,
  ReadOutlined,
  ScheduleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  SoundOutlined,
  BarChartOutlined,
  ReloadOutlined,
  FilterOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker
const { Title, Text } = Typography

interface MessageRecord {
  id: string
  title: string
  content: string
  sender: string
  sendType: 'single' | 'batch'
  recipients: string[]
  recipientCount: number
  channels: string[]
  status: 'sending' | 'sent' | 'scheduled' | 'failed'
  sendTime: string
  readCount: number
  readRate: number
  scheduleTime?: string
}

const mockRecords: MessageRecord[] = [
  {
    id: '1',
    title: '企业入驻审核通过通知',
    content: '恭喜！您的企业入驻申请已通过审核，欢迎加入湖北省工业软件公共服务平台。',
    sender: '系统管理员',
    sendType: 'batch',
    recipients: ['张三', '李四', '王五'],
    recipientCount: 3,
    channels: ['site', 'sms'],
    status: 'sent',
    sendTime: '2026-03-10 14:30:00',
    readCount: 3,
    readRate: 100,
  },
  {
    id: '2',
    title: '系统维护通知',
    content: '平台将于今晚22:00进行系统维护，维护期间部分功能可能无法使用。',
    sender: '平台运营',
    sendType: 'batch',
    recipients: ['全部用户'],
    recipientCount: 156,
    channels: ['site', 'email'],
    status: 'sending',
    sendTime: '2026-03-10 15:00:00',
    readCount: 45,
    readRate: 28.8,
  },
  {
    id: '3',
    title: '补贴券审核通过',
    content: '您的补贴券申报已通过审核，补贴金额：84000元。',
    sender: '财务审核员',
    sendType: 'single',
    recipients: ['张三'],
    recipientCount: 1,
    channels: ['site'],
    status: 'sent',
    sendTime: '2026-03-09 10:15:00',
    readCount: 1,
    readRate: 100,
  },
  {
    id: '4',
    title: '新政策发布提醒',
    content: '2026年度工业软件补贴政策已发布，请及时查看。',
    sender: '系统管理员',
    sendType: 'batch',
    recipients: ['工业制造企业'],
    recipientCount: 89,
    channels: ['site', 'sms', 'email'],
    status: 'scheduled',
    sendTime: '-',
    scheduleTime: '2026-03-15 09:00:00',
    readCount: 0,
    readRate: 0,
  },
  {
    id: '5',
    title: '软件发布审核结果',
    content: '您的软件产品审核未通过，原因：资料不完整。',
    sender: '审核员',
    sendType: 'single',
    recipients: ['李四'],
    recipientCount: 1,
    channels: ['site'],
    status: 'failed',
    sendTime: '2026-03-08 16:45:00',
    readCount: 0,
    readRate: 0,
  },
  {
    id: '6',
    title: '2026年度软件补贴政策解读',
    content: '详细解读2026年度工业软件补贴政策，包括申报条件、补贴标准、申报流程等内容。',
    sender: '政策专员',
    sendType: 'batch',
    recipients: ['软件企业', '制造企业'],
    recipientCount: 234,
    channels: ['site', 'email'],
    status: 'sent',
    sendTime: '2026-03-07 09:30:00',
    readCount: 198,
    readRate: 84.6,
  },
  {
    id: '7',
    title: '平台功能升级通知',
    content: '平台已完成V2.0版本升级，新增智能匹配、数据分析等功能模块。',
    sender: '产品团队',
    sendType: 'batch',
    recipients: ['全部用户'],
    recipientCount: 512,
    channels: ['site', 'sms', 'email'],
    status: 'sent',
    sendTime: '2026-03-06 10:00:00',
    readCount: 423,
    readRate: 82.6,
  },
  {
    id: '8',
    title: '留言回复通知',
    content: '您提交的留言已收到回复，请登录平台查看详情。',
    sender: '客服中心',
    sendType: 'single',
    recipients: ['王五'],
    recipientCount: 1,
    channels: ['site'],
    status: 'sent',
    sendTime: '2026-03-05 16:20:00',
    readCount: 1,
    readRate: 100,
  },
]

// 状态配置
const statusConfig: Record<string, { color: string; text: string; icon: any; bg: string; gradient: string }> = {
  sent: { 
    color: '#52c41a', 
    text: '已发送', 
    icon: <CheckCircleOutlined />,
    bg: '#f6ffed',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
  },
  sending: { 
    color: '#1890ff', 
    text: '发送中', 
    icon: <SyncOutlined spin />,
    bg: '#e6f7ff',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
  },
  scheduled: { 
    color: '#faad14', 
    text: '定时发送', 
    icon: <ClockCircleOutlined />,
    bg: '#fffbe6',
    gradient: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
  },
  failed: { 
    color: '#ff4d4f', 
    text: '发送失败', 
    icon: <CloseCircleOutlined />,
    bg: '#fff1f0',
    gradient: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
  },
}

// 渠道配置
const channelConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  site: { label: '站内信', color: '#1890ff', bg: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)', icon: <MessageOutlined /> },
  sms: { label: '短信', color: '#52c41a', bg: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', icon: <MobileOutlined /> },
  email: { label: '邮件', color: '#faad14', bg: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)', icon: <MailOutlined /> },
}

export default function MessageRecord() {
  const [status, setStatus] = useState('all')
  const [channel, setChannel] = useState('all')
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MessageRecord | null>(null)

  // 统计数据
  const stats = {
    total: mockRecords.length,
    sent: mockRecords.filter(r => r.status === 'sent').length,
    sending: mockRecords.filter(r => r.status === 'sending').length,
    scheduled: mockRecords.filter(r => r.status === 'scheduled').length,
    failed: mockRecords.filter(r => r.status === 'failed').length,
    totalRecipients: mockRecords.reduce((sum, r) => sum + r.recipientCount, 0),
    totalRead: mockRecords.reduce((sum, r) => sum + r.readCount, 0),
    avgReadRate: mockRecords.filter(r => r.status === 'sent').length > 0
      ? (mockRecords.filter(r => r.status === 'sent').reduce((sum, r) => sum + r.readRate, 0) / mockRecords.filter(r => r.status === 'sent').length).toFixed(1)
      : 0,
  }

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const config = statusConfig[status] || { color: '#999', text: '未知', icon: null, bg: '#f5f5f5' }
    return (
      <Tag 
        style={{ 
          color: config.color, 
          background: config.bg, 
          border: `1px solid ${config.color}40`,
          borderRadius: 6,
          fontWeight: 500,
          padding: '4px 12px',
          fontSize: 13,
        }}
        icon={config.icon}
      >
        {config.text}
      </Tag>
    )
  }

  // 获取渠道图标
  const getChannelIcons = (channels: string[]) => {
    return (
      <Space size={8}>
        {channels.map(ch => {
          const config = channelConfig[ch]
          if (!config) return null
          return (
            <Tooltip key={ch} title={config.label}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: config.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                <span style={{ color: '#fff', fontSize: 14 }}>{config.icon}</span>
              </div>
            </Tooltip>
          )
        })}
      </Space>
    )
  }

  // 获取阅读进度条
  const getReadProgress = (record: MessageRecord) => {
    if (record.status === 'scheduled' || record.status === 'failed') {
      return <Text type="secondary">-</Text>
    }
    return (
      <Tooltip title={`${record.readCount}/${record.recipientCount} 已读`}>
        <div style={{ minWidth: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 12, color: '#8c8c8c' }}>阅读率</Text>
            <Text strong style={{ fontSize: 13, color: record.readRate >= 80 ? '#52c41a' : record.readRate >= 50 ? '#faad14' : '#ff4d4f' }}>
              {record.readRate}%
            </Text>
          </div>
          <Progress
            percent={record.readRate}
            size="small"
            strokeColor={record.readRate >= 80 ? '#52c41a' : record.readRate >= 50 ? '#faad14' : '#ff4d4f'}
            showInfo={false}
            style={{ margin: 0 }}
          />
        </div>
      </Tooltip>
    )
  }

  // 表格列定义
  const columns: ColumnsType<MessageRecord> = [
    {
      title: '消息标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
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
            <SendOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <Text strong style={{ fontSize: 15 }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '发送方式',
      dataIndex: 'sendType',
      key: 'sendType',
      width: 120,
      render: (type: string) => (
        type === 'single' ? (
          <Tag style={{ 
            borderRadius: 6,
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
            color: '#1890ff',
            fontWeight: 500,
          }}>
            <UserOutlined style={{ marginRight: 4 }} />
            单发
          </Tag>
        ) : (
          <Tag style={{ 
            borderRadius: 6,
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            color: '#52c41a',
            fontWeight: 500,
          }}>
            <TeamOutlined style={{ marginRight: 4 }} />
            群发
          </Tag>
        )
      ),
    },
    {
      title: '接收人数',
      dataIndex: 'recipientCount',
      key: 'recipientCount',
      width: 110,
      align: 'center',
      render: (count: number) => (
        <Badge 
          count={count} 
          style={{ 
            backgroundColor: '#1890ff',
            fontSize: 13,
            fontWeight: 600,
            padding: '0 10px',
          }} 
        />
      ),
    },
    {
      title: '通知渠道',
      dataIndex: 'channels',
      key: 'channels',
      width: 140,
      render: (channels: string[]) => getChannelIcons(channels),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: 180,
      render: (time: string, record: MessageRecord) => (
        record.status === 'scheduled' ? (
          <Space>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#fffbe6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ScheduleOutlined style={{ color: '#faad14', fontSize: 14 }} />
            </div>
            <Text type="secondary" style={{ fontSize: 13 }}>{record.scheduleTime}</Text>
          </Space>
        ) : (
          <Space>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ClockCircleOutlined style={{ color: '#8c8c8c', fontSize: 14 }} />
            </div>
            <span style={{ fontSize: 13 }}>{time}</span>
          </Space>
        )
      ),
    },
    {
      title: '阅读情况',
      key: 'read',
      width: 160,
      align: 'center',
      render: (_: any, record: MessageRecord) => getReadProgress(record),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_: any, record: MessageRecord) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedRecord(record)
            setIsDetailModalOpen(true)
          }}
          style={{ 
            borderRadius: 6,
            borderColor: '#667eea',
            color: '#667eea',
          }}
        >
          详情
        </Button>
      ),
    },
  ]

  // 筛选数据
  const filteredRecords = mockRecords.filter(record => {
    if (status !== 'all' && record.status !== status) return false
    if (channel !== 'all' && !record.channels.includes(channel)) return false
    return true
  })

  return (
    <div>
      {/* 顶部统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={4}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>发送总数</span>}
              value={stats.total}
              prefix={<SendOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(82, 196, 26, 0.3)',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>已发送</span>}
              value={stats.sent}
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>发送中</span>}
              value={stats.sending}
              prefix={<SyncOutlined spin style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(250, 173, 20, 0.3)',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>定时发送</span>}
              value={stats.scheduled}
              prefix={<ScheduleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(255, 77, 79, 0.3)',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>发送失败</span>}
              value={stats.failed}
              prefix={<ExclamationCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(19, 194, 194, 0.3)',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>平均阅读率</span>}
              value={stats.avgReadRate}
              suffix="%"
              prefix={<BarChartOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

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
          <Col xs={24} sm={12} lg={6}>
            <Search
              placeholder="搜索消息标题"
              allowClear
              enterButton={
                <Button type="primary" icon={<SearchOutlined />} style={{ borderRadius: '0 6px 6px 0' }}>
                  搜索
                </Button>
              }
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Select
              value={status}
              onChange={setStatus}
              style={{ width: '100%' }}
              placeholder="选择状态"
              size="large"
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">全部状态</Option>
              <Option value="sent">已发送</Option>
              <Option value="sending">发送中</Option>
              <Option value="scheduled">定时发送</Option>
              <Option value="failed">发送失败</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Select
              value={channel}
              onChange={setChannel}
              style={{ width: '100%' }}
              placeholder="选择渠道"
              size="large"
              suffixIcon={<SoundOutlined />}
            >
              <Option value="all">全部渠道</Option>
              <Option value="site">站内信</Option>
              <Option value="sms">短信</Option>
              <Option value="email">邮件</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <RangePicker 
              style={{ width: '100%' }} 
              placeholder={['开始日期', '结束日期']}
              size="large"
            />
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
          dataSource={filteredRecords}
          rowKey="id"
          pagination={{
            total: filteredRecords.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space size="middle">
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.35)',
            }}>
              <FileTextOutlined style={{ color: '#fff', fontSize: 22 }} />
            </div>
            <div>
              <span style={{ fontSize: 18, fontWeight: 600 }}>消息发送详情</span>
              <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
                {selectedRecord?.title}
              </Text>
            </div>
          </Space>
        }
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setIsDetailModalOpen(false)}
            style={{ borderRadius: 8, height: 40, padding: '0 24px' }}
          >
            关闭
          </Button>,
        ]}
        width={760}
        bodyStyle={{ padding: '32px' }}
      >
        {selectedRecord && (
          <div>
            {/* 基本信息 */}
            <div style={{ 
              marginBottom: 28,
              padding: 24,
              background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)',
              borderRadius: 16,
              border: '1px solid #b7eb8f',
            }}>
              <Title level={5} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', fontSize: 16 }}>
                <div style={{
                  width: 4,
                  height: 20,
                  background: 'linear-gradient(180deg, #1890ff 0%, #36cfc9 100%)',
                  borderRadius: 2,
                  marginRight: 10,
                }} />
                基本信息
              </Title>
              <Row gutter={[24, 20]}>
                <Col span={12}>
                  <Space>
                    <Text type="secondary" style={{ fontSize: 13 }}>消息标题：</Text>
                    <Text strong style={{ fontSize: 14 }}>{selectedRecord.title}</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space>
                    <Text type="secondary" style={{ fontSize: 13 }}>发送人：</Text>
                    <Avatar size="small" icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                    <Text style={{ fontSize: 14 }}>{selectedRecord.sender}</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space>
                    <Text type="secondary" style={{ fontSize: 13 }}>发送方式：</Text>
                    {selectedRecord.sendType === 'single' ? (
                      <Tag style={{ 
                        borderRadius: 6,
                        background: '#e6f7ff',
                        border: '1px solid #91d5ff',
                        color: '#1890ff',
                        fontWeight: 500,
                      }}>
                        <UserOutlined style={{ marginRight: 4 }} />
                        单发
                      </Tag>
                    ) : (
                      <Tag style={{ 
                        borderRadius: 6,
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        color: '#52c41a',
                        fontWeight: 500,
                      }}>
                        <TeamOutlined style={{ marginRight: 4 }} />
                        群发
                      </Tag>
                    )}
                  </Space>
                </Col>
                <Col span={12}>
                  <Space>
                    <Text type="secondary" style={{ fontSize: 13 }}>发送状态：</Text>
                    {getStatusTag(selectedRecord.status)}
                  </Space>
                </Col>
                <Col span={12}>
                  <Space>
                    <Text type="secondary" style={{ fontSize: 13 }}>发送时间：</Text>
                    <Text style={{ fontSize: 14 }}>{selectedRecord.sendTime}</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space>
                    <Text type="secondary" style={{ fontSize: 13 }}>通知渠道：</Text>
                    {getChannelIcons(selectedRecord.channels)}
                  </Space>
                </Col>
              </Row>
            </div>

            {/* 消息内容 */}
            <div style={{ marginBottom: 28 }}>
              <Title level={5} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', fontSize: 16 }}>
                <div style={{
                  width: 4,
                  height: 20,
                  background: 'linear-gradient(180deg, #52c41a 0%, #73d13d 100%)',
                  borderRadius: 2,
                  marginRight: 10,
                }} />
                消息内容
              </Title>
              <div
                style={{
                  padding: 24,
                  background: '#fafafa',
                  borderRadius: 12,
                  minHeight: 100,
                  fontSize: 14,
                  lineHeight: 1.8,
                  border: '1px solid #e8e8e8',
                }}
              >
                {selectedRecord.content}
              </div>
            </div>

            {/* 接收人信息 */}
            <div>
              <Title level={5} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', fontSize: 16 }}>
                <div style={{
                  width: 4,
                  height: 20,
                  background: 'linear-gradient(180deg, #faad14 0%, #ffc53d 100%)',
                  borderRadius: 2,
                  marginRight: 10,
                }} />
                接收人信息
              </Title>
              <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col span={8}>
                  <Card
                    style={{ 
                      borderRadius: 12, 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%)',
                      border: '1px solid #91d5ff',
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>接收人数</Text>
                    <Text strong style={{ fontSize: 28, color: '#1890ff' }}>{selectedRecord.recipientCount}</Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    style={{ 
                      borderRadius: 12, 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #f6ffed 0%, #f0fff4 100%)',
                      border: '1px solid #b7eb8f',
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>已读人数</Text>
                    <Text strong style={{ fontSize: 28, color: '#52c41a' }}>{selectedRecord.readCount}</Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    style={{ 
                      borderRadius: 12, 
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #fff7e6 0%, #fffbe6 100%)',
                      border: '1px solid #ffd591',
                    }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>阅读率</Text>
                    <Text strong style={{ fontSize: 28, color: '#fa8c16' }}>{selectedRecord.readRate}%</Text>
                  </Card>
                </Col>
              </Row>
              <div>
                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>接收人列表：</Text>
                <div style={{ 
                  padding: 20,
                  background: '#fafafa',
                  borderRadius: 12,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 10,
                  maxHeight: 200,
                  overflow: 'auto',
                }}>
                  {selectedRecord.recipients.map((recipient, index) => (
                    <Tag 
                      key={index} 
                      style={{ 
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: '#fff',
                        border: '1px solid #e8e8e8',
                      }}
                    >
                      <Avatar size="small" icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                      <span style={{ fontWeight: 500 }}>{recipient}</span>
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
