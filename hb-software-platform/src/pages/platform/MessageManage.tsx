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
  Statistic,
  Empty,
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
  CommentOutlined,
  SolutionOutlined,
  BulbOutlined,
  CustomerServiceOutlined,
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
  { value: MESSAGE_TYPE.PERSONALIZED, label: '个性化需求', color: '#1890ff', bg: '#e6f7ff', icon: <SolutionOutlined /> },
  { value: MESSAGE_TYPE.CONSULTATION, label: '咨询', color: '#52c41a', bg: '#f6ffed', icon: <CustomerServiceOutlined /> },
  { value: MESSAGE_TYPE.SUGGESTION, label: '建议', color: '#fa8c16', bg: '#fff7e6', icon: <BulbOutlined /> },
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
  {
    id: 6,
    enterpriseName: '十堰汽车配件',
    enterpriseType: 'demand',
    type: MESSAGE_TYPE.CONSULTATION,
    softwareType: 'WMS',
    title: '仓储管理系统咨询',
    content: '我们的仓库面积5000平米，想了解WMS系统的部署方案和费用。',
    status: MESSAGE_STATUS.REPLIED,
    createTime: '2026-03-11 09:30',
    contactName: '刘经理',
    contactPhone: '133****2468',
    replies: [
      {
        id: 1,
        content: '已安排技术顾问与您联系，预计今天下午会有专人致电沟通。',
        replyTime: '2026-03-11 11:00',
        replier: '平台客服',
      },
    ],
  },
  {
    id: 7,
    enterpriseName: '孝感纺织集团',
    enterpriseType: 'demand',
    type: MESSAGE_TYPE.SUGGESTION,
    softwareType: 'OTHER',
    title: '关于平台搜索功能的建议',
    content: '建议优化搜索功能，增加按行业、按企业规模筛选软件产品的功能。',
    status: MESSAGE_STATUS.PENDING,
    createTime: '2026-03-13 16:20',
    contactName: '周主任',
    contactPhone: '132****1357',
  },
  {
    id: 8,
    enterpriseName: '黄冈食品工业',
    enterpriseType: 'demand',
    type: MESSAGE_TYPE.CONSULTATION,
    softwareType: 'CRM',
    title: '客户关系管理系统咨询',
    content: '我们是食品生产企业，想了解CRM系统如何帮助我们管理经销商和客户。',
    status: MESSAGE_STATUS.PROCESSING,
    createTime: '2026-03-07 11:00',
    contactName: '吴经理',
    contactPhone: '131****9753',
    replies: [
      {
        id: 1,
        content: '已收到您的咨询，正在为您匹配合适的解决方案。',
        replyTime: '2026-03-07 14:30',
        replier: '平台客服',
      },
    ],
  },
]

const MessageManage = () => {
  const [status, setStatus] = useState('all')
  const [type, setType] = useState('all')
  const [replyModalVisible, setReplyModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [form] = Form.useForm()

  // 统计数据
  const stats = {
    pending: messageList.filter(m => m.status === MESSAGE_STATUS.PENDING).length,
    processing: messageList.filter(m => m.status === MESSAGE_STATUS.PROCESSING).length,
    replied: messageList.filter(m => m.status === MESSAGE_STATUS.REPLIED).length,
    closed: messageList.filter(m => m.status === MESSAGE_STATUS.CLOSED).length,
    total: messageList.length,
  }

  const getStatusTag = (status: number) => {
    const statusConfig: Record<number, { color: string; text: string; icon: any; bg: string }> = {
      [MESSAGE_STATUS.PENDING]: { 
        color: '#ff4d4f', 
        text: '待处理', 
        icon: <ClockCircleOutlined />,
        bg: '#fff1f0',
      },
      [MESSAGE_STATUS.PROCESSING]: { 
        color: '#1890ff', 
        text: '处理中', 
        icon: <CheckCircleOutlined />,
        bg: '#e6f7ff',
      },
      [MESSAGE_STATUS.REPLIED]: { 
        color: '#52c41a', 
        text: '已回复', 
        icon: <MessageOutlined />,
        bg: '#f6ffed',
      },
      [MESSAGE_STATUS.CLOSED]: { 
        color: '#8c8c8c', 
        text: '已关闭', 
        icon: <CloseCircleOutlined />,
        bg: '#f5f5f5',
      },
    }
    const config = statusConfig[status] || { color: '#999', text: '未知', icon: null, bg: '#f5f5f5' }
    return (
      <Tag 
        style={{ 
          color: config.color, 
          background: config.bg, 
          border: `1px solid ${config.color}40`,
          borderRadius: 4,
          fontWeight: 500,
        }}
        icon={config.icon}
      >
        {config.text}
      </Tag>
    )
  }

  const getTypeTag = (type: number) => {
    const typeInfo = messageTypes.find(t => t.value === type)
    if (!typeInfo) return <Tag>未知</Tag>
    return (
      <Tag 
        style={{ 
          color: typeInfo.color, 
          background: typeInfo.bg, 
          border: `1px solid ${typeInfo.color}40`,
          borderRadius: 4,
          fontWeight: 500,
        }}
        icon={typeInfo.icon}
      >
        {typeInfo.label}
      </Tag>
    )
  }

  const columns = [
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      render: (text: string) => (
        <Space>
          <Avatar 
            size="small" 
            icon={<UserOutlined />} 
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }} 
          />
          <Text strong style={{ fontSize: 14 }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: '留言类型',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type: number) => getTypeTag(type),
    },
    {
      title: '软件类型',
      dataIndex: 'softwareType',
      key: 'softwareType',
      width: 160,
      render: (type: string) => (
        <Tag style={{ borderRadius: 4, background: '#f0f5ff', color: '#2f54eb', border: '1px solid #2f54eb40' }}>
          {softwareTypes.find(t => t.value === type)?.label || type}
        </Tag>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text: string) => <Text style={{ fontWeight: 500 }}>{text}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            style={{ padding: '0 8px' }}
          >
            查看
          </Button>
          {(record.status === MESSAGE_STATUS.PENDING || record.status === MESSAGE_STATUS.PROCESSING) && (
            <Button 
              type="link" 
              size="small" 
              icon={<MessageOutlined />}
              onClick={() => handleReply(record)}
              style={{ padding: '0 8px', color: '#52c41a' }}
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
              style={{ padding: '0 8px' }}
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

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={4}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>留言总数</span>}
              value={stats.total}
              prefix={<CommentOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>待处理</span>}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>处理中</span>}
              value={stats.processing}
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>已回复</span>}
              value={stats.replied}
              prefix={<MessageOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #a8a8a8 0%, #c0c0c0 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>已关闭</span>}
              value={stats.closed}
              prefix={<CloseCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主内容卡片 */}
      <Card
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        {/* 标题栏 */}
        <Row gutter={[24, 24]} align="middle" style={{ marginBottom: 24 }}>
          <Col flex="auto">
            <Space align="center">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CommentOutlined style={{ color: '#fff', fontSize: 24 }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                  留言管理
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  管理企业留言咨询，及时回复处理
                </Text>
              </div>
            </Space>
          </Col>
        </Row>

        {/* 搜索栏 */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '20px',
            borderRadius: 12,
            marginBottom: 24,
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Search
                placeholder="搜索企业名称或留言标题"
                allowClear
                enterButton={<><SearchOutlined /> 搜索</>}
                style={{ borderRadius: 8 }}
                size="middle"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Select
                value={status}
                onChange={setStatus}
                style={{ width: '100%', borderRadius: 8 }}
                placeholder="选择状态"
                size="middle"
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
                style={{ width: '100%', borderRadius: 8 }}
                placeholder="选择类型"
                size="middle"
              >
                <Option value="all">全部类型</Option>
                {messageTypes.map(t => (
                  <Option key={t.value} value={t.value}>{t.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} lg={4}>
              <Button 
                icon={<ReloadOutlined />} 
                style={{ width: '100%', borderRadius: 8 }}
                size="middle"
              >
                刷新
              </Button>
            </Col>
          </Row>
        </div>

        {/* 表格 */}
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
            style: { marginTop: 16 },
          }}
        />
      </Card>

      {/* 回复弹窗 */}
      <Modal
        title={
          <Space>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageOutlined style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600 }}>回复留言</span>
          </Space>
        }
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={handleSendReply}
        okText="发送回复"
        cancelText="取消"
        width={650}
        okButtonProps={{
          style: {
            borderRadius: 8,
            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
            border: 'none',
          },
        }}
      >
        {selectedMessage && (
          <div>
            <div 
              style={{ 
                marginBottom: 20, 
                padding: 20, 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                borderRadius: 12,
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <Space>
                  <Avatar 
                    size="small" 
                    icon={<UserOutlined />} 
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  />
                  <Text strong style={{ fontSize: 15 }}>{selectedMessage.enterpriseName}</Text>
                  {getTypeTag(selectedMessage.type)}
                </Space>
              </div>
              <Title level={5} style={{ marginBottom: 12, fontSize: 16 }}>{selectedMessage.title}</Title>
              <Text style={{ color: '#4b5563', lineHeight: 1.8 }}>{selectedMessage.content}</Text>
              <div style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  提交时间：{selectedMessage.createTime}
                </Text>
              </div>
            </div>
            <Form form={form} layout="vertical">
              <Form.Item
                name="replyContent"
                label="回复内容"
                rules={[{ required: true, message: '请输入回复内容' }]}
              >
                <TextArea 
                  rows={5} 
                  placeholder="请输入回复内容..."
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EyeOutlined style={{ color: '#fff' }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600 }}>留言详情</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setDetailModalVisible(false)}
            style={{ borderRadius: 8 }}
          >
            关闭
          </Button>,
        ]}
        width={750}
      >
        {selectedMessage && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <Space wrap>
                <Avatar 
                  size="large" 
                  icon={<UserOutlined />} 
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                />
                <div>
                  <Text strong style={{ fontSize: 16, display: 'block' }}>{selectedMessage.enterpriseName}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>联系人：{selectedMessage.contactName}</Text>
                </div>
                {getTypeTag(selectedMessage.type)}
                <Tag style={{ borderRadius: 4, background: '#f0f5ff', color: '#2f54eb', border: '1px solid #2f54eb40' }}>
                  {softwareTypes.find(t => t.value === selectedMessage.softwareType)?.label}
                </Tag>
                {getStatusTag(selectedMessage.status)}
              </Space>
            </div>
            <Title level={5} style={{ marginBottom: 12, fontSize: 16 }}>{selectedMessage.title}</Title>
            <div 
              style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                padding: 20, 
                borderRadius: 12,
                marginBottom: 20,
                border: '1px solid #e2e8f0',
              }}
            >
              <Text style={{ lineHeight: 1.8, color: '#374151' }}>{selectedMessage.content}</Text>
            </div>
            <Row gutter={16} style={{ marginBottom: 20 }}>
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
                <Divider style={{ margin: '24px 0' }} />
                <Title level={5} style={{ marginBottom: 16, fontSize: 16 }}>回复记录</Title>
                <Timeline>
                  {selectedMessage.replies.map((reply: any) => (
                    <Timeline.Item key={reply.id}>
                      <div 
                        style={{ 
                          background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)', 
                          padding: 16, 
                          borderRadius: 12,
                          border: '1px solid #bae7ff',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                          <Avatar 
                            size="small" 
                            icon={<CustomerServiceOutlined />} 
                            style={{ marginRight: 10, background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)' }} 
                          />
                          <Text strong>{reply.replier}</Text>
                        </div>
                        <Text style={{ lineHeight: 1.6, color: '#374151' }}>{reply.content}</Text>
                        <div style={{ marginTop: 10 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
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
