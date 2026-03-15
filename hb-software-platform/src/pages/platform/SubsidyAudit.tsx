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
  Statistic,
  Alert,
} from 'antd'
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  DownloadOutlined,
  DollarOutlined,
  RollbackOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

// 补贴券申报状态码（与PRD一致）
// 0: 待审核, 1: 审核中, 2: 审核通过, 3: 已驳回, 4: 已使用, 5: 已退还
const SUBSIDY_STATUS = {
  PENDING: 0,
  REVIEWING: 1,
  APPROVED: 2,
  REJECTED: 3,
  USED: 4,
  REFUNDED: 5,
}

// 模拟数据
const subsidyData = [
  {
    id: 1,
    enterprise: '湖北汽车制造有限公司',
    enterpriseType: '工业制造企业',
    software: '智能制造MES系统',
    softwareCompany: '武汉智造科技有限公司',
    contractNo: 'HT20260313001',
    contractDate: '2026-03-10',
    contractAmount: 800000,
    softwareAmount: 600000,
    subsidyAmount: 300000,
    applyType: 'first',
    status: SUBSIDY_STATUS.PENDING,
    submitTime: '2026-03-13 11:00:00',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '',
  },
  {
    id: 2,
    enterprise: '武汉电子科技有限公司',
    enterpriseType: '工业制造企业',
    software: '企业资源ERP系统',
    softwareCompany: '襄阳创新软件有限公司',
    contractNo: 'HT20260312002',
    contractDate: '2026-03-08',
    contractAmount: 350000,
    softwareAmount: 300000,
    subsidyAmount: 150000,
    applyType: 'first',
    status: SUBSIDY_STATUS.APPROVED,
    submitTime: '2026-03-12 14:30:00',
    auditTime: '2026-03-13 09:00:00',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '合同信息完整，审核通过',
  },
  {
    id: 3,
    enterprise: '襄阳机械制造厂',
    enterpriseType: '工业制造企业',
    software: '供应链管理系统',
    softwareCompany: '宜昌数字科技有限公司',
    contractNo: 'HT20260310003',
    contractDate: '2026-03-05',
    contractAmount: 500000,
    softwareAmount: 400000,
    subsidyAmount: 200000,
    applyType: 'first',
    status: SUBSIDY_STATUS.REJECTED,
    submitTime: '2026-03-10 10:00:00',
    auditTime: '2026-03-11 15:30:00',
    rejectReason: '合同金额与软件金额比例不合理，请重新核实',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '',
  },
]

export default function SubsidyAudit() {
  const [loading, setLoading] = useState(false)
  const [selectedSubsidy, setSelectedSubsidy] = useState<any>(null)
  const [detailVisible, setDetailVisible] = useState(false)
  const [auditVisible, setAuditVisible] = useState(false)
  const [auditType, setAuditType] = useState<'approve' | 'reject'>('approve')
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState<string>('pending')
  const [refundVisible, setRefundVisible] = useState(false)

  const handleViewDetail = (record: any) => {
    setSelectedSubsidy(record)
    setDetailVisible(true)
  }

  const handleAudit = (record: any, type: 'approve' | 'reject') => {
    setSelectedSubsidy(record)
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

  // 补贴券退还
  const handleRefund = (record: any) => {
    setSelectedSubsidy(record)
    setRefundVisible(true)
  }

  const handleRefundSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setRefundVisible(false)
        message.success(`已发起补贴券退还请求，退还金额：¥${selectedSubsidy.subsidyAmount.toLocaleString()}`)
      }, 1000)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getStatusTag = (status: number) => {
    const statusMap: Record<number, { color: string; text: string }> = {
      [SUBSIDY_STATUS.PENDING]: { color: 'orange', text: '待审核' },
      [SUBSIDY_STATUS.REVIEWING]: { color: 'blue', text: '审核中' },
      [SUBSIDY_STATUS.APPROVED]: { color: 'green', text: '审核通过' },
      [SUBSIDY_STATUS.REJECTED]: { color: 'red', text: '已驳回' },
      [SUBSIDY_STATUS.USED]: { color: 'purple', text: '已使用' },
      [SUBSIDY_STATUS.REFUNDED]: { color: 'default', text: '已退还' },
    }
    const { color, text } = statusMap[status] || { color: 'default', text: String(status) }
    return <Tag color={color}>{text}</Tag>
  }

  const formatAmount = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const columns = [
    {
      title: '申报企业',
      dataIndex: 'enterprise',
      key: 'enterprise',
      render: (text: string, record: any) => (
        <Space>
          <SafetyCertificateOutlined style={{ color: '#1677ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '软件产品',
      dataIndex: 'software',
      key: 'software',
    },
    {
      title: '软件企业',
      dataIndex: 'softwareCompany',
      key: 'softwareCompany',
    },
    {
      title: '合同金额',
      dataIndex: 'contractAmount',
      key: 'contractAmount',
      render: (amount: number) => formatAmount(amount),
    },
    {
      title: '申请补贴',
      dataIndex: 'subsidyAmount',
      key: 'subsidyAmount',
      render: (amount: number) => (
        <Text strong style={{ color: '#f5222d' }}>
          {formatAmount(amount)}
        </Text>
      ),
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
          {record.status === SUBSIDY_STATUS.PENDING && (
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
          {record.status === SUBSIDY_STATUS.APPROVED && (
            <Button
              type="link"
              icon={<RollbackOutlined />}
              onClick={() => handleRefund(record)}
            >
              退还
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const filteredData = subsidyData.filter(item => {
    if (activeTab === 'pending') return item.status === SUBSIDY_STATUS.PENDING
    if (activeTab === 'approved') return item.status === SUBSIDY_STATUS.APPROVED
    if (activeTab === 'rejected') return item.status === SUBSIDY_STATUS.REJECTED
    if (activeTab === 'used') return item.status === SUBSIDY_STATUS.USED
    if (activeTab === 'refunded') return item.status === SUBSIDY_STATUS.REFUNDED
    return true
  })

  return (
    <div>
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <Title level={4} style={{ margin: 0 }}>补贴券审核</Title>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审核金额"
              value={subsidyData
                .filter(i => i.status === SUBSIDY_STATUS.PENDING)
                .reduce((sum, i) => sum + i.subsidyAmount, 0)}
              prefix="¥"
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => value?.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="审核通过金额"
              value={subsidyData
                .filter(i => i.status === SUBSIDY_STATUS.APPROVED)
                .reduce((sum, i) => sum + i.subsidyAmount, 0)}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => value?.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已驳回金额"
              value={subsidyData
                .filter(i => i.status === SUBSIDY_STATUS.REJECTED)
                .reduce((sum, i) => sum + i.subsidyAmount, 0)}
              prefix="¥"
              valueStyle={{ color: '#f5222d' }}
              formatter={(value) => value?.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="累计发放"
              value={subsidyData
                .filter(i => i.status === SUBSIDY_STATUS.APPROVED)
                .reduce((sum, i) => sum + i.subsidyAmount, 0)}
              prefix="¥"
              valueStyle={{ color: '#1677ff' }}
              formatter={(value) => value?.toLocaleString()}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12 }}>
        {/* 搜索栏 */}
        <Space style={{ marginBottom: 24 }}>
          <Input
            placeholder="搜索企业名称"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <Select placeholder="审核状态" style={{ width: 150 }} allowClear>
            <Option value={SUBSIDY_STATUS.PENDING}>待审核</Option>
            <Option value={SUBSIDY_STATUS.APPROVED}>审核通过</Option>
            <Option value={SUBSIDY_STATUS.REJECTED}>已驳回</Option>
            <Option value={SUBSIDY_STATUS.USED}>已使用</Option>
            <Option value={SUBSIDY_STATUS.REFUNDED}>已退还</Option>
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
            { key: 'pending', label: `待审核 (${subsidyData.filter(i => i.status === SUBSIDY_STATUS.PENDING).length})` },
            { key: 'approved', label: `审核通过 (${subsidyData.filter(i => i.status === SUBSIDY_STATUS.APPROVED).length})` },
            { key: 'rejected', label: `已驳回 (${subsidyData.filter(i => i.status === SUBSIDY_STATUS.REJECTED).length})` },
            { key: 'used', label: `已使用 (${subsidyData.filter(i => i.status === SUBSIDY_STATUS.USED).length})` },
            { key: 'refunded', label: `已退还 (${subsidyData.filter(i => i.status === SUBSIDY_STATUS.REFUNDED).length})` },
            { key: 'all', label: '全部' },
          ]}
        />

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="补贴券申报详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>,
          selectedSubsidy?.status === SUBSIDY_STATUS.PENDING && (
            <>
              <Button
                key="reject"
                danger
                onClick={() => {
                  setDetailVisible(false)
                  handleAudit(selectedSubsidy, 'reject')
                }}
              >
                驳回
              </Button>
              <Button
                key="approve"
                type="primary"
                onClick={() => {
                  setDetailVisible(false)
                  handleAudit(selectedSubsidy, 'approve')
                }}
              >
                通过
              </Button>
            </>
          ),
        ]}
      >
        {selectedSubsidy && (
          <div>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Card style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                  <Statistic
                    title="合同金额"
                    value={selectedSubsidy.contractAmount}
                    prefix="¥"
                    formatter={(value) => value?.toLocaleString()}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                  <Statistic
                    title="申请补贴"
                    value={selectedSubsidy.subsidyAmount}
                    prefix="¥"
                    valueStyle={{ color: '#f5222d' }}
                    formatter={(value) => value?.toLocaleString()}
                  />
                </Card>
              </Col>
            </Row>

            <Descriptions column={2} bordered style={{ marginTop: 24 }}>
              <Descriptions.Item label="申报企业" span={2}>
                {selectedSubsidy.enterprise}
              </Descriptions.Item>
              <Descriptions.Item label="企业类型">
                {selectedSubsidy.enterpriseType}
              </Descriptions.Item>
              <Descriptions.Item label="申报类型">
                {selectedSubsidy.applyType === 'first' ? '首次申报' : '追加申报'}
              </Descriptions.Item>
              <Descriptions.Item label="软件产品" span={2}>
                {selectedSubsidy.software}
              </Descriptions.Item>
              <Descriptions.Item label="软件企业" span={2}>
                {selectedSubsidy.softwareCompany}
              </Descriptions.Item>
              <Descriptions.Item label="合同编号">
                {selectedSubsidy.contractNo}
              </Descriptions.Item>
              <Descriptions.Item label="合同日期">
                {selectedSubsidy.contractDate}
              </Descriptions.Item>
              <Descriptions.Item label="合同金额">
                {formatAmount(selectedSubsidy.contractAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="软件金额">
                {formatAmount(selectedSubsidy.softwareAmount)}
              </Descriptions.Item>
              <Descriptions.Item label="申请补贴" span={2}>
                <Text strong style={{ color: '#f5222d', fontSize: 18 }}>
                  {formatAmount(selectedSubsidy.subsidyAmount)}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Text strong>附件下载</Text>
              <Space style={{ marginTop: 16 }}>
                {selectedSubsidy.contractFile && (
                  <Button icon={<FileTextOutlined />}>
                    合同扫描件
                  </Button>
                )}
                {selectedSubsidy.invoiceFile && (
                  <Button icon={<DownloadOutlined />}>
                    发票凭证
                  </Button>
                )}
              </Space>
            </div>

            {selectedSubsidy.status === SUBSIDY_STATUS.REJECTED && (
              <Alert
                style={{ marginTop: 24 }}
                message="驳回原因"
                description={selectedSubsidy.rejectReason}
                type="error"
              />
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
              您正在审核补贴券申报：
              <Text strong>{selectedSubsidy?.enterprise}</Text>
            </Text>
            <br />
            <Text>
              申请补贴金额：
              <Text strong style={{ color: '#f5222d' }}>
                {formatAmount(selectedSubsidy?.subsidyAmount || 0)}
              </Text>
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
                placeholder="请输入驳回原因，将通知给申报企业"
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

      {/* 退还弹窗 */}
      <Modal
        title="补贴券退还"
        open={refundVisible}
        onCancel={() => setRefundVisible(false)}
        onOk={handleRefundSubmit}
        confirmLoading={loading}
        okText="确认退还"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Alert
            message="退还确认"
            description="退还操作将收回已发放的补贴券，请谨慎操作。"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Form.Item>
            <Text>
              申报企业：<Text strong>{selectedSubsidy?.enterprise}</Text>
            </Text>
            <br />
            <Text>
              软件产品：<Text strong>{selectedSubsidy?.software}</Text>
            </Text>
            <br />
            <Text>
              退还金额：
              <Text strong style={{ color: '#f5222d' }}>
                {formatAmount(selectedSubsidy?.subsidyAmount || 0)}
              </Text>
            </Text>
          </Form.Item>
          <Form.Item
            name="refundReason"
            label="退还原因"
            rules={[{ required: true, message: '请输入退还原因' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入退还原因，将通知给申报企业"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
