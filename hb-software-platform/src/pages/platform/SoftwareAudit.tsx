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
  Descriptions,
  message,
  Tabs,
  Image,
  Row,
  Col,
  Divider,
  Alert,
} from 'antd'
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import FilePreview from '../../components/FilePreview'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

// 软件发布状态码（与PRD一致）
// 0: 草稿, 1: 待审核, 2: 已上架, 3: 已驳回, 4: 已下架, 5: 更新待审
const SOFTWARE_STATUS = {
  DRAFT: 0,
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  OFFLINE: 4,
  UPDATE_PENDING: 5,
}

// 模拟数据
const softwareData = [
  {
    id: 1,
    name: '智能制造MES系统 V2.0',
    company: '武汉智造科技有限公司',
    category: '生产管控',
    industry: '汽车制造',
    deployType: '私有化部署',
    priceRange: '50-100万',
    version: 'V2.0',
    description: '面向制造企业的生产执行管理系统，实现生产过程的数字化管理',
    features: '生产计划、物料管理、质量管理、设备管理',
    architecture: '微服务架构，支持云原生部署',
    cases: '已服务50+制造企业',
    status: SOFTWARE_STATUS.PENDING,
    submitTime: '2026-03-13 10:15:00',
    logo: 'https://via.placeholder.com/100x100',
    screenshots: ['https://via.placeholder.com/400x300', 'https://via.placeholder.com/400x300'],
    manual: 'product_manual.pdf',
    video: 'demo_video.mp4',
  },
  {
    id: 2,
    name: '企业资源ERP系统',
    company: '襄阳创新软件有限公司',
    category: '经营管理',
    industry: '通用',
    deployType: 'SaaS',
    priceRange: '10-50万',
    version: 'V3.5',
    description: '集成财务、采购、销售、库存等模块的企业资源管理系统',
    features: '财务管理、采购管理、销售管理、库存管理',
    architecture: '云原生架构，支持多租户',
    cases: '已服务200+中小企业',
    status: SOFTWARE_STATUS.APPROVED,
    submitTime: '2026-03-10 14:30:00',
    auditTime: '2026-03-11 16:00:00',
    logo: 'https://via.placeholder.com/100x100',
    screenshots: ['https://via.placeholder.com/400x300'],
    manual: 'erp_manual.pdf',
  },
  {
    id: 3,
    name: '供应链管理系统',
    company: '宜昌数字科技有限公司',
    category: '供应链',
    industry: '物流仓储',
    deployType: '混合云',
    priceRange: '30-80万',
    version: 'V1.0',
    description: '端到端的供应链协同管理平台',
    features: '供应商管理、采购协同、库存优化',
    architecture: '分布式架构，高可用设计',
    cases: '正在试点阶段',
    status: SOFTWARE_STATUS.REJECTED,
    submitTime: '2026-03-08 09:00:00',
    auditTime: '2026-03-09 11:30:00',
    rejectReason: '产品功能描述不够详细，请补充完善产品功能介绍',
    logo: 'https://via.placeholder.com/100x100',
    screenshots: ['https://via.placeholder.com/400x300'],
    manual: 'scm_manual.pdf',
  },
]

export default function SoftwareAudit() {
  const [loading, setLoading] = useState(false)
  const [selectedSoftware, setSelectedSoftware] = useState<any>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [auditVisible, setAuditVisible] = useState(false)
  const [auditType, setAuditType] = useState<'approve' | 'reject'>('approve')
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [batchAuditVisible, setBatchAuditVisible] = useState(false)
  const [batchAuditType, setBatchAuditType] = useState<'approve' | 'reject'>('approve')

  const handleViewDetail = (record: any) => {
    setSelectedSoftware(record)
    setDetailVisible(true)
  }

  const handleAudit = (record: any, type: 'approve' | 'reject') => {
    setSelectedSoftware(record)
    setAuditType(type)
    setAuditVisible(true)
    form.resetFields()
  }

  const handleAuditSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setAuditVisible(false)
        message.success(auditType === 'approve' ? '审核通过' : '审核已驳回')
      }, 1000)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 批量审核
  const handleBatchAudit = (type: 'approve' | 'reject') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要审核的记录')
      return
    }
    setBatchAuditType(type)
    setBatchAuditVisible(true)
    form.resetFields()
  }

  const handleBatchAuditSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setBatchAuditVisible(false)
        message.success(`批量${batchAuditType === 'approve' ? '通过' : '驳回'}成功，共处理${selectedRowKeys.length}条记录`)
        setSelectedRowKeys([])
      }, 1000)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getStatusTag = (status: number) => {
    const statusMap: Record<number, { color: string; text: string }> = {
      [SOFTWARE_STATUS.DRAFT]: { color: 'default', text: '草稿' },
      [SOFTWARE_STATUS.PENDING]: { color: 'orange', text: '待审核' },
      [SOFTWARE_STATUS.APPROVED]: { color: 'green', text: '已上架' },
      [SOFTWARE_STATUS.REJECTED]: { color: 'red', text: '已驳回' },
      [SOFTWARE_STATUS.OFFLINE]: { color: 'default', text: '已下架' },
      [SOFTWARE_STATUS.UPDATE_PENDING]: { color: 'blue', text: '更新待审' },
    }
    const { color, text } = statusMap[status] || { color: 'default', text: String(status) }
    return <Tag color={color}>{text}</Tag>
  }

  const columns = [
    {
      title: '软件名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <AppstoreOutlined style={{ color: '#1677ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '软件企业',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: '软件类别',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '部署方式',
      dataIndex: 'deployType',
      key: 'deployType',
    },
    {
      title: '价格区间',
      dataIndex: 'priceRange',
      key: 'priceRange',
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
          {(record.status === SOFTWARE_STATUS.PENDING || record.status === SOFTWARE_STATUS.UPDATE_PENDING) && (
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

  const filteredData = softwareData.filter(item => {
    if (activeTab === 'draft') return item.status === SOFTWARE_STATUS.DRAFT
    if (activeTab === 'pending') return item.status === SOFTWARE_STATUS.PENDING
    if (activeTab === 'approved') return item.status === SOFTWARE_STATUS.APPROVED
    if (activeTab === 'rejected') return item.status === SOFTWARE_STATUS.REJECTED
    if (activeTab === 'offline') return item.status === SOFTWARE_STATUS.OFFLINE
    if (activeTab === 'update_pending') return item.status === SOFTWARE_STATUS.UPDATE_PENDING
    return true
  })

  return (
    <div>
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Title level={4} style={{ margin: 0 }}>软件发布审核</Title>
      </Card>

      <Card style={{ borderRadius: 12 }}>
        {/* 搜索栏 */}
        <Space style={{ marginBottom: 24 }}>
          <Input
            placeholder="搜索软件名称"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <Select placeholder="软件类别" style={{ width: 150 }} allowClear>
            <Option value="production">生产管控</Option>
            <Option value="management">经营管理</Option>
            <Option value="supply">供应链</Option>
            <Option value="design">研发设计</Option>
          </Select>
          <Button type="primary" icon={<SearchOutlined />}>
            搜索
          </Button>
        </Space>

        {/* 标签页 */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'draft', label: `草稿 (${softwareData.filter(i => i.status === SOFTWARE_STATUS.DRAFT).length})` },
            { key: 'pending', label: `待审核 (${softwareData.filter(i => i.status === SOFTWARE_STATUS.PENDING).length})` },
            { key: 'approved', label: `已上架 (${softwareData.filter(i => i.status === SOFTWARE_STATUS.APPROVED).length})` },
            { key: 'rejected', label: `已驳回 (${softwareData.filter(i => i.status === SOFTWARE_STATUS.REJECTED).length})` },
            { key: 'offline', label: `已下架 (${softwareData.filter(i => i.status === SOFTWARE_STATUS.OFFLINE).length})` },
            { key: 'update_pending', label: `更新待审 (${softwareData.filter(i => i.status === SOFTWARE_STATUS.UPDATE_PENDING).length})` },
            { key: 'all', label: '全部' },
          ]}
        />

        {/* 批量操作栏 */}
        {activeTab === 'pending' && (
          <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
            <Space>
              <span>已选择 <Text strong>{selectedRowKeys.length}</Text> 项</span>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleBatchAudit('approve')}
                disabled={selectedRowKeys.length === 0}
              >
                批量通过
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleBatchAudit('reject')}
                disabled={selectedRowKeys.length === 0}
              >
                批量驳回
              </Button>
            </Space>
          </div>
        )}

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          rowSelection={
            activeTab === 'pending'
              ? {
                  selectedRowKeys,
                  onChange: setSelectedRowKeys,
                }
              : undefined
          }
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="软件详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          (selectedSoftware?.status === SOFTWARE_STATUS.PENDING || selectedSoftware?.status === SOFTWARE_STATUS.UPDATE_PENDING) && (
            <>
              <Button
                key="reject"
                danger
                onClick={() => {
                  setDetailVisible(false)
                  handleAudit(selectedSoftware, 'reject')
                }}
              >
                驳回
              </Button>
              <Button
                key="approve"
                type="primary"
                onClick={() => {
                  setDetailVisible(false)
                  handleAudit(selectedSoftware, 'approve')
                }}
              >
                通过
              </Button>
            </>
          ),
        ]}
      >
        {selectedSoftware && (
          <div>
            <Row gutter={[24, 24]}>
              <Col span={8}>
                <Image
                  src={selectedSoftware.logo}
                  alt="软件logo"
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </Col>
              <Col span={16}>
                <Descriptions column={1}>
                  <Descriptions.Item label="软件名称">
                    <Text strong style={{ fontSize: 18 }}>{selectedSoftware.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="软件企业">
                    {selectedSoftware.company}
                  </Descriptions.Item>
                  <Descriptions.Item label="软件类别">
                    <Tag color="blue">{selectedSoftware.category}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="适用行业">
                    {selectedSoftware.industry}
                  </Descriptions.Item>
                  <Descriptions.Item label="部署方式">
                    {selectedSoftware.deployType}
                  </Descriptions.Item>
                  <Descriptions.Item label="价格区间">
                    <Text style={{ color: '#f5222d', fontSize: 16 }}>{selectedSoftware.priceRange}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Divider />

            <Descriptions column={1} bordered>
              <Descriptions.Item label="产品简介">
                {selectedSoftware.description}
              </Descriptions.Item>
              <Descriptions.Item label="功能模块">
                {selectedSoftware.features}
              </Descriptions.Item>
              <Descriptions.Item label="技术架构">
                {selectedSoftware.architecture}
              </Descriptions.Item>
              <Descriptions.Item label="成功案例">
                {selectedSoftware.cases}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div>
              <Text strong>产品截图</Text>
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                {selectedSoftware.screenshots?.map((screenshot: string, index: number) => (
                  <Col span={12} key={index}>
                    <Image
                      src={screenshot}
                      alt={`截图${index + 1}`}
                      style={{ width: '100%', borderRadius: 8 }}
                    />
                  </Col>
                ))}
              </Row>
            </div>

            <Divider />

            <div>
              <Text strong>附件列表</Text>
              <div style={{ marginTop: 16 }}>
                {selectedSoftware.manual && (
                  <FilePreview
                    fileName={selectedSoftware.manual}
                    fileUrl={`/uploads/${selectedSoftware.manual}`}
                  />
                )}
                {selectedSoftware.video && (
                  <FilePreview
                    fileName={selectedSoftware.video}
                    fileUrl={`/uploads/${selectedSoftware.video}`}
                  />
                )}
              </div>
            </div>

            {selectedSoftware.status === SOFTWARE_STATUS.REJECTED && (
              <>
                <Divider />
                <Alert
                  message="驳回原因"
                  description={selectedSoftware.rejectReason}
                  type="error"
                />
              </>
            )}
          </div>
        )}
      </Modal>

      {/* 审核弹窗 */}
      <Modal
        title={auditType === 'approve' ? '审核通过' : '审核驳回'}
        open={auditVisible}
        onCancel={() => setAuditVisible(false)}
        onOk={handleAuditSubmit}
        confirmLoading={loading}
        okText="确认"
        cancelText="取消"
        okButtonProps={{
          type: auditType === 'approve' ? 'primary' : 'default',
          danger: auditType === 'reject',
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item>
            <Text>
              您正在审核软件：<Text strong>{selectedSoftware?.name}</Text>
            </Text>
          </Form.Item>
          {auditType === 'reject' && (
            <Form.Item
              name="reason"
              label="驳回原因"
              rules={[{ required: true, message: '请输入驳回原因' }]}
            >
              <TextArea
                rows={4}
                placeholder="请输入驳回原因，将通知给软件企业"
              />
            </Form.Item>
          )}
          {auditType === 'approve' && (
            <Form.Item name="remark" label="审核备注">
              <TextArea
                rows={4}
                placeholder="可选：添加审核备注"
              />
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* 批量审核弹窗 */}
      <Modal
        title={batchAuditType === 'approve' ? '批量审核通过' : '批量审核驳回'}
        open={batchAuditVisible}
        onCancel={() => setBatchAuditVisible(false)}
        onOk={handleBatchAuditSubmit}
        confirmLoading={loading}
        okText="确认"
        cancelText="取消"
        okButtonProps={{
          type: batchAuditType === 'approve' ? 'primary' : 'default',
          danger: batchAuditType === 'reject',
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item>
            <Alert
              message={`您已选择 ${selectedRowKeys.length} 条记录进行批量${batchAuditType === 'approve' ? '通过' : '驳回'}操作`}
              type={batchAuditType === 'approve' ? 'info' : 'warning'}
              showIcon
            />
          </Form.Item>
          {batchAuditType === 'reject' && (
            <Form.Item
              name="reason"
              label="驳回原因"
              rules={[{ required: true, message: '请输入驳回原因' }]}
            >
              <TextArea
                rows={4}
                placeholder="请输入统一的驳回原因，将通知给所有被驳回的软件企业"
              />
            </Form.Item>
          )}
          {batchAuditType === 'approve' && (
            <Form.Item name="remark" label="审核备注">
              <TextArea
                rows={4}
                placeholder="可选：添加统一的审核备注"
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}
