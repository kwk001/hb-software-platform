import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Descriptions,
  Button,
  Tag,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Statistic,
} from 'antd'
import {
  EditOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  CreditCardOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

interface EnterpriseInfo {
  enterpriseName: string
  creditCode: string
  contactName: string
  contactEmail: string
}

interface UserInfo {
  password: string
  enterpriseType: string
  enterpriseInfo: EnterpriseInfo
  applyStatus: 'pending' | 'approved' | 'rejected'
  registerTime: string
  applyTime: string
}

export default function EnterpriseInfo() {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [phone, setPhone] = useState('')

  useEffect(() => {
    // 获取当前登录用户
    const currentUserStr = localStorage.getItem('currentUser')
    console.log('currentUser:', currentUserStr)
    if (!currentUserStr) {
      navigate('/login')
      return
    }

    const currentUser = JSON.parse(currentUserStr)
    const username = currentUser.username

    // 获取用户详细信息
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
    console.log('registeredUsers:', registeredUsers)
    const user = registeredUsers[username]
    console.log('user:', user)

    if (!user) {
      navigate('/login')
      return
    }

    setPhone(username)
    setUserInfo(user)
  }, [navigate])

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            已入驻
          </Tag>
        )
      case 'pending':
        return (
          <Tag color="warning" icon={<ClockCircleOutlined />}>
            待审核
          </Tag>
        )
      case 'rejected':
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            已拒绝
          </Tag>
        )
      default:
        return <Tag>未知</Tag>
    }
  }

  const getEnterpriseTypeText = (type: string) => {
    return type === 'supply' ? '工业软件企业' : '工业制造企业'
  }

  const getEnterpriseTypeColor = (type: string) => {
    return type === 'supply' ? 'green' : 'blue'
  }

  if (!userInfo) {
    return null
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Space size={16} align="center">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/enterprise')}
              style={{ borderRadius: 8 }}
            >
              返回工作台
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              企业信息
            </Title>
          </Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate('/enterprise/info/edit')}
            style={{ borderRadius: 8, height: 40, padding: '0 24px' }}
          >
            编辑信息
          </Button>
        </div>
      </Card>

      {/* 企业状态卡片 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Statistic
              title="入驻状态"
              value={userInfo.applyStatus === 'approved' ? '已入驻' : userInfo.applyStatus === 'pending' ? '待审核' : '已拒绝'}
              valueStyle={{
                color: userInfo.applyStatus === 'approved' ? '#52c41a' : userInfo.applyStatus === 'pending' ? '#faad14' : '#f5222d',
                fontSize: 24,
                fontWeight: 600,
              }}
              prefix={
                userInfo.applyStatus === 'approved' ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : userInfo.applyStatus === 'pending' ? (
                  <ClockCircleOutlined style={{ color: '#faad14' }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#f5222d' }} />
                )
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Statistic
              title="企业类型"
              value={getEnterpriseTypeText(userInfo.enterpriseType)}
              valueStyle={{
                color: userInfo.enterpriseType === 'supply' ? '#52c41a' : '#1677ff',
                fontSize: 24,
                fontWeight: 600,
              }}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Statistic
              title="入驻时间"
              value={userInfo.applyTime ? new Date(userInfo.applyTime).toLocaleDateString('zh-CN') : '-'}
              valueStyle={{
                fontSize: 20,
                fontWeight: 600,
              }}
              prefix={<SafetyCertificateOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 企业详细信息 */}
      <Card
        title={
          <Space>
            <ShopOutlined style={{ color: '#1677ff' }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>企业基本信息</span>
          </Space>
        }
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
      >
        <Descriptions
          column={2}
          labelStyle={{
            fontWeight: 500,
            color: 'var(--text-tertiary)',
            width: 140,
          }}
          contentStyle={{
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}
        >
          <Descriptions.Item label={<Space><ShopOutlined /> 企业名称</Space>}>
            {userInfo.enterpriseInfo?.enterpriseName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><CreditCardOutlined /> 统一社会信用代码</Space>}>
            {userInfo.enterpriseInfo?.creditCode || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><Tag color={getEnterpriseTypeColor(userInfo.enterpriseType)}>企业类型</Tag></Space>}>
            {getEnterpriseTypeText(userInfo.enterpriseType)}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><SafetyCertificateOutlined /> 入驻状态</Space>}>
            {getStatusTag(userInfo.applyStatus)}
          </Descriptions.Item>
        </Descriptions>

        <Divider style={{ margin: '24px 0', borderColor: 'var(--border-light)' }} />

        <Title level={5} style={{ marginBottom: 16, color: 'var(--text-primary)' }}>
          <Space>
            <UserOutlined style={{ color: 'var(--brand-primary)' }} />
            联系人信息
          </Space>
        </Title>

        <Descriptions
          column={2}
          labelStyle={{
            fontWeight: 500,
            color: 'var(--text-tertiary)',
            width: 140,
          }}
          contentStyle={{
            fontWeight: 500,
            color: 'var(--text-primary)',
          }}
        >
          <Descriptions.Item label={<Space><UserOutlined /> 联系人姓名</Space>}>
            {userInfo.enterpriseInfo?.contactName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><PhoneOutlined /> 手机号</Space>}>
            {phone}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><MailOutlined /> 联系人邮箱</Space>}>
            {userInfo.enterpriseInfo?.contactEmail || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={<Space><SafetyCertificateOutlined /> 注册时间</Space>}>
            {userInfo.registerTime ? new Date(userInfo.registerTime).toLocaleString('zh-CN') : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
