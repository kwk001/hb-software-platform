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
  DatePicker,
  message,
} from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

// 操作类型
const operationTypes = [
  { value: 'all', label: '全部类型' },
  { value: 'create', label: '新增' },
  { value: 'update', label: '修改' },
  { value: 'delete', label: '删除' },
  { value: 'query', label: '查询' },
  { value: 'audit', label: '审核' },
  { value: 'login', label: '登录' },
  { value: 'logout', label: '登出' },
]

// 操作状态
const operationStatuses = [
  { value: 'all', label: '全部状态' },
  { value: 'success', label: '成功', color: 'success' },
  { value: 'fail', label: '失败', color: 'error' },
]

// 模拟操作日志数据
const logList = [
  {
    id: 1,
    username: 'admin',
    realName: '系统管理员',
    operationType: 'audit',
    operationDesc: '审核企业入驻申请',
    operationDetail: '审核通过：武汉智造科技有限公司',
    requestMethod: 'POST',
    requestUrl: '/api/enterprise/audit',
    requestParams: '{"id": 123, "status": "approved"}',
    ip: '192.168.1.100',
    location: '湖北省武汉市',
    status: 'success',
    duration: 120,
    createTime: '2026-03-13 10:30:15',
  },
  {
    id: 2,
    username: 'admin',
    realName: '系统管理员',
    operationType: 'update',
    operationDesc: '修改政策信息',
    operationDetail: '修改政策：2026年度湖北省工业软件补贴券',
    requestMethod: 'PUT',
    requestUrl: '/api/policy/456',
    requestParams: '{"title": "2026年度湖北省工业软件补贴券", "amount": 5000000}',
    ip: '192.168.1.100',
    location: '湖北省武汉市',
    status: 'success',
    duration: 85,
    createTime: '2026-03-13 10:25:30',
  },
  {
    id: 3,
    username: 'zhangsan',
    realName: '张三',
    operationType: 'create',
    operationDesc: '新增软件产品',
    operationDetail: '新增软件：智能制造MES系统 V2.0',
    requestMethod: 'POST',
    requestUrl: '/api/software',
    requestParams: '{"name": "智能制造MES系统 V2.0", "category": "MES"}',
    ip: '192.168.1.105',
    location: '湖北省襄阳市',
    status: 'success',
    duration: 200,
    createTime: '2026-03-13 10:20:00',
  },
  {
    id: 4,
    username: 'lisi',
    realName: '李四',
    operationType: 'delete',
    operationDesc: '删除草稿',
    operationDetail: '删除软件发布草稿：未命名软件_2026/3/12',
    requestMethod: 'DELETE',
    requestUrl: '/api/software/draft/789',
    requestParams: '{}',
    ip: '192.168.1.110',
    location: '湖北省宜昌市',
    status: 'success',
    duration: 45,
    createTime: '2026-03-13 10:15:20',
  },
  {
    id: 5,
    username: 'admin',
    realName: '系统管理员',
    operationType: 'audit',
    operationDesc: '审核补贴券申请',
    operationDetail: '审核驳回：补贴券申报金额超出限额',
    requestMethod: 'POST',
    requestUrl: '/api/subsidy/audit',
    requestParams: '{"id": 321, "status": "rejected", "reason": "金额超限"}',
    ip: '192.168.1.100',
    location: '湖北省武汉市',
    status: 'success',
    duration: 150,
    createTime: '2026-03-13 10:10:05',
  },
  {
    id: 6,
    username: 'wangwu',
    realName: '王五',
    operationType: 'query',
    operationDesc: '查询软件列表',
    operationDetail: '查询条件：{category: "MES", status: "approved"}',
    requestMethod: 'GET',
    requestUrl: '/api/software/list',
    requestParams: '?category=MES&status=approved',
    ip: '192.168.1.115',
    location: '湖北省黄石市',
    status: 'success',
    duration: 60,
    createTime: '2026-03-13 10:05:30',
  },
  {
    id: 7,
    username: 'admin',
    realName: '系统管理员',
    operationType: 'update',
    operationDesc: '修改用户权限',
    operationDetail: '修改用户 zhangsan 的角色权限',
    requestMethod: 'PUT',
    requestUrl: '/api/user/role',
    requestParams: '{"userId": 456, "roles": ["enterprise"] }',
    ip: '192.168.1.100',
    location: '湖北省武汉市',
    status: 'fail',
    duration: 30,
    createTime: '2026-03-13 10:00:15',
  },
]

const OperationLog = () => {
  const [operationType, setOperationType] = useState('all')
  const [status, setStatus] = useState('all')
  const [searchText, setSearchText] = useState('')

  const getOperationTypeTag = (type: string) => {
    switch (type) {
      case 'create':
        return <Tag color="success">新增</Tag>
      case 'update':
        return <Tag color="warning">修改</Tag>
      case 'delete':
        return <Tag color="error">删除</Tag>
      case 'query':
        return <Tag color="blue">查询</Tag>
      case 'audit':
        return <Tag color="purple">审核</Tag>
      case 'login':
        return <Tag color="cyan">登录</Tag>
      case 'logout':
        return <Tag color="default">登出</Tag>
      default:
        return <Tag>{type}</Tag>
    }
  }

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'success':
        return <Tag color="success" icon={<CheckCircleOutlined />}>成功</Tag>
      case 'fail':
        return <Tag color="error" icon={<CloseCircleOutlined />}>失败</Tag>
      default:
        return <Tag>{status}</Tag>
    }
  }

  const columns = [
    {
      title: '操作人',
      dataIndex: 'realName',
      key: 'realName',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.username}</div>
        </div>
      ),
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      key: 'operationType',
      render: (type: string) => getOperationTypeTag(type),
    },
    {
      title: '操作描述',
      dataIndex: 'operationDesc',
      key: 'operationDesc',
      render: (text: string, record: any) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{record.operationDetail}</div>
        </div>
      ),
    },
    {
      title: '请求信息',
      key: 'request',
      render: (_: any, record: any) => (
        <div>
          <Tag color="blue">{record.requestMethod}</Tag>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{record.requestUrl}</div>
        </div>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      render: (ip: string, record: any) => (
        <div>
          <div>{ip}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{record.location}</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '耗时(ms)',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number) => (
        <span style={{ color: duration > 100 ? '#ff4d4f' : '#52c41a' }}>{duration}ms</span>
      ),
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ]

  const handleExport = () => {
    message.success('操作日志已导出')
  }

  const filteredData = logList.filter(item => {
    if (operationType !== 'all' && item.operationType !== operationType) return false
    if (status !== 'all' && item.status !== status) return false
    if (searchText && !item.operationDesc.includes(searchText) && !item.realName.includes(searchText)) return false
    return true
  })

  return (
    <div>
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Search
              placeholder="搜索操作人或操作描述"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              enterButton={<><SearchOutlined /> 搜索</>}
            />
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Select
              value={operationType}
              onChange={setOperationType}
              style={{ width: '100%' }}
              placeholder="操作类型"
            >
              {operationTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Select
              value={status}
              onChange={setStatus}
              style={{ width: '100%' }}
              placeholder="操作状态"
            >
              {operationStatuses.map(s => (
                <Option key={s.value} value={s.value}>{s.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
          </Col>
          <Col xs={24} sm={12} lg={3}>
            <Space>
              <Button icon={<ReloadOutlined />}>
                刷新
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: '12px' }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}

export default OperationLog
