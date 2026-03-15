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
  Timeline,
  Avatar,
  Typography,
  Badge,
  Tooltip,
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
]

export default function MessageRecord() {
  const [status, setStatus] = useState('all')
  const [channel, setChannel] = useState('all')
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MessageRecord | null>(null)

  // 获取状态标签
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'sent':
        return <Tag icon={<CheckCircleOutlined />} color="success">已发送</Tag>
      case 'sending':
        return <Tag icon={<SyncOutlined spin />} color="processing">发送中</Tag>
      case 'scheduled':
        return <Tag icon={<ClockCircleOutlined />} color="warning">定时发送</Tag>
      case 'failed':
        return <Tag icon={<CloseCircleOutlined />} color="error">发送失败</Tag>
      default:
        return <Tag>{status}</Tag>
    }
  }

  // 获取渠道图标
  const getChannelIcons = (channels: string[]) => {
    return (
      <Space>
        {channels.includes('site') && (
          <Tooltip title="站内信">
            <MessageOutlined style={{ color: '#1677ff' }} />
          </Tooltip>
        )}
        {channels.includes('sms') && (
          <Tooltip title="短信">
            <MobileOutlined style={{ color: '#52c41a' }} />
          </Tooltip>
        )}
        {channels.includes('email') && (
          <Tooltip title="邮件">
            <MailOutlined style={{ color: '#faad14' }} />
          </Tooltip>
        )}
      </Space>
    )
  }

  // 表格列定义
  const columns: ColumnsType<MessageRecord> = [
    {
      title: '消息标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '发送方式',
      dataIndex: 'sendType',
      key: 'sendType',
      render: (type: string) => (
        type === 'single' ? (
          <Tag icon={<UserOutlined />}>单发</Tag>
        ) : (
          <Tag icon={<TeamOutlined />} color="blue">群发</Tag>
        )
      ),
    },
    {
      title: '接收人数',
      dataIndex: 'recipientCount',
      key: 'recipientCount',
      render: (count: number) => <Badge count={count} style={{ backgroundColor: '#1677ff' }} />,
    },
    {
      title: '通知渠道',
      dataIndex: 'channels',
      key: 'channels',
      render: (channels: string[]) => getChannelIcons(channels),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      render: (time: string, record: MessageRecord) => (
        record.status === 'scheduled' ? (
          <Text type="secondary">定时: {record.scheduleTime}</Text>
        ) : (
          time
        )
      ),
    },
    {
      title: '阅读情况',
      key: 'read',
      render: (_: any, record: MessageRecord) => (
        record.status === 'sent' || record.status === 'sending' ? (
          <Tooltip title={`${record.readCount}/${record.recipientCount} 已读`}>
            <span style={{ color: record.readRate === 100 ? '#52c41a' : '#1677ff' }}>
              {record.readRate}%
            </span>
          </Tooltip>
        ) : (
          '-'
        )
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: MessageRecord) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedRecord(record)
            setIsDetailModalOpen(true)
          }}
        >
          详情
        </Button>
      ),
    },
  ]

  return (
    <div>
      <Card
        title={
          <Space>
            <MessageOutlined />
            <span>消息发送记录</span>
          </Space>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Search
              placeholder="搜索消息标题"
              allowClear
              enterButton={<><SearchOutlined /> 搜索</>}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              value={status}
              onChange={setStatus}
              style={{ width: '100%' }}
              placeholder="选择状态"
            >
              <Option value="all">全部状态</Option>
              <Option value="sent">已发送</Option>
              <Option value="sending">发送中</Option>
              <Option value="scheduled">定时发送</Option>
              <Option value="failed">发送失败</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              value={channel}
              onChange={setChannel}
              style={{ width: '100%' }}
              placeholder="选择渠道"
            >
              <Option value="all">全部渠道</Option>
              <Option value="site">站内信</Option>
              <Option value="sms">短信</Option>
              <Option value="email">邮件</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={mockRecords}
          rowKey="id"
          pagination={{
            total: mockRecords.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="消息发送详情"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedRecord && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>基本信息</Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text type="secondary">消息标题：</Text>
                  <Text strong>{selectedRecord.title}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">发送人：</Text>
                  <Text>{selectedRecord.sender}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">发送方式：</Text>
                  <Text>{selectedRecord.sendType === 'single' ? '单发' : '群发'}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">发送状态：</Text>
                  {getStatusTag(selectedRecord.status)}
                </Col>
                <Col span={12}>
                  <Text type="secondary">发送时间：</Text>
                  <Text>{selectedRecord.sendTime}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">通知渠道：</Text>
                  {getChannelIcons(selectedRecord.channels)}
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>消息内容</Title>
              <div
                style={{
                  padding: 16,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 8,
                  minHeight: 100,
                }}
              >
                {selectedRecord.content}
              </div>
            </div>

            <div>
              <Title level={5}>接收人信息</Title>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text type="secondary">接收人数：</Text>
                  <Text strong>{selectedRecord.recipientCount} 人</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">已读人数：</Text>
                  <Text strong style={{ color: '#52c41a' }}>
                    {selectedRecord.readCount} 人
                  </Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">阅读率：</Text>
                  <Text strong>{selectedRecord.readRate}%</Text>
                </Col>
              </Row>
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">接收人列表：</Text>
                <div style={{ marginTop: 8 }}>
                  {selectedRecord.recipients.map((recipient, index) => (
                    <Tag key={index} style={{ marginBottom: 8 }}>
                      <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 4 }} />
                      {recipient}
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
