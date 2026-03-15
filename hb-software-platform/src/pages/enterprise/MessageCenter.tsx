import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  List,
  Button,
  Tag,
  Space,
  Badge,
  Tabs,
  Empty,
  message,
  Modal,
  Typography,
  Divider,
} from 'antd'
import {
  BellOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

// 消息类型
const messageTypes = [
  { value: 'all', label: '全部', icon: <MailOutlined /> },
  { value: 'unread', label: '未读', icon: <BellOutlined /> },
  { value: 'audit', label: '审核通知', icon: <SafetyCertificateOutlined /> },
  { value: 'system', label: '系统通知', icon: <SettingOutlined /> },
]

// 模拟消息数据
const messageList = [
  {
    id: 1,
    type: 'audit',
    subtype: 'enterprise',
    title: '企业入驻审核通过',
    content: '恭喜！您的企业入驻申请已通过审核，您现在可以正常使用平台功能。',
    time: '2026-03-13 10:30:15',
    isRead: false,
    icon: <ShopOutlined style={{ color: '#52c41a' }} />,
    bgColor: '#f6ffed',
  },
  {
    id: 2,
    type: 'audit',
    subtype: 'software',
    title: '软件发布审核通过',
    content: '您发布的软件「智能制造MES系统 V2.0」已通过审核，已上架展示。',
    time: '2026-03-12 16:45:20',
    isRead: false,
    icon: <AppstoreOutlined style={{ color: '#1890ff' }} />,
    bgColor: '#e6f7ff',
  },
  {
    id: 3,
    type: 'audit',
    subtype: 'subsidy',
    title: '补贴券审核通过',
    content: '您的补贴券申报已通过审核，补贴额度：¥45,000，请尽快使用。',
    time: '2026-03-11 09:20:00',
    isRead: true,
    icon: <SafetyCertificateOutlined style={{ color: '#faad14' }} />,
    bgColor: '#fffbe6',
  },
  {
    id: 4,
    type: 'system',
    subtype: 'policy',
    title: '新政策发布',
    content: '《2026年度湖北省工业软件补贴券政策》已发布，请及时查看并申报。',
    time: '2026-03-10 14:00:00',
    isRead: true,
    icon: <MessageOutlined style={{ color: '#722ed1' }} />,
    bgColor: '#f9f0ff',
  },
  {
    id: 5,
    type: 'audit',
    subtype: 'enterprise',
    title: '企业入驻审核驳回',
    content: '您的企业入驻申请未通过审核，原因：营业执照信息不清晰。请修改后重新提交。',
    time: '2026-03-09 11:30:00',
    isRead: true,
    icon: <ShopOutlined style={{ color: '#ff4d4f' }} />,
    bgColor: '#fff1f0',
  },
  {
    id: 6,
    type: 'system',
    subtype: 'message',
    title: '留言回复通知',
    content: '平台管理员已回复您的留言「关于MES系统选型的咨询」，请查看。',
    time: '2026-03-08 15:20:00',
    isRead: true,
    icon: <MessageOutlined style={{ color: '#13c2c2' }} />,
    bgColor: '#e6fffb',
  },
]

const MessageCenter = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [messages, setMessages] = useState(messageList)

  // 统计未读消息数
  const unreadCount = messages.filter(m => !m.isRead).length

  // 获取类型标签
  const getTypeTag = (type: string, subtype: string) => {
    switch (type) {
      case 'audit':
        return <Tag color="blue">审核通知</Tag>
      case 'system':
        return <Tag color="green">系统通知</Tag>
      default:
        return <Tag>其他</Tag>
    }
  }

  // 筛选消息
  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !msg.isRead
    return msg.type === activeTab
  })

  // 查看消息详情
  const handleViewDetail = (msg: any) => {
    setSelectedMessage(msg)
    setDetailModalVisible(true)
    // 标记为已读
    if (!msg.isRead) {
      const updated = messages.map(m =>
        m.id === msg.id ? { ...m, isRead: true } : m
      )
      setMessages(updated)
    }
  }

  // 标记全部已读
  const handleMarkAllRead = () => {
    const updated = messages.map(m => ({ ...m, isRead: true }))
    setMessages(updated)
    message.success('已全部标记为已读')
  }

  // 删除消息
  const handleDelete = (id: number) => {
    const updated = messages.filter(m => m.id !== id)
    setMessages(updated)
    message.success('消息已删除')
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/enterprise')}>
          返回工作台
        </Button>
      </div>

      <Card
        title={
          <Space>
            <span style={{ color: 'var(--text-primary)' }}>消息中心</span>
            {unreadCount > 0 && (
              <Badge count={unreadCount} style={{ backgroundColor: 'var(--brand-error)' }} />
            )}
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            全部已读
          </Button>
        }
        style={{ borderRadius: '12px', background: 'var(--bg-card)' }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {messageTypes.map(type => (
            <TabPane
              tab={
                <Space>
                  {type.icon}
                  <span style={{ color: 'var(--text-primary)' }}>{type.label}</span>
                  {type.value === 'unread' && unreadCount > 0 && (
                    <Badge count={unreadCount} style={{ backgroundColor: 'var(--brand-error)' }} />
                  )}
                </Space>
              }
              key={type.value}
            >
              <List
                dataSource={filteredMessages}
                renderItem={item => (
                  <List.Item
                    style={{
                      background: item.isRead ? 'var(--bg-card)' : 'var(--brand-success-bg)',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onClick={() => handleViewDetail(item)}
                    actions={[
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetail(item)
                        }}
                      >
                        查看
                      </Button>,
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(item.id)
                        }}
                      >
                        删除
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: item.bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '24px',
                          }}
                        >
                          {item.icon}
                        </div>
                      }
                      title={
                        <Space>
                          <span style={{ fontWeight: 600, fontSize: '16px' }}>
                            {item.title}
                          </span>
                          {!item.isRead && <Badge status="error" text="未读" />}
                          {getTypeTag(item.type, item.subtype)}
                        </Space>
                      }
                      description={
                        <div>
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{ marginBottom: '8px', color: '#666' }}
                          >
                            {item.content}
                          </Paragraph>
                          <Text type="secondary" style={{ fontSize: '13px' }}>
                            {item.time}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="暂无消息"
                    />
                  ),
                }}
              />
            </TabPane>
          ))}
        </Tabs>
      </Card>

      {/* 消息详情弹窗 */}
      <Modal
        title="消息详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={560}
      >
        {selectedMessage && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: selectedMessage.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginRight: '16px',
                }}
              >
                {selectedMessage.icon}
              </div>
              <div>
                <Title level={5} style={{ margin: 0 }}>
                  {selectedMessage.title}
                </Title>
                <Space style={{ marginTop: '8px' }}>
                  {getTypeTag(selectedMessage.type, selectedMessage.subtype)}
                  <Text type="secondary">{selectedMessage.time}</Text>
                </Space>
              </div>
            </div>
            <Divider />
            <Paragraph style={{ fontSize: '15px', lineHeight: '1.8' }}>
              {selectedMessage.content}
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MessageCenter
