import { useState } from 'react'
import {
  Card,
  Tree,
  Button,
  Modal,
  Form,
  Input,
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
  ApartmentOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'

const { Title, Text } = Typography
const { TextArea } = Input

interface Dept {
  id: string
  name: string
  code: string
  parentId: string | null
  leader: string
  phone: string
  email: string
  sort: number
  status: boolean
  createTime: string
  userCount: number
  children?: Dept[]
}

// 模拟部门数据
const mockDepts: Dept[] = [
  {
    id: '1',
    name: '湖北省工业软件公共服务平台',
    code: 'root',
    parentId: null,
    leader: '张主任',
    phone: '027-12345678',
    email: 'admin@hb-software.gov.cn',
    sort: 1,
    status: true,
    createTime: '2026-01-01 10:00:00',
    userCount: 50,
    children: [
      {
        id: '1-1',
        name: '平台运营部',
        code: 'operation',
        parentId: '1',
        leader: '李经理',
        phone: '027-12345679',
        email: 'operation@hb-software.gov.cn',
        sort: 1,
        status: true,
        createTime: '2026-01-01 10:00:00',
        userCount: 15,
        children: [
          {
            id: '1-1-1',
            name: '企业审核组',
            code: 'enterprise_audit',
            parentId: '1-1',
            leader: '王组长',
            phone: '027-12345680',
            email: 'enterprise@hb-software.gov.cn',
            sort: 1,
            status: true,
            createTime: '2026-01-01 10:00:00',
            userCount: 5,
          },
          {
            id: '1-1-2',
            name: '软件审核组',
            code: 'software_audit',
            parentId: '1-1',
            leader: '赵组长',
            phone: '027-12345681',
            email: 'software@hb-software.gov.cn',
            sort: 2,
            status: true,
            createTime: '2026-01-01 10:00:00',
            userCount: 4,
          },
        ],
      },
      {
        id: '1-2',
        name: '财务审核部',
        code: 'finance',
        parentId: '1',
        leader: '刘经理',
        phone: '027-12345682',
        email: 'finance@hb-software.gov.cn',
        sort: 2,
        status: true,
        createTime: '2026-01-01 10:00:00',
        userCount: 8,
        children: [
          {
            id: '1-2-1',
            name: '补贴审核组',
            code: 'subsidy_audit',
            parentId: '1-2',
            leader: '陈组长',
            phone: '027-12345683',
            email: 'subsidy@hb-software.gov.cn',
            sort: 1,
            status: true,
            createTime: '2026-01-01 10:00:00',
            userCount: 6,
          },
        ],
      },
      {
        id: '1-3',
        name: '技术支持部',
        code: 'tech',
        parentId: '1',
        leader: '周经理',
        phone: '027-12345684',
        email: 'tech@hb-software.gov.cn',
        sort: 3,
        status: true,
        createTime: '2026-01-01 10:00:00',
        userCount: 12,
      },
      {
        id: '1-4',
        name: '综合管理部',
        code: 'admin',
        parentId: '1',
        leader: '吴经理',
        phone: '027-12345685',
        email: 'admin@hb-software.gov.cn',
        sort: 4,
        status: false,
        createTime: '2026-01-01 10:00:00',
        userCount: 0,
      },
    ],
  },
]

// 将部门数据转换为树形数据
const convertToTreeData = (depts: Dept[]): DataNode[] => {
  return depts.map((dept) => ({
    key: dept.id,
    title: (
      <Space>
        <span style={{ fontWeight: 500 }}>{dept.name}</span>
        <Tag color={dept.status ? 'success' : 'default'}>
          {dept.status ? '启用' : '禁用'}
        </Tag>
        <Text type="secondary">({dept.userCount}人)</Text>
      </Space>
    ),
    children: dept.children ? convertToTreeData(dept.children) : undefined,
  }))
}

export default function DeptManage() {
  const [depts, setDepts] = useState<Dept[]>(mockDepts)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingDept, setEditingDept] = useState<Dept | null>(null)
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  // 递归查找部门
  const findDept = (deptList: Dept[], id: string): Dept | null => {
    for (const dept of deptList) {
      if (dept.id === id) return dept
      if (dept.children) {
        const found = findDept(dept.children, id)
        if (found) return found
      }
    }
    return null
  }

  // 递归删除部门
  const deleteDept = (deptList: Dept[], id: string): Dept[] => {
    return deptList.filter((dept) => {
      if (dept.id === id) return false
      if (dept.children) {
        dept.children = deleteDept(dept.children, id)
      }
      return true
    })
  }

  // 打开新增/编辑弹窗
  const handleOpenModal = (dept?: Dept) => {
    if (dept) {
      setEditingDept(dept)
      form.setFieldsValue(dept)
    } else {
      setEditingDept(null)
      form.resetFields()
      form.setFieldsValue({
        status: true,
        sort: 1,
        parentId: selectedDeptId,
      })
    }
    setModalVisible(true)
  }

  // 保存部门
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingDept) {
        message.success('部门修改成功')
      } else {
        message.success('部门新增成功')
      }
      setModalVisible(false)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 删除部门
  const handleDelete = (id: string) => {
    const dept = findDept(depts, id)
    if (dept && dept.children && dept.children.length > 0) {
      message.error('该部门下存在子部门，无法删除')
      return
    }
    if (dept && dept.userCount > 0) {
      message.error('该部门下存在用户，无法删除')
      return
    }
    setDepts(deleteDept(depts, id))
    message.success('部门删除成功')
  }

  // 切换状态
  const handleStatusChange = (id: string, checked: boolean) => {
    message.success(`部门已${checked ? '启用' : '禁用'}`)
  }

  // 树节点选择
  const handleSelect = (selectedKeys: React.Key[]) => {
    setSelectedDeptId(selectedKeys[0] as string)
  }

  const selectedDept = selectedDeptId ? findDept(depts, selectedDeptId) : null

  return (
    <div>
      <Card
        title={
          <Space>
            <ApartmentOutlined />
            <span>部门管理</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            新增部门
          </Button>
        }
      >
        <Row gutter={24}>
          <Col span={12}>
            <Input
              placeholder="搜索部门名称"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ marginBottom: 16 }}
              allowClear
            />
            <Tree
              treeData={convertToTreeData(depts)}
              onSelect={handleSelect}
              defaultExpandAll
              blockNode
            />
          </Col>
          <Col span={12}>
            {selectedDept ? (
              <Card
                title={
                  <Space>
                    <TeamOutlined />
                    <span>部门详情</span>
                  </Space>
                }
                extra={
                  <Space>
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleOpenModal(selectedDept)}
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      title="确定删除该部门吗？"
                      description="删除后无法恢复，请谨慎操作"
                      onConfirm={() => handleDelete(selectedDept.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Row>
                    <Col span={8}>
                      <Text type="secondary">部门名称</Text>
                    </Col>
                    <Col span={16}>
                      <Text strong>{selectedDept.name}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Text type="secondary">部门编码</Text>
                    </Col>
                    <Col span={16}>
                      <Text code>{selectedDept.code}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Text type="secondary">负责人</Text>
                    </Col>
                    <Col span={16}>
                      <Text>{selectedDept.leader}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Text type="secondary">联系电话</Text>
                    </Col>
                    <Col span={16}>
                      <Text>{selectedDept.phone}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Text type="secondary">邮箱</Text>
                    </Col>
                    <Col span={16}>
                      <Text>{selectedDept.email}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Text type="secondary">排序号</Text>
                    </Col>
                    <Col span={16}>
                      <Text>{selectedDept.sort}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Text type="secondary">状态</Text>
                    </Col>
                    <Col span={16}>
                      <Switch
                        checked={selectedDept.status}
                        onChange={(checked) =>
                          handleStatusChange(selectedDept.id, checked)
                        }
                        checkedChildren="启用"
                        unCheckedChildren="禁用"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Text type="secondary">用户数量</Text>
                    </Col>
                    <Col span={16}>
                      <Tag icon={<UserOutlined />} color="blue">
                        {selectedDept.userCount} 人
                      </Tag>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <Text type="secondary">创建时间</Text>
                    </Col>
                    <Col span={16}>
                      <Text type="secondary">{selectedDept.createTime}</Text>
                    </Col>
                  </Row>
                </Space>
              </Card>
            ) : (
              <Card>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <ApartmentOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                  <p style={{ marginTop: 16, color: '#999' }}>
                    请选择左侧部门查看详情
                  </p>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </Card>

      {/* 新增/编辑部门弹窗 */}
      <Modal
        title={editingDept ? '编辑部门' : '新增部门'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: true, sort: 1 }}
        >
          <Form.Item
            name="parentId"
            label="上级部门"
          >
            <Input disabled placeholder="不选则为顶级部门" />
          </Form.Item>

          <Form.Item
            name="name"
            label="部门名称"
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input placeholder="如：平台运营部" />
          </Form.Item>

          <Form.Item
            name="code"
            label="部门编码"
            rules={[
              { required: true, message: '请输入部门编码' },
              { pattern: /^[a-z_]+$/, message: '只能使用小写字母和下划线' },
            ]}
          >
            <Input placeholder="如：operation" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="leader"
                label="负责人"
              >
                <Input placeholder="请输入负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '请输入正确的邮箱格式' }]}
          >
            <Input placeholder="请输入邮箱" />
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
