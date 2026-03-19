import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Tag,
  List,
  Pagination,
  Empty,
  Button,
  Tabs,
  Badge,
  Progress,
} from 'antd'
import {
  SearchOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BankOutlined,
  EyeOutlined,
  PlusOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from '@ant-design/icons'
import { policyList, getTypeColor, getCategoryColor } from '../../data/policies.tsx'
import { activityList, getActivityTypeColor, getActivityCategoryColor, getActivityStatusColor } from '../../data/activities.tsx'

const { Option } = Select
const { TabPane } = Tabs

const Policy = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('policy')
  const [category, setCategory] = useState('all')
  const [type, setType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [activityCategory, setActivityCategory] = useState('all')
  const [activityStatus, setActivityStatus] = useState('all')
  const [activityPage, setActivityPage] = useState(1)
  const [activityPageSize, setActivityPageSize] = useState(8)

  // 获取当前用户信息
  const getCurrentUser = () => {
    const currentUserStr = localStorage.getItem('currentUser')
    if (!currentUserStr) return null
    try {
      return JSON.parse(currentUserStr)
    } catch {
      return null
    }
  }

  const currentUser = getCurrentUser()

  // 判断是否显示发布政策按钮
  // 规则：未登录显示（点击跳转登录），平台管理员显示，其他角色隐藏
  const canShowPublishButton = () => {
    if (!currentUser) return true // 未登录显示，点击后跳转登录
    // 平台管理员角色可以发布政策
    if (currentUser.role === 'platform_admin') return true
    // 其他角色（工业制造企业、工业软件企业）隐藏
    return false
  }

  // 处理发布政策按钮点击
  const handlePublishClick = () => {
    if (!currentUser) {
      // 未登录，跳转到登录页
      navigate('/login')
      return
    }
    // 已登录且是平台管理员，跳转到政策管理页面
    navigate('/platform/policy')
  }

  // 分类选项
  const categories = [
    { value: 'all', label: '全部' },
    { value: 'subsidy', label: '补贴政策' },
    { value: 'industry', label: '产业政策' },
    { value: 'notice', label: '申报通知' },
  ]

  // 类型选项
  const typeOptions = [
    { value: 'all', label: '全部类型' },
    { value: 'national', label: '国家级' },
    { value: 'provincial', label: '省级' },
    { value: 'municipal', label: '市级' },
  ]

  const [searchText, setSearchText] = useState('')

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero区域 - 主题蓝渐变设计 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #4f46e5 50%, #4f46e5 100%)',
          padding: '60px 0 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 电路板纹理背景 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.6,
          }}
        />

        {/* 斜向线条纹理 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(59, 130, 246, 0.05) 20px,
                rgba(59, 130, 246, 0.05) 21px
              )
            `,
          }}
        />

        {/* 装饰几何图形 - 左上角 */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '3%',
            width: '120px',
            height: '120px',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '8px',
            transform: 'rotate(15deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '18%',
            left: '5%',
            width: '80px',
            height: '80px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '50%',
          }}
        />

        {/* 装饰几何图形 - 右下角 */}
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '5%',
            width: '100px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.7), transparent)',
            transform: 'rotate(-30deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '8%',
            width: '60px',
            height: '60px',
            border: '2px solid rgba(59, 130, 246, 0.35)',
            borderRadius: '4px',
            transform: 'rotate(45deg)',
          }}
        />

        {/* 浮动粒子效果 */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '15%',
            width: '4px',
            height: '4px',
            background: 'rgba(59, 130, 246, 0.9)',
            borderRadius: '50%',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.9)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '60%',
            right: '20%',
            width: '6px',
            height: '6px',
            background: 'rgba(37, 99, 235, 0.7)',
            borderRadius: '50%',
            boxShadow: '0 0 14px rgba(37, 99, 235, 0.7)',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Row gutter={[48, 32]} align="middle">
            <Col xs={24} lg={14}>
              <div style={{ paddingRight: '40px' }}>
                {/* 标签 - 发光效果 */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      background: '#3B82F6',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px #3B82F6',
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#93C5FD', fontWeight: 500 }}>
                    政策资讯平台
                  </span>
                </div>

                {/* 主标题 - 渐变效果 */}
                <h1
                  style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    margin: '0 0 16px 0',
                    letterSpacing: '-1.5px',
                    lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #fff 0%, #e0f2fe 50%, #7dd3fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  }}
                >
                  政策中心
                </h1>

                {/* 副标题 - 提高对比度 */}
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255,255,255,0.85)',
                    margin: 0,
                    maxWidth: '520px',
                    lineHeight: 1.8,
                    fontWeight: 400,
                  }}
                >
                  汇聚最新政策资讯，助力企业发展，把握政策机遇
                </p>

                {/* 统计数据 */}
                <div style={{ display: 'flex', gap: '40px', marginTop: '36px' }}>
                  <div>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1,
                      }}
                    >
                      50+
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      政策文件
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1,
                      }}
                    >
                      {activityList.length}+
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      活动场次
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1,
                      }}
                    >
                      3000+
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      参与人次
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={10}>
              {/* 搜索框 - 科技线条风 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '4px',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)'
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
                <Input
                  placeholder="搜索政策标题、关键词..."
                  allowClear
                  bordered={false}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    color: '#fff',
                    fontSize: '15px',
                    height: '48px',
                    paddingLeft: '16px',
                  }}
                />
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{
                    height: '44px',
                    width: '44px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  }}
                />
              </div>

              {/* 热门搜索 - 科技标签风 */}
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginRight: '4px' }}>
                  <BankOutlined style={{ fontSize: '12px', marginRight: '4px' }} />
                  热门：
                </span>
                {['补贴', '申报', '产业', '研发'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '5px 12px',
                      background: 'transparent',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)'
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                    }}
                    onClick={() => setSearchText(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 发布政策按钮 - 根据权限显示 */}
              {canShowPublishButton() && (
                <div style={{ marginTop: '24px' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={handlePublishClick}
                    style={{
                      height: '48px',
                      padding: '0 24px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: 500,
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    发布政策
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </div>

        {/* 波浪分隔线 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            overflow: 'hidden',
          }}
        >
          {/* 上层波浪 - 半透明蓝色 */}
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <path
              d="M0,30 C240,50 480,10 720,30 C960,50 1200,10 1440,30 L1440,60 L0,60 Z"
              fill="rgba(59, 130, 246, 0.15)"
            />
          </svg>
          {/* 下层波浪 - 白色 */}
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <path
              d="M0,40 C360,20 720,50 1080,30 C1260,20 1380,35 1440,40 L1440,60 L0,60 Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </div>

      {/* 政策与活动Tab切换 */}
      <div style={{ padding: '40px 0' }}>
        <div className="container">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            style={{ marginBottom: '24px' }}
            items={[
              {
                key: 'policy',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileTextOutlined />
                    政策文件
                    <Badge count={policyList.length} style={{ backgroundColor: '#3b82f6' }} />
                  </span>
                ),
                children: null,
              },
              {
                key: 'activity',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarOutlined />
                    活动中心
                    <Badge count={activityList.length} style={{ backgroundColor: '#10b981' }} />
                  </span>
                ),
                children: null,
              },
            ]}
          />

          {activeTab === 'policy' ? (
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={18}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {policyList.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      background: 'var(--bg-card)',
                      borderRadius: '16px',
                      border: '1px solid var(--border-light)',
                      boxShadow: 'var(--shadow-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onClick={() => navigate(`/policy/${item.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                      e.currentTarget.style.borderColor = 'var(--brand-primary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                      e.currentTarget.style.borderColor = 'var(--border-light)'
                    }}
                  >
                    {/* 左侧类型色块 */}
                    <div
                      style={{
                        width: '6px',
                        background:
                          item.type === '国家级'
                            ? 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)'
                            : item.type === '省级'
                            ? 'linear-gradient(180deg, #6366f1 0%, #6366f1 100%)'
                            : 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
                      }}
                    />

                    {/* 内容区域 */}
                    <div style={{ flex: 1, padding: '24px' }}>
                      {/* 头部：标签 + 日期 */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 10px',
                              background:
                                item.category === '补贴政策'
                                  ? 'rgba(249, 115, 22, 0.08)'
                                  : item.category === '产业政策'
                                  ? 'rgba(139, 92, 246, 0.08)'
                                  : 'rgba(6, 182, 212, 0.08)',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color:
                                item.category === '补贴政策'
                                  ? '#ea580c'
                                  : item.category === '产业政策'
                                  ? '#6366f1'
                                  : '#0891b2',
                            }}
                          >
                            {item.category}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 10px',
                              background:
                                item.type === '国家级'
                                  ? 'rgba(239, 68, 68, 0.08)'
                                  : item.type === '省级'
                                  ? 'rgba(59, 130, 246, 0.08)'
                                  : 'rgba(16, 185, 129, 0.08)',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color:
                                item.type === '国家级'
                                  ? '#dc2626'
                                  : item.type === '省级'
                                  ? '#6366f1'
                                  : '#059669',
                            }}
                          >
                            {item.type}
                          </span>
                        </div>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            color: '#94a3b8',
                          }}
                        >
                          <CalendarOutlined style={{ fontSize: '12px' }} />
                          {item.date}
                        </span>
                      </div>

                      {/* 标题 */}
                      <h3
                        style={{
                          fontSize: '17px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          margin: '0 0 10px 0',
                          lineHeight: 1.4,
                          letterSpacing: '-0.2px',
                        }}
                      >
                        {item.title}
                      </h3>

                      {/* 摘要 */}
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'var(--text-tertiary)',
                          lineHeight: 1.6,
                          margin: '0 0 16px 0',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.summary}
                      </p>

                      {/* 底部：标签 + 浏览量 */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                padding: '3px 10px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: '4px',
                                fontSize: '12px',
                                color: 'var(--text-tertiary)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '13px',
                            color: 'var(--text-quaternary)',
                          }}
                        >
                          <EyeOutlined style={{ fontSize: '12px' }} />
                          {item.views.toLocaleString()} 浏览
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 分页 - 科技感设计 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '40px',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <Pagination
                    current={currentPage}
                    total={policyList.length}
                    pageSize={pageSize}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => (
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginRight: '16px' }}>
                        共 <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{total}</span> 条
                      </span>
                    )}
                    onChange={(page, size) => {
                      setCurrentPage(page)
                      if (size) setPageSize(size)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    locale={{
                      items_per_page: '条/页',
                      jump_to: '跳至',
                      jump_to_confirm: '确定',
                      page: '页',
                      prev_page: '上一页',
                      next_page: '下一页',
                      prev_5: '向前 5 页',
                      next_5: '向后 5 页',
                      prev_3: '向前 3 页',
                      next_3: '向后 3 页',
                    }}
                    style={{
                      '--ant-pagination-item-bg': '#f1f5f9',
                      '--ant-pagination-item-active-bg': 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                      '--ant-pagination-item-active-color': '#fff',
                      '--ant-pagination-item-active-border': 'none',
                    } as React.CSSProperties}
                    itemRender={(page, type, originalElement) => {
                      if (type === 'page') {
                        const isActive = page === currentPage
                        return (
                          <div
                            style={{
                              minWidth: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? '#fff' : 'var(--text-primary)',
                              background: isActive
                                ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                                : 'var(--bg-tertiary)',
                              border: isActive ? 'none' : '1px solid var(--border-light)',
                              cursor: 'pointer',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = 'var(--bg-quaternary)'
                                e.currentTarget.style.borderColor = 'var(--border-medium)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = 'var(--bg-tertiary)'
                                e.currentTarget.style.borderColor = 'var(--border-light)'
                                e.currentTarget.style.transform = 'translateY(0)'
                              }
                            }}
                          >
                            {page}
                          </div>
                        )
                      }
                      return originalElement
                    }}
                  />
                </div>
              </div>
            </Col>

            <Col xs={24} lg={6}>
              <Card title="热门政策" style={{ borderRadius: '8px', marginBottom: '24px' }}>
                <List
                  itemLayout="horizontal"
                  dataSource={policyList.slice(0, 5)}
                  renderItem={(item, index) => (
                    <List.Item style={{ padding: '12px 0' }}>
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              background: index < 3 ? '#0052D9' : '#86909C',
                              color: '#fff',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {index + 1}
                          </div>
                        }
                        title={
                          <a style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</a>
                        }
                        description={
                          <span style={{ color: '#86909C', fontSize: '12px' }}>
                            {item.date}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>

              <Card title="政策分类" style={{ borderRadius: '8px' }}>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { name: '补贴政策', count: 12 },
                    { name: '产业政策', count: 28 },
                    { name: '申报通知', count: 35 },
                  ]}
                  renderItem={(item) => (
                    <List.Item
                      style={{ padding: '12px 0' }}
                      extra={<Tag>{item.count}</Tag>}
                    >
                      <List.Item.Meta title={<a style={{ fontWeight: 500 }}>{item.name}</a>} />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
          ) : (
            // 活动列表
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={18}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {activityList.slice((activityPage - 1) * activityPageSize, activityPage * activityPageSize).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        background: 'var(--bg-card)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-sm)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                        e.currentTarget.style.borderColor = 'var(--brand-primary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                        e.currentTarget.style.borderColor = 'var(--border-light)'
                      }}
                    >
                      {/* 左侧类型色块 */}
                      <div
                        style={{
                          width: '6px',
                          background: item.type === '线下'
                            ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                            : item.type === '线上'
                            ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)'
                            : 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
                        }}
                      />

                      {/* 内容区域 */}
                      <div style={{ flex: 1, padding: '24px' }}>
                        {/* 头部：标签 + 状态 */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '4px 10px',
                                background: getActivityCategoryColor(item.category).bg,
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 500,
                                color: getActivityCategoryColor(item.category).color,
                              }}
                            >
                              {item.category}
                            </span>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '4px 10px',
                                background: getActivityTypeColor(item.type).bg,
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 500,
                                color: getActivityTypeColor(item.type).color,
                              }}
                            >
                              {item.type}
                            </span>
                          </div>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 12px',
                              background: getActivityStatusColor(item.status).bg,
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: getActivityStatusColor(item.status).color,
                            }}
                          >
                            {item.status}
                          </span>
                        </div>

                        {/* 标题 */}
                        <h3
                          style={{
                            fontSize: '17px',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            margin: '0 0 10px 0',
                            lineHeight: 1.4,
                            letterSpacing: '-0.2px',
                          }}
                        >
                          {item.title}
                        </h3>

                        {/* 摘要 */}
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'var(--text-tertiary)',
                            lineHeight: 1.6,
                            margin: '0 0 16px 0',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.summary}
                        </p>

                        {/* 活动信息 */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                            marginBottom: '16px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '13px',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            <CalendarOutlined style={{ fontSize: '12px', color: '#3b82f6' }} />
                            {item.startDate} ~ {item.endDate}
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '13px',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            <EnvironmentOutlined style={{ fontSize: '12px', color: '#10b981' }} />
                            {item.location}
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '13px',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            <TeamOutlined style={{ fontSize: '12px', color: '#8b5cf6' }} />
                            {item.organizer}
                          </span>
                        </div>

                        {/* 底部：标签 + 报名进度 */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  padding: '3px 10px',
                                  background: 'var(--bg-tertiary)',
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  color: 'var(--text-tertiary)',
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <EyeOutlined style={{ fontSize: '12px', color: 'var(--text-quaternary)' }} />
                              <span style={{ fontSize: '13px', color: 'var(--text-quaternary)' }}>
                                {item.views.toLocaleString()} 浏览
                              </span>
                            </div>
                            <div style={{ width: '100px' }}>
                              <Progress
                                percent={Math.round((item.participants / item.maxParticipants) * 100)}
                                size="small"
                                strokeColor={item.participants >= item.maxParticipants ? '#ef4444' : '#3b82f6'}
                                showInfo={false}
                              />
                              <div style={{ fontSize: '11px', color: 'var(--text-quaternary)', marginTop: '2px' }}>
                                {item.participants}/{item.maxParticipants} 已报名
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 分页 */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '40px',
                    padding: '20px',
                  }}
                >
                  <Pagination
                    current={activityPage}
                    total={activityList.length}
                    pageSize={activityPageSize}
                    onChange={(page, size) => {
                      setActivityPage(page)
                      if (size) setActivityPageSize(size)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  />
                </div>
              </Col>

              <Col xs={24} lg={6}>
                <Card title="热门活动" style={{ borderRadius: '8px', marginBottom: '24px' }}>
                  <List
                    itemLayout="horizontal"
                    dataSource={activityList.slice(0, 5)}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: '12px 0' }}>
                        <List.Item.Meta
                          avatar={
                            <div
                              style={{
                                width: '24px',
                                height: '24px',
                                background: index < 3 ? '#10b981' : '#86909C',
                                color: '#fff',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}
                            >
                              {index + 1}
                            </div>
                          }
                          title={
                            <a style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</a>
                          }
                          description={
                            <span style={{ color: '#86909C', fontSize: '12px' }}>
                              {item.startDate}
                            </span>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>

                <Card title="活动分类" style={{ borderRadius: '8px' }}>
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      { name: '培训', count: 3 },
                      { name: '沙龙', count: 1 },
                      { name: '展会', count: 2 },
                      { name: '路演', count: 1 },
                      { name: '对接会', count: 1 },
                    ]}
                    renderItem={(item) => (
                      <List.Item
                        style={{ padding: '12px 0' }}
                        extra={<Tag>{item.count}</Tag>}
                      >
                        <List.Item.Meta title={<a style={{ fontWeight: 500 }}>{item.name}</a>} />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </div>
  )
}

export default Policy
