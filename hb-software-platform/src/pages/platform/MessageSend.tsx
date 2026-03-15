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
  Switch,
  Row,
  Col,
  Typography,
  Divider,
  Checkbox,
} from 'antd'
import {
  SendOutlined,
  TeamOutlined,
  UserOutlined,
  ClockCircleOutlined,
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
} from '@ant-design/icons'
import type { TransferProps } from 'antd'

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs
const { Title, Text } = Typography

// 模拟用户数据
const mockUsers = [
  { key: '1', title: '张三 - 湖北智造科技', description: '工业制造企业' },
  { key: '2', title: '李四 - 武汉云智软件', description: '工业软件企业' },
  { key: '3', title: '王五 - 襄阳创新科技', description: '工业软件企业' },
  { key: '4', title: '赵六 - 宜昌数字科技', description: '工业制造企业' },
  { key: '5', title: '陈七 - 黄石物流科技', description: '工业制造企业' },
  { key: '6', title: '刘八 - 荆州智能制造', description: '工业软件企业' },
  { key: '7', title: '周九 - 荆门工业互联网', description: '工业软件企业' },
  { key: '8', title: '吴十 - 鄂州数字化转型', description: '工业制造企业' },
]

// 消息模板
const messageTemplates = [
  { id: '1', name: '企业入驻审核通过', content: '恭喜！您的企业入驻申请已通过审核，欢迎加入湖北省工业软件公共服务平台。' },
  { id: '2', name: '软件发布审核通过', content: '您的软件产品【{softwareName}】已通过审核并上架。' },
  { id: '3', name: '补贴券审核通过', content: '您的补贴券申报已通过审核，补贴金额：{amount}元。' },
  { id: '4', name: '系统维护通知', content: '平台将于{time}进行系统维护，维护期间部分功能可能无法使用，请提前做好准备。' },
  { id: '5', name: '政策更新提醒', content: '新的补贴政策已发布，请登录平台查看详情。' },
]

// 角色选项
const roleOptions = [
  { value: 'all', label: '全部用户' },
  { value: 'demand', label: '工业制造企业' },
  { value: 'supply', label: '工业软件企业' },
  { value: 'admin', label: '平台管理员' },
]

// 部门选项
const deptOptions = [
  { value: 'operation', label: '平台运营部' },
  { value: 'finance', label: '财务审核部' },
  { value: 'tech', label: '技术支持部' },
  { value: 'admin', label: '综合管理部' },
]

export default function MessageSend() {
  const [form] = Form.useForm()
  const [sendType, setSendType] = useState('single')
  const [scheduleType, setScheduleType] = useState('now')
  const [targetKeys, setTargetKeys] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [loading, setLoading] = useState(false)

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
      }, 1500)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 穿梭框筛选
  const filterOption: TransferProps['filterOption'] = (inputValue, option) => {
    return option.title!.toLowerCase().includes(inputValue.toLowerCase())
  }

  return (
    <div>
      <Card
        title={
          <Space>
            <SendOutlined />
            <span>消息发送</span>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            sendType: 'single',
            scheduleType: 'now',
            channels: ['site'],
          }}
        >
          {/* 发送方式 */}
          <Form.Item
            name="sendType"
            label="发送方式"
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={(e) => setSendType(e.target.value)}>
              <Radio.Button value="single">
                <UserOutlined /> 单发
              </Radio.Button>
              <Radio.Button value="batch">
                <TeamOutlined /> 群发
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Divider />

          {/* 接收人选择 */}
          {sendType === 'single' ? (
            <Form.Item
              name="recipient"
              label="选择接收人"
              rules={[{ required: true, message: '请选择接收人' }]}
            >
              <Select
                  placeholder="请选择接收人"
                  showSearch
                  optionFilterProp="children"
                >
                  {mockUsers.map(user => (
                    <Option key={user.key} value={user.key}>
                      <Space>
                        <span>{user.title}</span>
                        <Tag>{user.description}</Tag>
                      </Space>
                    </Option>
                  ))}
                </Select>
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="filterType"
                label="筛选方式"
                rules={[{ required: true }]}
              >
                <Radio.Group>
                  <Radio value="role">按角色筛选</Radio>
                  <Radio value="dept">按部门筛选</Radio>
                  <Radio value="custom">自定义选择</Radio>
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
                        label="选择角色"
                        rules={[{ required: true, message: '请选择角色' }]}
                      >
                        <Select placeholder="请选择角色">
                          {roleOptions.map(role => (
                            <Option key={role.value} value={role.value}>
                              {role.label}
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
                        label="选择部门"
                        rules={[{ required: true, message: '请选择部门' }]}
                      >
                        <Select placeholder="请选择部门">
                          {deptOptions.map(dept => (
                            <Option key={dept.value} value={dept.value}>
                              {dept.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )
                  }
                  if (filterType === 'custom') {
                    return (
                      <Form.Item label="选择用户">
                        <Transfer
                          dataSource={mockUsers}
                          showSearch
                          filterOption={filterOption}
                          targetKeys={targetKeys}
                          onChange={(keys) => setTargetKeys(keys as string[])}
                          render={item => item.title}
                          listStyle={{
                            width: 300,
                            height: 300,
                          }}
                        />
                      </Form.Item>
                    )
                  }
                  return null
                }}
              </Form.Item>
            </>
          )}

          <Divider />

          {/* 消息模板 */}
          <Form.Item label="消息模板（可选）">
            <Select
              placeholder="选择模板快速填充"
              value={selectedTemplate}
              onChange={handleTemplateChange}
              allowClear
            >
              {messageTemplates.map(template => (
                <Option key={template.id} value={template.id}>
                  {template.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* 消息标题 */}
          <Form.Item
            name="title"
            label="消息标题"
            rules={[{ required: true, message: '请输入消息标题' }]}
          >
            <Input placeholder="请输入消息标题" maxLength={100} showCount />
          </Form.Item>

          {/* 消息内容 */}
          <Form.Item
            name="content"
            label="消息内容"
            rules={[{ required: true, message: '请输入消息内容' }]}
          >
            <TextArea
              placeholder="请输入消息内容"
              rows={6}
              maxLength={500}
              showCount
            />
          </Form.Item>

          {/* 通知渠道 */}
          <Form.Item
            name="channels"
            label="通知渠道"
            rules={[{ required: true, message: '请选择通知渠道' }]}
          >
            <Checkbox.Group>
              <Space>
                <Checkbox value="site">
                  <Space>
                    <MessageOutlined />
                    站内信
                  </Space>
                </Checkbox>
                <Checkbox value="sms">
                  <Space>
                    <MobileOutlined />
                    短信
                  </Space>
                </Checkbox>
                <Checkbox value="email">
                  <Space>
                    <MailOutlined />
                    邮件
                  </Space>
                </Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Divider />

          {/* 发送时间 */}
          <Form.Item
            name="scheduleType"
            label="发送时间"
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={(e) => setScheduleType(e.target.value)}>
              <Radio value="now">立即发送</Radio>
              <Radio value="schedule">
                <Space>
                  <ClockCircleOutlined />
                  定时发送
                </Space>
              </Radio>
            </Radio.Group>
          </Form.Item>

          {scheduleType === 'schedule' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="scheduleDate"
                  label="发送日期"
                  rules={[{ required: true, message: '请选择发送日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="scheduleTime"
                  label="发送时间"
                  rules={[{ required: true, message: '请选择发送时间' }]}
                >
                  <TimePicker style={{ width: '100%' }} format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={loading}
              onClick={handleSend}
              size="large"
            >
              {scheduleType === 'now' ? '立即发送' : '设置定时发送'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
