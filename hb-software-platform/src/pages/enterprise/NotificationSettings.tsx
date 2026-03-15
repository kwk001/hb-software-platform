import { useState } from 'react'
import {
  Card,
  Form,
  Switch,
  List,
  Typography,
  Space,
  Button,
  message,
  Divider,
  Tag,
  Alert,
  Row,
  Col,
  Input,
} from 'antd'
import {
  BellOutlined,
  MessageOutlined,
  MobileOutlined,
  MailOutlined,
  CheckCircleOutlined,
  SaveOutlined,
  EditOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

// 通知类型配置
const notificationTypes = [
  {
    key: 'audit',
    title: '审核通知',
    description: '企业入驻、软件发布、补贴申报等审核结果通知',
    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  },
  {
    key: 'demand',
    title: '需求对接通知',
    description: '需求状态变更、对接进度、新需求提醒',
    icon: <MessageOutlined style={{ color: '#1677ff' }} />,
  },
  {
    key: 'system',
    title: '系统通知',
    description: '系统维护、功能更新、安全提醒',
    icon: <BellOutlined style={{ color: '#faad14' }} />,
  },
  {
    key: 'policy',
    title: '政策通知',
    description: '新政策发布、政策到期提醒',
    icon: <MailOutlined style={{ color: '#722ed1' }} />,
  },
]

export default function NotificationSettings() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    site: {
      audit: true,
      demand: true,
      system: true,
      policy: true,
    },
    sms: {
      audit: true,
      demand: false,
      system: false,
      policy: false,
    },
    email: {
      audit: true,
      demand: true,
      system: true,
      policy: true,
    },
  })
  const [contactInfo, setContactInfo] = useState({
    phone: '138****8888',
    email: 'admin@example.com',
  })
  const [isEditingContact, setIsEditingContact] = useState(false)

  // 处理设置变更
  const handleSettingChange = (channel: string, type: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel as keyof typeof prev],
        [type]: checked,
      },
    }))
  }

  // 保存设置
  const handleSave = async () => {
    setLoading(true)
    // 模拟保存
    setTimeout(() => {
      setLoading(false)
      message.success('通知设置保存成功')
    }, 1000)
  }

  // 获取渠道图标
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'site':
        return <MessageOutlined style={{ color: '#1677ff' }} />
      case 'sms':
        return <MobileOutlined style={{ color: '#52c41a' }} />
      case 'email':
        return <MailOutlined style={{ color: '#faad14' }} />
      default:
        return null
    }
  }

  // 获取渠道名称
  const getChannelName = (channel: string) => {
    switch (channel) {
      case 'site':
        return '站内信'
      case 'sms':
        return '短信'
      case 'email':
        return '邮件'
      default:
        return channel
    }
  }

  return (
    <div>
      <Card
        title={
          <Space>
            <BellOutlined />
            <span>通知设置</span>
          </Space>
        }
      >
        <Alert
          message="通知设置说明"
          description="您可以根据需要选择接收不同类型通知的渠道。建议至少开启站内信通知，以免错过重要信息。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {/* 联系方式 */}
        <Card
          type="inner"
          title="联系方式"
          extra={
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => setIsEditingContact(!isEditingContact)}
            >
              {isEditingContact ? '取消' : '修改'}
            </Button>
          }
          style={{ marginBottom: 24 }}
        >
          {isEditingContact ? (
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="手机号码">
                    <Input
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      placeholder="请输入手机号码"
                      prefix={<MobileOutlined />}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="邮箱地址">
                    <Input
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder="请输入邮箱地址"
                      prefix={<MailOutlined />}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                onClick={() => {
                  setIsEditingContact(false)
                  message.success('联系方式更新成功')
                }}
              >
                保存
              </Button>
            </Form>
          ) : (
            <Row gutter={16}>
              <Col span={12}>
                <Space>
                  <MobileOutlined style={{ color: '#52c41a' }} />
                  <Text type="secondary">手机号码：</Text>
                  <Text strong>{contactInfo.phone}</Text>
                  <Tag color="success">已验证</Tag>
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <MailOutlined style={{ color: '#faad14' }} />
                  <Text type="secondary">邮箱地址：</Text>
                  <Text strong>{contactInfo.email}</Text>
                  <Tag color="success">已验证</Tag>
                </Space>
              </Col>
            </Row>
          )}
        </Card>

        <Divider />

        {/* 通知渠道设置 */}
        {Object.entries(settings).map(([channel, types]) => (
          <Card
            key={channel}
            type="inner"
            title={
              <Space>
                {getChannelIcon(channel)}
                <span>{getChannelName(channel)}通知</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <List
              dataSource={notificationTypes}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Switch
                      checked={types[item.key as keyof typeof types]}
                      onChange={(checked) => handleSettingChange(channel, item.key, checked)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={item.icon}
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        ))}

        <Divider />

        {/* 保存按钮 */}
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleSave}
          >
            保存设置
          </Button>
        </div>
      </Card>
    </div>
  )
}
