import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Typography,
  Space,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  DatePicker,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Badge,
  InputNumber,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import type { Activity } from '../../data/activities'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input
const { RangePicker } = DatePicker

// 本地存储键
const ACTIVITY_STORAGE_KEY = 'platform_activities'

// 默认活动数据
const defaultActivities: Activity[] = [
  {
    id: '1',
    title: '2025湖北省工业软件创新发展论坛',
    summary: '汇聚行业专家、企业代表，共同探讨工业软件发展趋势、技术创新路径和产业生态构建，推动湖北省工业软件产业高质量发展。',
    type: '线下',
    category: '展会',
    status: '即将开始',
    startDate: '2025-04-15',
    endDate: '2025-04-17',
    location: '武汉光谷会展中心',
    organizer: '湖北省工信厅',
    tags: ['工业软件', '创新发展', '产业对接'],
    views: 3256,
    participants: 156,
    maxParticipants: 300,
  },
  {
    id: '2',
    title: '工业软件企业数字化转型培训会',
    summary: '针对工业软件企业的数字化转型需求，提供系统化的培训课程，涵盖数字化战略、技术应用、管理变革等多个维度。',
    type: '混合',
    category: '培训',
    status: '即将开始',
    startDate: '2025-03-28',
    endDate: '2025-03-30',
    location: '线上+武汉软件新城',
    organizer: '湖北省软件行业协会',
    tags: ['数字化转型', '企业培训', '管理升级'],
    views: 2156,
    participants: 89,
    maxParticipants: 200,
  },
]

export default function ActivityManage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)
  const [form] = Form.useForm()

  // 加载活动数据
  useEffect(() => {
    const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // 过滤掉包含"报名中"状态的旧数据，重置为默认数据
        const hasInvalidStatus = parsed.some((a: { status: string }) => a.status === '报名中')
        if (hasInvalidStatus) {
          setActivities(defaultActivities)
          localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(defaultActivities))
        } else {
          setActivities(parsed)
        }
      } catch {
        setActivities(defaultActivities)
        localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(defaultActivities))
      }
    } else {
      setActivities(defaultActivities)
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(defaultActivities))
    }
  }, [])

  // 保存活动数据
  const saveActivities = (data: Activity[]) => {
    setActivities(data)
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(data))
  }

  // 获取类型颜色
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      '线上': 'blue',
      '线下': 'green',
      '混合': 'purple',
    }
    return colors[type] || 'default'
  }

  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '培训': 'orange',
      '沙龙': 'pink',
      '展会': 'cyan',
      '路演': 'gold',
      '对接会': 'indigo',
    }
    return colors[category] || 'default'
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      '进行中': 'processing',
      '已结束': 'default',
      '即将开始': 'warning',
    }
    return colors[status] || 'default'
  }

  // 筛选数据
  const filteredData = activities.filter((item) => {
    const matchSearch =
      !searchText ||
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.organizer.toLowerCase().includes(searchText.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase()))
    const matchType = filterType === 'all' || item.type === filterType
    const matchCategory = filterCategory === 'all' || item.category === filterCategory
    const matchStatus = filterStatus === 'all' || item.status === filterStatus
    return matchSearch && matchType && matchCategory && matchStatus
  })

  // 统计数据
  const stats = {
    total: activities.length,
    ongoing: activities.filter((a) => a.status === '即将开始').length,
    ended: activities.filter((a) => a.status === '已结束').length,
    totalParticipants: activities.reduce((sum, a) => sum + a.participants, 0),
  }

  // 打开新增弹窗
  const handleAdd = () => {
    setIsEdit(false)
    setCurrentActivity(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  // 打开编辑弹窗
  const handleEdit = (record: Activity) => {
    setIsEdit(true)
    setCurrentActivity(record)
    form.setFieldsValue({
      ...record,
      dateRange: [record.startDate, record.endDate],
    })
    setIsModalOpen(true)
  }

  // 删除活动
  const handleDelete = (id: string) => {
    const newData = activities.filter((item) => item.id !== id)
    saveActivities(newData)
    message.success('删除成功')
  }

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const [startDate, endDate] = values.dateRange || [values.startDate, values.endDate]
      const newActivity: Activity = {
        ...values,
        id: isEdit && currentActivity ? currentActivity.id : Date.now().toString(),
        startDate,
        endDate,
        views: isEdit && currentActivity ? currentActivity.views : 0,
        participants: isEdit && currentActivity ? currentActivity.participants : 0,
      }

      let newData: Activity[]
      if (isEdit && currentActivity) {
        newData = activities.map((item) => (item.id === currentActivity.id ? newActivity : item))
        message.success('修改成功')
      } else {
        newData = [newActivity, ...activities]
        message.success('添加成功')
      }

      saveActivities(newData)
      setIsModalOpen(false)
      form.resetFields()
    })
  }

  // 表格列定义
  const columns = [
    {
      title: '活动标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: Activity) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: 4 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{record.summary}</div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag color={getTypeColor(type)}>{type}</Tag>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => <Tag color={getCategoryColor(category)}>{category}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Badge
          status={
            status === '进行中'
              ? 'processing'
              : status === '已结束'
                ? 'default'
                : 'warning'
          }
          text={status}
        />
      ),
    },
    {
      title: '时间',
      dataIndex: 'startDate',
      key: 'time',
      width: 180,
      render: (_: string, record: Activity) => (
        <div style={{ fontSize: 13, color: '#4b5563' }}>
          <div>
            <CalendarOutlined style={{ marginRight: 4, color: '#9ca3af' }} />
            {record.startDate}
          </div>
          <div style={{ marginTop: 2 }}>
            <CalendarOutlined style={{ marginRight: 4, color: '#9ca3af' }} />
            {record.endDate}
          </div>
        </div>
      ),
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
      width: 150,
      render: (location: string) => (
        <span style={{ fontSize: 13, color: '#4b5563' }}>
          <EnvironmentOutlined style={{ marginRight: 4, color: '#9ca3af' }} />
          {location}
        </span>
      ),
    },
    {
      title: '主办方',
      dataIndex: 'organizer',
      key: 'organizer',
      width: 150,
      render: (organizer: string) => <span style={{ fontSize: 13, color: '#4b5563' }}>{organizer}</span>,
    },
    {
      title: '参与情况',
      key: 'participants',
      width: 120,
      render: (_: unknown, record: Activity) => (
        <div style={{ fontSize: 13 }}>
          <div style={{ color: '#4b5563' }}>
            <TeamOutlined style={{ marginRight: 4, color: '#9ca3af' }} />
            {record.participants} / {record.maxParticipants}
          </div>
          <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>
            <EyeOutlined style={{ marginRight: 4 }} />
            {record.views} 浏览
          </div>
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <Space size={4} wrap>
          {tags.map((tag, index) => (
            <Tag key={index} style={{ fontSize: 12 }}>
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: unknown, record: Activity) => (
        <Space size={8}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="删除后无法恢复，是否继续？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          <CalendarOutlined style={{ marginRight: 8, color: '#6366f1' }} />
          活动管理
        </Title>
        <Text type="secondary">管理平台发布的各类活动，包括培训、沙龙、展会、路演等</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="活动总数"
              value={stats.total}
              prefix={<CalendarOutlined style={{ color: '#6366f1' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="即将开始"
              value={stats.ongoing}
              valueStyle={{ color: '#10b981' }}
              prefix={<CheckCircleOutlined style={{ color: '#10b981' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已结束"
              value={stats.ended}
              valueStyle={{ color: '#6b7280' }}
              prefix={<CloseCircleOutlined style={{ color: '#6b7280' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="累计参与人数"
              value={stats.totalParticipants}
              valueStyle={{ color: '#f59e0b' }}
              prefix={<TeamOutlined style={{ color: '#f59e0b' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size={16} wrap>
              <Input
                placeholder="搜索活动标题、主办方、标签..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
              <Select
                placeholder="活动类型"
                value={filterType}
                onChange={setFilterType}
                style={{ width: 120 }}
                allowClear
              >
                <Option value="all">全部类型</Option>
                <Option value="线上">线上</Option>
                <Option value="线下">线下</Option>
                <Option value="混合">混合</Option>
              </Select>
              <Select
                placeholder="活动分类"
                value={filterCategory}
                onChange={setFilterCategory}
                style={{ width: 120 }}
                allowClear
              >
                <Option value="all">全部分类</Option>
                <Option value="培训">培训</Option>
                <Option value="沙龙">沙龙</Option>
                <Option value="展会">展会</Option>
                <Option value="路演">路演</Option>
                <Option value="对接会">对接会</Option>
              </Select>
              <Select
                placeholder="活动状态"
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: 120 }}
                allowClear
              >
                <Option value="all">全部状态</Option>
                <Option value="即将开始">即将开始</Option>
                <Option value="进行中">进行中</Option>
                <Option value="已结束">已结束</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增活动
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 活动列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={isEdit ? '编辑活动' : '新增活动'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="title"
                label="活动标题"
                rules={[{ required: true, message: '请输入活动标题' }]}
              >
                <Input placeholder="请输入活动标题" maxLength={100} showCount />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="活动状态"
                rules={[{ required: true, message: '请选择活动状态' }]}
                initialValue="即将开始"
              >
                <Select placeholder="请选择">
                  <Option value="即将开始">即将开始</Option>
                  <Option value="进行中">进行中</Option>
                  <Option value="已结束">已结束</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="summary"
            label="活动简介"
            rules={[{ required: true, message: '请输入活动简介' }]}
          >
            <TextArea
              placeholder="请输入活动简介，简要描述活动内容和目标"
              rows={3}
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="活动类型"
                rules={[{ required: true, message: '请选择活动类型' }]}
              >
                <Select placeholder="请选择">
                  <Option value="线上">线上</Option>
                  <Option value="线下">线下</Option>
                  <Option value="混合">混合</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="活动分类"
                rules={[{ required: true, message: '请选择活动分类' }]}
              >
                <Select placeholder="请选择">
                  <Option value="培训">培训</Option>
                  <Option value="沙龙">沙龙</Option>
                  <Option value="展会">展会</Option>
                  <Option value="路演">路演</Option>
                  <Option value="对接会">对接会</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dateRange"
                label="活动时间"
                rules={[{ required: true, message: '请选择活动时间' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="活动地点"
                rules={[{ required: true, message: '请输入活动地点' }]}
              >
                <Input placeholder="如：武汉光谷会展中心 / 腾讯会议" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="organizer"
                label="主办方"
                rules={[{ required: true, message: '请输入主办方' }]}
              >
                <Input placeholder="如：湖北省工信厅" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maxParticipants"
                label="最大参与人数"
                rules={[{ required: true, message: '请输入最大参与人数' }]}
                initialValue={100}
              >
                <InputNumber min={1} max={10000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tags"
                label="活动标签"
                rules={[{ required: true, message: '请输入活动标签' }]}
              >
                <Select mode="tags" placeholder="输入标签后按回车" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
