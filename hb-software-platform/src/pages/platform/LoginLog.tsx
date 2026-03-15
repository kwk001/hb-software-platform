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
  CheckCircleOutlined,
  CloseCircleOutlined,
  DesktopOutlined,
  MobileOutlined,
} from '@ant-design/icons'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

// 登录状态
const loginStatuses = [
  { value: 'all', label: '全部状态' },
  { value: 'success', label: '成功', color: 'success' },
  { value: 'fail', label: '失败', color: 'error' },
]

// 模拟登录日志数据
const loginLogList = [
  {
    id: 1,
    username: 'admin',
    realName: '系统管理员',
    loginType: 'account',
    ip: '192.168.1.100',
    location: '湖北省武汉市',
    browser: 'Chrome 120.0',
    os: 'Windows 10',
    device: 'desktop',
    status: 'success',
    message: '登录成功',
    loginTime: '2026-03-13 10:30:15',
  },
  {
    id: 2,
    username: 'zhangsan',
    realName: '张三',
    loginType: 'account',
    ip: '192.168.1.105',
    location: '湖北省襄阳市',
    browser: 'Firefox 121.0',
    os: 'Windows 11',
    device: 'desktop',
    status: 'success',
    message: '登录成功',
    loginTime: '2026-03-13 10:25:30',
  },
  {
    id: 3,
    username: 'lisi',
    realName: '李四',
    loginType: 'sms',
    ip: '192.168.1.110',
    location: '湖北省宜昌市',
    browser: 'Safari 17.0',
    os: 'iOS 17.0',
    device: 'mobile',
    status: 'success',
    message: '登录成功',
    loginTime: '2026-03-13 10:20:00',
  },
  {
    id: 4,
    username: 'wangwu',
    realName: '王五',
    loginType: 'account',
    ip: '192.168.1.115',
    location: '湖北省黄石市',
    browser: 'Chrome 120.0',
    os: 'macOS 14.0',
    device: 'desktop',
    status: 'fail',
    message: '密码错误',
    loginTime: '2026-03-13 10:15:20',
  },
  {
    id: 5,
    username: 'admin',
    realName: '系统管理员',
    loginType: 'account',
    ip: '192.168.1.100',
    location: '湖北省武汉市',
    browser: 'Edge 120.0',
    os: 'Windows 10',
    device: 'desktop',
    status: 'success',
    message: '登录成功',
    loginTime: '2026-03-13 09:30:15',
  },
  {
    id: 6,
    username: 'zhaoliu',
    realName: '赵六',
    loginType: 'account',
    ip: '192.168.1.120',
    location: '湖北省荆州市',
    browser: 'Chrome 120.0',
    os: 'Android 14',
    device: 'mobile',
    status: 'fail',
    message: '账号被锁定',
    loginTime: '2026-03-13 09:20:00',
  },
  {
    id: 7,
    username: 'admin',
    realName: '系统管理员',
    loginType: 'account',
    ip: '192.168.1.100',
    location: '湖北省武汉市',
    browser: 'Chrome 120.0',
    os: 'Windows 10',
    device: 'desktop',
    status: 'success',
    message: '登录成功',
    loginTime: '2026-03-13 09:00:00',
  },
]

const LoginLog = () => {
  const [status, setStatus] = useState('all')
  const [searchText, setSearchText] = useState('')

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

  const getDeviceIcon = (device: string) => {
    return device === 'mobile' ? <MobileOutlined /> : <DesktopOutlined />
  }

  const columns = [
    {
      title: '用户',
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
      title: '登录方式',
      dataIndex: 'loginType',
      key: 'loginType',
      render: (type: string) => (
        <Tag color={type === 'sms' ? 'blue' : 'default'}>
          {type === 'sms' ? '短信验证码' : '账号密码'}
        </Tag>
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
      title: '设备信息',
      key: 'device',
      render: (_: any, record: any) => (
        <div>
          <Space>
            {getDeviceIcon(record.device)}
            <span>{record.browser}</span>
          </Space>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{record.os}</div>
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
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      render: (text: string, record: any) => (
        <span style={{ color: record.status === 'fail' ? '#ff4d4f' : '#52c41a' }}>{text}</span>
      ),
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
    },
  ]

  const handleExport = () => {
    message.success('登录日志已导出')
  }

  const filteredData = loginLogList.filter(item => {
    if (status !== 'all' && item.status !== status) return false
    if (searchText && !item.realName.includes(searchText) && !item.username.includes(searchText)) return false
    return true
  })

  return (
    <div>
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Search
              placeholder="搜索用户名或姓名"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              enterButton={<><SearchOutlined /> 搜索</>}
            />
          </Col>
          <Col xs={24} sm={12} lg={5}>
            <Select
              value={status}
              onChange={setStatus}
              style={{ width: '100%' }}
              placeholder="登录状态"
            >
              {loginStatuses.map(s => (
                <Option key={s.value} value={s.value}>{s.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
          </Col>
          <Col xs={24} sm={12} lg={5} style={{ textAlign: 'right' }}>
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

export default LoginLog
