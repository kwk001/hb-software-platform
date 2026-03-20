import { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Radio,
  DatePicker,
  TimePicker,
  Space,
  message,
  Tabs,
  Tag,
  Transfer,
  Row,
  Col,
  Typography,
  Checkbox,
  Steps,
  Alert,
  Tooltip,
  Badge,
  Avatar,
  Divider,
  Statistic,
} from 'antd'
import {
  SendOutlined,
  TeamOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
  CheckCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  ReloadOutlined,
  EyeOutlined,
  SoundOutlined,
  NotificationOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ScheduleOutlined,
} from '@ant-design/icons'
import type { TransferProps } from 'antd'

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs
const { Title, Text, Paragraph } = Typography

// 模拟用户数据
const mockUsers = [
  { key: '1', title: '张三', description: '湖北智造科技', type: '工业制造企业' },
  { key: '2', title: '李四', description: '武汉云智软件', type: '工业软件企业' },
  { key: '3', title: '王五', description: '襄阳创新科技', type: '工业软件企业' },
  { key: '4', title: '赵六', description: '宜昌数字科技', type: '工业制造企业' },
  { key: '5', title: '陈七', description: '黄石物流科技', type: '工业制造企业' },
  { key: '6', title: '刘八', description: '荆州智能制造', type: '工业软件企业' },
  { key: '7', title: '周九', description: '荆门工业互联网', type: '工业软件企业' },
  { key: '8', title: '吴十', description: '鄂州数字化转型', type: '工业制造企业' },
  { key: '9', title: '郑十一', description: '孝感智能制造', type: '工业制造企业' },
  { key: '10', title: '孙十二', description: '黄冈软件科技', type: '工业软件企业' },
  { key: '11', title: '钱十三', description: '咸宁数字工厂', type: '工业制造企业' },
  { key: '12', title: '周十四', description: '随州云服务', type: '工业软件企业' },
]

// 消息模板
const messageTemplates = [
  { id: '1', name: '企业入驻审核通过', content: '恭喜！您的企业入驻申请已通过审核，欢迎加入湖北省工业软件公共服务平台。', category: 'enterprise', icon: <CheckCircleOutlined /> },
  { id: '2', name: '软件发布审核通过', content: '您的软件产品【{softwareName}】已通过审核并上架。', category: 'software', icon: <AppstoreOutlined /> },
  { id: '3', name: '补贴券审核通过', content: '您的补贴券申报已通过审核，补贴金额：{amount}元。', category: 'subsidy', icon: <TagsOutlined /> },
  { id: '4', name: '系统维护通知', content: '平台将于{time}进行系统维护，维护期间部分功能可能无法使用，请提前做好准备。', category: 'system', icon: <ScheduleOutlined /> },
  { id: '5', name: '政策更新提醒', content: '新的补贴政策已发布，请登录平台查看详情。', category: 'policy', icon: <NotificationOutlined /> },
]

// 角色选项
const roleOptions = [
  { value: 'all', label: '全部用户', count: 156, color: '#1890ff', icon: <TeamOutlined /> },
  { value: 'demand', label: '工业制造企业', count: 89, color: '#52c41a', icon: <UserOutlined /> },
  { value: 'supply', label: '工业软件企业', count: 67, color: '#722ed1', icon: <AppstoreOutlined /> },
]

// 部门选项
const deptOptions = [
  { value: 'operation', label: '平台运营部', count: 12, color: '#faad14' },
  { value: 'finance', label: '财务审核部', count: 8, color: '#13c2c2' },
  { value: 'tech', label: '技术支持部', count: 15, color: '#eb2f96' },
  { value: 'admin', label: '综合管理部', count: 6, color: '#f5222d' },
]

// 通知渠道配置
const channelConfig = {
  site: { label: '站内信', color: '#1890ff', bg: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)', icon: <MessageOutlined /> },
  sms: { label: '短信', color: '#52c41a', bg: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', icon: <MobileOutlined /> },
  email: { label: '邮件', color: '#722ed1', bg: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)', icon: <MailOutlined /> },
}

export default function MessageSend() {
  const [form] = Form.useForm()
  const [sendType, setSendType] = useState('single')
  const [scheduleType, setScheduleType] = useState('now')
  const [targetKeys, setTargetKeys] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['site'])

  // 处理模板选择
  const handleTemplateChange = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId)
    if (template) {
      form.setFieldsValue({ content: template.content })
      setSelectedTemplate(templateId)
    }
  }

  // 处理发送
  const handleSend = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // 模拟发送
      setTimeout(() => {
        setLoading(false)
        if (scheduleType === 'now') {
          message.success('消息发送成功')
        } else {
          message.success('定时消息已设置')
        }
        form.resetFields()
        setTargetKeys([])
        setSelectedTemplate('')
        setCurrentStep(0)
      }, 1500)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 穿梭框筛选
  const filterOption: TransferProps['filterOption'] = (inputValue, option) => {
    return option.title!.toLowerCase().includes(inputValue.toLowerCase())
  }

  // 获取当前步骤内容
  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Alert
              message="选择发送方式"
              description="请选择单发或群发方式，单发适用于给特定用户发送个性化消息，群发适用于批量发送。"
              type="info"
              showIcon
              style={{ marginBottom: 32, borderRadius: 12, border: 'none', background: '#e6f7ff' }}
            />
            <Form.Item
              name="sendType"
              label={<Text strong style={{ fontSize: 16 }}>发送方式</Text>}
              rules={[{ required: true }]}
              initialValue="single"
            >
              <Radio.Group 
                onChange={(e) => {
                  setSendType(e.target.value)
                  form.setFieldsValue({ sendType: e.target.value })
                }}
                style={{ width: '100%' }}
              >
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <div
                      style={{
                        padding: 32,
                        borderRadius: 16,
                        border: `2px solid ${sendType === 'single' ? '#1890ff' : '#e8e8e8'}`,
                        background: sendType === 'single' ? '#e6f7ff' : '#fafafa',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                      }}
                      onClick={() => {
                        setSendType('single')
                        form.setFieldsValue({ sendType: 'single' })
                      }}
                    >
                      <Radio value="single" style={{ width: '100%' }}>
                        <Space direction="vertical" size="middle" style={{ marginLeft: 8 }}>
                          <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: sendType === 'single' ? 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)' : '#d9d9d9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            boxShadow: sendType === 'single' ? '0 8px 24px rgba(24, 144, 255, 0.3)' : 'none',
                          }}>
                            <UserOutlined style={{ fontSize: 28, color: '#fff' }} />
                          </div>
                          <div>
                            <Text strong style={{ fontSize: 18, display: 'block' }}>单发</Text>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              给特定用户发送个性化消息
                            </Text>
                          </div>
                        </Space>
                      </Radio>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        padding: 32,
                        borderRadius: 16,
                        border: `2px solid ${sendType === 'batch' ? '#52c41a' : '#e8e8e8'}`,
                        background: sendType === 'batch' ? '#f6ffed' : '#fafafa',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textAlign: 'center',
                      }}
                      onClick={() => {
                        setSendType('batch')
                        form.setFieldsValue({ sendType: 'batch' })
                      }}
                    >
                      <Radio value="batch" style={{ width: '100%' }}>
                        <Space direction="vertical" size="middle" style={{ marginLeft: 8 }}>
                          <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: sendType === 'batch' ? 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)' : '#d9d9d9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            boxShadow: sendType === 'batch' ? '0 8px 24px rgba(82, 196, 26, 0.3)' : 'none',
                          }}>
                            <TeamOutlined style={{ fontSize: 28, color: '#fff' }} />
                          </div>
                          <div>
                            <Text strong style={{ fontSize: 18, display: 'block' }}>群发</Text>
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              批量发送给多个用户
                            </Text>
                          </div>
                        </Space>
                      </Radio>
                    </div>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>
          </div>
        )
      case 1:
        return (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Alert
              message="选择接收人"
              description={sendType === 'single' ? '请选择要发送消息的特定用户。' : '请选择要批量发送的用户群体。'}
              type="info"
              showIcon
              style={{ marginBottom: 32, borderRadius: 12, border: 'none', background: '#e6f7ff' }}
            />
            {sendType === 'single' ? (
              <Form.Item
                name="recipient"
                label={<Text strong style={{ fontSize: 16 }}>选择接收人</Text>}
                rules={[{ required: true, message: '请选择接收人' }]}
              >
                <Select
                  placeholder="请选择接收人"
                  showSearch
                  optionFilterProp="children"
                  style={{ borderRadius: 8 }}
                  size="large"
                  dropdownStyle={{ borderRadius: 8 }}
                >
                  {mockUsers.map(user => (
                    <Option key={user.key} value={user.key}>
                      <Space>
                        <Avatar size="small" icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                        <span style={{ fontWeight: 500 }}>{user.title}</span>
                        <span style={{ color: '#8c8c8c' }}>- {user.description}</span>
                        <Tag style={{ borderRadius: 4, fontSize: 11 }}>{user.type}</Tag>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  name="filterType"
                  label={<Text strong style={{ fontSize: 16 }}>筛选方式</Text>}
                  rules={[{ required: true }]}
                  initialValue="role"
                >
                  <Radio.Group>
                    <Space size="large">
                      <Radio value="role">按角色筛选</Radio>
                      <Radio value="dept">按部门筛选</Radio>
                      <Radio value="custom">自定义选择</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.filterType !== currentValues.filterType
                  }
                >
                  {({ getFieldValue }) => {
                    const filterType = getFieldValue('filterType')
                    if (filterType === 'role') {
                      return (
                        <Form.Item
                          name="role"
                          label={<Text strong style={{ fontSize: 16 }}>选择角色</Text>}
                          rules={[{ required: true, message: '请选择角色' }]}
                        >
                          <Select placeholder="请选择角色" size="large" style={{ borderRadius: 8 }}>
                            {roleOptions.map(role => (
                              <Option key={role.value} value={role.value}>
                                <Space>
                                  <div style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 6,
                                    background: role.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                    <span style={{ color: '#fff', fontSize: 14 }}>{role.icon}</span>
                                  </div>
                                  <span style={{ fontWeight: 500 }}>{role.label}</span>
                                  <Badge count={role.count} style={{ backgroundColor: role.color }} />
                                </Space>
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )
                    }
                    if (filterType === 'dept') {
                      return (
                        <Form.Item
                          name="dept"
                          label={<Text strong style={{ fontSize: 16 }}>选择部门</Text>}
                          rules={[{ required: true, message: '请选择部门' }]}
                        >
                          <Select placeholder="请选择部门" size="large" style={{ borderRadius: 8 }}>
                            {deptOptions.map(dept => (
                              <Option key={dept.value} value={dept.value}>
                                <Space>
                                  <div style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: dept.color,
                                  }} />
                                  <span style={{ fontWeight: 500 }}>{dept.label}</span>
                                  <Badge count={dept.count} style={{ backgroundColor: dept.color }} />
                                </Space>
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )
                    }
                    if (filterType === 'custom') {
                      return (
                        <Form.Item label={<Text strong style={{ fontSize: 16 }}>选择用户</Text>}>
                          <Transfer
                            dataSource={mockUsers}
                            showSearch
                            filterOption={filterOption}
                            targetKeys={targetKeys}
                            onChange={(keys) => setTargetKeys(keys as string[])}
                            render={item => (
                              <Space>
                                <Avatar size="small" icon={<UserOutlined />} style={{ background: '#1890ff' }} />
                                <span>{item.title}</span>
                                <span style={{ color: '#8c8c8c' }}>- {item.description}</span>
                              </Space>
                            )}
                            listStyle={{
                              width: 320,
                              height: 400,
                              borderRadius: 12,
                            }}
                            titles={[
                              <Text strong key="source">可选用户 ({mockUsers.length - targetKeys.length})</Text>,
                              <Text strong key="target">已选用户 ({targetKeys.length})</Text>,
                            ]}
                            style={{ marginTop: 8 }}
                          />
                        </Form.Item>
                      )
                    }
                    return null
                  }}
                </Form.Item>
              </>
            )}
          </div>
        )
      case 2:
        return (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Alert
              message="编辑消息内容"
              description="您可以选择预设模板快速填充，或自定义编辑消息内容。"
              type="info"
              showIcon
              style={{ marginBottom: 32, borderRadius: 12, border: 'none', background: '#e6f7ff' }}
            />
            {/* 消息模板 */}
            <Form.Item label={<Text strong style={{ fontSize: 16 }}>消息模板（可选）</Text>}>
              <Select
                placeholder="选择模板快速填充"
                value={selectedTemplate}
                onChange={handleTemplateChange}
                allowClear
                style={{ borderRadius: 8 }}
                size="large"
              >
                {messageTemplates.map(template => (
                  <Option key={template.id} value={template.id}>
                    <Space>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 14, color: '#1890ff' }}>{template.icon}</span>
                      </div>
                      <span style={{ fontWeight: 500 }}>{template.name}</span>
                      <Tag style={{ borderRadius: 4 }}>
                        {template.category === 'enterprise' && '企业'}
                        {template.category === 'software' && '软件'}
                        {template.category === 'subsidy' && '补贴'}
                        {template.category === 'system' && '系统'}
                        {template.category === 'policy' && '政策'}
                      </Tag>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* 消息标题 */}
            <Form.Item
              name="title"
              label={<Text strong style={{ fontSize: 16 }}>消息标题</Text>}
              rules={[{ required: true, message: '请输入消息标题' }]}
            >
              <Input 
                placeholder="请输入消息标题" 
                maxLength={100} 
                showCount 
                style={{ borderRadius: 8 }}
                size="large"
                prefix={<EditOutlined style={{ color: '#8c8c8c' }} />}
              />
            </Form.Item>

            {/* 消息内容 */}
            <Form.Item
              name="content"
              label={<Text strong style={{ fontSize: 16 }}>消息内容</Text>}
              rules={[{ required: true, message: '请输入消息内容' }]}
            >
              <TextArea
                placeholder="请输入消息内容"
                rows={6}
                maxLength={500}
                showCount
                style={{ borderRadius: 8, fontSize: 14 }}
              />
            </Form.Item>

            {/* 通知渠道 */}
            <Form.Item
              name="channels"
              label={<Text strong style={{ fontSize: 16 }}>通知渠道</Text>}
              rules={[{ required: true, message: '请选择通知渠道' }]}
              initialValue={['site']}
            >
              <Checkbox.Group value={selectedChannels} onChange={(values) => setSelectedChannels(values as string[])}>
                <Row gutter={[16, 16]}>
                  {Object.entries(channelConfig).map(([key, config]) => (
                    <Col span={8} key={key}>
                      <div
                        style={{
                          padding: 20,
                          borderRadius: 12,
                          border: `2px solid ${selectedChannels.includes(key) ? config.color : '#e8e8e8'}`,
                          background: selectedChannels.includes(key) ? `${config.color}10` : '#fafafa',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onClick={() => {
                          const newChannels = selectedChannels.includes(key)
                            ? selectedChannels.filter(c => c !== key)
                            : [...selectedChannels, key]
                          setSelectedChannels(newChannels)
                          form.setFieldsValue({ channels: newChannels })
                        }}
                      >
                        <Checkbox value={key} style={{ width: '100%' }}>
                          <Space direction="vertical" size="small">
                            <div style={{
                              width: 48,
                              height: 48,
                              borderRadius: 12,
                              background: config.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                              boxShadow: selectedChannels.includes(key) ? `0 4px 12px ${config.color}40` : 'none',
                            }}>
                              <span style={{ color: '#fff', fontSize: 20 }}>{config.icon}</span>
                            </div>
                            <Text strong style={{ fontSize: 15 }}>{config.label}</Text>
                          </Space>
                        </Checkbox>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </div>
        )
      case 3:
        return (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Alert
              message="设置发送时间"
              description="您可以选择立即发送，或设置定时发送。"
              type="info"
              showIcon
              style={{ marginBottom: 32, borderRadius: 12, border: 'none', background: '#e6f7ff' }}
            />
            <Form.Item
              name="scheduleType"
              label={<Text strong style={{ fontSize: 16 }}>发送时间</Text>}
              rules={[{ required: true }]}
              initialValue="now"
            >
              <Radio.Group onChange={(e) => setScheduleType(e.target.value)} value={scheduleType}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      border: `2px solid ${scheduleType === 'now' ? '#52c41a' : '#e8e8e8'}`,
                      background: scheduleType === 'now' ? '#f6ffed' : '#fafafa',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => {
                      setScheduleType('now')
                      form.setFieldsValue({ scheduleType: 'now' })
                    }}
                  >
                    <Radio value="now">
                      <Space size="large">
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: 14,
                          background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: scheduleType === 'now' ? '0 8px 24px rgba(82, 196, 26, 0.3)' : 'none',
                        }}>
                          <SendOutlined style={{ fontSize: 24, color: '#fff' }} />
                        </div>
                        <div>
                          <Text strong style={{ fontSize: 17, display: 'block' }}>立即发送</Text>
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            消息将立即发送给接收人
                          </Text>
                        </div>
                      </Space>
                    </Radio>
                  </div>
                  <div
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      border: `2px solid ${scheduleType === 'schedule' ? '#faad14' : '#e8e8e8'}`,
                      background: scheduleType === 'schedule' ? '#fffbe6' : '#fafafa',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => {
                      setScheduleType('schedule')
                      form.setFieldsValue({ scheduleType: 'schedule' })
                    }}
                  >
                    <Radio value="schedule">
                      <Space size="large">
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: 14,
                          background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: scheduleType === 'schedule' ? '0 8px 24px rgba(250, 173, 20, 0.3)' : 'none',
                        }}>
                          <ClockCircleOutlined style={{ fontSize: 24, color: '#fff' }} />
                        </div>
                        <div>
                          <Text strong style={{ fontSize: 17, display: 'block' }}>定时发送</Text>
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            设置在指定时间自动发送
                          </Text>
                        </div>
                      </Space>
                    </Radio>
                  </div>
                </Space>
              </Radio.Group>
            </Form.Item>

            {scheduleType === 'schedule' && (
              <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={12}>
                  <Form.Item
                    name="scheduleDate"
                    label={<Text strong style={{ fontSize: 16 }}>发送日期</Text>}
                    rules={[{ required: true, message: '请选择发送日期' }]}
                  >
                    <DatePicker style={{ width: '100%', borderRadius: 8 }} size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="scheduleTime"
                    label={<Text strong style={{ fontSize: 16 }}>发送时间</Text>}
                    rules={[{ required: true, message: '请选择发送时间' }]}
                  >
                    <TimePicker style={{ width: '100%', borderRadius: 8 }} format="HH:mm" size="large" />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const steps = [
    { title: '选择方式', icon: <UserOutlined /> },
    { title: '选择接收人', icon: <TeamOutlined /> },
    { title: '编辑内容', icon: <EditOutlined /> },
    { title: '设置时间', icon: <ClockCircleOutlined /> },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card
        style={{
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0',
        }}
        bodyStyle={{ padding: '40px' }}
      >
        {/* 标题栏 */}
        <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 40 }}>
          <Col flex="auto">
            <Space align="center" size="large">
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.35)',
                }}
              >
                <SendOutlined style={{ color: '#fff', fontSize: 36 }} />
              </div>
              <div>
                <Title level={3} style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
                  消息发送
                </Title>
                <Text type="secondary" style={{ fontSize: 15 }}>
                  向平台用户发送站内信、短信或邮件通知
                </Text>
              </div>
            </Space>
          </Col>
        </Row>

        {/* 步骤条 */}
        <div style={{ marginBottom: 48, padding: '0 40px' }}>
          <Steps
            current={currentStep}
            items={steps}
            labelPlacement="vertical"
          />
        </div>

        {/* 表单内容 */}
        <Form
          form={form}
          layout="vertical"
        >
          {getStepContent()}

          {/* 操作按钮 */}
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <Space size="large">
              {currentStep > 0 && (
                <Button
                  size="large"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  style={{ 
                    borderRadius: 10, 
                    minWidth: 140,
                    height: 48,
                    fontSize: 15,
                  }}
                  icon={<ArrowLeftOutlined />}
                >
                  上一步
                </Button>
              )}
              {currentStep < 3 ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={async () => {
                    try {
                      await form.validateFields()
                      setCurrentStep(currentStep + 1)
                    } catch (error) {
                      // 验证失败
                    }
                  }}
                  style={{
                    borderRadius: 10,
                    minWidth: 140,
                    height: 48,
                    fontSize: 15,
                    background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(24, 144, 255, 0.35)',
                  }}
                >
                  下一步
                  <ArrowRightOutlined style={{ marginLeft: 4 }} />
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  icon={<SendOutlined />}
                  loading={loading}
                  onClick={handleSend}
                  style={{
                    borderRadius: 10,
                    minWidth: 180,
                    background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                    border: 'none',
                    height: 52,
                    fontSize: 17,
                    boxShadow: '0 4px 16px rgba(82, 196, 26, 0.35)',
                  }}
                >
                  {scheduleType === 'now' ? '立即发送' : '设置定时发送'}
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  )
}
