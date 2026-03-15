import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Typography,
  message,
  Row,
  Col,
  Divider,
  Alert,
} from 'antd'
import {
  SaveOutlined,
  ArrowLeftOutlined,
  ShopOutlined,
  CreditCardOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
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

export default function EnterpriseInfoEdit() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [phone, setPhone] = useState('')

  useEffect(() => {
    // 获取当前登录用户
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) {
      navigate('/login')
      return
    }

    const currentUser = JSON.parse(currentUserStr)
    const username = currentUser.username

    // 获取用户详细信息
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
    const user = registeredUsers[username]

    if (!user) {
      navigate('/login')
      return
    }

    setPhone(username)
    setUserInfo(user)

    // 设置表单初始值
    form.setFieldsValue({
      enterpriseName: user.enterpriseInfo?.enterpriseName || '',
      creditCode: user.enterpriseInfo?.creditCode || '',
      contactName: user.enterpriseInfo?.contactName || '',
      contactEmail: user.enterpriseInfo?.contactEmail || '',
      phone: username,
    })
  }, [navigate, form])

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      // 获取已注册用户列表
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
      const user = registeredUsers[phone]

      if (!user) {
        message.error('用户信息不存在')
        setLoading(false)
        return
      }

      // 更新企业信息
      const updatedUser = {
        ...user,
        enterpriseInfo: {
          enterpriseName: values.enterpriseName,
          creditCode: values.creditCode,
          contactName: values.contactName,
          contactEmail: values.contactEmail,
        },
        // 更新入驻状态为待审核（如果修改了关键信息）
        applyStatus: 'approved', // 保持已入驻状态
        updateTime: new Date().toISOString(),
      }

      registeredUsers[phone] = updatedUser
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))

      message.success('企业信息更新成功')
      navigate('/enterprise/info')
    } catch (error) {
      console.error('更新失败:', error)
      message.error('更新失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const getEnterpriseTypeText = (type: string) => {
    return type === 'supply' ? '工业软件企业' : '工业制造企业'
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
              onClick={() => navigate('/enterprise/info')}
              style={{ borderRadius: 8 }}
            >
              返回
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              编辑企业信息
            </Title>
          </Space>
        </div>
      </Card>

      <Row gutter={24}>
        <Col span={16}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Alert
              message="信息修改提示"
              description="修改企业信息后，平台将重新审核您的企业资质。审核期间不影响正常使用。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Divider>
                <Space>
                  <ShopOutlined style={{ color: '#1677ff' }} />
                  <span style={{ fontWeight: 600 }}>企业基本信息</span>
                </Space>
              </Divider>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="enterpriseName"
                    label="企业名称"
                    rules={[
                      { required: true, message: '请输入企业名称' },
                      { max: 100, message: '企业名称不能超过100个字符' },
                    ]}
                  >
                    <Input
                      prefix={<ShopOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="请输入企业全称"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="creditCode"
                    label="统一社会信用代码"
                    rules={[
                      { required: true, message: '请输入统一社会信用代码' },
                      { pattern: /^[A-Z0-9]{18}$/, message: '请输入18位统一社会信用代码' },
                    ]}
                  >
                    <Input
                      prefix={<CreditCardOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="请输入18位统一社会信用代码"
                      size="large"
                      maxLength={18}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="企业类型">
                <Input
                  prefix={<SafetyCertificateOutlined style={{ color: '#bfbfbf' }} />}
                  value={getEnterpriseTypeText(userInfo.enterpriseType)}
                  size="large"
                  disabled
                />
                <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                  企业类型不可修改，如需修改请联系平台管理员
                </Text>
              </Form.Item>

              <Divider>
                <Space>
                  <UserOutlined style={{ color: '#1677ff' }} />
                  <span style={{ fontWeight: 600 }}>联系人信息</span>
                </Space>
              </Divider>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="contactName"
                    label="联系人姓名"
                    rules={[
                      { required: true, message: '请输入联系人姓名' },
                      { max: 50, message: '联系人姓名不能超过50个字符' },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="请输入联系人姓名"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="phone" label="手机号">
                    <Input
                      prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                      size="large"
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="contactEmail"
                label="联系人邮箱"
                rules={[
                  { required: true, message: '请输入联系人邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="请输入联系人邮箱"
                  size="large"
                />
              </Form.Item>

              <Divider />

              <Form.Item style={{ marginBottom: 0 }}>
                <Space size={16}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<SaveOutlined />}
                    loading={loading}
                    style={{ borderRadius: 8, height: 44, padding: '0 32px' }}
                  >
                    保存修改
                  </Button>
                  <Button
                    size="large"
                    onClick={() => navigate('/enterprise/info')}
                    style={{ borderRadius: 8, height: 44, padding: '0 32px' }}
                  >
                    取消
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="修改须知"
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div>
                <Text strong>1. 企业名称</Text>
                <br />
                <Text type="secondary">请填写与营业执照一致的企业全称</Text>
              </div>
              <div>
                <Text strong>2. 统一社会信用代码</Text>
                <br />
                <Text type="secondary">18位字母数字组合，请仔细核对</Text>
              </div>
              <div>
                <Text strong>3. 联系人信息</Text>
                <br />
                <Text type="secondary">用于接收平台通知和审核结果</Text>
              </div>
              <div>
                <Text strong>4. 企业类型</Text>
                <br />
                <Text type="secondary">企业类型不可自行修改，如需修改请联系客服</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
