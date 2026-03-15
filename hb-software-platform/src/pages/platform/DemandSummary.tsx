import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Row,
  Col,
  message,
  Modal,
  Descriptions,
  Badge,
  Statistic,
  DatePicker,
} from 'antd'
import {
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import type { RangePickerProps } from 'antd/es/date-picker'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

// 需求对接状态码（与PRD一致）
// 0: 待处理, 1: 处理中, 2: 已处理, 3: 已关闭
const DEMAND_STATUS = {
  PENDING: 0,
  PROCESSING: 1,
  PROCESSED: 2,
  CLOSED: 3,
}

// 需求状态
const demandStatuses = [
  { value: DEMAND_STATUS.PENDING, label: '待处理', color: 'default' },
  { value: DEMAND_STATUS.PROCESSING, label: '对接中', color: 'processing' },
  { value: DEMAND_STATUS.PROCESSED, label: '已完成', color: 'success' },
  { value: DEMAND_STATUS.CLOSED, label: '已关闭', color: 'default' },
]

// 行业列表
const industries = [
  '汽车制造',
  '电子信息',
  '装备制造',
  '钢铁冶金',
  '化工材料',
  '食品饮料',
  '纺织服装',
  '其他',
]

// 模拟需求数据
const demandList = [
  {
    id: 1,
    title: '寻求MES系统供应商',
    enterpriseName: '武汉钢铁集团',
    enterpriseType: 'demand',
    industry: '钢铁冶金',
    softwareName: '智能制造MES系统',
    softwareCompany: '湖北智造科技',
    category: 'MES系统',
    budget: '50-100万',
    status: DEMAND_STATUS.PENDING,
    urgency: 'urgent',
    isPublic: true,
    createTime: '2026-03-10 14:30',
    contactName: '张经理',
    contactPhone: '138****1234',
    description: '我们需要一套MES系统来实现生产过程的数字化管理，包括生产调度、质量管理、设备管理等功能模块。',
    technicalRequirements: '需要支持与现有ERP系统的数据对接，提供标准API接口。',
  },
  {
    id: 2,
    title: '工业数据采集平台开发',
    enterpriseName: '襄阳汽车零部件',
    enterpriseType: 'demand',
    industry: '汽车制造',
    softwareName: '工业物联网平台',
    softwareCompany: '宜昌智联科技',
    category: '物联网',
    budget: '30-50万',
    status: DEMAND_STATUS.PROCESSING,
    urgency: 'normal',
    isPublic: true,
    createTime: '2026-03-09 10:15',
    contactName: '李总',
    contactPhone: '139****5678',
    description: '希望建设工业数据采集平台，实现车间设备的实时数据采集和监控。',
    technicalRequirements: '支持Modbus、OPC UA等工业协议，数据存储至少保留3年。',
  },
  {
    id: 3,
    title: 'ERP系统升级服务',
    enterpriseName: '宜昌化工集团',
    enterpriseType: 'demand',
    industry: '化工材料',
    softwareName: '企业资源ERP系统',
    softwareCompany: '武汉云智软件',
    category: 'ERP系统',
    budget: '20-30万',
    status: DEMAND_STATUS.PROCESSED,
    urgency: 'normal',
    isPublic: false,
    createTime: '2026-03-08 11:20',
    contactName: '王工',
    contactPhone: '137****9012',
    description: '现有ERP系统版本较老，需要进行升级改造。',
    technicalRequirements: '保持现有数据完整性，支持新财税政策。',
    handleResult: '已对接武汉云智软件，预计4月初开始实施。',
    handleTime: '2026-03-09 16:30',
  },
  {
    id: 4,
    title: 'PLM系统选型咨询',
    enterpriseName: '黄石机械制造',
    enterpriseType: 'demand',
    industry: '装备制造',
    softwareName: '产品生命周期PLM',
    softwareCompany: '襄阳创新科技',
    category: 'PLM系统',
    budget: '100-500万',
    status: DEMAND_STATUS.CLOSED,
    urgency: 'planning',
    isPublic: true,
    createTime: '2026-03-05 09:00',
    contactName: '赵经理',
    contactPhone: '136****3456',
    description: '了解PLM系统的功能和实施周期，为明年项目做规划。',
    technicalRequirements: '需要支持三维设计软件集成。',
    closeReason: '企业暂时搁置项目，预计明年重新启动。',
    closeTime: '2026-03-06 10:00',
  },
  {
    id: 5,
    title: '设备数据采集方案咨询',
    enterpriseName: '荆州电子科技',
    enterpriseType: 'demand',
    industry: '电子信息',
    softwareName: '工业物联网平台',
    softwareCompany: '宜昌智联科技',
    category: '物联网',
    budget: '30-50万',
    status: DEMAND_STATUS.PENDING,
    urgency: 'urgent',
    isPublic: true,
    createTime: '2026-03-12 15:45',
    contactName: '陈工',
    contactPhone: '135****7890',
    description: '车间有50台老旧设备，想进行数据采集改造。',
    technicalRequirements: '需要支持老旧设备的通信协议转换。',
  },
]

const DemandSummary = () => {
  const [status, setStatus] = useState('all')
  const [industry, setIndustry] = useState('all')
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedDemand, setSelectedDemand] = useState<any>(null)
  const [handleModalVisible, setHandleModalVisible] = useState(false)

  // 统计数据
  const stats = {
    pending: demandList.filter(d => d.status === DEMAND_STATUS.PENDING).length,
    in_progress: demandList.filter(d => d.status === DEMAND_STATUS.PROCESSING).length,
    finished: demandList.filter(d => d.status === DEMAND_STATUS.PROCESSED).length,
    total: demandList.length,
  }

  const getStatusTag = (status: number) => {
    const statusInfo = demandStatuses.find(s => s.value === status)
    return <Badge status={statusInfo?.color as any} text={statusInfo?.label || String(status)} />
  }

  const getUrgencyTag = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return <Tag color="red">紧急</Tag>
      case 'normal':
        return <Tag color="blue">一般</Tag>
      case 'planning':
        return <Tag color="green">长期规划</Tag>
      default:
        return <Tag>{urgency}</Tag>
    }
  }

  const columns = [
    {
      title: '需求标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      render: (industry: string) => <Tag color="blue">{industry}</Tag>,
    },
    {
      title: '意向软件',
      dataIndex: 'softwareName',
      key: 'softwareName',
      render: (text: string, record: any) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.softwareCompany}</div>
        </div>
      ),
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
    },
    {
      title: '紧急程度',
      dataIndex: 'urgency',
      key: 'urgency',
      render: (urgency: string) => getUrgencyTag(urgency),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {(record.status === DEMAND_STATUS.PENDING || record.status === DEMAND_STATUS.PROCESSING) && (
            <Button
              type="link"
              size="small"
              onClick={() => handleProcess(record)}
            >
              处理
            </Button>
          )}
          {record.status !== DEMAND_STATUS.CLOSED && record.status !== DEMAND_STATUS.PROCESSED && (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleClose(record)}
            >
              关闭
            </Button>
          )}
        </Space>
      ),
    },
  ]

  const handleViewDetail = (record: any) => {
    setSelectedDemand(record)
    setDetailModalVisible(true)
  }

  const handleProcess = (record: any) => {
    setSelectedDemand(record)
    setHandleModalVisible(true)
  }

  const handleClose = (record: any) => {
    message.success(`需求「${record.title}」已关闭`)
  }

  const handleProcessSubmit = () => {
    message.success('处理结果已保存')
    setHandleModalVisible(false)
  }

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff4d4f' }}>{stats.pending}</div>
              <div style={{ color: '#666' }}>待处理</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff' }}>{stats.in_progress}</div>
              <div style={{ color: '#666' }}>对接中</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a' }}>{stats.finished}</div>
              <div style={{ color: '#666' }}>已完成</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1' }}>{stats.total}</div>
              <div style={{ color: '#666' }}>需求总数</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title="需求汇总"
        style={{ borderRadius: '12px' }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Search
              placeholder="搜索需求标题或企业名称"
              allowClear
              enterButton={<><SearchOutlined /> 搜索</>}
            />
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Select
              value={status}
              onChange={setStatus}
              style={{ width: '100%' }}
              placeholder="选择状态"
            >
              <Option value="all">全部状态</Option>
              {demandStatuses.map(s => (
                <Option key={s.value} value={s.value}>{s.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Select
              value={industry}
              onChange={setIndustry}
              style={{ width: '100%' }}
              placeholder="选择行业"
            >
              <Option value="all">全部行业</Option>
              {industries.map(i => (
                <Option key={i} value={i}>{i}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
          </Col>
          <Col xs={24} sm={12} lg={3}>
            <Button icon={<ReloadOutlined />} style={{ width: '100%' }}>
              刷新
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={demandList}
          rowKey="id"
          pagination={{
            total: demandList.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="需求详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedDemand && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="需求标题" span={2}>{selectedDemand.title}</Descriptions.Item>
            <Descriptions.Item label="企业名称">{selectedDemand.enterpriseName}</Descriptions.Item>
            <Descriptions.Item label="所属行业">{selectedDemand.industry}</Descriptions.Item>
            <Descriptions.Item label="意向软件">{selectedDemand.softwareName}</Descriptions.Item>
            <Descriptions.Item label="软件企业">{selectedDemand.softwareCompany}</Descriptions.Item>
            <Descriptions.Item label="预算范围">{selectedDemand.budget}</Descriptions.Item>
            <Descriptions.Item label="紧急程度">{getUrgencyTag(selectedDemand.urgency)}</Descriptions.Item>
            <Descriptions.Item label="是否公开">{selectedDemand.isPublic ? '公开' : '私密'}</Descriptions.Item>
            <Descriptions.Item label="联系人">{selectedDemand.contactName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{selectedDemand.contactPhone}</Descriptions.Item>
            <Descriptions.Item label="需求描述" span={2}>{selectedDemand.description}</Descriptions.Item>
            <Descriptions.Item label="技术要求" span={2}>{selectedDemand.technicalRequirements || '无'}</Descriptions.Item>
            <Descriptions.Item label="提交时间">{selectedDemand.createTime}</Descriptions.Item>
            <Descriptions.Item label="当前状态">{getStatusTag(selectedDemand.status)}</Descriptions.Item>
            {selectedDemand.handleResult && (
              <Descriptions.Item label="处理结果" span={2}>{selectedDemand.handleResult}</Descriptions.Item>
            )}
            {selectedDemand.handleTime && (
              <Descriptions.Item label="处理时间">{selectedDemand.handleTime}</Descriptions.Item>
            )}
            {selectedDemand.closeReason && (
              <Descriptions.Item label="关闭原因" span={2}>{selectedDemand.closeReason}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 处理弹窗 */}
      <Modal
        title="处理需求"
        open={handleModalVisible}
        onCancel={() => setHandleModalVisible(false)}
        onOk={handleProcessSubmit}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        {selectedDemand && (
          <div>
            <div style={{ marginBottom: '16px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontWeight: 500, marginBottom: '8px' }}>{selectedDemand.title}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {selectedDemand.enterpriseName} | {selectedDemand.softwareName}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 500, marginBottom: '8px' }}>处理结果</div>
              <Input.TextArea rows={4} placeholder="请输入处理结果..." />
            </div>
            <div>
              <div style={{ fontWeight: 500, marginBottom: '8px' }}>后续安排</div>
              <Input.TextArea rows={3} placeholder="请输入后续安排（选填）..." />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DemandSummary
