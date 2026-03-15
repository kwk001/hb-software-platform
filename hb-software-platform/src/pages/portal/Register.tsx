import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Steps,
  Radio,
  Space,
  Checkbox,
  message,
  Alert,
} from 'antd'
import {
  MobileOutlined,
  SafetyOutlined,
  LockOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography


export default function Register() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [enterpriseType, setEnterpriseType] = useState('demand')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [enterpriseTypeValue, setEnterpriseTypeValue] = useState('demand')

  const sendCode = () => {
    if (countdown > 0) return
    setCountdown(60)
    message.success('验证码已发送')
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleNext = async () => {
    try {
      await form.validateFields()
      if (currentStep === 0) {
        // 保存手机号和密码
        const values = form.getFieldsValue()
        setPhoneNumber(values.phone)
        setPasswordValue(values.password)
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
          setCurrentStep(1)
        }, 500)
      } else if (currentStep === 1) {
        // 保存企业类型
        const values = form.getFieldsValue()
        if (values.enterpriseType) {
          setEnterpriseType(values.enterpriseType)
          setEnterpriseTypeValue(values.enterpriseType)
        }
        setCurrentStep(2)
      } else if (currentStep === 2) {
        // 第2步点击下一步时，直接提交
        // 企业信息在handleSubmit中获取
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields()
      setLoading(true)
      setTimeout(() => {
        setLoading(false)

        // 保存用户信息到 registeredUsers（支持多用户）
        const formValues = form.getFieldsValue()
        const phone = phoneNumber || formValues.phone
        const password = passwordValue || formValues.password
        
        // 验证必要字段
        if (!phone) {
          console.error('注册失败：手机号为空')
          message.error('注册信息不完整，请返回第1步重新填写手机号')
          setLoading(false)
          return
        }
        if (!password) {
          console.error('注册失败：密码为空')
          message.error('注册信息不完整，请返回第1步重新设置密码')
          setLoading(false)
          return
        }
        
        // 调试信息
        console.log('注册提交数据:', {
          phone,
          password,
          phoneNumber,
          passwordValue,
          formValues,
          enterpriseType: formValues.enterpriseType || enterpriseTypeValue
        })

        // 直接使用表单值，不依赖state
        const finalEnterpriseType = formValues.enterpriseType || enterpriseTypeValue || 'demand'
        console.log('最终企业类型:', finalEnterpriseType)

        const userInfo = {
          password: password,
          // 直接使用表单值
          enterpriseType: finalEnterpriseType,
          // 企业入驻信息 - 直接从表单获取
          enterpriseInfo: {
            enterpriseName: formValues.enterpriseName || '',
            creditCode: formValues.creditCode || '',
            contactName: formValues.contactName || '',
            contactEmail: formValues.contactEmail || '',
          },
          // 入驻状态：pending-待审核, approved-已通过, rejected-已拒绝
          applyStatus: 'approved', // 注册即视为已入驻
          registerTime: new Date().toISOString(),
          applyTime: new Date().toISOString(),
        }

        // 获取已注册用户列表
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
        existingUsers[phone] = userInfo
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers))
        
        console.log('注册成功，已保存用户:', phone, userInfo)

        setCurrentStep(3)
      }, 1000)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const steps = [
    {
      title: '账号注册',
      icon: <MobileOutlined />,
    },
    {
      title: '选择类型',
      icon: <ShopOutlined />,
    },
    {
      title: '完善信息',
      icon: <CheckCircleOutlined />,
    },
    {
      title: '注册成功',
      icon: <CheckCircleOutlined />,
    },
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="注册说明"
              description="注册成功后，您需要提交企业入驻申请，审核通过后即可使用平台全部功能。"
              type="info"
              showIcon
            />
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
              ]}
            >
              <Input
                prefix={<MobileOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="请输入手机号"
                size="large"
                maxLength={11}
              />
            </Form.Item>

            <Form.Item>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  name="code"
                  noStyle
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <Input
                    prefix={<SafetyOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="请输入验证码"
                    size="large"
                    maxLength={6}
                    style={{ width: 'calc(100% - 140px)' }}
                  />
                </Form.Item>
                <Button
                  size="large"
                  disabled={countdown > 0}
                  onClick={sendCode}
                  style={{ width: 140 }}
                >
                  {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                </Button>
              </Space.Compact>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请设置密码' },
                { min: 6, message: '密码长度不能少于6位' },
                { max: 20, message: '密码长度不能超过20位' },
                {
                  pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,20}$/,
                  message: '密码必须包含字母和数字',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="请设置登录密码（6-20位，含字母和数字）"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="请确认登录密码"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('请阅读并同意用户协议')),
                },
              ]}
            >
              <Checkbox>
                我已阅读并同意
                <Text style={{ cursor: 'pointer', color: '#6366f1' }}>
                  《用户协议》
                </Text>
                和
                <Text style={{ cursor: 'pointer', color: '#6366f1' }}>
                  《隐私政策》
                </Text>
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              size="large"
              block
              onClick={handleNext}
              loading={loading}
              style={{ height: 48, fontSize: 16 }}
            >
              下一步 <ArrowRightOutlined />
            </Button>
          </Space>
        )

      case 1:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="选择企业类型"
              description="请根据您的企业实际情况选择类型，不同类型可使用不同的平台功能。"
              type="info"
              showIcon
            />

            <Form.Item
              name="enterpriseType"
              rules={[{ required: true, message: '请选择企业类型' }]}
              initialValue="demand"
              preserve={true}
            >
              <Radio.Group
                style={{ width: '100%' }}
                onChange={(e) => setEnterpriseType(e.target.value)}
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Radio.Button
                    value="demand"
                    style={{
                      width: '100%',
                      height: 'auto',
                      padding: 20,
                      textAlign: 'left',
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          background: 'var(--brand-primary-bg)',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 16,
                        }}
                      >
                        <ShopOutlined style={{ fontSize: 24, color: 'var(--brand-primary)' }} />
                      </div>
                      <div>
                        <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>
                          工业制造企业
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          可使用功能：入驻申请、上传需求、补贴券申报、提交留言
                        </Text>
                      </div>
                    </div>
                  </Radio.Button>

                  <Radio.Button
                    value="supply"
                    style={{
                      width: '100%',
                      height: 'auto',
                      padding: 20,
                      textAlign: 'left',
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          background: 'var(--brand-success-bg)',
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 16,
                        }}
                      >
                        <ShopOutlined style={{ fontSize: 24, color: 'var(--brand-success)' }} />
                      </div>
                      <div>
                        <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>
                          工业软件企业
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          可使用功能：入驻申请、软件发布
                        </Text>
                      </div>
                    </div>
                  </Radio.Button>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button size="large" onClick={handlePrev} style={{ width: 120 }}>
                <ArrowLeftOutlined /> 上一步
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleNext}
                style={{ width: 120 }}
              >
                下一步 <ArrowRightOutlined />
              </Button>
            </Space>
          </Space>
        )

      case 2:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="完善企业信息"
              description="请填写真实的企业信息，审核通过后即可使用平台功能。"
              type="info"
              showIcon
            />

            <Form.Item
              name="enterpriseName"
              rules={[{ required: true, message: '请输入企业名称' }]}
            >
              <Input placeholder="请输入企业全称（与营业执照一致）" size="large" />
            </Form.Item>

            <Form.Item
              name="creditCode"
              rules={[
                { required: true, message: '请输入统一社会信用代码' },
                { pattern: /^[A-Z0-9]{18}$/, message: '请输入18位统一社会信用代码' },
              ]}
            >
              <Input placeholder="请输入统一社会信用代码" size="large" maxLength={18} />
            </Form.Item>

            <Form.Item
              name="contactName"
              rules={[{ required: true, message: '请输入联系人姓名' }]}
            >
              <Input placeholder="请输入联系人姓名" size="large" />
            </Form.Item>

            <Form.Item
              name="contactEmail"
              rules={[
                { required: true, message: '请输入联系人邮箱' },
                { type: 'email', message: '请输入正确的邮箱格式' },
              ]}
            >
              <Input placeholder="请输入联系人邮箱" size="large" />
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button size="large" onClick={handlePrev} style={{ width: 120 }}>
                <ArrowLeftOutlined /> 上一步
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                loading={loading}
                style={{ width: 200, height: 48, fontSize: 16 }}
              >
                提交入驻申请
              </Button>
            </Space>
          </Space>
        )

      case 3:
        return (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: 'var(--brand-success-bg)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <CheckCircleOutlined style={{ fontSize: 40, color: 'var(--brand-success)' }} />
            </div>
            <Title level={3} style={{ marginBottom: 16, color: 'var(--text-primary)' }}>
              注册成功！
            </Title>
            <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
              您的入驻申请已提交，平台将在1-3个工作日内完成审核，请耐心等待。
              <br />
              审核结果将通过短信和站内信通知您。
            </Paragraph>
            <Space size="large">
              <Link to="/login">
                <Button type="primary" size="large" style={{ height: 48, padding: '0 40px' }}>
                  去登录
                </Button>
              </Link>
              <Link to="/">
                <Button size="large" style={{ height: 48, padding: '0 40px' }}>
                  返回首页
                </Button>
              </Link>
            </Space>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px - 280px)',
        background: 'var(--bg-secondary)',
        padding: '40px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        style={{
          width: 600,
          borderRadius: 16,
          boxShadow: 'var(--shadow-lg)',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
        }}
        bodyStyle={{ padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title level={3} style={{ marginBottom: 8, color: 'var(--text-primary)' }}>企业入驻注册</Title>
          <Text style={{ color: 'var(--text-secondary)' }}>湖北省工业软件公共服务平台</Text>
        </div>

        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 40 }}
        />

        <Form form={form} layout="vertical" autoComplete="off">
          {renderStepContent()}
        </Form>

        {currentStep < 3 && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text type="secondary">
              已有账号？
              <Link to="/login">
                <Text style={{ cursor: 'pointer', marginLeft: 4, color: '#6366f1' }}>
                  立即登录
                </Text>
              </Link>
            </Text>
          </div>
        )}
      </Card>
    </div>
  )
}
