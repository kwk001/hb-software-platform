import { useState, useEffect } from 'react'
import { Card, Row, Col, Tag, Button, Input, Select, Space, Badge, Pagination, Empty, message, Tooltip, Modal, Form, Steps, Divider, Radio, Upload, Typography } from 'antd'
import { SearchOutlined, FilterOutlined, EyeOutlined, ArrowRightOutlined, PlusOutlined, PhoneOutlined, MailOutlined, QrcodeOutlined, WechatOutlined, FormOutlined, CheckCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined as ArrowRightIcon, UploadOutlined, LayoutOutlined, ToolOutlined, ExperimentOutlined, SettingOutlined, DatabaseOutlined, SyncOutlined, NodeIndexOutlined, CloudOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { softwareList, industryCategories, getCategoryColor, getCategoryLabel, getIndustryLabel } from '../../data/software'

const { TextArea } = Input
const { Text, Title } = Typography

const { Search } = Input

// 软件类型配置
const softwareCategories = [
  { value: 'cad', label: 'CAD设计软件', color: '#6366f1', bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', lightBg: '#eef2ff', icon: <LayoutOutlined />, description: '二维/三维设计、参数化建模' },
  { value: 'cam', label: 'CAM制造软件', color: '#06b6d4', bg: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)', lightBg: '#ecfeff', icon: <ToolOutlined />, description: '数控编程、加工仿真' },
  { value: 'cae', label: 'CAE仿真软件', color: '#8b5cf6', bg: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', lightBg: '#f5f3ff', icon: <ExperimentOutlined />, description: '有限元分析、流体仿真' },
  { value: 'mes', label: 'MES生产执行', color: '#10b981', bg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', lightBg: '#ecfdf5', icon: <SettingOutlined />, description: '生产调度、质量管理' },
  { value: 'erp', label: 'ERP管理系统', color: '#f59e0b', bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', lightBg: '#fffbeb', icon: <DatabaseOutlined />, description: '财务、采购、库存管理' },
  { value: 'plm', label: 'PLM生命周期', color: '#ec4899', bg: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', lightBg: '#fdf2f8', icon: <SyncOutlined />, description: '产品数据、变更管理' },
  { value: 'scm', label: 'SCM供应链', color: '#14b8a6', bg: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)', lightBg: '#f0fdfa', icon: <NodeIndexOutlined />, description: '供应商、物流管理' },
  { value: 'iot', label: '工业物联网', color: '#3b82f6', bg: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', lightBg: '#eff6ff', icon: <CloudOutlined />, description: '设备联网、数据采集' },
]

// 预算范围选项
const budgetRanges = [
  { value: '10w', label: '10万以下' },
  { value: '10-50w', label: '10-50万' },
  { value: '50-100w', label: '50-100万' },
  { value: '100-500w', label: '100-500万' },
  { value: '500w+', label: '500万以上' },
]

// 期望时间选项
const expectedTimes = [
  { value: '1m', label: '1个月内' },
  { value: '3m', label: '3个月内' },
  { value: '6m', label: '6个月内' },
  { value: '1y', label: '1年内' },
]

export default function SoftwareList() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [industry, setIndustry] = useState('all')
  const [filteredData, setFilteredData] = useState(softwareList)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  // 发布需求弹窗状态
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [form] = Form.useForm()

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

  // 判断是否显示发布需求按钮（仅工业制造企业可见）
  const canShowPublishDemandButton = () => {
    if (!currentUser) return false // 未登录不显示
    // 工业制造企业角色可以发布需求
    if (currentUser.enterpriseType === 'demand') return true
    // 其他角色隐藏
    return false
  }

  // 处理发布需求按钮点击
  const handlePublishDemandClick = () => {
    setIsDemandModalOpen(true)
    setCurrentStep(0)
    setSelectedCategory(null)
    form.resetFields()
  }

  // 关闭弹窗
  const handleModalCancel = () => {
    setIsDemandModalOpen(false)
    setCurrentStep(0)
    setSelectedCategory(null)
    form.resetFields()
  }

  // 下一步
  const handleNext = () => {
    if (currentStep === 0 && !selectedCategory) {
      message.error('请先选择一个软件类型')
      return
    }
    if (currentStep === 1) {
      form.validateFields().then(() => {
        setCurrentStep(currentStep + 1)
      }).catch(() => {
        message.error('请完善需求信息')
      })
      return
    }
    setCurrentStep(currentStep + 1)
  }

  // 上一步
  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  // 提交需求
  const handleSubmit = () => {
    message.success('需求提交成功，平台将尽快为您匹配合适的供应商')
    setIsDemandModalOpen(false)
    setCurrentStep(0)
    setSelectedCategory(null)
    form.resetFields()
  }

  useEffect(() => {
    let result = softwareList

    if (industry !== 'all') {
      result = result.filter((item) => item.industry === industry)
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
  }, [searchText, industry])

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero区域 - 主题色渐变设计 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 20%, #4f46e5 40%, #6366f1 60%, #818cf8 100%)',
          padding: '60px 0 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 径向光晕装饰 - 主题色 */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '80%',
            height: '150%',
            background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.5) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            right: '-10%',
            width: '60%',
            height: '100%',
            background: 'radial-gradient(ellipse, rgba(79, 70, 229, 0.4) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* 网格纹理背景 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.8,
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
                transparent 30px,
                rgba(255, 255, 255, 0.02) 30px,
                rgba(255, 255, 255, 0.02) 31px
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
            border: '1px solid rgba(129, 140, 248, 0.35)',
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
            border: '1px solid rgba(99, 102, 241, 0.3)',
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
            background: 'linear-gradient(90deg, transparent, rgba(129, 140, 248, 0.9), transparent)',
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
            border: '2px solid rgba(99, 102, 241, 0.45)',
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
            background: 'rgba(129, 140, 248, 0.95)',
            borderRadius: '50%',
            boxShadow: '0 0 12px rgba(129, 140, 248, 0.95)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '60%',
            right: '20%',
            width: '6px',
            height: '6px',
            background: 'rgba(99, 102, 241, 0.85)',
            borderRadius: '50%',
            boxShadow: '0 0 14px rgba(99, 102, 241, 0.85)',
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
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(129, 140, 248, 0.5)',
                    padding: '8px 18px',
                    borderRadius: '24px',
                    marginBottom: '28px',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
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
              {/* 搜索框 - 透明玻璃风格 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '6px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.25), 0 0 30px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255,255,255,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
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
                    paddingLeft: '20px',
                  }}
                />
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{
                    height: '44px',
                    width: '44px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                />
              </div>

              {/* 热门搜索 - 玻璃标签风 */}
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginRight: '4px' }}>
                  <SearchOutlined style={{ fontSize: '12px', marginRight: '4px' }} />
                  热门：
                </span>
                {['CAD', 'MES', 'ERP', '仿真'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '6px 14px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '20px',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.8)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      backdropFilter: 'blur(10px)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                    onClick={() => setSearchText(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 发布需求按钮 - 工业制造企业可见 */}
              {canShowPublishDemandButton() && (
                <div style={{ marginTop: '24px' }}>
                  <Button
                    type="primary"
                    icon={<FormOutlined />}
                    onClick={handlePublishDemandClick}
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '8px',
                      background: '#fff',
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#4f46e5',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f5f3ff'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    发布需求
                  </Button>
                </div>
              )}

              {/* 发布产品按钮 - 已隐藏 */}
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
              <span style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600 }}>行业筛选</span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button
                  key="all"
                  type={industry === 'all' ? 'primary' : 'default'}
                  size="middle"
                  onClick={() => setIndustry('all')}
                  style={{
                    borderRadius: '10px',
                    fontSize: '14px',
                    height: '40px',
                    padding: '0 20px',
                    fontWeight: industry === 'all' ? 600 : 400,
                    background: industry === 'all' ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' : 'var(--bg-card)',
                    border: industry === 'all' ? 'none' : '1px solid var(--border-light)',
                    boxShadow: industry === 'all' ? '0 4px 14px rgba(59, 130, 246, 0.3)' : 'none',
                    color: industry === 'all' ? '#fff' : 'var(--text-primary)',
                  }}
                >
                  全部
                </Button>
                {industryCategories.map((ind) => (
                  <Button
                    key={ind.value}
                    type={industry === ind.value ? 'primary' : 'default'}
                    size="middle"
                    onClick={() => setIndustry(ind.value)}
                    style={{
                      borderRadius: '10px',
                      fontSize: '14px',
                      height: '40px',
                      padding: '0 20px',
                      fontWeight: industry === ind.value ? 600 : 400,
                      background: industry === ind.value ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' : 'var(--bg-card)',
                      border: industry === ind.value ? 'none' : '1px solid var(--border-light)',
                      boxShadow: industry === ind.value ? '0 4px 14px rgba(59, 130, 246, 0.3)' : 'none',
                      color: industry === ind.value ? '#fff' : 'var(--text-primary)',
                    }}
                  >
                    {ind.label}
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
                          border: 'none',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
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
                    background: '#fff',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Pagination
                    current={currentPage}
                    total={filteredData.length}
                    pageSize={pageSize}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => (
                      <span style={{ color: '#64748b', fontSize: '14px', marginRight: '16px' }}>
                        共 <span style={{ color: '#6366f1', fontWeight: 600 }}>{total}</span> 条
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
                      '--ant-pagination-item-active-bg': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
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
                              color: isActive ? '#fff' : '#475569',
                              background: isActive
                                ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                                : '#f1f5f9',
                              border: isActive ? 'none' : '1px solid #e2e8f0',
                              cursor: 'pointer',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none',
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = '#e2e8f0'
                                e.currentTarget.style.borderColor = '#cbd5e1'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background = '#f1f5f9'
                                e.currentTarget.style.borderColor = '#e2e8f0'
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

      {/* 悬浮发布需求按钮 - 仅工业制造企业可见 */}
      {canShowPublishDemandButton() && (
        <Tooltip title="发布需求" placement="left">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<FormOutlined style={{ fontSize: '20px' }} />}
            onClick={handlePublishDemandClick}
            style={{
              position: 'fixed',
              right: '32px',
              bottom: '100px',
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
              zIndex: 1000,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)'
            }}
          />
        </Tooltip>
      )}

      {/* 底部导航 */}
      <footer className="home-footer-v2" style={{ marginTop: '60px' }}>
        <div className="container-v2">
          <div className="footer-content-v2">
            {/* 左侧：Logo和简介 */}
            <div className="footer-brand-v2">
              <div className="footer-logo-v2">
                <span className="logo-icon-v2">◆</span>
                <span className="logo-text-v2">工业软件公共服务平台</span>
              </div>
              <p className="footer-desc-v2">
                专注于工业软件领域，为企业提供优质的软件产品和数字化解决方案，助力企业实现智能化转型。
              </p>
              <div className="footer-contact-v2">
                <span className="contact-item-v2">
                  <PhoneOutlined />
                  400-888-8888
                </span>
                <span className="contact-item-v2">
                  <MailOutlined />
                  contact@example.com
                </span>
              </div>
            </div>

            {/* 中间：导航链接 */}
            <div className="footer-nav-v2">
              <div className="footer-nav-group-v2">
                <h4 className="footer-nav-title-v2">产品服务</h4>
                <ul className="footer-nav-list-v2">
                  <li><Link to="/software">软件产品</Link></li>
                  <li><Link to="/solutions">解决方案</Link></li>
                  <li><Link to="/policy">政策资讯</Link></li>
                  {/* <li><Link to="/demand">需求大厅</Link></li> */}
                </ul>
              </div>
              <div className="footer-nav-group-v2">
                <h4 className="footer-nav-title-v2">企业服务</h4>
                <ul className="footer-nav-list-v2">
                  <li><Link to="/enterprise">企业入驻</Link></li>
                  <li><Link to="/cooperation">商务合作</Link></li>
                  <li><Link to="/consulting">技术咨询</Link></li>
                  <li><Link to="/training">培训服务</Link></li>
                </ul>
              </div>
              <div className="footer-nav-group-v2">
                <h4 className="footer-nav-title-v2">关于我们</h4>
                <ul className="footer-nav-list-v2">
                  <li><Link to="/about">平台介绍</Link></li>
                  <li><Link to="/news">新闻动态</Link></li>
                  <li><Link to="/join">加入我们</Link></li>
                  <li><Link to="/contact">联系我们</Link></li>
                </ul>
              </div>
            </div>

            {/* 右侧：二维码和社交 */}
            <div className="footer-extra-v2">
              <div className="footer-qr-v2">
                <div className="qr-placeholder-v2">
                  <QrcodeOutlined />
                </div>
                <span className="qr-label-v2">扫码关注公众号</span>
              </div>
              <div className="footer-social-v2">
                <a href="#" className="social-link-v2" title="微信">
                  <WechatOutlined />
                </a>
              </div>
            </div>
          </div>

          {/* 底部版权 */}
          <div className="footer-bottom-v2">
            <div className="footer-copyright-v2">
              <span>© 2024 工业软件公共服务平台 版权所有</span>
              <span className="footer-divider-v2">|</span>
              <Link to="/privacy">隐私政策</Link>
              <span className="footer-divider-v2">|</span>
              <Link to="/terms">服务条款</Link>
              <span className="footer-divider-v2">|</span>
              <span>京ICP备XXXXXXXX号</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 发布需求弹窗 */}
      <Modal
        title={null}
        open={isDemandModalOpen}
        onCancel={handleModalCancel}
        width={900}
        footer={null}
        destroyOnClose
        style={{ borderRadius: 16 }}
      >
        <div style={{ padding: '24px 0' }}>
          {/* 标题 */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
              <FormOutlined style={{ marginRight: 8, color: '#6366f1' }} />
              发布需求
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              填写您的工业软件需求，平台将为您匹配合适的供应商
            </Text>
          </div>

          {/* 步骤条 */}
          <Steps
            current={currentStep}
            style={{ marginBottom: 32 }}
            items={[
              { title: '选择类型', description: '选择软件类型' },
              { title: '填写需求', description: '填写详细需求信息' },
              { title: '提交审核', description: '确认并提交需求' },
            ]}
          />

          {/* 步骤内容 */}
          <div style={{ minHeight: 400, marginBottom: 24 }}>
            {currentStep === 0 && (
              <div>
                <div style={{ marginBottom: 24, textAlign: 'center' }}>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    请选择您需要的工业软件类型，我们将为您匹配合适的供应商
                  </Text>
                </div>
                <Row gutter={[16, 16]}>
                  {softwareCategories.map((cat) => (
                    <Col xs={24} sm={12} lg={8} key={cat.value}>
                      <Card
                        hoverable
                        onClick={() => setSelectedCategory(cat.value)}
                        style={{
                          borderRadius: 16,
                          border: selectedCategory === cat.value
                            ? `2px solid ${cat.color}`
                            : '1px solid #e5e7eb',
                          background: selectedCategory === cat.value ? cat.lightBg : '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: selectedCategory === cat.value
                            ? `0 8px 24px ${cat.color}30`
                            : '0 2px 8px rgba(0,0,0,0.04)',
                          height: '100%',
                        }}
                        bodyStyle={{ padding: '20px' }}
                        onMouseEnter={(e) => {
                          if (selectedCategory !== cat.value) {
                            e.currentTarget.style.transform = 'translateY(-4px)'
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCategory !== cat.value) {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                          }
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: 14,
                              background: cat.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 12px',
                              fontSize: 24,
                              color: '#fff',
                              boxShadow: `0 6px 16px ${cat.color}40`,
                            }}
                          >
                            {cat.icon}
                          </div>
                          <div style={{
                            fontWeight: 600,
                            fontSize: 15,
                            marginBottom: 6,
                            color: selectedCategory === cat.value ? cat.color : '#1f2937'
                          }}>
                            {cat.label}
                          </div>
                          <div style={{
                            fontSize: 12,
                            color: '#6b7280',
                            lineHeight: 1.5
                          }}>
                            {cat.description}
                          </div>
                          {selectedCategory === cat.value && (
                            <div style={{ marginTop: 12 }}>
                              <Tag
                                style={{
                                  borderRadius: 12,
                                  background: cat.color,
                                  border: 'none',
                                  color: '#fff',
                                  padding: '2px 12px',
                                  fontSize: 12,
                                }}
                              >
                                <CheckCircleOutlined style={{ marginRight: 4 }} />
                                已选择
                              </Tag>
                            </div>
                          )}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {selectedCategory && (
                  <div style={{
                    marginTop: 24,
                    padding: '16px 20px',
                    background: softwareCategories.find(c => c.value === selectedCategory)?.lightBg,
                    borderRadius: 12,
                    border: `1px solid ${softwareCategories.find(c => c.value === selectedCategory)?.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: 13 }}>已选择软件类型：</Text>
                      <Text strong style={{
                        fontSize: 15,
                        color: softwareCategories.find(c => c.value === selectedCategory)?.color,
                        marginLeft: 8
                      }}>
                        {softwareCategories.find(c => c.value === selectedCategory)?.label}
                      </Text>
                    </div>
                    <Tag color="success" style={{ borderRadius: 12 }}>
                      <CheckCircleOutlined /> 准备就绪
                    </Tag>
                  </div>
                )}
              </div>
            )}

            {currentStep === 1 && (
              <Form form={form} layout="vertical" style={{ maxWidth: 600, margin: '0 auto' }}>
                <Form.Item
                  name="title"
                  label="需求标题"
                  rules={[{ required: true, message: '请输入需求标题' }]}
                >
                  <Input placeholder="请简要描述您的需求，如：寻找MES系统供应商" style={{ height: 44, borderRadius: 10 }} />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="budget"
                      label="预算范围"
                      rules={[{ required: true, message: '请选择预算范围' }]}
                    >
                      <Select placeholder="请选择" style={{ height: 44 }}>
                        {budgetRanges.map(r => (
                          <Select.Option key={r.value} value={r.value}>{r.label}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="expectedTime"
                      label="期望上线时间"
                      rules={[{ required: true, message: '请选择期望时间' }]}
                    >
                      <Select placeholder="请选择" style={{ height: 44 }}>
                        {expectedTimes.map(t => (
                          <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="urgency"
                  label="紧急程度"
                  rules={[{ required: true, message: '请选择紧急程度' }]}
                >
                  <Radio.Group>
                    <Radio.Button value="low">低</Radio.Button>
                    <Radio.Button value="medium">中</Radio.Button>
                    <Radio.Button value="high">高</Radio.Button>
                    <Radio.Button value="urgent">紧急</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="description"
                  label="需求描述"
                  rules={[{ required: true, message: '请详细描述您的需求' }]}
                >
                  <TextArea
                    rows={5}
                    placeholder="请详细描述您的需求，包括：&#10;1. 企业现状和痛点&#10;2. 期望的功能和性能要求&#10;3. 集成需求&#10;4. 其他特殊要求"
                    style={{ borderRadius: 10, resize: 'none' }}
                  />
                </Form.Item>

                <Form.Item name="attachment" label="附件上传（可选）">
                  <Upload.Dragger
                    name="file"
                    multiple
                    style={{ borderRadius: 12, background: '#f9fafb' }}
                  >
                    <div style={{ padding: '20px 0' }}>
                      <UploadOutlined style={{ fontSize: 32, color: '#6366f1' }} />
                      <div style={{ marginTop: 12, color: '#374151' }}>
                        点击或拖拽文件到此处上传
                      </div>
                      <div style={{ marginTop: 4, color: '#9ca3af', fontSize: 12 }}>
                        支持 PDF、Word、Excel、图片等格式，单个文件不超过 20MB
                      </div>
                    </div>
                  </Upload.Dragger>
                </Form.Item>
              </Form>
            )}

            {currentStep === 2 && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: '0 8px 24px rgba(82, 196, 26, 0.3)',
                    }}
                  >
                    <CheckCircleOutlined style={{ fontSize: 40, color: '#fff' }} />
                  </div>
                  <Title level={4} style={{ marginTop: 16 }}>请确认需求信息</Title>
                  <Text type="secondary">确认无误后提交，平台将尽快为您匹配合适的供应商</Text>
                </div>

                <Card
                  style={{
                    borderRadius: 16,
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <div style={{ marginBottom: 20 }}>
                    <Text style={{ color: '#6b7280', fontSize: 13 }}>软件类型</Text>
                    <div style={{ fontSize: 17, fontWeight: 600, marginTop: 6 }}>
                      <Tag
                        style={{
                          borderRadius: 8,
                          background: softwareCategories.find(c => c.value === selectedCategory)?.bg,
                          border: 'none',
                          color: '#fff',
                          padding: '4px 16px',
                          fontSize: 15,
                          fontWeight: 600,
                        }}
                      >
                        {softwareCategories.find(c => c.value === selectedCategory)?.icon}
                        <span style={{ marginLeft: 6 }}>
                          {softwareCategories.find(c => c.value === selectedCategory)?.label}
                        </span>
                      </Tag>
                    </div>
                  </div>
                  <Divider style={{ margin: '16px 0' }} />
                  {/* 其他确认信息 */}
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Text type="secondary">需求信息已填写完成</Text>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* 底部按钮 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
            <Button
              onClick={handleModalCancel}
              style={{ height: 44, padding: '0 24px', borderRadius: 10 }}
            >
              取消
            </Button>
            <Space>
              {currentStep > 0 && (
                <Button
                  onClick={handlePrev}
                  style={{ height: 44, padding: '0 24px', borderRadius: 10 }}
                  icon={<ArrowLeftOutlined />}
                >
                  上一步
                </Button>
              )}
              {currentStep < 2 ? (
                <Button
                  type="primary"
                  onClick={handleNext}
                  style={{
                    height: 44,
                    padding: '0 32px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    border: 'none',
                  }}
                  icon={<ArrowRightIcon />}
                >
                  下一步
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  style={{
                    height: 44,
                    padding: '0 32px',
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                  }}
                  icon={<CheckCircleOutlined />}
                >
                  提交需求
                </Button>
              )}
            </Space>
          </div>
        </div>
      </Modal>
    </div>
  )
}
