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
              软件发布审核
            </Title>
            <Text style={{ color: '#64748b', fontSize: 13, marginTop: 4, display: 'block' }}>
              审核和管理软件产品发布申请
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
                {softwareData.filter(i => i.status === SOFTWARE_STATUS.PENDING).length}
              </Text>
            </div>
            <div style={{ width: 1, background: '#e2e8f0' }} />
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#64748b', fontSize: 12, display: 'block' }}>已上架</Text>
              <Text style={{ color: '#22c55e', fontSize: 20, fontWeight: 700 }}>
                {softwareData.filter(i => i.status === SOFTWARE_STATUS.APPROVED).length}
              </Text>
            </div>
            <div style={{ width: 1, background: '#e2e8f0' }} />
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: '#64748b', fontSize: 12, display: 'block' }}>已驳回</Text>
              <Text style={{ color: '#ef4444', fontSize: 20, fontWeight: 700 }}>
                {softwareData.filter(i => i.status === SOFTWARE_STATUS.REJECTED).length}
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
              placeholder="搜索软件名称"
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              style={{ width: 280, borderRadius: 10 }}
              size="large"
            />
            <Select
              placeholder="软件类别"
              style={{ width: 160, borderRadius: 10 }}
              allowClear
              size="large"
              suffixIcon={<AppstoreOutlined style={{ color: '#94a3b8' }} />}
            >
              <Option value="production">生产管控</Option>
              <Option value="management">经营管理</Option>
              <Option value="supply">供应链</Option>
              <Option value="design">研发设计</Option>
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
            { key: 'draft', label: <span style={{ fontSize: 15, fontWeight: 500 }}>草稿 ({softwareData.filter(i => i.status === SOFTWARE_STATUS.DRAFT).length})</span> },
            { key: 'pending', label: <span style={{ fontSize: 15, fontWeight: 500 }}>待审核 ({softwareData.filter(i => i.status === SOFTWARE_STATUS.PENDING).length})</span> },
            { key: 'approved', label: <span style={{ fontSize: 15, fontWeight: 500 }}>已上架 ({softwareData.filter(i => i.status === SOFTWARE_STATUS.APPROVED).length})</span> },
            { key: 'rejected', label: <span style={{ fontSize: 15, fontWeight: 500 }}>已驳回 ({softwareData.filter(i => i.status === SOFTWARE_STATUS.REJECTED).length})</span> },
            { key: 'offline', label: <span style={{ fontSize: 15, fontWeight: 500 }}>已下架 ({softwareData.filter(i => i.status === SOFTWARE_STATUS.OFFLINE).length})</span> },
            { key: 'update_pending', label: <span style={{ fontSize: 15, fontWeight: 500 }}>更新待审 ({softwareData.filter(i => i.status === SOFTWARE_STATUS.UPDATE_PENDING).length})</span> },
            { key: 'all', label: <span style={{ fontSize: 15, fontWeight: 500 }}>全部</span> },
          ]}
        />

        {/* 批量操作栏 */}
        {activeTab === 'pending' && (
          <div style={{
            marginBottom: 24,
            padding: '16px 20px',
            background: '#f0fdf4',
            borderRadius: 12,
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Space size={16}>
              <span style={{ color: '#166534', fontSize: 14 }}>
                已选择 <Text strong style={{ color: '#16a34a', fontSize: 16 }}>{selectedRowKeys.length}</Text> 项
              </span>
            </Space>
            <Space size={12}>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleBatchAudit('approve')}
                disabled={selectedRowKeys.length === 0}
                style={{
                  borderRadius: 10,
                  height: 40,
                  background: selectedRowKeys.length === 0 ? '#cbd5e1' : '#22c55e',
                  borderColor: selectedRowKeys.length === 0 ? '#cbd5e1' : '#22c55e',
                }}
              >
                批量通过
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleBatchAudit('reject')}
                disabled={selectedRowKeys.length === 0}
                style={{ borderRadius: 10, height: 40 }}
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
          style={{ borderRadius: 12, overflow: 'hidden' }}
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
              <AppstoreOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>软件详情</span>
          </div>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={900}
        bodyStyle={{ padding: '32px' }}
        footer={[
          <Button
            key="close"
            onClick={() => setDetailVisible(false)}
            style={{ borderRadius: 10, height: 40 }}
          >
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
                style={{ borderRadius: 10, height: 40 }}
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
        {selectedSoftware && (
          <div style={{
            padding: '24px',
            background: '#f8fafc',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
          }}>
            <Row gutter={[24, 24]}>
              <Col span={8}>
                <div style={{
                  padding: 16,
                  background: '#fff',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                }}>
                  <Image
                    src={selectedSoftware.logo}
                    alt="软件logo"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </div>
              </Col>
              <Col span={16}>
                <Descriptions column={1} style={{ background: '#fff' }}>
                  <Descriptions.Item label="软件名称">
                    <Text strong style={{ fontSize: 18, color: '#1e293b' }}>{selectedSoftware.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="软件企业">
                    {selectedSoftware.company}
                  </Descriptions.Item>
                  <Descriptions.Item label="软件类别">
                    <Tag color="blue" style={{ fontSize: 13 }}>{selectedSoftware.category}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="适用行业">
                    {selectedSoftware.industry}
                  </Descriptions.Item>
                  <Descriptions.Item label="部署方式">
                    {selectedSoftware.deployType}
                  </Descriptions.Item>
                  <Descriptions.Item label="价格区间">
                    <Text style={{ color: '#ef4444', fontSize: 16, fontWeight: 600 }}>{selectedSoftware.priceRange}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Divider style={{ borderColor: '#e2e8f0' }} />

            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
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
            </div>

            <Divider style={{ borderColor: '#e2e8f0' }} />

            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
              <Text strong style={{ fontSize: 16, color: '#1e293b' }}>产品截图</Text>
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                {selectedSoftware.screenshots?.map((screenshot: string, index: number) => (
                  <Col span={12} key={index}>
                    <Image
                      src={screenshot}
                      alt={`截图${index + 1}`}
                      style={{ width: '100%', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </Col>
                ))}
              </Row>
            </div>

            <Divider style={{ borderColor: '#e2e8f0' }} />

            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0' }}>
              <Text strong style={{ fontSize: 16, color: '#1e293b' }}>附件列表</Text>
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
                <Divider style={{ borderColor: '#e2e8f0' }} />
                <div style={{
                  padding: '16px 20px',
                  background: '#fef2f2',
                  borderRadius: 12,
                  border: '1px solid #fecaca',
                }}>
                  <Text strong style={{ color: '#dc2626', display: 'block', marginBottom: 8 }}>驳回原因</Text>
                  <Text style={{ color: '#991b1b' }}>{selectedSoftware.rejectReason}</Text>
                </div>
              </>
            )}
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
              您正在审核软件：<Text strong style={{ color: '#1e293b', fontSize: 16 }}>{selectedSoftware?.name}</Text>
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
                placeholder="请输入驳回原因，将通知给软件企业"
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

      {/* 批量审核弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: batchAuditType === 'approve' ? '#22c55e' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {batchAuditType === 'approve' ? (
                <CheckCircleOutlined style={{ color: '#fff', fontSize: 18 }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#fff', fontSize: 18 }} />
              )}
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
              {batchAuditType === 'approve' ? '批量审核通过' : '批量审核驳回'}
            </span>
          </div>
        }
        open={batchAuditVisible}
        onCancel={() => setBatchAuditVisible(false)}
        onOk={handleBatchAuditSubmit}
        confirmLoading={loading}
        okText="确认"
        cancelText="取消"
        width={560}
        bodyStyle={{ padding: '32px' }}
        okButtonProps={{
          type: batchAuditType === 'approve' ? 'primary' : 'default',
          danger: batchAuditType === 'reject',
          style: {
            borderRadius: 10,
            height: 44,
            padding: '0 28px',
            background: batchAuditType === 'approve' ? '#22c55e' : undefined,
            borderColor: batchAuditType === 'approve' ? '#22c55e' : undefined,
          },
        }}
        cancelButtonProps={{
          style: { borderRadius: 10, height: 44, padding: '0 28px' },
        }}
      >
        <Form form={form} layout="vertical">
          <div style={{
            padding: '16px 20px',
            background: batchAuditType === 'approve' ? '#f0fdf4' : '#fef2f2',
            borderRadius: 12,
            border: `1px solid ${batchAuditType === 'approve' ? '#bbf7d0' : '#fecaca'}`,
            marginBottom: 24,
          }}>
            <Text style={{ color: batchAuditType === 'approve' ? '#166534' : '#991b1b', fontSize: 14 }}>
              您已选择 <Text strong style={{ color: batchAuditType === 'approve' ? '#16a34a' : '#dc2626', fontSize: 16 }}>{selectedRowKeys.length}</Text> 条记录进行批量{batchAuditType === 'approve' ? '通过' : '驳回'}操作
            </Text>
          </div>
          {batchAuditType === 'reject' && (
            <Form.Item
              name="reason"
              label={<span style={{ fontWeight: 600, color: '#1e293b' }}>驳回原因</span>}
              rules={[{ required: true, message: '请输入驳回原因' }]}
            >
              <TextArea
                rows={4}
                placeholder="请输入统一的驳回原因，将通知给所有被驳回的软件企业"
                style={{ borderRadius: 10, resize: 'none' }}
              />
            </Form.Item>
          )}
          {batchAuditType === 'approve' && (
            <Form.Item
              name="remark"
              label={<span style={{ fontWeight: 600, color: '#1e293b' }}>审核备注</span>}
            >
              <TextArea
                rows={4}
                placeholder="可选：添加统一的审核备注"
                style={{ borderRadius: 10, resize: 'none' }}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}
