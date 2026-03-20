import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Tag,
  List,
  Pagination,
  Button,
  Breadcrumb,
  Empty,
  Modal,
  Form,
  Upload,
  message,
  Space,
  Popconfirm,
  Alert,
  Typography,
  Tooltip,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  MessageOutlined,
  EyeOutlined,
  CalendarOutlined,
  HomeOutlined,
  BankOutlined,
  UploadOutlined,
  DownloadOutlined,
  SaveOutlined,
  FileOutlined,
  DeleteOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  QrcodeOutlined,
  WechatOutlined,
} from '@ant-design/icons'
import { maskEnterpriseName } from '../../utils/mask'

const { Text } = Typography

const { Search } = Input
const { Option } = Select
const { TextArea } = Input

// 草稿存储键
const DEMAND_DRAFT_KEY = 'demand_drafts'

// 草稿类型
interface DemandDraft {
  id: string
  title: string
  data: any
  createTime: string
  updateTime: string
}

const Demand = () => {
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [drafts, setDrafts] = useState<DemandDraft[]>([])
  const [saveLoading, setSaveLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

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

  // 判断是否显示发布需求按钮
  // 规则：未登录显示（点击跳转登录），工业制造企业显示，其他角色隐藏
  const canShowPublishButton = () => {
    if (!currentUser) return true // 未登录显示，点击后跳转登录
    // 工业制造企业角色可以发布需求
    if (currentUser.enterpriseType === 'demand') return true
    // 其他角色（工业软件企业、平台管理员）隐藏
    return false
  }

  // 处理发布需求按钮点击
  const handlePublishClick = () => {
    if (!currentUser) {
      // 未登录，跳转到登录页
      navigate('/login')
      return
    }
    // 已登录且是工业制造企业，跳转到企业端需求管理页面
    navigate('/enterprise/demands')
  }

  // 分类选项
  const categories = [
    { value: 'all', label: '全部' },
    { value: 'mes', label: 'MES系统' },
    { value: 'erp', label: 'ERP系统' },
    { value: 'iot', label: '物联网' },
    { value: 'design', label: '设计软件' },
    { value: 'other', label: '其他' },
  ]

  // 状态选项
  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: 'active', label: '进行中' },
    { value: 'completed', label: '已对接' },
    { value: 'closed', label: '已关闭' },
  ]

  // 需求列表数据
  const demandList = [
    {
      id: 1,
      title: '寻求MES系统供应商',
      company: '武汉某汽车零部件有限公司',
      category: 'MES系统',
      budget: '50-100万',
      status: '进行中',
      publishDate: '2026-03-10',
      views: 128,
      description: '公司计划实施智能制造升级，需要采购MES系统，实现生产过程的数字化管理。',
      requirements: [
        '支持多工厂、多车间部署',
        '具备生产计划、质量管理、设备管理等功能',
        '支持与ERP、PLM等系统集成',
        '提供完善的售后服务',
      ],
    },
    {
      id: 2,
      title: '工业数据采集平台开发',
      company: '湖北某机械制造企业',
      category: '物联网',
      budget: '30-50万',
      status: '进行中',
      publishDate: '2026-03-08',
      views: 96,
      description: '需要开发工业数据采集平台，实现设备数据实时采集和可视化展示。',
      requirements: [
        '支持多种工业协议（Modbus、OPC UA等）',
        '具备边缘计算能力',
        '提供数据可视化大屏',
        '支持云端部署',
      ],
    },
    {
      id: 3,
      title: 'ERP系统升级服务',
      company: '武汉某电子科技有限公司',
      category: 'ERP系统',
      budget: '20-30万',
      status: '已对接',
      publishDate: '2026-03-05',
      views: 156,
      description: '现有ERP系统需要升级，提升系统性能和功能模块。',
      requirements: [
        '系统性能优化',
        '新增供应链模块',
        '移动端应用开发',
        '数据迁移服务',
      ],
    },
    {
      id: 4,
      title: 'CAD软件采购',
      company: '湖北某装备制造企业',
      category: '设计软件',
      budget: '10-20万',
      status: '进行中',
      publishDate: '2026-03-03',
      views: 89,
      description: '采购国产CAD设计软件，用于产品设计和工程制图。',
      requirements: [
        '支持2D/3D设计',
        '兼容主流CAD格式',
        '提供培训服务',
        '具备协同设计功能',
      ],
    },
    {
      id: 5,
      title: '质量管理系统建设',
      company: '武汉某食品加工企业',
      category: '其他',
      budget: '15-25万',
      status: '已对接',
      publishDate: '2026-03-01',
      views: 67,
      description: '建设全面质量管理系统，实现从原料到成品的全流程质量追溯。',
      requirements: [
        '来料检验管理',
        '生产过程质量监控',
        '成品检验管理',
        '质量追溯功能',
      ],
    },
    {
      id: 6,
      title: '智能仓储系统',
      company: '湖北某物流企业',
      category: '其他',
      budget: '80-120万',
      status: '进行中',
      publishDate: '2026-02-28',
      views: 134,
      description: '建设智能仓储管理系统，实现仓储作业的自动化和智能化。',
      requirements: [
        'WMS仓库管理系统',
        'AGV调度系统',
        '智能分拣系统',
        '与ERP系统集成',
      ],
    },
  ]

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中':
        return 'processing'
      case '已对接':
        return 'success'
      case '已关闭':
        return 'default'
      default:
        return 'default'
    }
  }

  // 加载草稿
  useEffect(() => {
    const stored = localStorage.getItem(DEMAND_DRAFT_KEY)
    if (stored) {
      setDrafts(JSON.parse(stored))
    }
  }, [])

  // 保存草稿
  const handleSaveDraft = async () => {
    try {
      setSaveLoading(true)
      const values = await form.validateFields().catch(() => form.getFieldsValue())
      
      const draft: DemandDraft = {
        id: Date.now().toString(),
        title: values.title || `未命名需求_${new Date().toLocaleDateString()}`,
        data: values,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      }

      const stored = localStorage.getItem(DEMAND_DRAFT_KEY)
      let draftList: DemandDraft[] = stored ? JSON.parse(stored) : []
      draftList.unshift(draft)
      
      // 最多保存10个草稿
      if (draftList.length > 10) {
        draftList = draftList.slice(0, 10)
      }

      localStorage.setItem(DEMAND_DRAFT_KEY, JSON.stringify(draftList))
      setDrafts(draftList)
      message.success('草稿保存成功')
    } catch (error) {
      message.error('草稿保存失败')
    } finally {
      setSaveLoading(false)
    }
  }

  // 删除草稿
  const handleDeleteDraft = (id: string) => {
    const stored = localStorage.getItem(DEMAND_DRAFT_KEY)
    if (stored) {
      let draftList: DemandDraft[] = JSON.parse(stored)
      draftList = draftList.filter(d => d.id !== id)
      localStorage.setItem(DEMAND_DRAFT_KEY, JSON.stringify(draftList))
      setDrafts(draftList)
      message.success('草稿删除成功')
    }
  }

  // 使用草稿
  const handleUseDraft = (draft: DemandDraft) => {
    form.setFieldsValue(draft.data)
    setIsDraftModalOpen(false)
    setIsModalOpen(true)
    message.success('草稿加载成功')
  }

  // 提交需求
  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('需求提交成功，平台将尽快处理')
      setIsModalOpen(false)
      form.resetFields()
    })
  }

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
                    企业需求对接平台
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
                  需求广场
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
                  发布需求，对接优质软件服务商，助力企业数字化转型
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
                      120+
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      需求数量
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
                      85%
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      对接成功率
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
                      优质服务商
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
                  placeholder="搜索需求标题、关键词..."
                  allowClear
                  bordered={false}
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
                {['MES系统', 'ERP系统', '物联网', '设计软件'].map((tag) => (
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
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 发布需求按钮 - 根据权限显示 */}
              {canShowPublishButton() && (
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
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
                    发布需求
                  </Button>
                  {currentUser && drafts.length > 0 && (
                    <Button
                      size="large"
                      icon={<FileOutlined />}
                      onClick={() => setIsDraftModalOpen(true)}
                      style={{
                        height: '48px',
                        padding: '0 24px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        fontSize: '15px',
                      }}
                    >
                      草稿箱 ({drafts.length})
                    </Button>
                  )}
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

      {/* 筛选区域 */}
      <div style={{ background: 'var(--bg-card)', padding: '20px 0', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} lg={16}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontWeight: 500 }}>筛选条件：</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>分类</span>
                  <Select value={category} onChange={setCategory} style={{ width: 130 }}>
                    {categories.map((cat) => (
                      <Option key={cat.value} value={cat.value}>
                        {cat.label}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>状态</span>
                  <Select value={status} onChange={setStatus} style={{ width: 130 }}>
                    {statusOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
              <span style={{ color: 'var(--text-quaternary)', fontSize: '14px' }}>
                共 <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{demandList.length}</span> 个需求
              </span>
            </Col>
          </Row>
        </div>
      </div>

      {/* 需求列表 */}
      <div style={{ padding: '40px 0' }}>
        <div className="container">
          <Row gutter={[24, 24]}>
            {/* 左侧需求列表 */}
            <Col xs={24} lg={18}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {demandList.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((demand) => (
                  <div
                    key={demand.id}
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
                    onClick={() => navigate(`/demand/${demand.id}`)}
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
                    {/* 左侧状态色块 */}
                    <div
                      style={{
                        width: '6px',
                        background:
                          demand.status === '进行中'
                            ? 'linear-gradient(180deg, #6366f1 0%, #6366f1 100%)'
                            : demand.status === '已对接'
                            ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)'
                            : 'linear-gradient(180deg, #94a3b8 0%, #64748b 100%)',
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
                              background: 'rgba(59, 130, 246, 0.08)',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#6366f1',
                            }}
                          >
                            {demand.category}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 10px',
                              background:
                                demand.status === '进行中'
                                  ? 'rgba(59, 130, 246, 0.08)'
                                  : demand.status === '已对接'
                                  ? 'rgba(16, 185, 129, 0.08)'
                                  : 'rgba(148, 163, 184, 0.08)',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color:
                                demand.status === '进行中'
                                  ? '#6366f1'
                                  : demand.status === '已对接'
                                  ? '#059669'
                                  : '#64748b',
                            }}
                          >
                            {demand.status}
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
                          {demand.publishDate}
                        </span>
                      </div>

                      {/* 标题 */}
                      <h3
                        style={{
                          fontSize: '17px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          margin: '0 0 8px 0',
                          lineHeight: 1.4,
                          letterSpacing: '-0.2px',
                        }}
                      >
                        {demand.title}
                      </h3>

                      {/* 企业名称 */}
                      <Tooltip title="企业信息已脱敏保护">
                        <p
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-tertiary)',
                            margin: '0 0 10px 0',
                          }}
                        >
                          {maskEnterpriseName(demand.company)}
                        </p>
                      </Tooltip>

                      {/* 描述 */}
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
                        {demand.description}
                      </p>

                      {/* 底部：预算 + 浏览量 */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--brand-primary)',
                          }}
                        >
                          预算：{demand.budget}
                        </span>
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
                          {demand.views.toLocaleString()} 浏览
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
                    total={demandList.length}
                    pageSize={pageSize}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => (
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '14px', marginRight: '16px' }}>
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

            {/* 右侧侧边栏 */}
            <Col xs={24} lg={6}>
              {/* 热门需求 */}
              <Card
                title="热门需求"
                style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.04)',
                  marginBottom: '24px',
                }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={demandList.slice(0, 5)}
                  renderItem={(item, index) => (
                    <List.Item
                      style={{ padding: '12px 0', cursor: 'pointer' }}
                      onClick={() => navigate(`/demand/${item.id}`)}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              background: index < 3 ? '#6366f1' : '#94a3b8',
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
                          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {item.title}
                          </span>
                        }
                        description={
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                            {item.publishDate}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>

              {/* 需求分类统计 */}
              <Card
                title="需求分类"
                style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.04)',
                }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { name: 'MES系统', count: demandList.filter(d => d.category === 'MES系统').length },
                    { name: 'ERP系统', count: demandList.filter(d => d.category === 'ERP系统').length },
                    { name: '物联网', count: demandList.filter(d => d.category === '物联网').length },
                    { name: '设计软件', count: demandList.filter(d => d.category === '设计软件').length },
                    { name: '其他', count: demandList.filter(d => d.category === '其他').length },
                  ]}
                  renderItem={(item) => (
                    <List.Item
                      style={{ padding: '12px 0' }}
                      extra={
                        <Tag
                          style={{
                            background: 'rgba(59, 130, 246, 0.08)',
                            color: '#6366f1',
                            border: 'none',
                            fontWeight: 500,
                          }}
                        >
                          {item.count}
                        </Tag>
                      }
                    >
                      <List.Item.Meta
                        title={
                          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {item.name}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* 发布需求弹窗 */}
      <Modal
        title="发布需求"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        width={720}
        okText="提交"
        cancelText="取消"
        footer={[
          <Button key="draft" onClick={handleSaveDraft} loading={saveLoading} icon={<SaveOutlined />}>
            保存草稿
          </Button>,
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            提交
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="需求标题"
                rules={[{ required: true, message: '请输入需求标题' }]}
              >
                <Input placeholder="请输入需求标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="需求分类"
                rules={[{ required: true, message: '请选择需求分类' }]}
              >
                <Select placeholder="请选择需求分类">
                  {categories
                    .filter((c) => c.value !== 'all')
                    .map((cat) => (
                      <Option key={cat.value} value={cat.value}>
                        {cat.label}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="预算范围"
                rules={[{ required: true, message: '请输入预算范围' }]}
              >
                <Input placeholder="如：50-100万" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contact"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="需求描述"
            rules={[{ required: true, message: '请输入需求描述' }]}
          >
            <TextArea rows={4} placeholder="请详细描述您的需求" />
          </Form.Item>
          <Form.Item name="requirements" label="具体要求">
            <TextArea rows={3} placeholder="请列出具体的功能要求或技术需求" />
          </Form.Item>
          <Form.Item label="附件上传">
            <Upload>
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
            <div style={{ marginTop: '8px' }}>
              <a href="#" style={{ fontSize: '13px' }}>
                <DownloadOutlined /> 下载需求模板
              </a>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 草稿箱弹窗 */}
      <Modal
        title="需求草稿箱"
        open={isDraftModalOpen}
        onCancel={() => setIsDraftModalOpen(false)}
        footer={null}
        width={600}
      >
        {drafts.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无草稿"
          />
        ) : (
          <>
            <Alert
              message="草稿提示"
              description="草稿仅保存在本地浏览器中，清除浏览器数据会导致草稿丢失。请及时提交重要内容。"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <List
              dataSource={drafts}
              renderItem={(draft) => (
                <List.Item
                  actions={[
                    <Button
                      key="edit"
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleUseDraft(draft)}
                    >
                      使用
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="确定删除此草稿？"
                      onConfirm={() => handleDeleteDraft(draft.id)}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={draft.title}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          创建时间：{new Date(draft.createTime).toLocaleString()}
                        </Text>
                        <Text type="secondary">
                          更新时间：{new Date(draft.updateTime).toLocaleString()}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>

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
                  <li><Link to="/demand">需求大厅</Link></li>
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
    </div>
  )
}

export default Demand
