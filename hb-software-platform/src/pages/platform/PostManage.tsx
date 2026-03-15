import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Space,
  Tag,
  message,
  Popconfirm,
  Row,
  Col,
  Typography,
  InputNumber,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SolutionOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { Option } = Select

interface Post {
  id: string
  code: string
  name: string
  deptId: string
  deptName: string
  level: number
  salaryMin: number
  salaryMax: number
  description: string
  status: boolean
  createTime: string
  userCount: number
}

// 岗位级别
const postLevels = [
  { value: 1, label: '初级' },
  { value: 2, label: '中级' },
  { value: 3, label: '高级' },
  { value: 4, label: '资深' },
  { value: 5, label: '专家' },
]

// 模拟部门数据
const depts = [
  { id: '1', name: '平台运营部' },
  { id: '2', name: '财务审核部' },
  { id: '3', name: '技术支持部' },
  { id: '4', name: '综合管理部' },
]

// 模拟岗位数据
const mockPosts: Post[] = [
  {
    id: '1',
    code: 'enterprise_auditor',
    name: '企业审核专员',
    deptId: '1',
    deptName: '平台运营部',
    level: 2,
    salaryMin: 8000,
    salaryMax: 12000,
    description: '负责企业入驻资质审核工作',
    status: true,
    createTime: '2026-01-01 10:00:00',
    userCount: 3,
  },
  {
    id: '2',
    code: 'software_auditor',
    name: '软件审核专员',
    deptId: '1',
    deptName: '平台运营部',
    level: 2,
    salaryMin: 8000,
    salaryMax: 12000,
    description: '负责软件产品发布审核工作',
    status: true,
    createTime: '2026-01-01 10:00:00',
    userCount: 2,
  },
  {
    id: '3',
    code: 'subsidy_auditor',
    name: '补贴审核专员',
    deptId: '2',
    deptName: '财务审核部',
    level: 3,
    salaryMin: 10000,
    salaryMax: 15000,
    description: '负责补贴券申报审核工作',
    status: true,
    createTime: '2026-01-01 10:00:00',
    userCount: 4,
  },
  {
    id: '4',
    code: 'operation_specialist',
    name: '运营专员',
    deptId: '1',
    deptName: '平台运营部',
    level: 1,
    salaryMin: 6000,
    salaryMax: 9000,
    description: '负责平台日常运营工作',
    status: true,
    createTime: '2026-01-01 10:00:00',
    userCount: 5,
  },
  {
    id: '5',
    code: 'tech_support',
    name: '技术支持工程师',
    deptId: '3',
    deptName: '技术支持部',
    level: 2,
    salaryMin: 10000,
    salaryMax: 18000,
    description: '负责平台技术支持和问题处理',
    status: true,
    createTime: '2026-01-01 10:00:00',
    userCount: 6,
  },
  {
    id: '6',
    code: 'admin_assistant',
    name: '行政助理',
    deptId: '4',
    deptName: '综合管理部',
    level: 1,
    salaryMin: 5000,
    salaryMax: 7000,
    description: '负责行政事务处理',
    status: false,
    createTime: '2026-01-01 10:00:00',
    userCount: 0,
  },
]

export default function PostManage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  // 过滤岗位
  const filteredPosts = posts.filter(
    (post) =>
      post.name.toLowerCase().includes(searchText.toLowerCase()) ||
      post.code.toLowerCase().includes(searchText.toLowerCase())
  )

  // 打开新增/编辑弹窗
  const handleOpenModal = (post?: Post) => {
    if (post) {
      setEditingPost(post)
      form.setFieldsValue(post)
    } else {
      setEditingPost(null)
      form.resetFields()
      form.setFieldsValue({ status: true, level: 1 })
    }
    setModalVisible(true)
  }

  // 保存岗位
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingPost) {
        // 编辑
        setPosts(
          posts.map((post) =>
            post.id === editingPost.id
              ? {
                  ...post,
                  ...values,
                  deptName: depts.find((d) => d.id === values.deptId)?.name || '',
                }
              : post
          )
        )
        message.success('岗位修改成功')
      } else {
        // 新增
        const newPost: Post = {
          id: Date.now().toString(),
          ...values,
          deptName: depts.find((d) => d.id === values.deptId)?.name || '',
          createTime: new Date().toLocaleString(),
          userCount: 0,
        }
        setPosts([...posts, newPost])
        message.success('岗位新增成功')
      }
      setModalVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 删除岗位
  const handleDelete = (id: string) => {
    const post = posts.find((p) => p.id === id)
    if (post && post.userCount > 0) {
      message.error('该岗位下存在用户，无法删除')
      return
    }
    setPosts(posts.filter((post) => post.id !== id))
    message.success('岗位删除成功')
  }

  // 切换状态
  const handleStatusChange = (id: string, checked: boolean) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, status: checked } : post
      )
    )
    message.success(`岗位已${checked ? '启用' : '禁用'}`)
  }

  const getLevelTag = (level: number) => {
    const levelMap: Record<number, { color: string; text: string }> = {
      1: { color: 'default', text: '初级' },
      2: { color: 'blue', text: '中级' },
      3: { color: 'green', text: '高级' },
      4: { color: 'orange', text: '资深' },
      5: { color: 'purple', text: '专家' },
    }
    const { color, text } = levelMap[level] || { color: 'default', text: '未知' }
    return <Tag color={color}>{text}</Tag>
  }

  const columns: ColumnsType<Post> = [
    {
      title: '岗位编码',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: '岗位名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      key: 'deptName',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: '岗位级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: number) => getLevelTag(level),
    },
    {
      title: '薪资范围',
      key: 'salary',
      render: (_: any, record: Post) => (
        <Space>
          <DollarOutlined style={{ color: '#52c41a' }} />
          <span>
            {record.salaryMin.toLocaleString()} - {record.salaryMax.toLocaleString()}
          </span>
        </Space>
      ),
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <Tag icon={<TeamOutlined />} color={count > 0 ? 'blue' : 'default'}>
          {count} 人
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: Post) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Post) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该岗位吗？"
            description="删除后无法恢复，请谨慎操作"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card
        title={
          <Space>
            <SolutionOutlined />
            <span>岗位管理</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            新增岗位
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="搜索岗位编码或名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredPosts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑岗位弹窗 */}
      <Modal
        title={editingPost ? '编辑岗位' : '新增岗位'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true, level: 1 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="岗位编码"
                rules={[
                  { required: true, message: '请输入岗位编码' },
                  { pattern: /^[a-z_]+$/, message: '只能使用小写字母和下划线' },
                ]}
              >
                <Input
                  placeholder="如：enterprise_auditor"
                  disabled={!!editingPost}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="岗位名称"
                rules={[{ required: true, message: '请输入岗位名称' }]}
              >
                <Input placeholder="如：企业审核专员" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deptId"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select placeholder="请选择所属部门">
                  {depts.map((dept) => (
                    <Option key={dept.id} value={dept.id}>
                      {dept.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="岗位级别"
                rules={[{ required: true, message: '请选择岗位级别' }]}
              >
                <Select placeholder="请选择岗位级别">
                  {postLevels.map((level) => (
                    <Option key={level.value} value={level.value}>
                      {level.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="salaryMin"
                label="最低薪资"
                rules={[{ required: true, message: '请输入最低薪资' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={1000}
                  placeholder="请输入最低薪资"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salaryMax"
                label="最高薪资"
                rules={[{ required: true, message: '请输入最高薪资' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={1000}
                  placeholder="请输入最高薪资"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="岗位描述"
          >
            <Input.TextArea
              placeholder="请输入岗位描述"
              rows={3}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
