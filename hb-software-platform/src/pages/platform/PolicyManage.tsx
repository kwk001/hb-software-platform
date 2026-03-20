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
  Statistic,
  Badge,
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
  SoundOutlined,
  PushpinOutlined,
  ReadOutlined,
  FormOutlined,
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
  {
    id: 5,
    title: '工业软件产品认证管理办法',
    type: POLICY_TYPE.SETTLEMENT,
    targetAudience: TARGET_AUDIENCE.SUPPLY,
    isTop: false,
    publishDate: '2026-03-05',
    status: 'published',
    views: 423,
    summary: '为规范工业软件产品认证流程，提高产品质量...',
    content: '详细政策内容...',
    author: '平台管理员',
  },
  {
    id: 6,
    title: '2026年度智能制造示范项目申报指南',
    type: POLICY_TYPE.SUBSIDY,
    targetAudience: TARGET_AUDIENCE.DEMAND,
    isTop: true,
    publishDate: '2026-03-08',
    status: 'published',
    views: 789,
    summary: '为加快推进智能制造发展，现开展2026年度示范项目申报工作...',
    content: '详细政策内容...',
    author: '平台管理员',
  },
  {
    id: 7,
    title: '平台用户行为规范',
    type: POLICY_TYPE.SETTLEMENT,
    targetAudience: TARGET_AUDIENCE.BOTH,
    isTop: false,
    publishDate: '2026-02-28',
    status: 'published',
    views: 345,
    summary: '为维护平台良好秩序，保障用户合法权益...',
    content: '详细政策内容...',
    author: '平台管理员',
  },
  {
    id: 8,
    title: '2026年第三季度补贴券预通知',
    type: POLICY_TYPE.SUBSIDY,
    targetAudience: TARGET_AUDIENCE.DEMAND,
    isTop: false,
    publishDate: '',
    status: 'draft',
    views: 0,
    summary: '第三季度补贴券发放计划预告...',
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

  // 统计数据
  const stats = {
    total: policyData.length,
    published: policyData.filter(p => p.status === 'published').length,
    draft: policyData.filter(p => p.status === 'draft').length,
    top: policyData.filter(p => p.isTop).length,
    totalViews: policyData.reduce((sum, p) => sum + p.views, 0),
  }

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
      published: { color: 'success', text: '已发布', icon: <CheckCircleOutlined /> },
      draft: { color: 'default', text: '草稿', icon: <FormOutlined /> },
    }
    const { color, text, icon } = statusMap[status] || { color: 'default', text: status, icon: null }
    return (
      <Tag color={color} icon={icon} style={{ borderRadius: 4 }}>
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
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: record.type === POLICY_TYPE.SUBSIDY 
                ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' 
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileTextOutlined style={{ color: '#fff', fontSize: 14 }} />
          </div>
          <Text strong style={{ fontSize: 14 }}>{text}</Text>
          {record.isTop && (
            <PushpinOutlined style={{ color: '#faad14', fontSize: 14 }} />
          )}
        </Space>
      ),
    },
    {
      title: '政策类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: number) => {
        const typeMap: Record<number, { color: string; text: string; bg: string }> = {
          [POLICY_TYPE.SUBSIDY]: { color: '#ff6b6b', text: '补贴政策', bg: '#fff1f0' },
          [POLICY_TYPE.SETTLEMENT]: { color: '#4facfe', text: '入驻政策', bg: '#e6f7ff' },
        }
        const { color, text, bg } = typeMap[type] || { color: '#999', text: '未知', bg: '#f5f5f5' }
        return (
          <Tag 
            style={{ 
              color, 
              background: bg, 
              border: `1px solid ${color}40`,
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            {text}
          </Tag>
        )
      },
    },
    {
      title: '发布对象',
      dataIndex: 'targetAudience',
      key: 'targetAudience',
      width: 120,
      render: (audience: number) => {
        const audienceMap: Record<number, { text: string; color: string; bg: string }> = {
          [TARGET_AUDIENCE.DEMAND]: { text: '制造企业', color: '#52c41a', bg: '#f6ffed' },
          [TARGET_AUDIENCE.SUPPLY]: { text: '软件企业', color: '#722ed1', bg: '#f9f0ff' },
          [TARGET_AUDIENCE.BOTH]: { text: '双方', color: '#fa8c16', bg: '#fff7e6' },
        }
        const { text, color, bg } = audienceMap[audience] || { text: '未知', color: '#999', bg: '#f5f5f5' }
        return (
          <Tag style={{ color, background: bg, border: `1px solid ${color}40`, borderRadius: 4 }}>
            {text}
          </Tag>
        )
      },
    },
    {
      title: '发布日期',
      dataIndex: 'publishDate',
      key: 'publishDate',
      width: 120,
      render: (date: string) => date || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: getStatusTag,
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      render: (views: number) => (
        <Space>
          <ReadOutlined style={{ color: '#8c8c8c' }} />
          <span>{views.toLocaleString()}</span>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{ padding: '0 8px' }}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ padding: '0 8px' }}
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
            <Button type="link" danger icon={<DeleteOutlined />} style={{ padding: '0 8px' }}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>政策总数</span>}
              value={stats.total}
              prefix={<SoundOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>已发布</span>}
              value={stats.published}
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>置顶政策</span>}
              value={stats.top}
              prefix={<PushpinOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>总浏览量</span>}
              value={stats.totalViews}
              prefix={<ReadOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
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
                <SoundOutlined style={{ color: '#fff', fontSize: 24 }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                  政策管理
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  管理平台政策发布、编辑和置顶设置
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              {drafts.length > 0 && (
                <Button 
                  icon={<FileOutlined />} 
                  onClick={() => setDraftModalVisible(true)}
                  size="large"
                  style={{ borderRadius: 8 }}
                >
                  草稿箱 <Badge count={drafts.length} style={{ marginLeft: 4 }} />
                </Button>
              )}
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAdd}
                size="large"
                style={{ 
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                发布政策
              </Button>
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
          <Space size="middle" wrap>
            <Input
              placeholder="搜索政策标题"
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              style={{ width: 280, borderRadius: 8 }}
              size="middle"
            />
            <Select 
              placeholder="政策类型" 
              style={{ width: 150, borderRadius: 8 }} 
              allowClear
              size="middle"
            >
              <Option value={POLICY_TYPE.SUBSIDY}>补贴政策</Option>
              <Option value={POLICY_TYPE.SETTLEMENT}>入驻政策</Option>
            </Select>
            <Select 
              placeholder="发布状态" 
              style={{ width: 150, borderRadius: 8 }} 
              allowClear
              size="middle"
            >
              <Option value="published">已发布</Option>
              <Option value="draft">草稿</Option>
            </Select>
            <Button 
              type="primary" 
              icon={<SearchOutlined />}
              size="middle"
              style={{ 
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              搜索
            </Button>
          </Space>
        </div>

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
            style: { marginTop: 16 },
          }}

        />
      </Card>

      {/* 新增/编辑弹窗 */}
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
              {modalType === 'add' ? <PlusOutlined style={{ color: '#fff' }} /> : <EditOutlined style={{ color: '#fff' }} />}
            </div>
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {modalType === 'add' ? '发布政策' : '编辑政策'}
            </span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        width={800}
        footer={[
          modalType === 'add' && (
            <Button
              key="draft"
              onClick={handleSaveDraft}
              loading={saveLoading}
              icon={<SaveOutlined />}
              style={{ borderRadius: 8 }}
            >
              保存草稿
            </Button>
          ),
          <Button key="cancel" onClick={() => setModalVisible(false)} style={{ borderRadius: 8 }}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmit} 
            loading={loading}
            style={{ 
              borderRadius: 8,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
          >
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
            <Input placeholder="请输入政策标题" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="政策类型"
                rules={[{ required: true, message: '请选择政策类型' }]}
              >
                <Select placeholder="请选择政策类型" style={{ borderRadius: 8 }}>
                  <Option value={POLICY_TYPE.SUBSIDY}>补贴政策</Option>
                  <Option value={POLICY_TYPE.SETTLEMENT}>入驻政策</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="targetAudience"
                label="发布对象"
                rules={[{ required: true, message: '请选择发布对象' }]}
              >
                <Select placeholder="请选择发布对象" style={{ borderRadius: 8 }}>
                  <Option value={TARGET_AUDIENCE.DEMAND}>制造企业</Option>
                  <Option value={TARGET_AUDIENCE.SUPPLY}>工业软件企业</Option>
                  <Option value={TARGET_AUDIENCE.BOTH}>双方</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isTop"
                label="置顶"
                valuePropName="checked"
              >
                <Select placeholder="是否置顶" style={{ borderRadius: 8 }}>
                  <Option value={true}>置顶</Option>
                  <Option value={false}>不置顶</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="publishDate"
                label="发布日期"
              >
                <DatePicker style={{ width: '100%', borderRadius: 8 }} placeholder="选择发布日期" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="summary"
            label="政策摘要"
            rules={[{ required: true, message: '请输入政策摘要' }]}
          >
            <TextArea rows={3} placeholder="请输入政策摘要" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="content"
            label="政策内容"
            rules={[{ required: true, message: '请输入政策内容' }]}
          >
            <TextArea rows={8} placeholder="请输入政策内容" style={{ borderRadius: 8 }} />
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
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        创建时间：{new Date(draft.createTime).toLocaleString()}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
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
          <Button key="close" onClick={() => setDetailVisible(false)} style={{ borderRadius: 8 }}>
            关闭
          </Button>,
        ]}
      >
        {selectedPolicy && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Title level={4} style={{ marginBottom: 16 }}>{selectedPolicy.title}</Title>
              <Space wrap style={{ marginBottom: 16 }}>
                <Tag 
                  style={{ 
                    color: selectedPolicy.type === POLICY_TYPE.SUBSIDY ? '#ff6b6b' : '#4facfe',
                    background: selectedPolicy.type === POLICY_TYPE.SUBSIDY ? '#fff1f0' : '#e6f7ff',
                    border: `1px solid ${selectedPolicy.type === POLICY_TYPE.SUBSIDY ? '#ff6b6b40' : '#4facfe40'}`,
                    borderRadius: 4,
                    fontWeight: 500,
                  }}
                >
                  {selectedPolicy.type === POLICY_TYPE.SUBSIDY ? '补贴政策' : '入驻政策'}
                </Tag>
                <Tag 
                  style={{ 
                    color: '#722ed1',
                    background: '#f9f0ff',
                    border: '1px solid #722ed140',
                    borderRadius: 4,
                  }}
                >
                  {selectedPolicy.targetAudience === TARGET_AUDIENCE.DEMAND ? '制造企业' :
                    selectedPolicy.targetAudience === TARGET_AUDIENCE.SUPPLY ? '工业软件企业' : '双方'}
                </Tag>
                {selectedPolicy.isTop && (
                  <Tag color="gold" icon={<PushpinOutlined />} style={{ borderRadius: 4 }}>
                    置顶
                  </Tag>
                )}
                {getStatusTag(selectedPolicy.status)}
              </Space>
              <Row gutter={24} style={{ marginTop: 16 }}>
                <Col>
                  <Text type="secondary">发布日期：{selectedPolicy.publishDate || '未发布'}</Text>
                </Col>
                <Col>
                  <Text type="secondary">
                    <ReadOutlined style={{ marginRight: 4 }} />
                    浏览量：{selectedPolicy.views.toLocaleString()}
                  </Text>
                </Col>
                <Col>
                  <Text type="secondary">发布人：{selectedPolicy.author}</Text>
                </Col>
              </Row>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
              padding: 20, 
              borderRadius: 12, 
              marginBottom: 20 
            }}>
              <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>政策摘要</Text>
              <Text style={{ lineHeight: 1.8 }}>{selectedPolicy.summary}</Text>
            </div>
            <div>
              <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 12 }}>政策内容</Text>
              <div style={{ 
                background: '#fafafa', 
                padding: 20, 
                borderRadius: 12,
                lineHeight: 1.8,
                color: '#374151',
              }}>
                {selectedPolicy.content}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
