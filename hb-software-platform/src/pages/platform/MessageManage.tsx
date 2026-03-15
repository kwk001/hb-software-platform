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
  Avatar,
  Typography,
  Divider,
  Timeline,
  Badge,
} from 'antd'
import {
  EyeOutlined,
  MessageOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons'

const { Search } = Input
const { Option } = Select
const { TextArea } = Input
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

// 模拟留言数据
const messageList = [
  {
    id: 1,
    enterpriseName: '武汉钢铁集团',
    enterpriseType: 'demand',
    type: MESSAGE_TYPE.CONSULTATION,
    softwareType: 'MES',
    title: 'MES系统与现有ERP集成问题',
    content: '我们目前已有ERP系统，想了解MES系统如何与现有ERP进行数据对接，需要哪些接口开发工作？',
    status: MESSAGE_STATUS.PENDING,
    createTime: '2026-03-10 14:30',
    contactName: '张经理',
    contactPhone: '138****1234',
  },
  {
    id: 2,
    enterpriseName: '襄阳汽车零部件',
    enterpriseType: 'demand',
    type: MESSAGE_TYPE.PERSONALIZED,
    softwareType: 'ERP',
    title: '定制化ERP开发需求',
    content: '我们有特殊的生产排程需求，需要定制开发ERP模块，请问是否支持？开发周期大概多久？',
    status: MESSAGE_STATUS.PROCESSING,
    createTime: '2026-03-09 10:15',
    contactName: '李总',
    contactPhone: '139****5678',
    replies: [
      {
        id: 1,
        content: '已收到您的需求，我们的技术团队正在评估可行性。',
        replyTime: '2026-03-09 14:20',
        replier: '平台客服',
      },
    ],
  },
  {
    id: 3,
    enterpriseName: '宜昌化工集团',
    enterpriseType: 'demand',
    type: MESSAGE_TYPE.SUGGESTION,
    softwareType: 'OTHER',
    title: '平台功能建议',
    content: '建议增加软件产品对比功能，方便企业选型时可以同时对比多个产品的功能、价格等信息。',
    status: MESSAGE_STATUS.REPLIED,
    createTime: '2026-03-08 11:20',
    contactName: '王工',
    contactPhone: '137****9012',
    replies: [
      {
        id: 1,
        content: '感谢您的宝贵建议！我们已将此需求纳入产品规划，预计下个版本上线。',
        replyTime: '2026-03-08 16:30',
        replier: '产品经理',
      },
    ],
  },
  {
    id: 4,
    enterpriseName: '黄石机械制造',
    enterpriseType: 'demand',
    type: MESSAGE_TYPE.CONSULTATION,
    softwareType: 'PLM',
    title: 'PLM系统选型咨询',
    content: '我们是中小型机械制造企业，想了解PLM系统的投入成本和实施周期。',
    status: MESSAGE_STATUS.CLOSED,
    createTime: '2026-03-05 09:00',
    contactName: '赵经理',
    contactPhone: '136****3456',
    replies: [
      {
        id: 1,
        content: '已通过电话为您详细解答，如有其他问题欢迎随时联系。',
        replyTime: '2026-03-05 11:30',
        replier: '平台客服',
      },
    ],
  },
  {
    id: 5,
    enterpriseName: '荆州电子科技',
    enterpriseType: 'demand',
    type: MESSAGE_TYPE.PERSONALIZED,
    softwareType: 'IOT',
    title: '设备数据采集方案咨询',
    content: '我们车间有50台老旧设备，想进行数据采集改造，想了解具体的实施方案和成本。',
    status: MESSAGE_STATUS.PENDING,
    createTime: '2026-03-12 15:45',
    contactName: '陈工',
    contactPhone: '135****7890',
  },
]

const MessageManage = () => {
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [replyModalVisible, setReplyModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [form] = Form.useForm()

  const getStatusTag = (status: number) => {
    switch (status) {
      case MESSAGE_STATUS.PENDING:
        return <Badge status="default" text="待处理" />
      case MESSAGE_STATUS.PROCESSING:
        return <Badge status="processing" text="处理中" />
      case MESSAGE_STATUS.REPLIED:
        return <Badge status="success" text="已回复" />
      case MESSAGE_STATUS.CLOSED:
        return <Badge status="default" text="已关闭" />
      default:
        return <Tag>{status}</Tag>
    }
  }

  const getTypeTag = (type: number) => {
    const typeInfo = messageTypes.find(t => t.value === type)
    return <Tag color={typeInfo?.color || 'default'}>{typeInfo?.label || type}</Tag>
  }

  const columns = [
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '留言类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => getTypeTag(type),
    },
    {
      title: '软件类型',
      dataIndex: 'softwareType',
      key: 'softwareType',
      render: (type: string) => softwareTypes.find(t => t.value === type)?.label || type,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {(record.status === MESSAGE_STATUS.PENDING || record.status === MESSAGE_STATUS.PROCESSING) && (
            <Button 
              type="link" 
              size="small" 
              icon={<MessageOutlined />}
              onClick={() => handleReply(record)}
            >
              回复
            </Button>
          )}
          {record.status !== MESSAGE_STATUS.CLOSED && (
            <Button 
              type="link" 
              size="small" 
              danger
              onClick={() => handleClose(record)}
            >
              关闭
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const handleViewDetail = (record: any) => {
    setSelectedMessage(record)
    setDetailModalVisible(true)
  }

  const handleReply = (record: any) => {
    setSelectedMessage(record)
    form.resetFields()
    setReplyModalVisible(true)
  }

  const handleClose = (record: any) => {
    message.success(`留言「${record.title}」已关闭`)
  }

  const handleSendReply = async () => {
    try {
      const values = await form.validateFields()
      message.success('回复发送成功')
      setReplyModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('请输入回复内容')
    }
  }

  // 统计数据
  const stats = {
    pending: messageList.filter(m => m.status === MESSAGE_STATUS.PENDING).length,
    processing: messageList.filter(m => m.status === MESSAGE_STATUS.PROCESSING).length,
    replied: messageList.filter(m => m.status === MESSAGE_STATUS.REPLIED).length,
    total: messageList.length,
  }

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff4d4f' }}>{stats.pending}</div>
              <div style={{ color: '#666' }}>待处理</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>{stats.processing}</div>
              <div style={{ color: '#666' }}>处理中</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>{stats.replied}</div>
              <div style={{ color: '#666' }}>已回复</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1' }}>{stats.total}</div>
              <div style={{ color: '#666' }}>留言总数</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title="留言管理"
        style={{ borderRadius: '12px' }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={8}>
            <Search
              placeholder="搜索企业名称或留言标题"
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
              <Option value="pending">待处理</Option>
              <Option value="processing">处理中</Option>
              <Option value="replied">已回复</Option>
              <Option value="closed">已关闭</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              value={type}
              onChange={setType}
              style={{ width: '100%' }}
              placeholder="选择类型"
            >
              <Option value="all">全部类型</Option>
              {messageTypes.map(t => (
                <Option key={t.value} value={t.value}>{t.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Button icon={<ReloadOutlined />} style={{ width: '100%' }}>
              刷新
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={messageList}
          rowKey="id"
          pagination={{
            total: messageList.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 回复弹窗 */}
      <Modal
        title="回复留言"
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={handleSendReply}
        okText="发送回复"
        cancelText="取消"
        width={600}
      >
        {selectedMessage && (
          <div>
            <div style={{ marginBottom: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ marginBottom: '8px' }}>
                <Space>
                  <Text strong>{selectedMessage.enterpriseName}</Text>
                  {getTypeTag(selectedMessage.type)}
                </Space>
              </div>
              <Title level={5}>{selectedMessage.title}</Title>
              <Text>{selectedMessage.content}</Text>
            </div>
            <Form form={form} layout="vertical">
              <Form.Item
                name="replyContent"
                label="回复内容"
                rules={[{ required: true, message: '请输入回复内容' }]}
              >
                <TextArea 
                  rows={6} 
                  placeholder="请输入回复内容..."
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="留言详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedMessage && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Space>
                <Avatar icon={<UserOutlined />} />
                <Text strong>{selectedMessage.enterpriseName}</Text>
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
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={12}>
                <Text type="secondary">联系人：{selectedMessage.contactName}</Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">联系电话：{selectedMessage.contactPhone}</Text>
              </Col>
            </Row>
            <div>
              <Text type="secondary">提交时间：{selectedMessage.createTime}</Text>
            </div>

            {selectedMessage.replies && selectedMessage.replies.length > 0 && (
              <>
                <Divider />
                <Title level={5}>回复记录</Title>
                <Timeline>
                  {selectedMessage.replies.map((reply: any) => (
                    <Timeline.Item key={reply.id}>
                      <div style={{ background: '#e6f7ff', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: '8px', background: '#1890ff' }} />
                          <Text strong>{reply.replier}</Text>
                        </div>
                        <Text>{reply.content}</Text>
                        <div style={{ marginTop: '8px' }}>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {reply.replyTime}
                          </Text>
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default MessageManage
