import { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Space,
  Typography,
  Table,
  Tag,
  message,
  Alert,
  Descriptions,
  Divider,
} from 'antd'
import {
  DatabaseOutlined,
  SyncOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import {
  migrateUserData,
  getAllUsers,
  clearAllUsers,
  type UserInfo,
} from '../../utils/migrateUserData'

const { Title, Text } = Typography

export default function DataMigration() {
  const [users, setUsers] = useState<Record<string, UserInfo> | null>(null)
  const [loading, setLoading] = useState(false)

  const loadUsers = () => {
    const data = getAllUsers()
    setUsers(data)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleMigrate = () => {
    setLoading(true)
    setTimeout(() => {
      migrateUserData()
      loadUsers()
      setLoading(false)
      message.success('数据迁移完成')
    }, 500)
  }

  const handleClear = () => {
    if (window.confirm('确定要清除所有用户数据吗？此操作不可恢复！')) {
      clearAllUsers()
      loadUsers()
      message.success('数据已清除')
    }
  }

  const getStatusTag = (status?: string) => {
    if (status === 'approved') {
      return <Tag color="success">已入驻</Tag>
    } else if (status === 'pending') {
      return <Tag color="warning">待审核</Tag>
    } else if (status === 'rejected') {
      return <Tag color="error">已拒绝</Tag>
    }
    return <Tag>未设置</Tag>
  }

  const columns = [
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '企业类型',
      dataIndex: 'enterpriseType',
      key: 'enterpriseType',
      render: (type: string) => (type === 'supply' ? '工业软件企业' : '工业制造企业'),
    },
    {
      title: '入驻状态',
      dataIndex: 'applyStatus',
      key: 'applyStatus',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '企业信息',
      key: 'enterpriseInfo',
      render: (_: any, record: UserInfo) => {
        const info = record.enterpriseInfo
        if (!info || (!info.enterpriseName && !info.creditCode)) {
          return <Tag color="error">缺失</Tag>
        }
        return <Tag color="success">完整</Tag>
      },
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
      render: (time: string) => (time ? new Date(time).toLocaleString('zh-CN') : '-'),
    },
  ]

  const tableData = users
    ? Object.keys(users).map((phone) => ({
        key: phone,
        phone,
        ...users[phone],
      }))
    : []

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <Space>
            <DatabaseOutlined />
            <span>数据迁移工具</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Alert
          message="使用说明"
          description="此工具用于更新旧版本注册的用户数据，添加缺失的 applyStatus 和 enterpriseInfo 字段。迁移后，已注册用户将能正常查看企业信息。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Space size={16}>
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={handleMigrate}
            loading={loading}
            size="large"
          >
            执行数据迁移
          </Button>
          <Button icon={<EyeOutlined />} onClick={loadUsers} size="large">
            刷新数据
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleClear}
            size="large"
          >
            清除所有数据
          </Button>
        </Space>
      </Card>

      <Card
        title={
          <Space>
            <EyeOutlined />
            <span>用户数据列表</span>
          </Space>
        }
      >
        {users && Object.keys(users).length > 0 ? (
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            expandable={{
              expandedRowRender: (record: any) => {
                const info = record.enterpriseInfo
                return (
                  <Descriptions
                    title="企业详细信息"
                    bordered
                    column={2}
                    size="small"
                  >
                    <Descriptions.Item label="企业名称">
                      {info?.enterpriseName || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="统一社会信用代码">
                      {info?.creditCode || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="联系人姓名">
                      {info?.contactName || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="联系人邮箱">
                      {info?.contactEmail || '-'}
                    </Descriptions.Item>
                  </Descriptions>
                )
              },
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <ExclamationCircleOutlined
              style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }}
            />
            <Text type="secondary">暂无用户数据</Text>
          </div>
        )}
      </Card>
    </div>
  )
}
