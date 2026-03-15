import React, { useState } from 'react'
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
  message,
  Popconfirm,
  Avatar,
  Switch,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select

// 模拟数据
const userData = [
  {
    id: 1,
    username: 'admin',
    realName: '平台管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    role: '平台管理员',
    enterprise: '-',
    status: 'active',
    lastLogin: '2026-03-13 14:30:00',
    createTime: '2025-01-01 00:00:00',
  },
  {
    id: 2,
    username: 'zhangsan',
    realName: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    role: '企业用户',
    enterprise: '武汉智造科技有限公司',
    enterpriseType: '工业制造企业',
    status: 'active',
    lastLogin: '2026-03-13 10:15:00',
    createTime: '2026-03-10 09:00:00',
  },
  {
    id: 3,
    username: 'lisi',
    realName: '李四',
    phone: '13800138002',
    email: 'lisi@example.com',
    role: '企业用户',
    enterprise: '襄阳创新软件有限公司',
    enterpriseType: '工业软件企业',
    status: 'active',
    lastLogin: '2026-03-12 16:45:00',
    createTime: '2026-03-08 14:00:00',
  },
  {
    id: 4,
    username: 'wangwu',
    realName: '王五',
    phone: '13800138003',
    email: 'wangwu@example.com',
    role: '企业用户',
    enterprise: '宜昌数字科技有限公司',
    enterpriseType: '工业软件企业',
    status: 'inactive',
    lastLogin: '2026-03-05 11:20:00',
    createTime: '2026-02-20 10:00:00',
  },
]

export default function UserManage() {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [batchActionVisible, setBatchActionVisible] = useState(false)
  const [batchActionType, setBatchActionType] = useState<'enable' | 'disable' | 'delete'>('enable')

  const handleAdd = () => {
    setModalType('add')
    setSelectedUser(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setModalType('edit')
    setSelectedUser(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleView = (record: any) => {
    setSelectedUser(record)
    setDetailVisible(true)
  }

  const handleDelete = (id: number) => {
    message.success('删除成功')
  }

  const handleStatusChange = (record: any, checked: boolean) => {
    message.success(`用户已${checked ? '启用' : '禁用'}`)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setModalVisible(false)
        message.success(modalType === 'add' ? '添加成功' : '更新成功')
      }, 1000)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 批量操作
  const handleBatchAction = (type: 'enable' | 'disable' | 'delete') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择用户')
      return
    }
    setBatchActionType(type)
    setBatchActionVisible(true)
  }

  const handleBatchActionSubmit = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setBatchActionVisible(false)
      const actionText = {
        enable: '启用',
        disable: '禁用',
        delete: '删除',
      }
      message.success(`批量${actionText[batchActionType]}成功，共处理${selectedRowKeys.length}个用户`)
      setSelectedRowKeys([])
    }, 1000)
  }

  const getRoleTag = (role: string) => {
    const colors: Record<string, string> = {
      '平台管理员': 'red',
      '企业用户': 'blue',
    }
    return <Tag color={colors[role]}>{role}</Tag>
  }

  const getStatusTag = (status: string) => {
    return status === 'active' ? (
      <Tag color="green" icon={<UnlockOutlined />}>正常</Tag>
    ) : (
      <Tag color="red" icon={<LockOutlined />}>禁用</Tag>
    )
  }

  const columns = [
    {
      title: '用户',
      dataIndex: 'realName',
      key: 'realName',
      render: (text: string, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.username}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: getRoleTag,
    },
    {
      title: '所属企业',
      dataIndex: 'enterprise',
      key: 'enterprise',
      render: (text: string, record: any) => (
        text === '-' ? '-' : (
          <Space>
            <ShopOutlined style={{ color: '#1677ff' }} />
            <div>
              <Text>{text}</Text>
              {record.enterpriseType && (
                <>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{record.enterpriseType}</Text>
                </>
              )}
            </div>
          </Space>
        )
      ),
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => handleStatusChange(record, checked)}
          checkedChildren="正常"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date: string) => date || '从未登录',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个用户吗？"
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
    <div>
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>用户管理</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加用户
          </Button>
        </Space>
      </Card>

      <Card style={{ borderRadius: 12 }}>
        {/* 搜索栏 */}
        <Space style={{ marginBottom: 24 }}>
          <Input
            placeholder="搜索用户名/姓名"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <Select placeholder="用户角色" style={{ width: 150 }} allowClear>
            <Option value="admin">平台管理员</Option>
            <Option value="enterprise">企业用户</Option>
          </Select>
          <Select placeholder="用户状态" style={{ width: 150 }} allowClear>
            <Option value="active">正常</Option>
            <Option value="inactive">禁用</Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>
            搜索
          </Button>
        </Space>

        {/* 批量操作栏 */}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
            <Space>
              <span>已选择 <Text strong>{selectedRowKeys.length}</Text> 个用户</span>
              <Button
                type="primary"
                icon={<UnlockOutlined />}
                onClick={() => handleBatchAction('enable')}
              >
                批量启用
              </Button>
              <Button
                icon={<LockOutlined />}
                onClick={() => handleBatchAction('disable')}
              >
                批量禁用
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleBatchAction('delete')}
              >
                批量删除
              </Button>
            </Space>
          </div>
        )}

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={userData}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalType === 'add' ? '添加用户' : '编辑用户'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="realName"
            label="真实姓名"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="role"
            label="用户角色"
            rules={[{ required: true, message: '请选择用户角色' }]}
          >
            <Select placeholder="请选择用户角色">
              <Option value="平台管理员">平台管理员</Option>
              <Option value="企业用户">企业用户</Option>
            </Select>
          </Form.Item>
          {modalType === 'add' && (
            <Form.Item
              name="password"
              label="初始密码"
              rules={[{ required: true, message: '请输入初始密码' }]}
            >
              <Input.Password placeholder="请输入初始密码" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="用户详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {selectedUser && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={80} icon={<UserOutlined />} />
              <h3 style={{ marginTop: 16, marginBottom: 8 }}>{selectedUser.realName}</h3>
              <Text type="secondary">{selectedUser.username}</Text>
            </div>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
              <p><Text strong>角色：</Text>{getRoleTag(selectedUser.role)}</p>
              <p><Text strong>状态：</Text>{getStatusTag(selectedUser.status)}</p>
              <p><Text strong>联系电话：</Text>{selectedUser.phone}</p>
              <p><Text strong>邮箱：</Text>{selectedUser.email}</p>
              {selectedUser.enterprise !== '-' && (
                <>
                  <p><Text strong>所属企业：</Text>{selectedUser.enterprise}</p>
                  <p><Text strong>企业类型：</Text>{selectedUser.enterpriseType}</p>
                </>
              )}
              <p><Text strong>注册时间：</Text>{selectedUser.createTime}</p>
              <p><Text strong>最后登录：</Text>{selectedUser.lastLogin || '从未登录'}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* 批量操作确认弹窗 */}
      <Modal
        title={
          batchActionType === 'enable'
            ? '批量启用用户'
            : batchActionType === 'disable'
            ? '批量禁用用户'
            : '批量删除用户'
        }
        open={batchActionVisible}
        onCancel={() => setBatchActionVisible(false)}
        onOk={handleBatchActionSubmit}
        confirmLoading={loading}
        okText="确认"
        cancelText="取消"
        okButtonProps={{
          danger: batchActionType === 'delete',
        }}
      >
        <p>
          您已选择 <Text strong>{selectedRowKeys.length}</Text> 个用户进行
          <Text strong>
            {batchActionType === 'enable'
              ? '启用'
              : batchActionType === 'disable'
              ? '禁用'
              : '删除'}
          </Text>
          操作
        </p>
        {batchActionType === 'delete' && (
          <p style={{ color: '#f5222d' }}>删除操作不可恢复，请谨慎操作！</p>
        )}
      </Modal>
    </div>
  )
}
