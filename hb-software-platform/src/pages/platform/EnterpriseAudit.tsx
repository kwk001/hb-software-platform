import { useState } from 'react'
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
  Descriptions,
  message,
  Tabs,
  Image,
  Row,
  Col,
} from 'antd'
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ShopOutlined,
  FileTextOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

// 企业入驻状态码（与PRD一致）
// 0: 已注册, 1: 待审核, 2: 审核中, 3: 已入驻, 4: 已驳回
const ENTERPRISE_STATUS = {
  REGISTERED: 0,
  PENDING: 1,
  REVIEWING: 2,
  APPROVED: 3,
  REJECTED: 4,
}

// 模拟数据
const enterpriseData = [
  {
    id: 1,
    name: '武汉智造科技有限公司',
    type: '工业制造企业',
    creditCode: '91420100MA4K2X8X8X',
    industry: '汽车制造',
    scale: '200-500人',
    contactName: '张三',
    contactPhone: '13800138001',
    contactEmail: 'zhangsan@example.com',
    status: ENTERPRISE_STATUS.PENDING,
    submitTime: '2026-03-13 09:30:00',
    licenseUrl: 'https://via.placeholder.com/400x300',
    address: '湖北省武汉市东湖高新区光谷大道123号',
  },
  {
    id: 2,
    name: '襄阳创新软件有限公司',
    type: '工业软件企业',
    creditCode: '91420600MA4K2X8X9X',
    industry: '软件服务',
    scale: '50-200人',
    contactName: '李四',
    contactPhone: '13800138002',
    contactEmail: 'lisi@example.com',
    status: ENTERPRISE_STATUS.PENDING,
    submitTime: '2026-03-12 16:45:00',
    licenseUrl: 'https://via.placeholder.com/400x300',
    address: '湖北省襄阳市高新区软件园A座',
  },
  {
    id: 3,
    name: '宜昌数字科技有限公司',
    type: '工业软件企业',
    creditCode: '91420500MA4K2X8X0X',
    industry: '软件服务',
    scale: '50-200人',
    contactName: '王五',
    contactPhone: '13800138003',
    contactEmail: 'wangwu@example.com',
    status: ENTERPRISE_STATUS.APPROVED,
    submitTime: '2026-03-10 10:20:00',
    auditTime: '2026-03-11 14:30:00',
    licenseUrl: 'https://via.placeholder.com/400x300',
    address: '湖北省宜昌市西陵区发展大道88号',
  },
  {
    id: 4,
    name: '荆州机械制造有限公司',
    type: '工业制造企业',
    creditCode: '91421000MA4K2X8X1X',
    industry: '机械制造',
    scale: '500-1000人',
    contactName: '赵六',
    contactPhone: '13800138004',
    contactEmail: 'zhaoliu@example.com',
    status: ENTERPRISE_STATUS.REJECTED,
    submitTime: '2026-03-09 09:00:00',
    auditTime: '2026-03-10 11:20:00',
    rejectReason: '营业执照信息不完整，请重新上传清晰的营业执照扫描件',
    licenseUrl: 'https://via.placeholder.com/400x300',
    address: '湖北省荆州市沙市区工业园B区',
  },
]

export default function EnterpriseAudit() {
  const [loading, setLoading] = useState(false)
  const [selectedEnterprise, setSelectedEnterprise] = useState<any>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [auditVisible, setAuditVisible] = useState(false)
  const [auditType, setAuditType] = useState<'approve' | 'reject'>('approve')
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState('pending')

  const handleSearch = (values: any) => {
    console.log('Search:', values)
    // 实现搜索逻辑
  }

  const handleViewDetail = (record: any) => {
    setSelectedEnterprise(record)
    setDetailVisible(true)
  }

  const handleAudit = (record: any, type: 'approve' | 'reject') => {
    setSelectedEnterprise(record)
    setAuditType(type)
    setAuditVisible(true)
    form.resetFields()
  }

  const handleAuditSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      // 模拟提交
      setTimeout(() => {
        setLoading(false)
        setAuditVisible(false)
        message.success(auditType === 'approve' ? '审核通过' : '审核已驳回')
      }, 1000)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getStatusTag = (status: number) => {
    const statusMap: Record<number, { color: string; text: string }> = {
      [ENTERPRISE_STATUS.REGISTERED]: { color: 'default', text: '已注册' },
      [ENTERPRISE_STATUS.PENDING]: { color: 'orange', text: '待审核' },
      [ENTERPRISE_STATUS.REVIEWING]: { color: 'blue', text: '审核中' },
      [ENTERPRISE_STATUS.APPROVED]: { color: 'green', text: '已入驻' },
      [ENTERPRISE_STATUS.REJECTED]: { color: 'red', text: '已驳回' },
    }
    const { color, text } = statusMap[status] || { color: 'default', text: String(status) }
    return <Tag color={color}>{text}</Tag>
  }

  const columns = [
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <ShopOutlined style={{ color: '#1677ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '企业类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Tag color={text === '工业制造企业' ? 'blue' : 'green'}>{text}</Tag>
      ),
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      key: 'industry',
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {(record.status === ENTERPRISE_STATUS.PENDING || record.status === ENTERPRISE_STATUS.REVIEWING) && (
            <>
              <Button
                type="link"
                style={{ color: '#52c41a' }}
                icon={<CheckCircleOutlined />}
                onClick={() => handleAudit(record, 'approve')}
              >
                通过
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleAudit(record, 'reject')}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  const filteredData = enterpriseData.filter(item => {
    if (activeTab === 'registered') return item.status === ENTERPRISE_STATUS.REGISTERED
    if (activeTab === 'pending') return item.status === ENTERPRISE_STATUS.PENDING
    if (activeTab === 'reviewing') return item.status === ENTERPRISE_STATUS.REVIEWING
    if (activeTab === 'approved') return item.status === ENTERPRISE_STATUS.APPROVED
    if (activeTab === 'rejected') return item.status === ENTERPRISE_STATUS.REJECTED
    return true
  })

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
        bodyStyle={{ padding: '24px 32px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ margin: 0, color: '#1e293b', fontWeight: 600 }}>
              企业入驻审核
            </Title>
            <Text style={{ color: '#64748b', fontSize: 13, marginTop: 4, display: 'block' }}>
              审核和管理企业入驻申请
            </Text>
          </div>
          <div style={{
            display: 'flex',
            gap: 16,
            padding: '12px 20px',
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#64748b', fontSize: 12, display: 'block' }}>待审核</Text>
              <Text style={{ color: '#f59e0b', fontSize: 20, fontWeight: 700 }}>
                {enterpriseData.filter(i => i.status === ENTERPRISE_STATUS.PENDING).length}
              </Text>
            </div>
            <div style={{ width: 1, background: '#e2e8f0' }} />
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#64748b', fontSize: 12, display: 'block' }}>已入驻</Text>
              <Text style={{ color: '#22c55e', fontSize: 20, fontWeight: 700 }}>
                {enterpriseData.filter(i => i.status === ENTERPRISE_STATUS.APPROVED).length}
              </Text>
            </div>
            <div style={{ width: 1, background: '#e2e8f0' }} />
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#64748b', fontSize: 12, display: 'block' }}>已驳回</Text>
              <Text style={{ color: '#ef4444', fontSize: 20, fontWeight: 700 }}>
                {enterpriseData.filter(i => i.status === ENTERPRISE_STATUS.REJECTED).length}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Card
        style={{
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          background: '#fff',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        {/* 搜索栏 */}
        <div style={{
          padding: '20px 24px',
          background: '#f8fafc',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          marginBottom: 24,
        }}>
          <Space size={16} align="center">
            <Input
              placeholder="搜索企业名称"
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              style={{ width: 280, borderRadius: 10 }}
              size="large"
            />
            <Select
              placeholder="企业类型"
              style={{ width: 160, borderRadius: 10 }}
              allowClear
              size="large"
              suffixIcon={<ShopOutlined style={{ color: '#94a3b8' }} />}
            >
              <Option value="demand">工业制造企业</Option>
              <Option value="supply">工业软件企业</Option>
            </Select>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              size="large"
              style={{
                borderRadius: 10,
                background: '#4f46e5',
                borderColor: '#4f46e5',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
              }}
            >
              搜索
            </Button>
          </Space>
        </div>

        {/* 标签页 */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginBottom: 24 }}
          items={[
            { key: 'registered', label: <span style={{ fontSize: 15, fontWeight: 500 }}>已注册 ({enterpriseData.filter(i => i.status === ENTERPRISE_STATUS.REGISTERED).length})</span> },
            { key: 'pending', label: <span style={{ fontSize: 15, fontWeight: 500 }}>待审核 ({enterpriseData.filter(i => i.status === ENTERPRISE_STATUS.PENDING).length})</span> },
            { key: 'reviewing', label: <span style={{ fontSize: 15, fontWeight: 500 }}>审核中 ({enterpriseData.filter(i => i.status === ENTERPRISE_STATUS.REVIEWING).length})</span> },
            { key: 'approved', label: <span style={{ fontSize: 15, fontWeight: 500 }}>已入驻 ({enterpriseData.filter(i => i.status === ENTERPRISE_STATUS.APPROVED).length})</span> },
            { key: 'rejected', label: <span style={{ fontSize: 15, fontWeight: 500 }}>已驳回 ({enterpriseData.filter(i => i.status === ENTERPRISE_STATUS.REJECTED).length})</span> },
            { key: 'all', label: <span style={{ fontSize: 15, fontWeight: 500 }}>全部</span> },
          ]}
        />

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          style={{ borderRadius: 12, overflow: 'hidden' }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShopOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>企业详情</span>
          </div>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        bodyStyle={{ padding: '32px' }}
        footer={[
          <Button
            key="close"
            onClick={() => setDetailVisible(false)}
            style={{ borderRadius: 10, height: 40 }}
          >
            关闭
          </Button>,
          (selectedEnterprise?.status === ENTERPRISE_STATUS.PENDING || selectedEnterprise?.status === ENTERPRISE_STATUS.REVIEWING) && (
            <>
              <Button
                key="reject"
                danger
                onClick={() => {
                  setDetailVisible(false)
                  handleAudit(selectedEnterprise, 'reject')
                }}
                style={{ borderRadius: 10, height: 40 }}
              >
                驳回
              </Button>
              <Button
                key="approve"
                type="primary"
                onClick={() => {
                  setDetailVisible(false)
                  handleAudit(selectedEnterprise, 'approve')
                }}
                style={{
                  borderRadius: 10,
                  height: 40,
                  background: '#22c55e',
                  borderColor: '#22c55e',
                }}
              >
                通过
              </Button>
            </>
          ),
        ]}
      >
        {selectedEnterprise && (
          <div style={{
            padding: '24px',
            background: '#f8fafc',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
          }}>
            <Descriptions column={2} bordered style={{ background: '#fff' }}>
              <Descriptions.Item label="企业名称" span={2}>
                <Text strong style={{ fontSize: 16, color: '#1e293b' }}>{selectedEnterprise.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="企业类型">
                <Tag color={selectedEnterprise.type === '工业制造企业' ? 'blue' : 'green'} style={{ fontSize: 13 }}>
                  {selectedEnterprise.type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="统一社会信用代码">
                {selectedEnterprise.creditCode}
              </Descriptions.Item>
              <Descriptions.Item label="所属行业">
                {selectedEnterprise.industry}
              </Descriptions.Item>
              <Descriptions.Item label="企业规模">
                {selectedEnterprise.scale}
              </Descriptions.Item>
              <Descriptions.Item label="联系人">
                {selectedEnterprise.contactName}
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">
                {selectedEnterprise.contactPhone}
              </Descriptions.Item>
              <Descriptions.Item label="联系邮箱" span={2}>
                {selectedEnterprise.contactEmail}
              </Descriptions.Item>
              <Descriptions.Item label="注册地址" span={2}>
                {selectedEnterprise.address}
              </Descriptions.Item>
              <Descriptions.Item label="营业执照" span={2}>
                <Image
                  src={selectedEnterprise.licenseUrl}
                  alt="营业执照"
                  style={{ maxWidth: 400, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </Descriptions.Item>
              {selectedEnterprise.status === ENTERPRISE_STATUS.REJECTED && (
                <Descriptions.Item label="驳回原因" span={2}>
                  <div style={{
                    padding: '12px 16px',
                    background: '#fef2f2',
                    borderRadius: 8,
                    border: '1px solid #fecaca',
                  }}>
                    <Text style={{ color: '#dc2626' }}>{selectedEnterprise.rejectReason}</Text>
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* 审核弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: auditType === 'approve' ? '#22c55e' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {auditType === 'approve' ? (
                <CheckCircleOutlined style={{ color: '#fff', fontSize: 18 }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#fff', fontSize: 18 }} />
              )}
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
              {auditType === 'approve' ? '审核通过' : '审核驳回'}
            </span>
          </div>
        }
        open={auditVisible}
        onCancel={() => setAuditVisible(false)}
        onOk={handleAuditSubmit}
        confirmLoading={loading}
        okText="确认"
        cancelText="取消"
        width={560}
        bodyStyle={{ padding: '32px' }}
        okButtonProps={{
          type: auditType === 'approve' ? 'primary' : 'default',
          danger: auditType === 'reject',
          style: {
            borderRadius: 10,
            height: 44,
            padding: '0 28px',
            background: auditType === 'approve' ? '#22c55e' : undefined,
            borderColor: auditType === 'approve' ? '#22c55e' : undefined,
          },
        }}
        cancelButtonProps={{
          style: { borderRadius: 10, height: 44, padding: '0 28px' },
        }}
      >
        <Form form={form} layout="vertical">
          <div style={{
            padding: '16px 20px',
            background: '#f8fafc',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            marginBottom: 24,
          }}>
            <Text style={{ color: '#64748b', fontSize: 14 }}>
              您正在审核企业：<Text strong style={{ color: '#1e293b', fontSize: 16 }}>{selectedEnterprise?.name}</Text>
            </Text>
          </div>
          {auditType === 'reject' && (
            <Form.Item
              name="reason"
              label={<span style={{ fontWeight: 600, color: '#1e293b' }}>驳回原因</span>}
              rules={[{ required: true, message: '请输入驳回原因' }]}
            >
              <TextArea
                rows={4}
                placeholder="请输入驳回原因，将通知给企业"
                style={{ borderRadius: 10, resize: 'none' }}
              />
            </Form.Item>
          )}
          {auditType === 'approve' && (
            <Form.Item
              name="remark"
              label={<span style={{ fontWeight: 600, color: '#1e293b' }}>审核备注</span>}
            >
              <TextArea
                rows={4}
                placeholder="可选：添加审核备注"
                style={{ borderRadius: 10, resize: 'none' }}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}
