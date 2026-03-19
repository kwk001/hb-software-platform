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

// 退还记录类型
interface RefundRecord {
  id: number
  subsidyId: number
  enterprise: string
  refundAmount: number
  refundReason: string
  refundTime: string
  operator: string
}

// 模拟退还记录数据
const refundRecords: RefundRecord[] = [
  {
    id: 1,
    subsidyId: 4,
    enterprise: '荆州电子制造有限公司',
    refundAmount: 180000,
    refundReason: '企业因项目调整，主动申请退还补贴券',
    refundTime: '2026-03-15 14:30:00',
    operator: '平台管理员',
  },
  {
    id: 2,
    subsidyId: 8,
    enterprise: '黄石钢铁集团有限公司',
    refundAmount: 250000,
    refundReason: '合同变更，软件采购内容调整',
    refundTime: '2026-02-20 10:15:00',
    operator: '平台管理员',
  },
  {
    id: 3,
    subsidyId: 12,
    enterprise: '黄石钢铁集团有限公司',
    refundAmount: 120000,
    refundReason: '企业资金周转困难，暂缓项目',
    refundTime: '2025-12-10 16:45:00',
    operator: '平台管理员',
  },
]

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
  {
    id: 4,
    enterprise: '荆州电子制造有限公司',
    enterpriseType: '工业制造企业',
    software: '智能仓储管理系统',
    softwareCompany: '武汉软件科技有限公司',
    contractNo: 'HT20260308004',
    contractDate: '2026-03-08',
    contractAmount: 400000,
    softwareAmount: 360000,
    subsidyAmount: 180000,
    applyType: 'first',
    status: SUBSIDY_STATUS.REFUNDED,
    submitTime: '2026-03-08 09:00:00',
    auditTime: '2026-03-09 10:00:00',
    refundTime: '2026-03-15 14:30:00',
    refundReason: '企业因项目调整，主动申请退还补贴券',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '审核通过，后退还',
  },
  // 待审核 - 大额申报
  {
    id: 5,
    enterprise: '武汉重型机械有限公司',
    enterpriseType: '工业制造企业',
    software: '数字化车间管理系统',
    softwareCompany: '华中科技大学软件有限公司',
    contractNo: 'HT20260314005',
    contractDate: '2026-03-12',
    contractAmount: 2500000,
    softwareAmount: 2000000,
    subsidyAmount: 1000000,
    applyType: 'first',
    status: SUBSIDY_STATUS.PENDING,
    submitTime: '2026-03-14 16:30:00',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '',
  },
  // 待审核 - 中小额申报
  {
    id: 6,
    enterprise: '宜昌化工股份有限公司',
    enterpriseType: '工业制造企业',
    software: '安全生产监控系统',
    softwareCompany: '武汉安全科技有限公司',
    contractNo: 'HT20260313006',
    contractDate: '2026-03-10',
    contractAmount: 280000,
    softwareAmount: 250000,
    subsidyAmount: 125000,
    applyType: 'first',
    status: SUBSIDY_STATUS.PENDING,
    submitTime: '2026-03-13 09:15:00',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '',
  },
  // 待审核 - 首次申报（新企业）
  {
    id: 7,
    enterprise: '孝感纺织科技有限公司',
    enterpriseType: '工业制造企业',
    software: '智能排产系统',
    softwareCompany: '襄阳智造软件有限公司',
    contractNo: 'HT20260311007',
    contractDate: '2026-03-09',
    contractAmount: 320000,
    softwareAmount: 280000,
    subsidyAmount: 140000,
    applyType: 'first',
    status: SUBSIDY_STATUS.PENDING,
    submitTime: '2026-03-11 14:20:00',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '',
  },
  // 审核通过 - 可退还（有历史退还记录的企业）
  {
    id: 8,
    enterprise: '黄石钢铁集团有限公司',
    enterpriseType: '工业制造企业',
    software: '能源管理系统',
    softwareCompany: '北京智控科技有限公司',
    contractNo: 'HT20260301008',
    contractDate: '2026-02-28',
    contractAmount: 600000,
    softwareAmount: 500000,
    subsidyAmount: 250000,
    applyType: 'first',
    status: SUBSIDY_STATUS.APPROVED,
    submitTime: '2026-03-01 10:00:00',
    auditTime: '2026-03-02 15:30:00',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '专家组评审通过，建议支持',
  },
  // 审核通过 - 已使用
  {
    id: 9,
    enterprise: '十堰汽车零部件有限公司',
    enterpriseType: '工业制造企业',
    software: '质量追溯系统',
    softwareCompany: '武汉质量科技有限公司',
    contractNo: 'HT20260220009',
    contractDate: '2026-02-18',
    contractAmount: 450000,
    softwareAmount: 380000,
    subsidyAmount: 190000,
    applyType: 'first',
    status: SUBSIDY_STATUS.USED,
    submitTime: '2026-02-20 11:30:00',
    auditTime: '2026-02-21 09:00:00',
    useTime: '2026-03-01 10:00:00',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '审核通过，已使用',
  },
  // 已驳回 - 资料不全
  {
    id: 10,
    enterprise: '荆门食品加工厂',
    enterpriseType: '工业制造企业',
    software: '生产管理系统',
    softwareCompany: '宜昌软件科技有限公司',
    contractNo: 'HT20260309010',
    contractDate: '2026-03-07',
    contractAmount: 180000,
    softwareAmount: 150000,
    subsidyAmount: 75000,
    applyType: 'first',
    status: SUBSIDY_STATUS.REJECTED,
    submitTime: '2026-03-09 16:00:00',
    auditTime: '2026-03-10 11:20:00',
    rejectReason: '缺少发票扫描件，请补充完整后重新提交',
    contractFile: 'contract.pdf',
    invoiceFile: '',
    remarks: '',
  },
  // 已驳回 - 不符合申报条件
  {
    id: 11,
    enterprise: '随州建材有限公司',
    enterpriseType: '工业制造企业',
    software: '库存管理系统',
    softwareCompany: '武汉通用软件有限公司',
    contractNo: 'HT20260308011',
    contractDate: '2026-03-06',
    contractAmount: 120000,
    softwareAmount: 100000,
    subsidyAmount: 50000,
    applyType: 'first',
    status: SUBSIDY_STATUS.REJECTED,
    submitTime: '2026-03-08 13:45:00',
    auditTime: '2026-03-09 10:30:00',
    rejectReason: '该企业为首次申报，但软件产品不在支持目录内',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '',
  },
  // 已退还 - 有历史记录的企业再次退还
  {
    id: 12,
    enterprise: '黄石钢铁集团有限公司',
    enterpriseType: '工业制造企业',
    software: '设备预测性维护系统',
    softwareCompany: '上海工业互联网有限公司',
    contractNo: 'HT20251115012',
    contractDate: '2025-11-10',
    contractAmount: 300000,
    softwareAmount: 240000,
    subsidyAmount: 120000,
    applyType: 'first',
    status: SUBSIDY_STATUS.REFUNDED,
    submitTime: '2025-11-15 09:30:00',
    auditTime: '2025-11-18 14:00:00',
    refundTime: '2025-12-10 16:45:00',
    refundReason: '企业资金周转困难，暂缓项目',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '审核通过，后退还',
  },
  // 审核中状态
  {
    id: 13,
    enterprise: '鄂州造船有限公司',
    enterpriseType: '工业制造企业',
    software: '船舶设计仿真软件',
    softwareCompany: '武汉船舶科技有限公司',
    contractNo: 'HT20260312013',
    contractDate: '2026-03-10',
    contractAmount: 1200000,
    softwareAmount: 1000000,
    subsidyAmount: 500000,
    applyType: 'first',
    status: SUBSIDY_STATUS.REVIEWING,
    submitTime: '2026-03-12 11:00:00',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '',
  },
  // 待审核 - 二次申报（该企业有历史记录）
  {
    id: 14,
    enterprise: '荆州电子制造有限公司',
    enterpriseType: '工业制造企业',
    software: '生产执行系统MES',
    softwareCompany: '武汉智造科技有限公司',
    contractNo: 'HT20260316014',
    contractDate: '2026-03-14',
    contractAmount: 550000,
    softwareAmount: 480000,
    subsidyAmount: 240000,
    applyType: 'first',
    status: SUBSIDY_STATUS.PENDING,
    submitTime: '2026-03-16 10:30:00',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '',
  },
  // 审核通过 - 大额（可退还）
  {
    id: 15,
    enterprise: '武汉光谷电子有限公司',
    enterpriseType: '工业制造企业',
    software: '芯片设计EDA软件',
    softwareCompany: '深圳芯片科技有限公司',
    contractNo: 'HT20260228015',
    contractDate: '2026-02-25',
    contractAmount: 3500000,
    softwareAmount: 3000000,
    subsidyAmount: 1500000,
    applyType: 'first',
    status: SUBSIDY_STATUS.APPROVED,
    submitTime: '2026-02-28 15:00:00',
    auditTime: '2026-03-02 10:30:00',
    contractFile: 'contract.pdf',
    invoiceFile: 'invoice.pdf',
    remarks: '技术先进，经济合理，建议重点支持',
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

  // 监听评分变化，自动计算综合评分
  const calculateTotalScore = () => {
    const values = form.getFieldsValue()
    const technical = parseFloat(values.technicalScore) || 0
    const economic = parseFloat(values.economicScore) || 0
    const implementation = parseFloat(values.implementationScore) || 0
    const value = parseFloat(values.valueScore) || 0
    const demonstration = parseFloat(values.demonstrationScore) || 0

    // 加权计算：技术25% + 经济25% + 实施20% + 价值20% + 示范10%
    const total = technical * 0.25 + economic * 0.25 + implementation * 0.2 + value * 0.2 + demonstration * 0.1
    return total.toFixed(2)
  }

  // 表单值变化时更新综合评分
  const handleFormValuesChange = (changedValues: any) => {
    const scoreFields = ['technicalScore', 'economicScore', 'implementationScore', 'valueScore', 'demonstrationScore']
    const hasScoreChange = Object.keys(changedValues).some(key => scoreFields.includes(key))

    if (hasScoreChange) {
      const totalScore = calculateTotalScore()
      form.setFieldsValue({ totalScore })
    }
  }

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

  // 获取企业历史退还记录
  const getEnterpriseRefundHistory = (enterpriseName: string): RefundRecord[] => {
    return refundRecords.filter(record => record.enterprise === enterpriseName)
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
              补贴券审核
            </Title>
            <Text style={{ color: '#64748b', fontSize: 13, marginTop: 4, display: 'block' }}>
              审核和管理补贴券申报申请
            </Text>
          </div>
        </div>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <DollarOutlined style={{ color: '#fff', fontSize: 24 }} />
              </div>
              <div>
                <Text style={{ color: '#92400e', fontSize: 13 }}>待审核金额</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#b45309' }}>
                  ¥{subsidyData
                    .filter(i => i.status === SUBSIDY_STATUS.PENDING)
                    .reduce((sum, i) => sum + i.subsidyAmount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircleOutlined style={{ color: '#fff', fontSize: 24 }} />
              </div>
              <div>
                <Text style={{ color: '#166534', fontSize: 13 }}>审核通过金额</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#15803d' }}>
                  ¥{subsidyData
                    .filter(i => i.status === SUBSIDY_STATUS.APPROVED)
                    .reduce((sum, i) => sum + i.subsidyAmount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CloseCircleOutlined style={{ color: '#fff', fontSize: 24 }} />
              </div>
              <div>
                <Text style={{ color: '#991b1b', fontSize: 13 }}>已驳回金额</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#b91c1c' }}>
                  ¥{subsidyData
                    .filter(i => i.status === SUBSIDY_STATUS.REJECTED)
                    .reduce((sum, i) => sum + i.subsidyAmount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <SafetyCertificateOutlined style={{ color: '#fff', fontSize: 24 }} />
              </div>
              <div>
                <Text style={{ color: '#1e40af', fontSize: 13 }}>累计发放</Text>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#1d4ed8' }}>
                  ¥{subsidyData
                    .filter(i => i.status === SUBSIDY_STATUS.APPROVED)
                    .reduce((sum, i) => sum + i.subsidyAmount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

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
              placeholder="审核状态"
              style={{ width: 160, borderRadius: 10 }}
              allowClear
              size="large"
              suffixIcon={<SafetyCertificateOutlined style={{ color: '#94a3b8' }} />}
            >
              <Option value={SUBSIDY_STATUS.PENDING}>待审核</Option>
              <Option value={SUBSIDY_STATUS.APPROVED}>审核通过</Option>
              <Option value={SUBSIDY_STATUS.REJECTED}>已驳回</Option>
              <Option value={SUBSIDY_STATUS.USED}>已使用</Option>
              <Option value={SUBSIDY_STATUS.REFUNDED}>已退还</Option>
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
            { key: 'pending', label: <span style={{ fontSize: 15, fontWeight: 500 }}>待审核 ({subsidyData.filter(i => i.status === SUBSIDY_STATUS.PENDING).length})</span> },
            { key: 'approved', label: <span style={{ fontSize: 15, fontWeight: 500 }}>审核通过 ({subsidyData.filter(i => i.status === SUBSIDY_STATUS.APPROVED).length})</span> },
            { key: 'rejected', label: <span style={{ fontSize: 15, fontWeight: 500 }}>已驳回 ({subsidyData.filter(i => i.status === SUBSIDY_STATUS.REJECTED).length})</span> },
            { key: 'used', label: <span style={{ fontSize: 15, fontWeight: 500 }}>已使用 ({subsidyData.filter(i => i.status === SUBSIDY_STATUS.USED).length})</span> },
            { key: 'refunded', label: <span style={{ fontSize: 15, fontWeight: 500 }}>已退还 ({subsidyData.filter(i => i.status === SUBSIDY_STATUS.REFUNDED).length})</span> },
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
              <SafetyCertificateOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>补贴券申报详情</span>
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
          selectedSubsidy?.status === SUBSIDY_STATUS.PENDING && (
            <>
              <Button
                key="reject"
                danger
                onClick={() => {
                  setDetailVisible(false)
                  handleAudit(selectedSubsidy, 'reject')
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
                  handleAudit(selectedSubsidy, 'approve')
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
        {selectedSubsidy && (
          <div style={{
            padding: '24px',
            background: '#f8fafc',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
          }}>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <div style={{
                  padding: '20px',
                  background: '#eff6ff',
                  borderRadius: 12,
                  border: '1px solid #bfdbfe',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <FileTextOutlined style={{ color: '#fff', fontSize: 20 }} />
                    </div>
                    <div>
                      <Text style={{ color: '#1e40af', fontSize: 13 }}>合同金额</Text>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#1d4ed8' }}>
                        ¥{selectedSubsidy.contractAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{
                  padding: '20px',
                  background: '#f0fdf4',
                  borderRadius: 12,
                  border: '1px solid #bbf7d0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: '#22c55e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <DollarOutlined style={{ color: '#fff', fontSize: 20 }} />
                    </div>
                    <div>
                      <Text style={{ color: '#166534', fontSize: 13 }}>申请补贴</Text>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>
                        ¥{selectedSubsidy.subsidyAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <div style={{
              marginTop: 24,
              padding: '20px',
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="申报企业" span={2}>
                  <Text strong style={{ fontSize: 16, color: '#1e293b' }}>{selectedSubsidy.enterprise}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="企业类型">
                  <Tag color="blue" style={{ fontSize: 13 }}>{selectedSubsidy.enterpriseType}</Tag>
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
                  <Text strong style={{ color: '#ef4444', fontSize: 18 }}>
                    {formatAmount(selectedSubsidy.subsidyAmount)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </div>

            <div style={{
              marginTop: 24,
              padding: '20px',
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Text strong style={{ fontSize: 16, color: '#1e293b', display: 'block', marginBottom: 16 }}>附件下载</Text>
              <Space size={16}>
                {selectedSubsidy.contractFile && (
                  <Button
                    icon={<FileTextOutlined />}
                    style={{ borderRadius: 10, height: 40 }}
                  >
                    合同扫描件
                  </Button>
                )}
                {selectedSubsidy.invoiceFile && (
                  <Button
                    icon={<DownloadOutlined />}
                    style={{ borderRadius: 10, height: 40 }}
                  >
                    发票凭证
                  </Button>
                )}
              </Space>
            </div>

            {selectedSubsidy.status === SUBSIDY_STATUS.REJECTED && (
              <div style={{
                marginTop: 24,
                padding: '16px 20px',
                background: '#fef2f2',
                borderRadius: 12,
                border: '1px solid #fecaca',
              }}>
                <Text strong style={{ color: '#dc2626', display: 'block', marginBottom: 8 }}>驳回原因</Text>
                <Text style={{ color: '#991b1b' }}>{selectedSubsidy.rejectReason}</Text>
              </div>
            )}

            {/* 退还记录 */}
            {(selectedSubsidy.status === SUBSIDY_STATUS.REFUNDED || selectedSubsidy.refundTime) && (
              <div style={{
                marginTop: 24,
                padding: '20px',
                background: '#fefce8',
                borderRadius: 12,
                border: '1px solid #fde047',
              }}>
                <Text strong style={{ fontSize: 16, color: '#a16207', display: 'block', marginBottom: 16 }}>
                  <RollbackOutlined style={{ marginRight: 8 }} />
                  退还记录
                </Text>
                <Descriptions column={2} bordered style={{ background: '#fff', borderRadius: 8 }}>
                  <Descriptions.Item label="退还金额" span={2}>
                    <Text strong style={{ color: '#ef4444', fontSize: 16 }}>
                      {formatAmount(selectedSubsidy.refundAmount || selectedSubsidy.subsidyAmount)}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="退还时间">
                    {selectedSubsidy.refundTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="操作人">
                    平台管理员
                  </Descriptions.Item>
                  <Descriptions.Item label="退还原因" span={2}>
                    {selectedSubsidy.refundReason}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            )}

            {/* 该企业历史退还记录提示 */}
            {selectedSubsidy && getEnterpriseRefundHistory(selectedSubsidy.enterprise).length > 0 && (
              <div style={{
                marginTop: 24,
                padding: '16px 20px',
                background: '#eff6ff',
                borderRadius: 12,
                border: '1px solid #bfdbfe',
              }}>
                <Text strong style={{ color: '#1e40af', display: 'block', marginBottom: 8 }}>
                  <SafetyCertificateOutlined style={{ marginRight: 8 }} />
                  该企业历史退还记录
                </Text>
                <Text style={{ color: '#3b82f6', fontSize: 13 }}>
                  该企业在历史申报中有 {getEnterpriseRefundHistory(selectedSubsidy.enterprise).length} 条退还记录，
                  累计退还金额：{formatAmount(getEnterpriseRefundHistory(selectedSubsidy.enterprise).reduce((sum, r) => sum + r.refundAmount, 0))}
                </Text>
              </div>
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
        width={auditType === 'approve' ? 720 : 560}
        bodyStyle={{ padding: '32px', maxHeight: '70vh', overflow: 'auto' }}
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
        <Form form={form} layout="vertical" onValuesChange={handleFormValuesChange}>
          {/* 申报信息确认 */}
          <div style={{
            padding: '16px 20px',
            background: '#f8fafc',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            marginBottom: 24,
          }}>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ color: '#64748b', fontSize: 14 }}>
                申报企业：<Text strong style={{ color: '#1e293b', fontSize: 16 }}>{selectedSubsidy?.enterprise}</Text>
              </Text>
            </div>
            <Text style={{ color: '#64748b', fontSize: 14 }}>
              软件产品：<Text strong style={{ color: '#1e293b' }}>{selectedSubsidy?.software}</Text>
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
                placeholder="请输入驳回原因，将通知给申报企业"
                style={{ borderRadius: 10, resize: 'none' }}
              />
            </Form.Item>
          )}

          {auditType === 'approve' && (
            <>
              {/* 专家评分 */}
              <div style={{
                padding: '20px',
                background: '#eff6ff',
                borderRadius: 12,
                border: '1px solid #bfdbfe',
                marginBottom: 24,
              }}>
                <Text strong style={{ fontSize: 16, color: '#1e40af', display: 'block', marginBottom: 16 }}>
                  专家评分
                </Text>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="technicalScore"
                      label={<span style={{ color: '#1e40af' }}>技术可行性 (25%)</span>}
                      rules={[{ required: true, message: '请输入评分' }]}
                    >
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0-100分"
                        suffix="分"
                        style={{ borderRadius: 10 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="economicScore"
                      label={<span style={{ color: '#1e40af' }}>经济合理性 (25%)</span>}
                      rules={[{ required: true, message: '请输入评分' }]}
                    >
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0-100分"
                        suffix="分"
                        style={{ borderRadius: 10 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="implementationScore"
                      label={<span style={{ color: '#1e40af' }}>实施条件 (20%)</span>}
                      rules={[{ required: true, message: '请输入评分' }]}
                    >
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0-100分"
                        suffix="分"
                        style={{ borderRadius: 10 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="valueScore"
                      label={<span style={{ color: '#1e40af' }}>应用价值 (20%)</span>}
                      rules={[{ required: true, message: '请输入评分' }]}
                    >
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0-100分"
                        suffix="分"
                        style={{ borderRadius: 10 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="demonstrationScore"
                      label={<span style={{ color: '#1e40af' }}>示范效应 (10%)</span>}
                      rules={[{ required: true, message: '请输入评分' }]}
                    >
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0-100分"
                        suffix="分"
                        style={{ borderRadius: 10 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="totalScore"
                      label={<span style={{ color: '#1e40af', fontWeight: 600 }}>综合评分</span>}
                    >
                      <Input
                        disabled
                        suffix="分"
                        style={{ borderRadius: 10, background: '#dbeafe', fontWeight: 600, color: '#1d4ed8' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="reviewComment"
                  label={<span style={{ color: '#1e40af' }}>评审意见</span>}
                  rules={[{ required: true, message: '请输入评审意见' }]}
                >
                  <TextArea
                    rows={3}
                    placeholder="请输入专家组评审意见"
                    style={{ borderRadius: 10, resize: 'none' }}
                  />
                </Form.Item>
              </div>

              {/* 信息修改 */}
              <div style={{
                padding: '20px',
                background: '#f0fdf4',
                borderRadius: 12,
                border: '1px solid #bbf7d0',
                marginBottom: 24,
              }}>
                <Text strong style={{ fontSize: 16, color: '#166534', display: 'block', marginBottom: 16 }}>
                  信息修改（可选）
                </Text>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="contractAmount"
                      label={<span style={{ color: '#166534' }}>合同金额</span>}
                      initialValue={selectedSubsidy?.contractAmount}
                    >
                      <Input
                        type="number"
                        prefix="¥"
                        placeholder="请输入合同金额"
                        style={{ borderRadius: 10 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="softwareAmount"
                      label={<span style={{ color: '#166534' }}>软件金额</span>}
                      initialValue={selectedSubsidy?.softwareAmount}
                    >
                      <Input
                        type="number"
                        prefix="¥"
                        placeholder="请输入软件金额"
                        style={{ borderRadius: 10 }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="subsidyAmount"
                      label={<span style={{ color: '#166534', fontWeight: 600 }}>补贴金额</span>}
                      initialValue={selectedSubsidy?.subsidyAmount}
                    >
                      <Input
                        type="number"
                        prefix="¥"
                        placeholder="请输入补贴金额"
                        style={{ borderRadius: 10, borderColor: '#22c55e' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* 审核备注 */}
              <Form.Item
                name="remark"
                label={<span style={{ fontWeight: 600, color: '#1e293b' }}>审核备注（可选）</span>}
              >
                <TextArea
                  rows={3}
                  placeholder="可选：添加审核备注"
                  style={{ borderRadius: 10, resize: 'none' }}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* 退还弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <RollbackOutlined style={{ color: '#fff', fontSize: 18 }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>补贴券退还</span>
          </div>
        }
        open={refundVisible}
        onCancel={() => setRefundVisible(false)}
        onOk={handleRefundSubmit}
        confirmLoading={loading}
        okText="确认退还"
        cancelText="取消"
        width={560}
        bodyStyle={{ padding: '32px' }}
        okButtonProps={{
          danger: true,
          style: { borderRadius: 10, height: 44, padding: '0 28px' },
        }}
        cancelButtonProps={{
          style: { borderRadius: 10, height: 44, padding: '0 28px' },
        }}
      >
        <Form form={form} layout="vertical">
          <div style={{
            padding: '16px 20px',
            background: '#fffbeb',
            borderRadius: 12,
            border: '1px solid #fcd34d',
            marginBottom: 24,
          }}>
            <Text style={{ color: '#92400e', fontSize: 14 }}>
              <span style={{ marginRight: 8 }}>⚠️</span>
              退还操作将收回已发放的补贴券，请谨慎操作
            </Text>
          </div>
          <div style={{
            padding: '16px 20px',
            background: '#f8fafc',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            marginBottom: 24,
          }}>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ color: '#64748b', fontSize: 14 }}>
                申报企业：<Text strong style={{ color: '#1e293b' }}>{selectedSubsidy?.enterprise}</Text>
              </Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ color: '#64748b', fontSize: 14 }}>
                软件产品：<Text strong style={{ color: '#1e293b' }}>{selectedSubsidy?.software}</Text>
              </Text>
            </div>
            <Text style={{ color: '#64748b', fontSize: 14 }}>
              退还金额：<Text strong style={{ color: '#ef4444', fontSize: 18 }}>{formatAmount(selectedSubsidy?.subsidyAmount || 0)}</Text>
            </Text>
          </div>
          <Form.Item
            name="refundReason"
            label={<span style={{ fontWeight: 600, color: '#1e293b' }}>退还原因</span>}
            rules={[{ required: true, message: '请输入退还原因' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入退还原因，将通知给申报企业"
              style={{ borderRadius: 10, resize: 'none' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
