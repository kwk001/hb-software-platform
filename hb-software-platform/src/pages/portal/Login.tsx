import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Tabs,
  Checkbox,
  Space,
  Divider,
  message,
  Alert,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  SafetyOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

// 登录失败锁定配置
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_DURATION = 1 * 60 * 1000 // 1分钟

export default function Login() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('password')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeLeft, setLockTimeLeft] = useState(0)

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

    // 模拟登录验证
    setTimeout(() => {
      setLoading(false)

      const username = values.username || values.phone
      const password = values.password

      // 调试信息
      console.log('登录尝试:', { username, password })

      // 检查是否是平台管理员账号
      if (username === PLATFORM_ADMIN.username && password === PLATFORM_ADMIN.password) {
        console.log('平台管理员登录成功')

        // 登录成功，清除失败记录
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('loginLock')
        setLoginAttempts(0)

        // 保存当前会话信息到 currentUser
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

      // 调试信息
      console.log('已注册用户:', registeredUsers)
      console.log('查找用户:', registeredUsers[username])

      let isLoginSuccess = false
      let userEnterpriseType = 'demand'

      // 验证用户名和密码是否匹配
      if (registeredUsers[username] && registeredUsers[username].password === values.password) {
        isLoginSuccess = true
        userEnterpriseType = registeredUsers[username].enterpriseType || 'demand'
        console.log('登录验证成功')
      } else {
        console.log('登录验证失败:', {
          userExists: !!registeredUsers[username],
          storedPassword: registeredUsers[username]?.password,
          inputPassword: values.password,
          match: registeredUsers[username]?.password === values.password
        })
      }

      if (isLoginSuccess) {
        // 登录成功，清除失败记录
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('loginLock')
        setLoginAttempts(0)

        // 保存当前会话信息到 currentUser
        const currentUser = {
          username: username,
          enterpriseType: userEnterpriseType,
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser))

        message.success('登录成功')
        navigate('/enterprise')
      } else {
        // 登录失败
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)
        localStorage.setItem('loginAttempts', newAttempts.toString())

        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          // 锁定账户
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

  // 格式化锁定时间
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

  const passwordForm = (
    <Form
      name="password_login"
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
          style={{ marginBottom: 16, borderRadius: 8 }}
        />
      )}

      {!isLocked && loginAttempts > 0 && (
        <Alert
          message="登录提示"
          description={`已连续失败${loginAttempts}次，再失败${MAX_LOGIN_ATTEMPTS - loginAttempts}次将锁定账户1分钟`}
          type="warning"
          showIcon
          style={{ marginBottom: 16, borderRadius: 8 }}
        />
      )}

      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入手机号/用户名' }]}
      >
        <Input
          prefix={<UserOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
          placeholder="请输入手机号/用户名"
          disabled={isLocked}
          style={{
            height: 44,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            background: '#fff',
          }}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度不能少于6位' },
          { max: 20, message: '密码长度不能超过20位' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: '#94a3b8', fontSize: 16 }} />}
          placeholder="请输入密码（6-20位）"
          disabled={isLocked}
          style={{
            height: 44,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            background: '#fff',
          }}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ color: '#64748b' }}>记住我</Checkbox>
          </Form.Item>
          <Text style={{ cursor: 'pointer', color: '#3b82f6', fontSize: 14 }}>
            忘记密码？
          </Text>
        </div>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{
            height: 44,
            fontSize: 15,
            fontWeight: 500,
            borderRadius: 8,
            background: '#3b82f6',
            border: 'none',
          }}
        >
          登 录
        </Button>
      </Form.Item>
    </Form>
  )

  const codeForm = (
    <Form
      name="code_login"
      onFinish={handleLogin}
      autoComplete="off"
      size="large"
    >
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
          maxLength={11}
          style={{
            height: 44,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            background: '#fff',
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
              maxLength={6}
              style={{
                width: 'calc(100% - 120px)',
                height: 44,
                borderRadius: '8px 0 0 8px',
                border: '1px solid #e2e8f0',
                background: '#fff',
              }}
            />
          </Form.Item>
          <Button
            disabled={countdown > 0}
            onClick={sendCode}
            style={{
              width: 120,
              height: 44,
              borderRadius: '0 8px 8px 0',
              background: countdown > 0 ? '#f1f5f9' : '#3b82f6',
              border: '1px solid #e2e8f0',
              borderLeft: 'none',
              color: countdown > 0 ? '#94a3b8' : '#fff',
            }}
          >
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </Button>
        </Space.Compact>
      </Form.Item>

      <Form.Item style={{ marginTop: 24 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          style={{
            height: 44,
            fontSize: 15,
            fontWeight: 500,
            borderRadius: 8,
            background: '#3b82f6',
            border: 'none',
          }}
        >
          登 录
        </Button>
      </Form.Item>
    </Form>
  )

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f8fafc',
      }}
    >
      {/* 顶部Logo区域 */}
      <div
        style={{
          padding: '24px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            background: '#3b82f6',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DatabaseOutlined style={{ fontSize: 22, color: '#fff' }} />
        </div>
        <Text style={{ fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
          湖北省工业软件公共服务平台
        </Text>
      </div>

      {/* 中间登录表单区域 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 40px 60px',
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            background: '#fff',
            border: '1px solid #e2e8f0',
          }}
          bodyStyle={{ padding: '40px 36px' }}
        >
          {/* 欢迎标题 */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title
              level={3}
              style={{
                marginBottom: 8,
                color: '#1e293b',
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              账号登录
            </Title>
            <Text style={{ color: '#94a3b8', fontSize: 14 }}>
              欢迎回来，请登录您的账号
            </Text>
          </div>

          {/* 登录方式切换 */}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            style={{ marginBottom: 8 }}
            items={[
              {
                key: 'password',
                label: <span style={{ fontSize: 14 }}>密码登录</span>,
                children: passwordForm,
              },
              {
                key: 'code',
                label: <span style={{ fontSize: 14 }}>验证码登录</span>,
                children: codeForm,
              },
            ]}
          />

          {/* 分割线 */}
          <Divider style={{ margin: '24px 0' }}>
            <Text type="secondary" style={{ fontSize: 12, color: '#cbd5e1' }}>
              还没有账号？
            </Text>
          </Divider>

          {/* 注册按钮 */}
          <Link to="/register">
            <Button
              block
              size="large"
              style={{
                height: 44,
                fontSize: 14,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                color: '#3b82f6',
                background: '#fff',
              }}
            >
              立即注册入驻
            </Button>
          </Link>
        </Card>
      </div>

      {/* 底部版权 */}
      <div
        style={{
          padding: '20px 40px',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: 12,
          borderTop: '1px solid #f1f5f9',
        }}
      >
        © 2025 湖北省工业软件公共服务平台 版权所有
      </div>
    </div>
  )
}
