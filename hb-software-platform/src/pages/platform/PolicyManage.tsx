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
  List,
  Empty,
  Row,
  Col,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SaveOutlined,
  FileOutlined,
} from '@ant-design/icons'

// 草稿存储键
const POLICY_DRAFT_KEY = 'policy_drafts'

// 草稿类型
interface PolicyDraft {
  id: string
  title: string
  data: any
  createTime: string
  updateTime: string
}

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

// 政策类型（与PRD一致）
// 1: 补贴政策, 2: 入驻政策
const POLICY_TYPE = {
  SUBSIDY: 1,
  SETTLEMENT: 2,
}

// 发布对象（与PRD一致）
// 1: 制造企业, 2: 软件企业, 3: 双方
const TARGET_AUDIENCE = {
  DEMAND: 1,
  SUPPLY: 2,
  BOTH: 3,
}

// 模拟数据
const policyData = [
  {
    id: 1,
    title: '2026年工业软件补贴券发放通知',
    type: POLICY_TYPE.SUBSIDY,
    targetAudience: TARGET_AUDIENCE.DEMAND,
    isTop: true,
    publishDate: '2026-03-01',
    status: 'published',
    views: 1256,
    summary: '为支持湖北省制造业企业数字化转型，现发放2026年度工业软件补贴券...',
    content: '详细政策内容...',
    author: '平台管理员',
  },
  {
    id: 2,
    title: '湖北省工业软件产业发展三年行动计划',
    type: POLICY_TYPE.SUBSIDY,
    targetAudience: TARGET_AUDIENCE.BOTH,
    isTop: true,
    publishDate: '2026-02-15',
    status: 'published',
    views: 892,
    summary: '为推动湖北省工业软件产业高质量发展，制定本行动计划...',
    content: '详细政策内容...',
    author: '平台管理员',
  },
  {
    id: 3,
    title: '工业软件企业入驻平台指南',
    type: POLICY_TYPE.SETTLEMENT,
    targetAudience: TARGET_AUDIENCE.SUPPLY,
    isTop: false,
    publishDate: '2026-01-20',
    status: 'published',
    views: 567,
    summary: '为规范工业软件企业入驻流程，特制定本指南...',
    content: '详细政策内容...',
    author: '平台管理员',
  },
  {
    id: 4,
    title: '2026年第二季度补贴券申报通知',
    type: POLICY_TYPE.SUBSIDY,
    targetAudience: TARGET_AUDIENCE.DEMAND,
    isTop: false,
    publishDate: '',
    status: 'draft',
    views: 0,
    summary: '第二季度补贴券申报即将开始...',
    content: '详细政策内容...',
    author: '平台管理员',
  },
]

export default function PolicyManage() {
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [draftModalVisible, setDraftModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'add' | 'edit'>('add')
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [form] = Form.useForm()
  const [drafts, setDrafts] = useState<PolicyDraft[]>([])
  const [saveLoading, setSaveLoading] = useState(false)

  const handleAdd = () => {
    setModalType('add')
    setSelectedPolicy(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setModalType('edit')
    setSelectedPolicy(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleView = (record: any) => {
    setSelectedPolicy(record)
    setDetailVisible(true)
  }

  const handleDelete = (id: number) => {
    message.success('删除成功')
  }

  // 加载草稿
  useEffect(() => {
    const stored = localStorage.getItem(POLICY_DRAFT_KEY)
    if (stored) {
      setDrafts(JSON.parse(stored))
    }
  }, [])

  // 保存草稿
  const handleSaveDraft = async () => {
    try {
      setSaveLoading(true)
      const values = await form.validateFields().catch(() => form.getFieldsValue())
      
      const draft: PolicyDraft = {
        id: Date.now().toString(),
        title: values.title || `未命名政策_${new Date().toLocaleDateString()}`,
        data: values,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }

      const stored = localStorage.getItem(POLICY_DRAFT_KEY)
      let draftList: PolicyDraft[] = stored ? JSON.parse(stored) : []
      draftList.unshift(draft)
      
      if (draftList.length > 10) {
        draftList = draftList.slice(0, 10)
      }

      localStorage.setItem(POLICY_DRAFT_KEY, JSON.stringify(draftList))
      setDrafts(draftList)
      message.success('草稿保存成功')
      setModalVisible(false)
    } catch (error) {
      message.error('草稿保存失败')
    } finally {
      setSaveLoading(false)
    }
  }

  // 删除草稿
  const handleDeleteDraft = (id: string) => {
    const stored = localStorage.getItem(POLICY_DRAFT_KEY)
    if (stored) {
      let draftList: PolicyDraft[] = JSON.parse(stored)
      draftList = draftList.filter(d => d.id !== id)
      localStorage.setItem(POLICY_DRAFT_KEY, JSON.stringify(draftList))
      setDrafts(draftList)
      message.success('草稿删除成功')
    }
  }

  // 使用草稿
  const handleUseDraft = (draft: PolicyDraft) => {
    form.setFieldsValue(draft.data)
    setDraftModalVisible(false)
    setModalType('add')
    setModalVisible(true)
    message.success('草稿加载成功')
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setModalVisible(false)
        message.success(modalType === 'add' ? '发布成功' : '更新成功')
      }, 1000)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string; icon: any }> = {
      published: { color: 'green', text: '已发布', icon: <CheckCircleOutlined /> },
      draft: { color: 'default', text: '草稿', icon: <ClockCircleOutlined /> },
    }
    const { color, text, icon } = statusMap[status] || { color: 'default', text: status, icon: null }
    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    )
  }

  const columns = [
    {
      title: '政策标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Space>
          <FileTextOutlined style={{ color: '#1677ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '政策类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        const typeMap: Record<number, { color: string; text: string }> = {
          [POLICY_TYPE.SUBSIDY]: { color: 'red', text: '补贴政策' },
          [POLICY_TYPE.SETTLEMENT]: { color: 'blue', text: '入驻政策' },
        }
        const { color, text } = typeMap[type] || { color: 'default', text: '未知' }
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '发布对象',
      dataIndex: 'targetAudience',
      key: 'targetAudience',
      render: (audience: number) => {
        const audienceMap: Record<number, string> = {
          [TARGET_AUDIENCE.DEMAND]: '制造企业',
          [TARGET_AUDIENCE.SUPPLY]: '工业软件企业',
          [TARGET_AUDIENCE.BOTH]: '双方',
        }
        return <Tag color="purple">{audienceMap[audience] || '未知'}</Tag>
      },
    },
    {
      title: '置顶',
      dataIndex: 'isTop',
      key: 'isTop',
      render: (isTop: boolean) => isTop ? <Tag color="gold">置顶</Tag> : '-',
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
      render: (date: string) => date || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
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
            description="确定要删除这条政策吗？"
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
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>政策管理</Title>
          </Col>
          <Col>
            <Space>
              {drafts.length > 0 && (
                <Button icon={<FileOutlined />} onClick={() => setDraftModalVisible(true)}>
                  草稿箱 ({drafts.length})
                </Button>
              )}
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                发布政策
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 12 }}>
        {/* 搜索栏 */}
        <Space style={{ marginBottom: 24 }}>
          <Input
            placeholder="搜索政策标题"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <Select placeholder="政策类型" style={{ width: 150 }} allowClear>
            <Option value={POLICY_TYPE.SUBSIDY}>补贴政策</Option>
            <Option value={POLICY_TYPE.SETTLEMENT}>入驻政策</Option>
          </Select>
          <Select placeholder="发布状态" style={{ width: 150 }} allowClear>
            <Option value="published">已发布</Option>
            <Option value="draft">草稿</Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>
            搜索
          </Button>
        </Space>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={policyData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalType === 'add' ? '发布政策' : '编辑政策'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        width={800}
        okText="发布"
        cancelText="取消"
        footer={[
          modalType === 'add' && (
            <Button
              key="draft"
              onClick={handleSaveDraft}
              loading={saveLoading}
              icon={<SaveOutlined />}
            >
              保存草稿
            </Button>
          ),
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
            {modalType === 'add' ? '发布' : '更新'}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="政策标题"
            rules={[{ required: true, message: '请输入政策标题' }]}
          >
            <Input placeholder="请输入政策标题" />
          </Form.Item>
          <Form.Item
            name="type"
            label="政策类型"
            rules={[{ required: true, message: '请选择政策类型' }]}
          >
            <Select placeholder="请选择政策类型">
              <Option value={POLICY_TYPE.SUBSIDY}>补贴政策</Option>
              <Option value={POLICY_TYPE.SETTLEMENT}>入驻政策</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="targetAudience"
            label="发布对象"
            rules={[{ required: true, message: '请选择发布对象' }]}
          >
            <Select placeholder="请选择发布对象">
              <Option value={TARGET_AUDIENCE.DEMAND}>制造企业</Option>
              <Option value={TARGET_AUDIENCE.SUPPLY}>工业软件企业</Option>
              <Option value={TARGET_AUDIENCE.BOTH}>双方</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="isTop"
            label="置顶"
            valuePropName="checked"
          >
            <Select placeholder="是否置顶">
              <Option value={true}>置顶</Option>
              <Option value={false}>不置顶</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="summary"
            label="政策摘要"
            rules={[{ required: true, message: '请输入政策摘要' }]}
          >
            <TextArea rows={3} placeholder="请输入政策摘要" />
          </Form.Item>
          <Form.Item
            name="content"
            label="政策内容"
            rules={[{ required: true, message: '请输入政策内容' }]}
          >
            <TextArea rows={8} placeholder="请输入政策内容" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 草稿箱弹窗 */}
      <Modal
        title="政策草稿箱"
        open={draftModalVisible}
        onCancel={() => setDraftModalVisible(false)}
        footer={null}
        width={600}
      >
        {drafts.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无草稿"
          />
        ) : (
          <List
            dataSource={drafts}
            renderItem={(draft) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleUseDraft(draft)}
                  >
                    使用
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="确定删除此草稿？"
                    onConfirm={() => handleDeleteDraft(draft.id)}
                  >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={draft.title}
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">
                        创建时间：{new Date(draft.createTime).toLocaleString()}
                      </Text>
                      <Text type="secondary">
                        更新时间：{new Date(draft.updateTime).toLocaleString()}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="政策详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {selectedPolicy && (
          <div>
            <h2>{selectedPolicy.title}</h2>
            <Space style={{ marginBottom: 16 }}>
              <Tag color={selectedPolicy.type === POLICY_TYPE.SUBSIDY ? 'red' : 'blue'}>
                {selectedPolicy.type === POLICY_TYPE.SUBSIDY ? '补贴政策' : '入驻政策'}
              </Tag>
              <Tag color="purple">
                {selectedPolicy.targetAudience === TARGET_AUDIENCE.DEMAND ? '制造企业' :
                  selectedPolicy.targetAudience === TARGET_AUDIENCE.SUPPLY ? '工业软件企业' : '双方'}
              </Tag>
              {selectedPolicy.isTop && <Tag color="gold">置顶</Tag>}
              <Text type="secondary">发布日期：{selectedPolicy.publishDate || '未发布'}</Text>
              <Text type="secondary">浏览量：{selectedPolicy.views}</Text>
            </Space>
            <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
              <Text strong>政策摘要</Text>
              <p>{selectedPolicy.summary}</p>
            </div>
            <div>
              <Text strong>政策内容</Text>
              <p>{selectedPolicy.content}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}


