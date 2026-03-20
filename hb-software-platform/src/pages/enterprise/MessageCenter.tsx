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
  ClockCircleOutlined,
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
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
        bodyStyle={{ padding: '24px 32px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size={16} align="center">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/enterprise')}
              style={{
                borderRadius: 10,
                height: 40,
                borderColor: '#cbd5e1',
                color: '#64748b',
              }}
            >
              返回工作台
            </Button>
            <div>
              <Title level={4} style={{ margin: 0, color: '#1e293b', fontWeight: 600 }}>
                消息中心
              </Title>
              <Text style={{ color: '#64748b', fontSize: 13 }}>
                查看和管理您的消息通知
              </Text>
            </div>
          </Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            style={{
              borderRadius: 10,
              height: 44,
              padding: '0 24px',
              background: unreadCount === 0 ? '#cbd5e1' : '#4f46e5',
              borderColor: unreadCount === 0 ? '#cbd5e1' : '#4f46e5',
              boxShadow: unreadCount === 0 ? 'none' : '0 4px 14px rgba(79, 70, 229, 0.3)',
            }}
          >
            全部已读
          </Button>
        </div>
      </Card>

      <Card
        style={{
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          background: '#fff',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginBottom: 24 }}
        >
          {messageTypes.map(type => (
            <TabPane
              tab={
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 15,
                  fontWeight: 500,
                }}>
                  <span style={{ fontSize: 16 }}>{type.icon}</span>
                  <span>{type.label}</span>
                  {type.value === 'unread' && unreadCount > 0 && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 20,
                      height: 20,
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '0 6px',
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </span>
              }
              key={type.value}
            >
              <List
                dataSource={filteredMessages}
                renderItem={item => (
                  <List.Item
                    style={{
                      background: item.isRead ? '#fff' : '#f0fdf4',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      padding: '20px 24px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: item.isRead ? '1px solid #e2e8f0' : '1px solid #bbf7d0',
                      boxShadow: item.isRead ? '0 2px 4px rgba(0,0,0,0.02)' : '0 4px 12px rgba(34, 197, 94, 0.1)',
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
                        style={{ color: '#4f46e5' }}
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
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            background: item.bgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          }}
                        >
                          {item.icon}
                        </div>
                      }
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: '17px', color: '#1e293b' }}>
                            {item.title}
                          </span>
                          {!item.isRead && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '2px 10px',
                              background: '#fee2e2',
                              color: '#dc2626',
                              borderRadius: 10,
                              fontSize: 12,
                              fontWeight: 600,
                            }}>
                              <span style={{
                                width: 6,
                                height: 6,
                                background: '#dc2626',
                                borderRadius: '50%',
                              }} />
                              未读
                            </span>
                          )}
                          {getTypeTag(item.type, item.subtype)}
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{ marginBottom: 10, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}
                          >
                            {item.content}
                          </Paragraph>
                          <Text style={{ fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ClockCircleOutlined style={{ fontSize: 12 }} />
                            {item.time}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                locale={{
                  emptyText: (
                    <div style={{
                      padding: '60px 40px',
                      background: '#f8fafc',
                      borderRadius: 12,
                      border: '1px dashed #cbd5e1',
                    }}>
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span style={{ color: '#64748b', fontSize: 14 }}>暂无消息</span>}
                      />
                    </div>
                  ),
                }}
              />
            </TabPane>
          ))}
        </Tabs>
      </Card>

      {/* 消息详情弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MailOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>消息详情</span>
          </div>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setDetailModalVisible(false)}
            style={{
              borderRadius: 10,
              height: 44,
              padding: '0 28px',
              background: '#4f46e5',
              borderColor: '#4f46e5',
              color: '#fff',
            }}
          >
            关闭
          </Button>,
        ]}
        width={600}
        bodyStyle={{ padding: '32px' }}
      >
        {selectedMessage && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '24px',
                padding: '20px',
                background: selectedMessage.bgColor,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginRight: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  flexShrink: 0,
                }}
              >
                {selectedMessage.icon}
              </div>
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ margin: 0, marginBottom: 10, color: '#1e293b', fontSize: 18 }}>
                  {selectedMessage.title}
                </Title>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  {getTypeTag(selectedMessage.type, selectedMessage.subtype)}
                  <Text style={{ color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ClockCircleOutlined style={{ fontSize: 12 }} />
                    {selectedMessage.time}
                  </Text>
                </div>
              </div>
            </div>
            <div style={{
              padding: '24px',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Paragraph style={{ fontSize: '15px', lineHeight: '1.8', color: '#334155', margin: 0 }}>
                {selectedMessage.content}
              </Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MessageCenter
