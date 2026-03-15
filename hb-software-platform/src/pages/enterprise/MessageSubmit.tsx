import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  List,
  Avatar,
  Tag,
  Space,
  Typography,
  Divider,
  Empty,
  Modal,
} from 'antd'
import {
  ArrowLeftOutlined,
  MessageOutlined,
  SendOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select
const { Title, Text } = Typography

// 留言状态码（与PRD一致）
// 0: 待处理, 1: 处理中, 2: 已回复, 3: 已关闭
const MESSAGE_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  REPLIED: 2,
  CLOSED: 3,
}

// 留言类型（与PRD一致）
// 1: 个性化需求, 2: 咨询, 3: 建议
const MESSAGE_TYPE = {
  PERSONALIZED: 1,
  CONSULTATION: 2,
  SUGGESTION: 3,
}

const messageTypes = [
  { value: MESSAGE_TYPE.PERSONALIZED, label: '个性化需求', color: 'blue' },
  { value: MESSAGE_TYPE.CONSULTATION, label: '咨询', color: 'green' },
  { value: MESSAGE_TYPE.SUGGESTION, label: '建议', color: 'orange' },
]

// 软件类型
const softwareTypes = [
  { value: 'MES', label: '制造执行系统(MES)' },
  { value: 'ERP', label: '企业资源计划(ERP)' },
  { value: 'PLM', label: '产品生命周期(PLM)' },
  { value: 'SCM', label: '供应链管理(SCM)' },
  { value: 'CRM', label: '客户关系管理(CRM)' },
  { value: 'WMS', label: '仓储管理系统(WMS)' },
  { value: 'IOT', label: '工业物联网平台' },
  { value: 'OTHER', label: '其他' },
]

// 模拟历史留言数据
const historyMessages = [
  {
    id: 1,
    type: MESSAGE_TYPE.CONSULTATION,
    softwareType: 'MES',
    title: 'MES系统与现有ERP集成问题',
    content: '我们目前已有ERP系统，想了解MES系统如何与现有ERP进行数据对接...',
    status: MESSAGE_STATUS.REPLIED,
    createTime: '2026-03-10 14:30',
    replyContent: '感谢您的咨询。MES与ERP集成通常通过标准API接口实现，我们可以安排技术顾问为您详细讲解集成方案。',
    replyTime: '2026-03-10 16:45',
  },
  {
    id: 2,
    type: MESSAGE_TYPE.PERSONALIZED,
    softwareType: 'ERP',
    title: '定制化ERP开发需求',
    content: '我们有特殊的生产排程需求，需要定制开发ERP模块...',
    status: MESSAGE_STATUS.PENDING,
    createTime: '2026-03-08 09:15',
  },
  {
    id: 3,
    type: MESSAGE_TYPE.SUGGESTION,
    softwareType: 'OTHER',
    title: '平台功能建议',
    content: '建议增加软件产品对比功能，方便企业选型...',
    status: MESSAGE_STATUS.CLOSED,
    createTime: '2026-03-05 11:20',
  },
]

const MessageSubmit = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      // 模拟提交
      setTimeout(() => {
        message.success('留言提交成功，平台将尽快回复')
        form.resetFields()
        setLoading(false)
      }, 1000)
    } catch (error) {
      message.error('请完善表单信息')
    }
  }

  const getStatusTag = (status: number) => {
    switch (status) {
      case MESSAGE_STATUS.PENDING:
        return <Tag icon={<ClockCircleOutlined />} color="default">待处理</Tag>
      case MESSAGE_STATUS.PROCESSING:
        return <Tag icon={<ClockCircleOutlined />} color="processing">处理中</Tag>
      case MESSAGE_STATUS.REPLIED:
        return <Tag icon={<CheckCircleOutlined />} color="success">已回复</Tag>
      case MESSAGE_STATUS.CLOSED:
        return <Tag icon={<CloseCircleOutlined />}>已关闭</Tag>
      default:
        return <Tag>{status}</Tag>
    }
  }

  const getTypeTag = (type: number) => {
    const typeInfo = messageTypes.find(t => t.value === type)
    return <Tag color={typeInfo?.color || 'default'}>{typeInfo?.label || type}</Tag>
  }

  const handleViewDetail = (message: any) => {
    setSelectedMessage(message)
    setViewModalVisible(true)
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/enterprise')}>
          返回工作台
        </Button>
      </div>

      <Row gutter={24}>
        {/* 左侧：提交留言表单 */}
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <MessageOutlined />
                <span>提交留言</span>
              </Space>
            }
            style={{ borderRadius: '12px', marginBottom: '24px' }}
          >
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="softwareType"
                    label="软件类型"
                    rules={[{ required: true, message: '请选择软件类型' }]}
                  >
                    <Select placeholder="请选择软件类型">
                      {softwareTypes.map(type => (
                        <Option key={type.value} value={type.value}>{type.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="messageType"
                    label="留言类型"
                    rules={[{ required: true, message: '请选择留言类型' }]}
                  >
                    <Select placeholder="请选择留言类型">
                      {messageTypes.map(type => (
                        <Option key={type.value} value={type.value}>{type.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="title"
                label="留言标题"
                rules={[{ required: true, message: '请输入留言标题' }]}
              >
                <Input placeholder="请简要描述您的留言主题" />
              </Form.Item>
              <Form.Item
                name="content"
                label="留言内容"
                rules={[{ required: true, message: '请输入留言内容' }]}
              >
                <TextArea 
                  rows={6} 
                  placeholder="请详细描述您的需求、咨询内容或建议..."
                />
              </Form.Item>
              <Form.Item
                name="contactName"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人姓名' }]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
              <Form.Item
                name="contactPhone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                ]}
              >
                <Input placeholder="请输入联系电话" maxLength={11} />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  icon={<SendOutlined />} 
                  onClick={handleSubmit}
                  loading={loading}
                  size="large"
                  style={{ width: '100%' }}
                >
                  提交留言
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 右侧：历史留言 */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>历史留言</span>
              </Space>
            }
            style={{ borderRadius: '12px' }}
          >
            {historyMessages.length > 0 ? (
              <List
                dataSource={historyMessages}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    style={{ 
                      padding: '16px', 
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleViewDetail(item)}
                  >
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <Space>
                          {getTypeTag(item.type)}
                          <Text strong style={{ fontSize: '14px' }}>{item.title}</Text>
                        </Space>
                        {getStatusTag(item.status)}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                          {item.content.length > 50 ? item.content.substring(0, 50) + '...' : item.content}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.createTime}
                        </Text>
                        <Button type="link" size="small" icon={<EyeOutlined />}>
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无历史留言" />
            )}
          </Card>
        </Col>
      </Row>

      {/* 查看详情弹窗 */}
      <Modal
        title="留言详情"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {selectedMessage && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Space>
                {getTypeTag(selectedMessage.type)}
                <Tag color="blue">
                  {softwareTypes.find(t => t.value === selectedMessage.softwareType)?.label}
                </Tag>
                {getStatusTag(selectedMessage.status)}
              </Space>
            </div>
            <Title level={5}>{selectedMessage.title}</Title>
            <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <Text>{selectedMessage.content}</Text>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text type="secondary">提交时间：{selectedMessage.createTime}</Text>
            </div>
            
            {selectedMessage.replyContent && (
              <>
                <Divider />
                <div style={{ background: '#e6f7ff', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '8px', background: '#1890ff' }} />
                    <Text strong>平台回复</Text>
                  </div>
                  <Text>{selectedMessage.replyContent}</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      回复时间：{selectedMessage.replyTime}
                    </Text>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MessageSubmit
