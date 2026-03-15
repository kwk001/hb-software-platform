import { useState, useEffect } from 'react'
import { Card, Row, Col, Tag, Button, Input, Select, Space, Badge, Pagination, Empty, message } from 'antd'
import { SearchOutlined, FilterOutlined, EyeOutlined, ArrowRightOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { softwareList, softwareCategories, getCategoryColor, getCategoryLabel } from '../../data/software'

const { Search } = Input

export default function SoftwareList() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [category, setCategory] = useState('all')
  const [filteredData, setFilteredData] = useState(softwareList)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

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

  // 判断是否显示发布产品按钮
  // 规则：未登录显示（点击跳转登录），工业软件企业显示，其他角色隐藏
  const canShowPublishButton = () => {
    if (!currentUser) return true // 未登录显示，点击后跳转登录
    // 工业软件企业角色可以发布产品
    if (currentUser.enterpriseType === 'supply') return true
    // 其他角色（工业制造企业、平台管理员）隐藏
    return false
  }

  // 处理发布产品按钮点击
  const handlePublishClick = () => {
    if (!currentUser) {
      // 未登录，跳转到登录页
      navigate('/login')
      return
    }
    // 已登录且是工业软件企业，跳转到发布页面
    navigate('/enterprise/software/publish')
  }

  useEffect(() => {
    let result = softwareList

    if (category !== 'all') {
      result = result.filter((item) => item.category === category)
    }

    if (searchText) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.company.toLowerCase().includes(searchText.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase()))
      )
    }

    setFilteredData(result)
  }, [searchText, category])

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
                    gap: '10px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    padding: '8px 18px',
                    borderRadius: '24px',
                    marginBottom: '28px',
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      background: '#3B82F6',
                      borderRadius: '50%',
                      boxShadow: '0 0 12px #3B82F6, 0 0 24px rgba(59, 130, 246, 0.5)',
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                  <span style={{ color: '#60A5FA', fontSize: '14px', fontWeight: 600 }}>
                    工业软件资源库
                  </span>
                </div>

                {/* 标题 - 渐变效果 */}
                <h1
                  style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    margin: '0 0 20px 0',
                    letterSpacing: '-1.5px',
                    lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #fff 0%, #e0f2fe 50%, #7dd3fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  }}
                >
                  软件产品
                </h1>

                {/* 副标题 - 提高对比度 */}
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255,255,255,0.85)',
                    margin: 0,
                    maxWidth: '520px',
                    lineHeight: '1.8',
                    fontWeight: 400,
                  }}
                >
                  汇聚优质工业软件，助力企业数字化转型，提升智能制造水平
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
                      200+
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      入驻软件
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
                      50+
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      软件企业
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
                      8
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      软件分类
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
                  placeholder="搜索软件名称、企业..."
                  allowClear
                  bordered={false}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onPressEnter={() => {}}
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.1)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                />
              </div>

              {/* 热门搜索 - 科技标签风 */}
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginRight: '4px' }}>
                  <SearchOutlined style={{ fontSize: '12px', marginRight: '4px' }} />
                  热门：
                </span>
                {['CAD', 'MES', 'ERP', '仿真'].map((tag) => (
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

              {/* 发布产品按钮 - 根据权限显示 */}
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
                    发布产品
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

      {/* 筛选栏 - 玻璃拟态 */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '24px 0',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600 }}>分类筛选</span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {softwareCategories.map((cat) => (
                  <Button
                    key={cat.value}
                    type={category === cat.value ? 'primary' : 'default'}
                    size="middle"
                    onClick={() => setCategory(cat.value)}
                    style={{
                      borderRadius: '10px',
                      fontSize: '14px',
                      height: '40px',
                      padding: '0 20px',
                      fontWeight: category === cat.value ? 600 : 400,
                      background: category === cat.value ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' : 'var(--bg-card)',
                      border: category === cat.value ? 'none' : '1px solid var(--border-light)',
                      boxShadow: category === cat.value ? '0 4px 14px rgba(59, 130, 246, 0.3)' : 'none',
                      color: category === cat.value ? '#fff' : 'var(--text-primary)',
                    }}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Select
                defaultValue="newest"
                style={{ width: 140 }}
                size="middle"
                options={[
                  { value: 'newest', label: '最新发布' },
                  { value: 'hot', label: '热度最高' },
                  { value: 'name', label: '名称排序' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 软件列表 */}
      <div style={{ padding: '40px 0 80px' }}>
        <div className="container">
          {filteredData.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
                    <Link to={`/software/${item.id}`} style={{ textDecoration: 'none' }}>
                      <Card
                        hoverable
                        style={{
                          height: '100%',
                          borderRadius: '16px',
                          border: '1px solid var(--border-light)',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          background: 'var(--bg-card)',
                        }}
                        bodyStyle={{ padding: '24px' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)'
                          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        {/* 头部 */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '16px',
                          }}
                        >
                          <Tag
                            color={getCategoryColor(item.category)}
                            style={{
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              padding: '4px 10px',
                            }}
                          >
                            {getCategoryLabel(item.category)}
                          </Tag>
                          <span style={{ fontSize: '13px', color: 'var(--text-quaternary)' }}>
                            <EyeOutlined style={{ marginRight: '4px' }} />
                            {item.views}
                          </span>
                        </div>

                        {/* 标题 */}
                        <h3
                          style={{
                            fontSize: '18px',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            margin: '0 0 8px 0',
                            lineHeight: 1.4,
                          }}
                        >
                          {item.name}
                        </h3>

                        {/* 企业 */}
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'var(--text-tertiary)',
                            margin: '0 0 12px 0',
                            fontWeight: 500,
                          }}
                        >
                          {item.company}
                        </p>

                        {/* 描述 */}
                        <p
                          style={{
                            fontSize: '14px',
                            color: 'var(--text-tertiary)',
                            margin: '0 0 16px 0',
                            lineHeight: '1.6',
                            height: '44px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {item.description}
                        </p>

                        {/* 标签 */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-tertiary)',
                                background: 'var(--bg-tertiary)',
                                padding: '4px 10px',
                                borderRadius: '6px',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* 底部按钮 */}
                        <div
                          style={{
                            marginTop: '20px',
                            paddingTop: '16px',
                            borderTop: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Button
                            type="primary"
                            size="small"
                            style={{
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                              border: 'none',
                              fontWeight: 600,
                            }}
                          >
                            查看详情
                          </Button>
                          <ArrowRightOutlined style={{ color: '#94a3b8', fontSize: '14px' }} />
                        </div>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>

              {/* 分页 - 科技感设计 */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '48px',
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
                    total={filteredData.length}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    showTotal={(total) => (
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginRight: '16px' }}>
                        共 <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{total}</span> 条
                      </span>
                    )}
                    onChange={(page) => {
                      setCurrentPage(page)
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
            </>
          ) : (
            <Empty
              description="暂无相关软件产品"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: '80px 0' }}
            />
          )}
        </div>
      </div>

      {/* 脉动动画 */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
