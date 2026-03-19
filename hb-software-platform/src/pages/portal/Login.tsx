import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  message,
  Alert,
  Card,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  SafetyOutlined,
  DesktopOutlined,
  DatabaseOutlined,
  CloudOutlined,
  SafetyCertificateOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
} from '@ant-design/icons'

const { Title, Text } = Typography

// 登录失败锁定配置
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_DURATION = 1 * 60 * 1000 // 1分钟

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
  
  .login-input:hover {
    border-color: #3b82f6 !important;
  }
  
  .login-input:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  }
`

// 平台特色数据
const features = [
  {
    icon: <DatabaseOutlined style={{ fontSize: 18 }} />,
    title: '软件资源汇聚',
    desc: '汇聚全省优质工业软件资源',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.08)',
  },
  {
    icon: <CloudOutlined style={{ fontSize: 18 }} />,
    title: '供需精准对接',
    desc: '智能匹配供需双方需求',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.08)',
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: 18 }} />,
    title: '政策补贴支持',
    desc: '提供软件采购补贴政策',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.08)',
  },
  {
    icon: <DesktopOutlined style={{ fontSize: 18 }} />,
    title: '数字化转型',
    desc: '助力企业数字化升级',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.08)',
  },
]

// 统计数据
const stats = [
  { value: '500+', label: '入驻软件企业', color: '#3b82f6' },
  { value: '2000+', label: '优质软件产品', color: '#10b981' },
  { value: '98%', label: '企业满意度', color: '#f59e0b' },
]

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeLeft, setLockTimeLeft] = useState(0)
  const [loginType, setLoginType] = useState<'password' | 'code'>('password')

  // 检查登录锁定状态
  useEffect(() => {
    const lockData = localStorage.getItem('loginLock')
    if (lockData) {
      const { lockedUntil } = JSON.parse(lockData)
      if (Date.now() < lockedUntil) {
        setIsLocked(true)
        setLockTimeLeft(Math.ceil((lockedUntil - Date.now()) / 1000))
      } else {
        localStorage.removeItem('loginLock')
        localStorage.removeItem('loginAttempts')
      }
    }

    const attempts = localStorage.getItem('loginAttempts')
    if (attempts) {
      setLoginAttempts(parseInt(attempts, 10))
    }
  }, [])

  // 锁定倒计时
  useEffect(() => {
    if (isLocked && lockTimeLeft > 0) {
      const timer = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(false)
            localStorage.removeItem('loginLock')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isLocked, lockTimeLeft])

  // 平台管理员账号配置
  const PLATFORM_ADMIN = {
    username: 'admin',
    password: 'admin123',
    role: 'platform_admin',
  }

  const handleLogin = async (values: any) => {
    if (isLocked) {
      message.error(`账户已锁定，请${Math.ceil(lockTimeLeft / 60)}分钟后重试`)
      return
    }

    setLoading(true)

    setTimeout(() => {
      setLoading(false)

      const username = values.username || values.phone
      const password = values.password

      // 检查是否是平台管理员账号
      if (username === PLATFORM_ADMIN.username && password === PLATFORM_ADMIN.password) {
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('loginLock')
        setLoginAttempts(0)

        const currentUser = {
          username: username,
          role: PLATFORM_ADMIN.role,
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser))

        message.success('登录成功')
        navigate('/platform')
        return
      }

      // 从 localStorage 获取注册的用户列表
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}')

      let isLoginSuccess = false
      let userEnterpriseType = 'demand'

      if (registeredUsers[username] && registeredUsers[username].password === values.password) {
        isLoginSuccess = true
        userEnterpriseType = registeredUsers[username].enterpriseType || 'demand'
      }

      if (isLoginSuccess) {
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('loginLock')
        setLoginAttempts(0)

        const currentUser = {
          username: username,
          enterpriseType: userEnterpriseType,
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser))

        message.success('登录成功')
        navigate('/enterprise')
      } else {
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)
        localStorage.setItem('loginAttempts', newAttempts.toString())

        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          const lockedUntil = Date.now() + LOCK_DURATION
          localStorage.setItem('loginLock', JSON.stringify({ lockedUntil }))
          setIsLocked(true)
          setLockTimeLeft(LOCK_DURATION / 1000)
          message.error(`登录失败次数过多，账户已锁定1分钟`)
        } else {
          const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts
          message.error(`登录失败，还剩${remainingAttempts}次尝试机会`)
        }
      }
    }, 1000)
  }

  const formatLockTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}分${secs}秒`
  }

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

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#f8fafc', overflow: 'hidden' }}>
      <style>{autofillStyles}</style>

      {/* 左侧品牌展示区 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 60px',
          background: 'linear-gradient(165deg, #f0f9ff 0%, #e0f2fe 40%, #dbeafe 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 装饰背景 */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            right: '-10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-5%',
            left: '-10%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Logo 和标题 */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
          {/* Logo区域 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <DatabaseOutlined style={{ fontSize: 24, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>
                湖北省工业软件公共服务平台
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2, letterSpacing: '0.5px' }}>
                HUBEI INDUSTRIAL SOFTWARE PLATFORM
              </div>
            </div>
          </div>

          {/* 平台简介 */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontSize: 15,
                color: '#334155',
                lineHeight: 1.7,
                marginBottom: 16,
              }}
            >
              汇聚全省优质工业软件资源，提供供需精准对接、政策补贴支持，
              助力企业数字化转型。
            </div>

            {/* 特性标签 */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['政府背书', '安全可靠', '免费服务', '专业支持'].map((tag, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '5px 12px',
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    fontSize: 12,
                    color: '#475569',
                    fontWeight: 500,
                  }}
                >
                  <CheckCircleFilled style={{ fontSize: 11, color: '#10b981' }} />
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* 特色功能卡片 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
            {features.map((feature, index) => (
              <Card
                key={index}
                style={{
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.3s ease',
                }}
                bodyStyle={{ padding: '16px' }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: feature.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>
                  {feature.title}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{feature.desc}</div>
              </Card>
            ))}
          </div>

          {/* 数据统计 */}
          <div
            style={{
              display: 'flex',
              gap: 40,
              paddingTop: 24,
              borderTop: '1px solid rgba(148,163,184,0.15)',
            }}
          >
            {stats.map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, letterSpacing: '-0.5px', marginBottom: 2 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧登录表单区 */}
      <div
        style={{
          width: 440,
          minWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 48px',
          background: '#fff',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.03)',
          position: 'relative',
          overflow: 'auto',
        }}
      >
        <div style={{ width: '100%' }}>
          {/* 欢迎标题 */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                width: 32,
                height: 3,
                background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                borderRadius: 2,
                marginBottom: 14,
              }}
            />
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 6, letterSpacing: '-0.3px' }}>
              欢迎回来
            </div>
            <div style={{ fontSize: 14, color: '#64748b' }}>
              请登录您的账号，开启数字化之旅
            </div>
          </div>

          {/* 返回首页入口 */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 20,
              padding: '6px 12px',
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9'
              e.currentTarget.style.color = '#3b82f6'
              e.currentTarget.style.borderColor = '#cbd5e1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8fafc'
              e.currentTarget.style.color = '#64748b'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}
          >
            <ArrowLeftOutlined style={{ fontSize: 12 }} />
            <span>返回首页</span>
          </Link>

          {/* 登录类型切换 */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginBottom: 20,
              padding: 3,
              background: '#f1f5f9',
              borderRadius: 10,
            }}
          >
            <Button
              type="text"
              onClick={() => setLoginType('password')}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 8,
                background: loginType === 'password' ? '#fff' : 'transparent',
                color: loginType === 'password' ? '#3b82f6' : '#64748b',
                fontWeight: loginType === 'password' ? 600 : 500,
                fontSize: 13,
                border: 'none',
                boxShadow: loginType === 'password' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              密码登录
            </Button>
            <Button
              type="text"
              onClick={() => setLoginType('code')}
              style={{
                flex: 1,
                height: 36,
                borderRadius: 8,
                background: loginType === 'code' ? '#fff' : 'transparent',
                color: loginType === 'code' ? '#3b82f6' : '#64748b',
                fontWeight: loginType === 'code' ? 600 : 500,
                fontSize: 13,
                border: 'none',
                boxShadow: loginType === 'code' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              验证码登录
            </Button>
          </div>

          {/* 登录表单 */}
          <Form
            name="login"
            onFinish={handleLogin}
            autoComplete="off"
            size="large"
          >
            {isLocked && (
              <Alert
                message="账户已锁定"
                description={`由于登录失败次数过多，账户已锁定。剩余时间：${formatLockTime(lockTimeLeft)}`}
                type="error"
                showIcon
                style={{ marginBottom: 16, borderRadius: 8, border: 'none', background: '#fef2f2' }}
              />
            )}

            {!isLocked && loginAttempts > 0 && (
              <Alert
                message="登录提示"
                description={`已连续失败${loginAttempts}次，再失败${MAX_LOGIN_ATTEMPTS - loginAttempts}次将锁定账户1分钟`}
                type="warning"
                showIcon
                style={{ marginBottom: 16, borderRadius: 8, border: 'none', background: '#fffbeb' }}
              />
            )}

            {loginType === 'password' ? (
              <>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入手机号/用户名' }]}
                  style={{ marginBottom: 16 }}
                >
                  <Input
                    className="login-input"
                    prefix={<UserOutlined style={{ color: '#94a3b8', fontSize: 15 }} />}
                    placeholder="请输入手机号/用户名"
                    disabled={isLocked}
                    style={{
                      height: 44,
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      fontSize: 14,
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码长度不能少于6位' },
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input.Password
                    className="login-input"
                    prefix={<LockOutlined style={{ color: '#94a3b8', fontSize: 15 }} />}
                    placeholder="请输入密码"
                    disabled={isLocked}
                    style={{
                      height: 44,
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      fontSize: 14,
                    }}
                  />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                  ]}
                  style={{ marginBottom: 16 }}
                >
                  <Input
                    className="login-input"
                    prefix={<MobileOutlined style={{ color: '#94a3b8', fontSize: 15 }} />}
                    placeholder="请输入手机号"
                    maxLength={11}
                    style={{
                      height: 44,
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      fontSize: 14,
                    }}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Form.Item
                      name="code"
                      noStyle
                      rules={[{ required: true, message: '请输入验证码' }]}
                    >
                      <Input
                        className="login-input"
                        prefix={<SafetyOutlined style={{ color: '#94a3b8', fontSize: 15 }} />}
                        placeholder="请输入验证码"
                        maxLength={6}
                        style={{
                          flex: 1,
                          height: 44,
                          borderRadius: 10,
                          border: '1px solid #e2e8f0',
                          background: '#fff',
                          fontSize: 14,
                        }}
                      />
                    </Form.Item>
                    <Button
                      disabled={countdown > 0}
                      onClick={sendCode}
                      style={{
                        width: 110,
                        height: 44,
                        borderRadius: 10,
                        background: countdown > 0 ? '#f1f5f9' : '#3b82f6',
                        border: 'none',
                        color: countdown > 0 ? '#94a3b8' : '#fff',
                        fontWeight: 500,
                        fontSize: 13,
                      }}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  </div>
                </Form.Item>
              </>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Checkbox style={{ color: '#64748b', fontSize: 13 }}>记住我</Checkbox>
              <Text
                style={{
                  cursor: 'pointer',
                  color: '#3b82f6',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                忘记密码？
              </Text>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  height: 46,
                  fontSize: 15,
                  fontWeight: 600,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                }}
              >
                立即登录
              </Button>
            </Form.Item>
          </Form>

          {/* 注册入口 */}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <span style={{ color: '#94a3b8', fontSize: 13 }}>还没有账号？</span>
            <Link
              to="/register"
              style={{
                marginLeft: 6,
                color: '#3b82f6',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              立即注册入驻
            </Link>
          </div>

          {/* 底部版权 */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: '1px solid #f1f5f9',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: 11,
            }}
          >
            © 2025 湖北省工业软件公共服务平台 版权所有
          </div>
        </div>
      </div>
    </div>
  )
}
