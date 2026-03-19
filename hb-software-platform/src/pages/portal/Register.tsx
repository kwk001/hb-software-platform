import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Typography,
  Radio,
  Space,
  Checkbox,
  message,
  Card,
  Divider,
} from 'antd'
import {
  MobileOutlined,
  SafetyOutlined,
  LockOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  DatabaseOutlined,
  CloudOutlined,
  CheckCircleFilled,
  UserOutlined,
  MailOutlined,
  FileTextOutlined,
  HomeOutlined,
  LoginOutlined,
  NumberOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

// 覆盖浏览器自动填充样式
const autofillStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
    -webkit-text-fill-color: #1e293b !important;
    transition: background-color 5000s ease-in-out 0s !important;
  }
  
  .register-input {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .register-input:hover {
    border-color: #3b82f6 !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08) !important;
  }
  
  .register-input:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12) !important;
    transform: translateY(-1px);
  }
  
  .register-input::placeholder {
    color: #94a3b8 !important;
    transition: all 0.2s ease;
  }
  
  .register-input:focus::placeholder {
    color: #cbd5e1 !important;
    transform: translateX(4px);
  }
  
  .enterprise-card {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .enterprise-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08) !important;
  }
  
  .enterprise-card.active {
    transform: scale(1.01);
  }
  
  .submit-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  
  .submit-btn:hover::before {
    left: 100%;
  }
  
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4) !important;
  }
  
  .submit-btn:active {
    transform: translateY(0);
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  
  @keyframes pulse-soft {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  .step-icon {
    animation: float 3s ease-in-out infinite;
  }
  
  .step-icon:nth-child(2) {
    animation-delay: 0.5s;
  }
  
  .step-icon:nth-child(3) {
    animation-delay: 1s;
  }
`

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
        const values = form.getFieldsValue()
        setPhoneNumber(values.phone)
        setPasswordValue(values.password)
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
          setCurrentStep(1)
        }, 500)
      } else if (currentStep === 1) {
        const values = form.getFieldsValue()
        if (values.enterpriseType) {
          setEnterpriseType(values.enterpriseType)
          setEnterpriseTypeValue(values.enterpriseType)
        }
        setCurrentStep(2)
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

        const formValues = form.getFieldsValue()
        const phone = phoneNumber || formValues.phone
        const password = passwordValue || formValues.password
        
        if (!phone) {
          message.error('注册信息不完整，请返回第1步重新填写手机号')
          setLoading(false)
          return
        }
        if (!password) {
          message.error('注册信息不完整，请返回第1步重新设置密码')
          setLoading(false)
          return
        }

        const finalEnterpriseType = formValues.enterpriseType || enterpriseTypeValue || 'demand'

        const userInfo = {
          password: password,
          enterpriseType: finalEnterpriseType,
          enterpriseInfo: {
            enterpriseName: formValues.enterpriseName || '',
            creditCode: formValues.creditCode || '',
            contactName: formValues.contactName || '',
            contactEmail: formValues.contactEmail || '',
          },
          applyStatus: 'approved',
          registerTime: new Date().toISOString(),
          applyTime: new Date().toISOString(),
        }

        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')
        existingUsers[phone] = userInfo
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers))

        setCurrentStep(3)
      }, 1000)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  // 自定义步骤条
  const renderCustomSteps = () => {
    const steps = [
      { title: '账号信息', icon: <MobileOutlined />, desc: '创建登录账号' },
      { title: '企业类型', icon: <ShopOutlined />, desc: '选择企业性质' },
      { title: '企业信息', icon: <FileTextOutlined />, desc: '完善企业资料' },
      { title: '完成', icon: <CheckCircleOutlined />, desc: '等待审核' },
    ]

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 48, padding: '0 20px' }}>
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const isLast = index === steps.length - 1

          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 0 : 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {/* 步骤圆圈 */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive
                      ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : isCompleted
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : '#fff',
                    color: isActive || isCompleted ? '#fff' : '#94a3b8',
                    fontSize: 22,
                    boxShadow: isActive
                      ? '0 8px 24px rgba(59, 130, 246, 0.45), inset 0 2px 4px rgba(255,255,255,0.3)'
                      : isCompleted
                      ? '0 8px 24px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)'
                      : '0 2px 12px rgba(0,0,0,0.06), inset 0 0 0 2.5px #e2e8f0',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {isCompleted ? <CheckCircleOutlined style={{ fontSize: 24 }} /> : step.icon}
                </div>
                
                {/* 步骤标题 */}
                <Text
                  style={{
                    marginTop: 12,
                    fontSize: 15,
                    fontWeight: isActive ? 600 : isCompleted ? 500 : 400,
                    color: isActive ? '#1e40af' : isCompleted ? '#059669' : '#64748b',
                    letterSpacing: '0.5px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {step.title}
                </Text>
                
                {/* 步骤描述 */}
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    color: isActive ? '#3b82f6' : isCompleted ? '#10b981' : '#94a3b8',
                    fontWeight: isActive ? 500 : 400,
                    opacity: isActive ? 1 : 0.8,
                  }}
                >
                  {step.desc}
                </Text>
                
                {/* 步骤序号小圆点 */}
                <div
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: isActive ? '#f59e0b' : isCompleted ? '#10b981' : '#cbd5e1',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    zIndex: 3,
                    opacity: isActive || isCompleted ? 1 : 0.7,
                    border: '2px solid #fff',
                  }}
                >
                  {index + 1}
                </div>
              </div>
              
              {/* 连接线 */}
              {!isLast && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', marginBottom: 32 }}>
                  <div
                    style={{
                      height: 4,
                      width: '100%',
                      background: index < currentStep 
                        ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' 
                        : '#e2e8f0',
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: index < currentStep ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none',
                    }}
                  >
                    {index === currentStep - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                          animation: 'shimmer 2s infinite',
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
              ]}
            >
              <Input
                prefix={<MobileOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
                placeholder="请输入手机号"
                size="large"
                maxLength={11}
                className="register-input"
                style={{ 
                  height: 50, 
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  fontSize: 15
                }}
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
                    prefix={<SafetyOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
                    placeholder="请输入验证码"
                    size="large"
                    maxLength={6}
                    className="register-input"
                    style={{ 
                      width: 'calc(100% - 140px)', 
                      height: 50, 
                      borderRadius: '12px 0 0 12px',
                      border: '1px solid #e2e8f0',
                      borderRight: 'none',
                      background: '#fff',
                      fontSize: 15
                    }}
                  />
                </Form.Item>
                <Button
                  size="large"
                  disabled={countdown > 0}
                  onClick={sendCode}
                  style={{ 
                    width: 140, 
                    height: 50, 
                    borderRadius: '0 12px 12px 0',
                    background: countdown > 0 ? '#f1f5f9' : '#3b82f6',
                    border: 'none',
                    color: countdown > 0 ? '#94a3b8' : '#fff',
                    fontWeight: 600,
                    fontSize: 14
                  }}
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
                prefix={<LockOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
                placeholder="请设置登录密码（6-20位，含字母和数字）"
                size="large"
                className="register-input"
                style={{ 
                  height: 50, 
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  fontSize: 15
                }}
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
                prefix={<LockOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
                placeholder="请确认登录密码"
                size="large"
                className="register-input"
                style={{ 
                  height: 50, 
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  fontSize: 15
                }}
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
              <Checkbox style={{ fontSize: 13, color: '#64748b' }}>
                我已阅读并同意
                <Text style={{ cursor: 'pointer', color: '#3b82f6', fontWeight: 500 }}>
                  《用户协议》
                </Text>
                和
                <Text style={{ cursor: 'pointer', color: '#3b82f6', fontWeight: 500 }}>
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
              className="submit-btn"
              style={{ 
                height: 54, 
                fontSize: 16, 
                fontWeight: 600,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
                letterSpacing: '0.5px',
              }}
            >
              下一步 <ArrowRightOutlined style={{ marginLeft: 4 }} />
            </Button>
          </Space>
        )

      case 1:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Form.Item
              name="enterpriseType"
              rules={[{ required: true, message: '请选择企业类型' }]}
              initialValue="demand"
              preserve={true}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Card
                  hoverable
                  onClick={() => {
                    setEnterpriseType('demand')
                    form.setFieldsValue({ enterpriseType: 'demand' })
                  }}
                  className={`enterprise-card ${enterpriseType === 'demand' ? 'active' : ''}`}
                  style={{
                    width: '100%',
                    borderRadius: 18,
                    border: enterpriseType === 'demand' ? '2.5px solid #3b82f6' : '1.5px solid #e2e8f0',
                    background: enterpriseType === 'demand' 
                      ? 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)' 
                      : '#fff',
                    cursor: 'pointer',
                    boxShadow: enterpriseType === 'demand' 
                      ? '0 8px 24px rgba(59, 130, 246, 0.15)' 
                      : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  bodyStyle={{ padding: '28px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 20,
                        boxShadow: enterpriseType === 'demand' 
                          ? '0 8px 20px rgba(59, 130, 246, 0.4)' 
                          : '0 4px 12px rgba(59, 130, 246, 0.25)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <DatabaseOutlined style={{ fontSize: 30, color: '#fff' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ 
                        fontSize: 18, 
                        display: 'block', 
                        marginBottom: 6, 
                        color: enterpriseType === 'demand' ? '#1e40af' : '#0f172a',
                        transition: 'color 0.3s ease',
                      }}>
                        工业制造企业
                      </Text>
                      <Text style={{ fontSize: 14, color: '#64748b', lineHeight: '1.6' }}>
                        入驻申请 · 上传需求 · 补贴券申报 · 提交留言
                      </Text>
                    </div>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: enterpriseType === 'demand' ? '#3b82f6' : '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: enterpriseType === 'demand' ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                    }}>
                      <CheckCircleFilled style={{ 
                        fontSize: 16, 
                        color: enterpriseType === 'demand' ? '#fff' : '#cbd5e1',
                        transition: 'color 0.3s ease',
                      }} />
                    </div>
                  </div>
                </Card>

                <Card
                  hoverable
                  onClick={() => {
                    setEnterpriseType('supply')
                    form.setFieldsValue({ enterpriseType: 'supply' })
                  }}
                  className={`enterprise-card ${enterpriseType === 'supply' ? 'active' : ''}`}
                  style={{
                    width: '100%',
                    borderRadius: 18,
                    border: enterpriseType === 'supply' ? '2.5px solid #10b981' : '1.5px solid #e2e8f0',
                    background: enterpriseType === 'supply' 
                      ? 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)' 
                      : '#fff',
                    cursor: 'pointer',
                    boxShadow: enterpriseType === 'supply' 
                      ? '0 8px 24px rgba(16, 185, 129, 0.15)' 
                      : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  bodyStyle={{ padding: '28px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 20,
                        boxShadow: enterpriseType === 'supply' 
                          ? '0 8px 20px rgba(16, 185, 129, 0.4)' 
                          : '0 4px 12px rgba(16, 185, 129, 0.25)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <CloudOutlined style={{ fontSize: 30, color: '#fff' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ 
                        fontSize: 18, 
                        display: 'block', 
                        marginBottom: 6, 
                        color: enterpriseType === 'supply' ? '#047857' : '#0f172a',
                        transition: 'color 0.3s ease',
                      }}>
                        工业软件企业
                      </Text>
                      <Text style={{ fontSize: 14, color: '#64748b', lineHeight: '1.6' }}>
                        入驻申请 · 软件发布
                      </Text>
                    </div>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: enterpriseType === 'supply' ? '#10b981' : '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: enterpriseType === 'supply' ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none',
                    }}>
                      <CheckCircleFilled style={{ 
                        fontSize: 16, 
                        color: enterpriseType === 'supply' ? '#fff' : '#cbd5e1',
                        transition: 'color 0.3s ease',
                      }} />
                    </div>
                  </div>
                </Card>
              </div>
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 24 }}>
              <Button 
                size="large" 
                onClick={handlePrev} 
                icon={<ArrowLeftOutlined />}
                style={{ 
                  height: 50,
                  padding: '0 32px',
                  borderRadius: 14,
                  border: '1.5px solid #e2e8f0',
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: 15,
                  background: '#fff',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1'
                  e.currentTarget.style.color = '#475569'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0'
                  e.currentTarget.style.color = '#64748b'
                }}
              >
                上一步
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleNext}
                className="submit-btn"
                style={{ 
                  height: 50,
                  padding: '0 32px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 15,
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
                  letterSpacing: '0.5px',
                }}
              >
                下一步 <ArrowRightOutlined style={{ marginLeft: 4 }} />
              </Button>
            </Space>
          </Space>
        )

      case 2:
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Form.Item
              name="enterpriseName"
              rules={[{ required: true, message: '请输入企业名称' }]}
            >
              <Input 
                prefix={<ShopOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
                placeholder="请输入企业全称（与营业执照一致）" 
                size="large"
                className="register-input"
                style={{ 
                  height: 50, 
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  fontSize: 15
                }}
              />
            </Form.Item>

            <Form.Item
              name="creditCode"
              rules={[
                { required: true, message: '请输入统一社会信用代码' },
                { pattern: /^[A-Z0-9]{18}$/, message: '请输入18位统一社会信用代码' },
              ]}
            >
              <Input 
                prefix={<NumberOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
                placeholder="请输入统一社会信用代码" 
                size="large"
                maxLength={18}
                className="register-input"
                style={{ 
                  height: 50, 
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  fontSize: 15
                }}
              />
            </Form.Item>

            <Form.Item
              name="contactName"
              rules={[{ required: true, message: '请输入联系人姓名' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
                placeholder="请输入联系人姓名" 
                size="large"
                className="register-input"
                style={{ 
                  height: 50, 
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  fontSize: 15
                }}
              />
            </Form.Item>

            <Form.Item
              name="contactEmail"
              rules={[
                { required: true, message: '请输入联系人邮箱' },
                { type: 'email', message: '请输入正确的邮箱格式' },
              ]}
            >
              <Input 
                prefix={<MailOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
                placeholder="请输入联系人邮箱" 
                size="large"
                className="register-input"
                style={{ 
                  height: 50, 
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  fontSize: 15
                }}
              />
            </Form.Item>

            <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }}>
              <Button 
                size="large" 
                onClick={handlePrev}
                icon={<ArrowLeftOutlined />}
                style={{ 
                  height: 48,
                  padding: '0 28px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: 15
                }}
              >
                上一步
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                loading={loading}
                style={{ 
                  height: 52, 
                  padding: '0 40px',
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)'
                }}
              >
                提交入驻申请
              </Button>
            </Space>
          </Space>
        )

      case 3:
        return (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 28px rgba(16, 185, 129, 0.35)'
              }}
            >
              <CheckCircleOutlined style={{ fontSize: 40, color: '#fff' }} />
            </div>
            <Title level={3} style={{ marginBottom: 12, color: '#0f172a', fontSize: 24 }}>
              注册成功！
            </Title>
            <Paragraph style={{ color: '#64748b', marginBottom: 32, fontSize: 14, lineHeight: '1.8' }}>
              您的入驻申请已提交，平台将在1-3个工作日内完成审核
              <br />
              审核结果将通过短信和站内信通知您
            </Paragraph>
            <Space size="large">
              <Link to="/login">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<LoginOutlined />}
                  style={{ 
                    height: 48, 
                    padding: '0 32px',
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 15,
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)'
                  }}
                >
                  去登录
                </Button>
              </Link>
              <Link to="/">
                <Button 
                  size="large"
                  icon={<HomeOutlined />}
                  style={{ 
                    height: 48, 
                    padding: '0 32px',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    fontWeight: 500,
                    fontSize: 15
                  }}
                >
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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <style>{autofillStyles}</style>

      {/* 顶部导航 */}
      <div style={{ 
        width: '100%', 
        maxWidth: 1200, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 40
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
            }}
          >
            <DatabaseOutlined style={{ fontSize: 22, color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
              湖北省工业软件公共服务平台
            </div>
          </div>
        </Link>
        <Space>
          <Link to="/">
            <Button 
              type="text" 
              icon={<HomeOutlined />}
              style={{ color: '#64748b', fontWeight: 500 }}
            >
              首页
            </Button>
          </Link>
          <Link to="/login">
            <Button 
              type="text" 
              icon={<LoginOutlined />}
              style={{ color: '#64748b', fontWeight: 500 }}
            >
              登录
            </Button>
          </Link>
        </Space>
      </div>

      {/* 主内容区 */}
      <Card
        style={{
          width: '100%',
          maxWidth: 640,
          borderRadius: 24,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
          background: '#fff',
          border: 'none',
        }}
        bodyStyle={{ padding: '48px 40px' }}
      >
        {/* 自定义步骤条 */}
        {renderCustomSteps()}

        <Divider style={{ margin: '0 0 32px 0', borderColor: '#f1f5f9' }} />

        {/* 表单内容 */}
        <Form form={form} layout="vertical" autoComplete="off">
          {renderStepContent()}
        </Form>

        {/* 登录入口 */}
        {currentStep < 3 && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text style={{ color: '#64748b', fontSize: 14 }}>
              已有账号？
              <Link to="/login">
                <Text style={{ cursor: 'pointer', marginLeft: 4, color: '#3b82f6', fontWeight: 600 }}>
                  立即登录
                </Text>
              </Link>
            </Text>
          </div>
        )}
      </Card>

      {/* 底部版权 */}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Text style={{ fontSize: 13, color: '#94a3b8' }}>
          © 2024 湖北省工业软件公共服务平台 版权所有
        </Text>
      </div>
    </div>
  )
}
