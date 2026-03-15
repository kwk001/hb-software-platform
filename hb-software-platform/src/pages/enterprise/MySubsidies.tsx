import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Steps,
  Timeline,
  Modal,
  Form,
} from 'antd'
import {
  PlusOutlined,
  EyeOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const { Search } = Input
const { Option } = Select

// 补贴券申报状态码（与PRD一致）
// 0: 待审核, 1: 审核通过, 2: 已驳回, 3: 已使用, 4: 已退还
const SUBSIDY_STATUS = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
  USED: 3,
  REFUNDED: 4,
}

const MySubsidies = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('all')
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  // 申报列表数据
  const subsidyList = [
    {
      id: 1,
      policyName: '2026年度湖北省工业软件补贴券',
      softwareName: '智能制造MES系统',
      contractAmount: 280000,
      subsidyAmount: 84000,
      status: SUBSIDY_STATUS.PENDING,
      submitDate: '2026-03-10',
      currentLevel: 1,
    },
    {
      id: 2,
      policyName: '2025年度湖北省工业软件补贴券',
      softwareName: '工业物联网平台',
      contractAmount: 150000,
      subsidyAmount: 45000,
      status: SUBSIDY_STATUS.APPROVED,
      submitDate: '2025-06-15',
      currentLevel: 3,
    },
    {
      id: 3,
      policyName: '2025年度智能制造专项补贴',
      softwareName: '质量管理系统',
      contractAmount: 80000,
      subsidyAmount: 24000,
      status: SUBSIDY_STATUS.REJECTED,
      submitDate: '2025-03-20',
      currentLevel: 2,
    },
    {
      id: 4,
      policyName: '2025年度湖北省工业软件补贴券',
      softwareName: '企业资源ERP系统',
      contractAmount: 200000,
      subsidyAmount: 60000,
      status: SUBSIDY_STATUS.REFUNDED,
      submitDate: '2025-05-10',
      currentLevel: 3,
      refundDate: '2025-08-15',
      refundReason: '项目取消，合同终止',
    },
  ]

  // 获取状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case SUBSIDY_STATUS.PENDING:
        return <Tag color="warning">待审核</Tag>
      case SUBSIDY_STATUS.APPROVED:
        return <Tag color="success">审核通过</Tag>
      case SUBSIDY_STATUS.REJECTED:
        return <Tag color="error">已驳回</Tag>
      case SUBSIDY_STATUS.USED:
        return <Tag color="blue">已使用</Tag>
      case SUBSIDY_STATUS.REFUNDED:
        return <Tag color="default">已退还</Tag>
      default:
        return <Tag>{status}</Tag>
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '申报政策',
      dataIndex: 'policyName',
      key: 'policyName',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '申报软件',
      dataIndex: 'softwareName',
      key: 'softwareName',
    },
    {
      title: '合同金额',
      dataIndex: 'contractAmount',
      key: 'contractAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '申请补贴',
      dataIndex: 'subsidyAmount',
      key: 'subsidyAmount',
      render: (amount: number) => (
        <span style={{ color: '#F56C6C', fontWeight: 600 }}>
          ¥{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '提交时间',
      dataIndex: 'submitDate',
      key: 'submitDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRecord(record)
              setIsDetailModalOpen(true)
            }}
          >
            查看
          </Button>
          {record.status === SUBSIDY_STATUS.REJECTED && (
            <Button type="link" size="small">
              重新申报
            </Button>
          )}
        </Space>
      ),
    },
  ]

  // 审核进度步骤
  const auditSteps = [
    { title: '提交申报', description: '企业提交申报材料' },
    { title: '一级审核', description: '初审人员审核' },
    { title: '二级审核', description: '复审人员审核' },
    { title: '最终审核', description: '终审人员审核' },
  ]

  // 审核时间线
  const auditTimeline = [
    {
      content: '申报提交成功',
      time: '2026-03-10 14:30',
      icon: <CheckCircleOutlined style={{ color: '#00A870' }} />,
    },
    {
      content: '一级审核通过',
      time: '2026-03-12 10:15',
      icon: <CheckCircleOutlined style={{ color: '#00A870' }} />,
    },
    {
      content: '一级审核中',
      time: '进行中',
      icon: <ClockCircleOutlined style={{ color: '#0052D9' }} />,
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/enterprise')}>
          返回工作台
        </Button>
      </div>

      <Card
        title="我的补贴申报"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/enterprise/subsidy/apply')}
          >
            申报补贴
          </Button>
        }
        style={{ borderRadius: '8px' }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={8}>
            <Search
              placeholder="搜索政策名称、软件名称"
              allowClear
              enterButton={<><SearchOutlined /> 搜索</>}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Select
              value={status}
              onChange={setStatus}
              style={{ width: '100%' }}
              placeholder="选择状态"
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待审核</Option>
              <Option value="reviewing">审核中</Option>
              <Option value="approved">审核通过</Option>
              <Option value="rejected">已驳回</Option>
              <Option value="used">已使用</Option>
              <Option value="refunded">已退还</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={subsidyList}
          rowKey="id"
          pagination={{
            total: subsidyList.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="申报详情"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={720}
      >
        {selectedRecord && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '16px' }}>审核进度</h4>
              <Steps
                current={selectedRecord.currentLevel - 1}
                direction="horizontal"
                size="small"
                items={auditSteps.map((step) => ({ title: step.title, description: step.description }))}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '16px' }}>审核记录</h4>
              <Timeline>
                {auditTimeline.map((item, index) => (
                  <Timeline.Item key={index} dot={item.icon}>
                    <div>{item.content}</div>
                    <div style={{ color: '#86909C', fontSize: '12px' }}>{item.time}</div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>

            <div style={{ background: '#F5F7FA', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '16px' }}>申报信息</h4>
              <p><strong>申报政策：</strong>{selectedRecord.policyName}</p>
              <p><strong>申报软件：</strong>{selectedRecord.softwareName}</p>
              <p><strong>合同金额：</strong>¥{selectedRecord.contractAmount.toLocaleString()}</p>
              <p><strong>申请补贴：</strong>¥{selectedRecord.subsidyAmount.toLocaleString()}</p>
              <p><strong>补贴比例：</strong>{((selectedRecord.subsidyAmount / selectedRecord.contractAmount) * 100).toFixed(0)}%</p>
              <p><strong>提交时间：</strong>{selectedRecord.submitDate}</p>
              {selectedRecord.status === SUBSIDY_STATUS.REFUNDED && (
                <>
                  <p><strong>退还日期：</strong>{selectedRecord.refundDate}</p>
                  <p><strong>退还原因：</strong>{selectedRecord.refundReason}</p>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

    </div>
  )
}

export default MySubsidies
