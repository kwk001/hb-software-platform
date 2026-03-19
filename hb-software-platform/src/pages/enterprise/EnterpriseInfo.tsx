import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Tag,
  Space,
  Typography,
  Divider,
  Row,
  Col,
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
              style={{ 
                borderRadius: 10,
                height: 40,
                borderColor: '#cbd5e1',
                color: '#64748b',
              }}
            >
              返回工作台
            </Button>
            <div>
              <Title level={4} style={{ margin: 0, color: '#1e293b', fontWeight: 600 }}>
                企业信息
              </Title>
              <Text style={{ color: '#64748b', fontSize: 13 }}>
                查看和管理您的企业信息
              </Text>
            </div>
          </Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate('/enterprise/info/edit')}
            style={{ 
              borderRadius: 10, 
              height: 44, 
              padding: '0 28px',
              background: '#4f46e5',
              borderColor: '#4f46e5',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
            }}
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
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              background: userInfo.applyStatus === 'approved' 
                ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                : userInfo.applyStatus === 'pending'
                ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
                : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: userInfo.applyStatus === 'approved' 
                    ? '#22c55e'
                    : userInfo.applyStatus === 'pending'
                    ? '#f59e0b'
                    : '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: userInfo.applyStatus === 'approved'
                    ? '0 4px 14px rgba(34, 197, 94, 0.4)'
                    : userInfo.applyStatus === 'pending'
                    ? '0 4px 14px rgba(245, 158, 11, 0.4)'
                    : '0 4px 14px rgba(239, 68, 68, 0.4)',
                }}
              >
                {userInfo.applyStatus === 'approved' ? (
                  <CheckCircleOutlined style={{ color: '#fff', fontSize: 28 }} />
                ) : userInfo.applyStatus === 'pending' ? (
                  <ClockCircleOutlined style={{ color: '#fff', fontSize: 28 }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#fff', fontSize: 28 }} />
                )}
              </div>
              <div>
                <Text style={{ color: '#64748b', fontSize: 13, display: 'block', marginBottom: 4 }}>
                  入驻状态
                </Text>
                <Text style={{ 
                  fontSize: 22, 
                  fontWeight: 700,
                  color: userInfo.applyStatus === 'approved' 
                    ? '#16a34a'
                    : userInfo.applyStatus === 'pending'
                    ? '#d97706'
                    : '#dc2626',
                }}>
                  {userInfo.applyStatus === 'approved' ? '已入驻' : userInfo.applyStatus === 'pending' ? '待审核' : '已拒绝'}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              background: userInfo.enterpriseType === 'supply'
                ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: userInfo.enterpriseType === 'supply' ? '#22c55e' : '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: userInfo.enterpriseType === 'supply'
                    ? '0 4px 14px rgba(34, 197, 94, 0.4)'
                    : '0 4px 14px rgba(59, 130, 246, 0.4)',
                }}
              >
                <ShopOutlined style={{ color: '#fff', fontSize: 28 }} />
              </div>
              <div>
                <Text style={{ color: '#64748b', fontSize: 13, display: 'block', marginBottom: 4 }}>
                  企业类型
                </Text>
                <Text style={{ 
                  fontSize: 22, 
                  fontWeight: 700,
                  color: userInfo.enterpriseType === 'supply' ? '#16a34a' : '#2563eb',
                }}>
                  {getEnterpriseTypeText(userInfo.enterpriseType)}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
                }}
              >
                <SafetyCertificateOutlined style={{ color: '#fff', fontSize: 28 }} />
              </div>
              <div>
                <Text style={{ color: '#64748b', fontSize: 13, display: 'block', marginBottom: 4 }}>
                  入驻时间
                </Text>
                <Text style={{ fontSize: 20, fontWeight: 700, color: '#7c3aed' }}>
                  {userInfo.applyTime ? new Date(userInfo.applyTime).toLocaleDateString('zh-CN') : '-'}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 企业详细信息 */}
      <Card
        style={{
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          background: '#fff',
        }}
        bodyStyle={{ padding: '32px' }}
      >
        {/* 企业基本信息 */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
              }}
            >
              <ShopOutlined style={{ color: '#fff', fontSize: 20 }} />
            </div>
            <div>
              <Text style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', display: 'block' }}>
                企业基本信息
              </Text>
              <Text style={{ fontSize: 13, color: '#64748b' }}>
                企业的核心注册信息
              </Text>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
            <div style={{ 
              padding: '16px 20px', 
              background: '#f8fafc', 
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
                <ShopOutlined style={{ marginRight: 6 }} /> 企业名称
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                {userInfo.enterpriseInfo?.enterpriseName || '-'}
              </Text>
            </div>

            <div style={{ 
              padding: '16px 20px', 
              background: '#f8fafc', 
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
                <CreditCardOutlined style={{ marginRight: 6 }} /> 统一社会信用代码
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                {userInfo.enterpriseInfo?.creditCode || '-'}
              </Text>
            </div>

            <div style={{ 
              padding: '16px 20px', 
              background: '#f8fafc', 
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
                <Tag color={getEnterpriseTypeColor(userInfo.enterpriseType)} style={{ marginRight: 6 }}>企业类型</Tag>
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                {getEnterpriseTypeText(userInfo.enterpriseType)}
              </Text>
            </div>

            <div style={{ 
              padding: '16px 20px', 
              background: '#f8fafc', 
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
                <SafetyCertificateOutlined style={{ marginRight: 6 }} /> 入驻状态
              </Text>
              <div>{getStatusTag(userInfo.applyStatus)}</div>
            </div>
          </div>
        </div>

        <Divider style={{ margin: '32px 0', borderColor: '#e2e8f0' }} />

        {/* 联系人信息 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
              }}
            >
              <UserOutlined style={{ color: '#fff', fontSize: 20 }} />
            </div>
            <div>
              <Text style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', display: 'block' }}>
                联系人信息
              </Text>
              <Text style={{ fontSize: 13, color: '#64748b' }}>
                企业联系人的详细信息
              </Text>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' }}>
            <div style={{ 
              padding: '16px 20px', 
              background: '#f8fafc', 
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
                <UserOutlined style={{ marginRight: 6 }} /> 联系人姓名
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                {userInfo.enterpriseInfo?.contactName || '-'}
              </Text>
            </div>

            <div style={{ 
              padding: '16px 20px', 
              background: '#f8fafc', 
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
                <PhoneOutlined style={{ marginRight: 6 }} /> 手机号
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                {phone}
              </Text>
            </div>

            <div style={{ 
              padding: '16px 20px', 
              background: '#f8fafc', 
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
                <MailOutlined style={{ marginRight: 6 }} /> 联系人邮箱
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                {userInfo.enterpriseInfo?.contactEmail || '-'}
              </Text>
            </div>

            <div style={{ 
              padding: '16px 20px', 
              background: '#f8fafc', 
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}>
              <Text style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>
                <SafetyCertificateOutlined style={{ marginRight: 6 }} /> 注册时间
              </Text>
              <Text style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>
                {userInfo.registerTime ? new Date(userInfo.registerTime).toLocaleString('zh-CN') : '-'}
              </Text>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
