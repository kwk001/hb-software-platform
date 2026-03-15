import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Space,
  Tag,
  Tree,
  message,
  Popconfirm,
  Row,
  Col,
  Typography,
  Divider,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  SafetyOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { TextArea } = Input

interface Role {
  id: string
  code: string
  name: string
  description: string
  status: boolean
  createTime: string
  userCount: number
  permissions: string[]
}

// 模拟菜单权限数据
const menuPermissions = [
  {
    title: '企业入驻管理',
    key: 'enterprise',
    children: [
      { title: '企业审核', key: 'enterprise:audit' },
      { title: '企业列表', key: 'enterprise:list' },
    ],
  },
  {
    title: '软件发布管理',
    key: 'software',
    children: [
      { title: '软件审核', key: 'software:audit' },
      { title: '软件列表', key: 'software:list' },
    ],
  },
  {
    title: '需求对接管理',
    key: 'demand',
    children: [
      { title: '需求汇总', key: 'demand:summary' },
      { title: '需求列表', key: 'demand:list' },
    ],
  },
  {
    title: '补贴券管理',
    key: 'subsidy',
    children: [
      { title: '补贴审核', key: 'subsidy:audit' },
      { title: '补贴列表', key: 'subsidy:list' },
    ],
  },
  {
    title: '政策管理',
    key: 'policy',
    children: [
      { title: '政策发布', key: 'policy:publish' },
      { title: '政策列表', key: 'policy:list' },
    ],
  },
  {
    title: '留言管理',
    key: 'message',
    children: [
      { title: '留言回复', key: 'message:reply' },
      { title: '留言列表', key: 'message:list' },
    ],
  },
  {
    title: '报表中心',
    key: 'report',
    children: [
      { title: '运营总览', key: 'report:overview' },
      { title: '企业统计', key: 'report:enterprise' },
      { title: '软件统计', key: 'report:software' },
      { title: '需求统计', key: 'report:demand' },
      { title: '补贴统计', key: 'report:subsidy' },
    ],
  },
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '用户管理', key: 'system:user' },
      { title: '角色管理', key: 'system:role' },
      { title: '菜单管理', key: 'system:menu' },
      { title: '部门管理', key: 'system:dept' },
      { title: '岗位管理', key: 'system:post' },
      { title: '操作日志', key: 'system:log' },
      { title: '登录日志', key: 'system:login' },
    ],
  },
]

// 模拟角色数据（与PRD一致）
const mockRoles: Role[] = [
  {
    id: '1',
    code: 'platform_admin',
    name: '平台管理员',
    description: '所有审核、需求汇总、留言回复、系统管理、报表查看',
    status: true,
    createTime: '2026-01-01 10:00:00',
    userCount: 5,
    permissions: ['enterprise', 'software', 'demand', 'subsidy', 'policy', 'message', 'report', 'system'],
  },
  {
    id: '2',
    code: 'enterprise_demand',
    name: '工业制造企业',
    description: '入驻申请、上传需求、补贴券申报、提交留言',
    status: true,
    createTime: '2026-01-15 14:30:00',
    userCount: 86,
    permissions: ['enterprise', 'demand', 'subsidy', 'message'],
  },
  {
    id: '3',
    code: 'enterprise_supply',
    name: '工业软件企业',
    description: '入驻申请、软件发布',
    status: true,
    createTime: '2026-02-01 09:00:00',
    userCount: 42,
    permissions: ['enterprise', 'software'],
  },
]

export default function RoleManage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  // 过滤角色
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchText.toLowerCase()) ||
      role.code.toLowerCase().includes(searchText.toLowerCase())
  )

  // 打开新增/编辑弹窗
  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role)
      form.setFieldsValue(role)
    } else {
      setEditingRole(null)
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 保存角色
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingRole) {
        // 编辑
        setRoles(
          roles.map((role) =>
            role.id === editingRole.id
              ? { ...role, ...values }
              : role
          )
        )
        message.success('角色修改成功')
      } else {
        // 新增
        const newRole: Role = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toLocaleString(),
          userCount: 0,
          permissions: [],
        }
        setRoles([...roles, newRole])
        message.success('角色新增成功')
      }
      setModalVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 删除角色
  const handleDelete = (id: string) => {
    const role = roles.find((r) => r.id === id)
    if (role && role.userCount > 0) {
      message.error('该角色下存在用户，无法删除')
      return
    }
    setRoles(roles.filter((role) => role.id !== id))
    message.success('角色删除成功')
  }

  // 切换状态
  const handleStatusChange = (id: string, checked: boolean) => {
    setRoles(
      roles.map((role) =>
        role.id === id ? { ...role, status: checked } : role
      )
    )
    message.success(`角色已${checked ? '启用' : '禁用'}`)
  }

  // 打开权限配置弹窗
  const handleOpenPermissionModal = (role: Role) => {
    setEditingRole(role)
    setSelectedPermissions(role.permissions)
    setPermissionModalVisible(true)
  }

  // 保存权限
  const handleSavePermissions = () => {
    if (editingRole) {
      setRoles(
        roles.map((role) =>
          role.id === editingRole.id
            ? { ...role, permissions: selectedPermissions }
            : role
        )
      )
      message.success('权限配置成功')
      setPermissionModalVisible(false)
    }
  }

  const columns: ColumnsType<Role> = [
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <Tag icon={<UserOutlined />} color={count > 0 ? 'blue' : 'default'}>
          {count} 人
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: Role) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: Role) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<SafetyOutlined />}
            onClick={() => handleOpenPermissionModal(record)}
          >
            配置权限
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该角色吗？"
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
            <TeamOutlined />
            <span>角色管理</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            新增角色
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="搜索角色编码或名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredRoles}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑角色弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true }}
        >
          <Form.Item
            name="code"
            label="角色编码"
            rules={[
              { required: true, message: '请输入角色编码' },
              { pattern: /^[a-z_]+$/, message: '只能使用小写字母和下划线' },
            ]}
          >
            <Input
              placeholder="如：platform_admin"
              disabled={!!editingRole}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="如：平台管理员" />
          </Form.Item>

          <Form.Item
            name="description"
            label="角色描述"
          >
            <TextArea
              placeholder="请输入角色描述"
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

      {/* 权限配置弹窗 */}
      <Modal
        title="配置权限"
        open={permissionModalVisible}
        onOk={handleSavePermissions}
        onCancel={() => setPermissionModalVisible(false)}
        width={700}
        destroyOnClose
      >
        {editingRole && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>当前角色：{editingRole.name}</Text>
            <br />
            <Text type="secondary">请勾选该角色拥有的菜单权限</Text>
          </div>
        )}
        <Divider />
        <Tree
          checkable
          treeData={menuPermissions}
          checkedKeys={selectedPermissions}
          onCheck={(checkedKeys) => {
            setSelectedPermissions(checkedKeys as string[])
          }}
          defaultExpandAll
        />
      </Modal>
    </div>
  )
}
