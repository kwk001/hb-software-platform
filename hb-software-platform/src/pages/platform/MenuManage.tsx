import { useState, useEffect } from 'react'
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
  TreeSelect,
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
  MenuOutlined,
  AppstoreOutlined,
  FileOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { Option } = Select

interface Menu {
  id: string
  name: string
  code: string
  path: string
  icon: string
  type: 'directory' | 'menu'
  parentId: string | null
  sort: number
  status: boolean
  createTime: string
  children?: Menu[]
}

// 图标选项
const iconOptions = [
  { value: 'DashboardOutlined', label: '仪表盘' },
  { value: 'ShopOutlined', label: '企业' },
  { value: 'AppstoreOutlined', label: '软件' },
  { value: 'FileTextOutlined', label: '文档' },
  { value: 'DollarOutlined', label: '补贴' },
  { value: 'SafetyCertificateOutlined', label: '审核' },
  { value: 'BarChartOutlined', label: '报表' },
  { value: 'SettingOutlined', label: '设置' },
  { value: 'TeamOutlined', label: '用户' },
  { value: 'MenuOutlined', label: '菜单' },
]

// 模拟菜单数据
const mockMenus: Menu[] = [
  {
    id: '1',
    name: '工作台',
    code: 'dashboard',
    path: '/platform/dashboard',
    icon: 'DashboardOutlined',
    type: 'menu',
    parentId: null,
    sort: 1,
    status: true,
    createTime: '2026-01-01 10:00:00',
  },
  {
    id: '2',
    name: '企业入驻管理',
    code: 'enterprise',
    path: '',
    icon: 'ShopOutlined',
    type: 'directory',
    parentId: null,
    sort: 2,
    status: true,
    createTime: '2026-01-01 10:00:00',
    children: [
      {
        id: '2-1',
        name: '企业审核',
        code: 'enterprise_audit',
        path: '/platform/enterprise/audit',
        icon: 'SafetyCertificateOutlined',
        type: 'menu',
        parentId: '2',
        sort: 1,
        status: true,
        createTime: '2026-01-01 10:00:00',
      },
    ],
  },
  {
    id: '3',
    name: '软件发布管理',
    code: 'software',
    path: '',
    icon: 'AppstoreOutlined',
    type: 'directory',
    parentId: null,
    sort: 3,
    status: true,
    createTime: '2026-01-01 10:00:00',
    children: [
      {
        id: '3-1',
        name: '软件审核',
        code: 'software_audit',
        path: '/platform/software/audit',
        icon: 'SafetyCertificateOutlined',
        type: 'menu',
        parentId: '3',
        sort: 1,
        status: true,
        createTime: '2026-01-01 10:00:00',
      },
    ],
  },
  {
    id: '4',
    name: '需求对接管理',
    code: 'demand',
    path: '/platform/demand/summary',
    icon: 'FileTextOutlined',
    type: 'menu',
    parentId: null,
    sort: 4,
    status: true,
    createTime: '2026-01-01 10:00:00',
  },
  {
    id: '5',
    name: '补贴券管理',
    code: 'subsidy',
    path: '/platform/subsidy/audit',
    icon: 'DollarOutlined',
    type: 'menu',
    parentId: null,
    sort: 5,
    status: true,
    createTime: '2026-01-01 10:00:00',
  },
  {
    id: '6',
    name: '政策管理',
    code: 'policy',
    path: '/platform/policy',
    icon: 'FileTextOutlined',
    type: 'menu',
    parentId: null,
    sort: 6,
    status: true,
    createTime: '2026-01-01 10:00:00',
  },
  {
    id: '7',
    name: '留言管理',
    code: 'message',
    path: '/platform/message',
    icon: 'FileTextOutlined',
    type: 'menu',
    parentId: null,
    sort: 7,
    status: true,
    createTime: '2026-01-01 10:00:00',
  },
  {
    id: '8',
    name: '报表中心',
    code: 'report',
    path: '/platform/statistics',
    icon: 'BarChartOutlined',
    type: 'menu',
    parentId: null,
    sort: 8,
    status: true,
    createTime: '2026-01-01 10:00:00',
  },
  {
    id: '9',
    name: '系统管理',
    code: 'system',
    path: '',
    icon: 'SettingOutlined',
    type: 'directory',
    parentId: null,
    sort: 9,
    status: true,
    createTime: '2026-01-01 10:00:00',
    children: [
      {
        id: '9-1',
        name: '用户管理',
        code: 'user_manage',
        path: '/platform/user',
        icon: 'TeamOutlined',
        type: 'menu',
        parentId: '9',
        sort: 1,
        status: true,
        createTime: '2026-01-01 10:00:00',
      },
      {
        id: '9-2',
        name: '角色管理',
        code: 'role_manage',
        path: '/platform/role',
        icon: 'TeamOutlined',
        type: 'menu',
        parentId: '9',
        sort: 2,
        status: true,
        createTime: '2026-01-01 10:00:00',
      },
      {
        id: '9-3',
        name: '菜单管理',
        code: 'menu_manage',
        path: '/platform/menu',
        icon: 'MenuOutlined',
        type: 'menu',
        parentId: '9',
        sort: 3,
        status: true,
        createTime: '2026-01-01 10:00:00',
      },
      {
        id: '9-4',
        name: '部门管理',
        code: 'dept_manage',
        path: '/platform/dept',
        icon: 'TeamOutlined',
        type: 'menu',
        parentId: '9',
        sort: 4,
        status: true,
        createTime: '2026-01-01 10:00:00',
      },
      {
        id: '9-5',
        name: '岗位管理',
        code: 'post_manage',
        path: '/platform/post',
        icon: 'TeamOutlined',
        type: 'menu',
        parentId: '9',
        sort: 5,
        status: true,
        createTime: '2026-01-01 10:00:00',
      },
      {
        id: '9-6',
        name: '操作日志',
        code: 'operation_log',
        path: '/platform/log/operation',
        icon: 'FileTextOutlined',
        type: 'menu',
        parentId: '9',
        sort: 6,
        status: true,
        createTime: '2026-01-01 10:00:00',
      },
      {
        id: '9-7',
        name: '登录日志',
        code: 'login_log',
        path: '/platform/log/login',
        icon: 'FileTextOutlined',
        type: 'menu',
        parentId: '9',
        sort: 7,
        status: true,
        createTime: '2026-01-01 10:00:00',
      },
    ],
  },
]

// 将树形数据转换为扁平数据用于表格展示
const flattenMenus = (menus: Menu[], parentName = ''): Menu[] => {
  const result: Menu[] = []
  menus.forEach((menu) => {
    const menuWithParent = {
      ...menu,
      parentName,
    }
    result.push(menuWithParent)
    if (menu.children && menu.children.length > 0) {
      result.push(...flattenMenus(menu.children, menu.name))
    }
  })
  return result
}

export default function MenuManage() {
  const [menus, setMenus] = useState<Menu[]>(mockMenus)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  // 扁平化的菜单数据
  const flatMenus = flattenMenus(menus)

  // 过滤菜单
  const filteredMenus = flatMenus.filter(
    (menu) =>
      menu.name.toLowerCase().includes(searchText.toLowerCase()) ||
      menu.code.toLowerCase().includes(searchText.toLowerCase())
  )

  // 生成TreeSelect的数据
  const generateTreeData = (menuList: Menu[]): any[] => {
    return menuList
      .filter((menu) => menu.type === 'directory')
      .map((menu) => ({
        title: menu.name,
        value: menu.id,
        key: menu.id,
        children: menu.children
          ? generateTreeData(menu.children)
          : undefined,
      }))
  }

  // 打开新增/编辑弹窗
  const handleOpenModal = (menu?: Menu) => {
    if (menu) {
      setEditingMenu(menu)
      form.setFieldsValue(menu)
    } else {
      setEditingMenu(null)
      form.resetFields()
      form.setFieldsValue({ type: 'menu', status: true, sort: 1 })
    }
    setModalVisible(true)
  }

  // 保存菜单
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingMenu) {
        // 编辑 - 简化处理，实际应该递归更新
        message.success('菜单修改成功')
      } else {
        // 新增
        message.success('菜单新增成功')
      }
      setModalVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 删除菜单
  const handleDelete = (id: string) => {
    const menu = flatMenus.find((m) => m.id === id)
    if (menu && menu.children && menu.children.length > 0) {
      message.error('该菜单下存在子菜单，无法删除')
      return
    }
    message.success('菜单删除成功')
  }

  // 切换状态
  const handleStatusChange = (id: string, checked: boolean) => {
    message.success(`菜单已${checked ? '启用' : '禁用'}`)
  }

  const getTypeTag = (type: string) => {
    return type === 'directory' ? (
      <Tag color="blue">目录</Tag>
    ) : (
      <Tag color="green">菜单</Tag>
    )
  }

  const columns: ColumnsType<Menu> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Menu) => (
        <Space>
          {record.parentId && <span style={{ marginLeft: 20 }}>└─</span>}
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '菜单编码',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeTag(type),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      render: (path: string) =>
        path ? (
          <span style={{ color: '#1677ff' }}>{path}</span>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: Menu) => (
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
      render: (_: any, record: Menu) => (
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
            title="确定删除该菜单吗？"
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
            <MenuOutlined />
            <span>菜单管理</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            新增菜单
          </Button>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="搜索菜单名称或编码"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredMenus}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑菜单弹窗 */}
      <Modal
        title={editingMenu ? '编辑菜单' : '新增菜单'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: 'menu', status: true, sort: 1 }}
        >
          <Form.Item
            name="parentId"
            label="上级菜单"
          >
            <TreeSelect
              placeholder="请选择上级菜单（不选则为顶级菜单）"
              treeData={generateTreeData(menus)}
              allowClear
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="菜单类型"
                rules={[{ required: true, message: '请选择菜单类型' }]}
              >
                <Select placeholder="请选择菜单类型">
                  <Option value="directory">目录</Option>
                  <Option value="menu">菜单</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="icon"
                label="菜单图标"
              >
                <Select placeholder="请选择图标" allowClear>
                  {iconOptions.map((icon) => (
                    <Option key={icon.value} value={icon.value}>
                      {icon.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input placeholder="如：用户管理" />
          </Form.Item>

          <Form.Item
            name="code"
            label="菜单编码"
            rules={[
              { required: true, message: '请输入菜单编码' },
              { pattern: /^[a-z_]+$/, message: '只能使用小写字母和下划线' },
            ]}
          >
            <Input placeholder="如：user_manage" />
          </Form.Item>

          <Form.Item
            name="path"
            label="路由路径"
          >
            <Input placeholder="如：/platform/user" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sort"
                label="排序号"
                rules={[{ required: true, message: '请输入排序号' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  placeholder="数字越小越靠前"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
