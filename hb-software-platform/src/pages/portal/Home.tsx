import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { policyList } from '../../data/policies.tsx'

// 数字递增动画 Hook
function useCountUp(end: number, duration: number = 2000, decimals: number = 0, start: boolean = false) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!start) {
      setCount(0)
      return
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }
      
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
      // 使用 easeOutExpo 缓动函数
      const easeOutExpo = 1 - Math.pow(2, -10 * progress)
      const currentValue = easeOutExpo * end
      
      setCount(Number(currentValue.toFixed(decimals)))
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      startTimeRef.current = null
    }
  }, [end, duration, decimals, start])

  return count
}
import {
  ArrowRightOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  FormOutlined,
  AuditOutlined,
  RightOutlined,
  CrownOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  RocketOutlined,
  StarOutlined,
  HeartOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ApiOutlined,
  LineChartOutlined,
  SettingOutlined,
  TeamOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import { softwareList } from '../../data/software'
import './home-styles.css'

// 数据
const homeSoftwareList = softwareList.slice(0, 8)
const policies = policyList.slice(0, 6)

const processSteps = [
  { 
    title: '注册账号', 
    desc: '填写基本信息完成企业注册，开启数字化之旅',
    icon: FormOutlined,
    color: '#6366f1'
  },
  { 
    title: '提交申请', 
    desc: '完善企业资质和产品信息，展示企业实力',
    icon: FileTextOutlined,
    color: '#8b5cf6'
  },
  { 
    title: '平台审核', 
    desc: '专业团队1-3个工作日内完成资质审核',
    icon: AuditOutlined,
    color: '#ec4899'
  },
  { 
    title: '正式入驻', 
    desc: '审核通过，享受平台全部服务与资源支持',
    icon: CheckCircleOutlined,
    color: '#10b981'
  },
]

const partners = [
  { name: '湖北省工信厅', abbr: '湖北工信', color: '#6366f1', tag: '政府机构' },
  { name: '武汉市经信局', abbr: '武汉经信', color: '#6366f1', tag: '政府机构' },
  { name: '东风汽车', abbr: '东风', color: '#6366f1', tag: '制造企业' },
  { name: '烽火通信', abbr: '烽火', color: '#6366f1', tag: '科技企业' },
  { name: '华工科技', abbr: '华工', color: '#6366f1', tag: '科技企业' },
  { name: '中国信科', abbr: '信科', color: '#6366f1', tag: '科技企业' },
  { name: '三峡集团', abbr: '三峡', color: '#6366f1', tag: '能源企业' },
  { name: '武钢集团', abbr: '武钢', color: '#6366f1', tag: '制造企业' },
]

interface StatItem {
  label: string
  value: number
  suffix: string
  icon: React.FC<any>
  color: string
  decimals?: number
}

const stats: StatItem[] = [
  { label: '入驻企业', value: 128, suffix: '+', icon: TeamOutlined, color: '#6366f1' },
  { label: '软件产品', value: 568, suffix: '+', icon: AppstoreOutlined, color: '#8b5cf6' },
  { label: '覆盖行业', value: 15, suffix: '+', icon: DatabaseOutlined, color: '#ec4899' },
  { label: '交易金额', value: 2.8, suffix: '亿', icon: LineChartOutlined, decimals: 1, color: '#10b981' },
]

const solutions = [
  { title: '智能制造', desc: 'MES/ERP/PLM 一体化解决方案', icon: SettingOutlined, color: '#6366f1' },
  { title: '工业互联', desc: 'IoT 平台与边缘计算服务', icon: CloudOutlined, color: '#06b6d4' },
  { title: '数字孪生', desc: '3D 可视化与仿真模拟', icon: ApiOutlined, color: '#8b5cf6' },
  { title: 'AI 质检', desc: '智能视觉检测与质量分析', icon: LineChartOutlined, color: '#ec4899' },
]

// Hero 背景配置 - 仅保留第一张海报
const HERO_BACKGROUND = {
  image: '/images/hero-bg-1.png',
  title: '湖北省工业软件公共服务平台',
  subtitle: '汇聚优质工业软件资源，助力企业数字化转型',
  desc: '为制造企业提供工业软件产品发现和补贴申请服务，为软件企业提供产品展示和需求对接服务',
}

export default function Home() {
  const [hoveredSoftware, setHoveredSoftware] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  // 软件产品轮播状态
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [isSoftwarePaused, setIsSoftwarePaused] = useState(false)

  // 软件产品自动轮播 - 2.5秒切换
  useEffect(() => {
    if (isSoftwarePaused) return
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % homeSoftwareList.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [isSoftwarePaused])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
        }
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const bg = HERO_BACKGROUND

  return (
    <div className="home-page">
      {/* Hero Section - 世界顶级设计 */}
      <section className="hero-section">
        <div 
          className="hero-bg"
          style={{ backgroundImage: `url(${bg.image})` }}
        />
        <div className="hero-overlay" />
        <div className="hero-glow" />
        
        <div className="hero-content">
          {/* 状态标签 */}
          <div className="hero-status">
            <span className="hero-status-dot" />
            <span className="hero-status-text">平台已正式上线运营</span>
          </div>
          
          {/* 标题 */}
          <h1 className="hero-title">{bg.title}</h1>
          <p className="hero-subtitle">{bg.subtitle}</p>
          
          {/* 按钮组 */}
          <div className="hero-actions">
            <Link to="/software">
              <button className="hero-btn hero-btn-primary">
                浏览软件产品 <ArrowRightOutlined />
              </button>
            </Link>
            <Link to="/register">
              <button className="hero-btn hero-btn-secondary">
                企业入驻
              </button>
            </Link>
          </div>
          
          {/* 统计数据 */}
          <div className="hero-stats" ref={statsRef}>
            {stats.map((stat, index) => {
              const animatedValue = useCountUp(stat.value, 2000, stat.decimals || 0, statsVisible)

              return (
                <div
                  key={index}
                  className="hero-stat"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="hero-stat-value">
                    {animatedValue}
                    <span className="hero-stat-suffix">{stat.suffix}</span>
                  </div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Software Section - Bento Grid 风格 */}
      <section className="software-section">
        <div className="container">
          <div className="section-header center">
            <div>
              <h2 className="section-title">
                <ThunderboltOutlined className="section-icon" />
                热门软件产品
              </h2>
              <p className="section-subtitle">精选优质工业软件，助力企业数字化转型</p>
            </div>
            <Link to="/software" className="section-link">
              查看全部 <ArrowRightOutlined />
            </Link>
          </div>
          
          <div 
            className="software-grid-bento"
            onMouseEnter={() => setIsSoftwarePaused(true)}
            onMouseLeave={() => setIsSoftwarePaused(false)}
          >
            {/* 轮转式切换：每次切换，产品数组轮转一位，主推位置固定在0 */}
            {(() => {
              // 根据featuredIndex计算轮转后的数组
              const rotationOffset = featuredIndex % 7
              const rotatedList = [
                ...homeSoftwareList.slice(rotationOffset, 7),
                ...homeSoftwareList.slice(0, rotationOffset)
              ]
              return rotatedList.map((software, index) => {
                const isFeatured = index === 0  // 主推位置固定在0
                const isActive = isFeatured
                return (
                <Link
                    to={`/software/${software.id}`}
                    key={software.id}
                    className={`software-card-bento ${isFeatured ? 'featured' : ''} ${isActive ? 'active' : ''}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                  <div className="software-card-bento-inner">
                    <div
                      className="software-card-bento-bg"
                      style={{ background: `linear-gradient(135deg, ${software.color}20 0%, ${software.color}08 50%, transparent 100%)` }}
                    />

                    <div className="software-card-bento-content">
                      {isFeatured ? (
                        // 主推产品布局
                        <>
                          <div className="software-bento-featured-main">
                            <div
                              className="software-bento-icon-large"
                              style={{ backgroundColor: software.color }}
                            >
                              <span className="software-icon-text">{software.categoryLabel.slice(0, 3)}</span>
                            </div>
                            <div className="software-bento-info">
                              <div className="software-bento-tags">
                                <span className="software-bento-tag featured">{software.categoryLabel}</span>
                              </div>
                              <h3 className="software-bento-title-large">{software.name}</h3>
                              <p className="software-bento-desc-large">{software.description}</p>
                              <div className="software-bento-meta">
                                <span className="software-bento-price">{software.isFree ? '免费' : software.price}</span>
                                <span className="software-bento-arrow">
                                  <ArrowRightOutlined />
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        // 普通产品布局
                        <>
                          <div 
                            className="software-bento-icon"
                            style={{ backgroundColor: software.color }}
                          >
                            <span className="software-icon-text">{software.categoryLabel.slice(0, 2)}</span>
                          </div>
                          <div className="software-bento-details">
                            <span className="software-bento-category">{software.categoryLabel}</span>
                            <h3 className="software-bento-title">{software.name}</h3>
                            <div className="software-bento-footer">
                              <div className="software-bento-price-tag">
                                <span className="price-label">{software.isFree ? '免费试用' : '起售价'}</span>
                                <span className="price-value">{software.isFree ? '¥0' : software.price}</span>
                              </div>
                              <div className="software-bento-action">
                                <span className="action-text">了解详情</span>
                                <div className="action-arrow">
                                  <ArrowRightOutlined />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="software-card-bento-shine" />
                  </div>
                </Link>
              )
              })
            })()}
          </div>
        </div>
      </section>

      {/* Solutions Section - 行业解决方案 */}
      <section className="solutions-section">
        <div className="container">
          <div className="section-header center">
            <h2 className="section-title">
              <RocketOutlined className="section-icon" />
              行业解决方案
            </h2>
            <p className="section-subtitle">覆盖制造业全流程的数字化解决方案</p>
          </div>
          
          <div className="solutions-grid">
            {solutions.map((solution, index) => (
              <div 
                key={index} 
                className="solution-card"
                style={{ 
                  '--solution-color': solution.color,
                  animationDelay: `${index * 100}ms`
                } as React.CSSProperties}
              >
                <div className="solution-glow" />
                <div className="solution-icon">
                  <solution.icon />
                </div>
                <h3 className="solution-title">{solution.title}</h3>
                <p className="solution-desc">{solution.desc}</p>
                <div className="solution-arrow">
                  <ArrowRightOutlined />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - 杂志级流程设计 */}
      <section className="process-section">
        <div className="container">
          <div className="section-header center">
            <h2 className="section-title">
              <SafetyOutlined className="section-icon" />
              入驻流程
            </h2>
            <p className="section-subtitle">简单四步，快速入驻平台，享受全方位服务支持</p>
          </div>
          
          <div className="process-container">
            {processSteps.map((step, index) => (
              <div 
                key={index} 
                className="process-card"
                style={{ 
                  '--card-color': step.color,
                  '--card-color-light': `${step.color}dd`,
                  '--card-color-rgb': step.color.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')
                } as React.CSSProperties}
              >
                <div className="process-step-number">0{index + 1}</div>
                <div className="process-connector" />
                <div className="process-icon-wrapper">
                  <div className="process-icon-bg" />
                  <div className="process-icon-shine" />
                  <step.icon className="process-icon" />
                </div>
                <h3 className="process-title">{step.title}</h3>
                <p className="process-desc">{step.desc}</p>
                <div className="process-status">
                  {index === 3 ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                  {index === 3 ? '已完成' : '待完成'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies Section - 左右非对称布局 */}
      <section className="policies-section">
        <div className="container">
          <div className="section-header center">
            <div>
              <h2 className="section-title">
                <CrownOutlined className="section-icon" />
                最新政策
              </h2>
              <p className="section-subtitle">及时了解最新产业政策，把握发展机遇</p>
            </div>
            <Link to="/policy" className="section-link">
              查看全部 <ArrowRightOutlined />
            </Link>
          </div>

          <PolicySection policies={policies} />
        </div>
      </section>

      {/* Partners Section - Logo墙 */}
      <section className="partners-section">
        <div className="container">
          <div className="section-header center">
            <h2 className="section-title">
              <TrophyOutlined className="section-icon" />
              合作伙伴
            </h2>
            <p className="section-subtitle">携手行业领军企业，共建工业软件生态</p>
          </div>
          
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="partner-item"
                style={{
                  animationDelay: `${index * 50}ms`,
                  '--partner-color': partner.color
                } as React.CSSProperties}
              >
                <div className="partner-logo">
                  <span className="partner-abbr">{partner.abbr}</span>
                </div>
                <div className="partner-name">{partner.name}</div>
                <span className="partner-tag">{partner.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">准备好开始数字化转型了吗？</h2>
            <p className="cta-desc">立即入驻平台，享受政策补贴、产品展示、需求对接等全方位服务</p>
            <div className="cta-buttons">
              <Link to="/register">
                <Button type="primary" size="large" className="cta-btn-primary">
                  立即入驻 <ArrowRightOutlined />
                </Button>
              </Link>
              <Link to="/software">
                <Button size="large" className="cta-btn-secondary">
                  浏览产品
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <AppstoreOutlined />
              </div>
              <h3>湖北省工业软件公共服务平台</h3>
              <p>汇聚优质工业软件资源，助力企业数字化转型</p>
            </div>
            <div className="footer-links">
              <h4>平台服务</h4>
              <Link to="/software">软件产品</Link>
              <Link to="/policy">政策中心</Link>
              <Link to="/demand">需求广场</Link>
            </div>
            <div className="footer-links">
              <h4>企业入驻</h4>
              <Link to="/register">入驻申请</Link>
              <Link to="/enterprise">企业中心</Link>
              <Link to="/platform">平台管理</Link>
            </div>
            <div className="footer-contact">
              <h4>联系我们</h4>
              <p>电话：027-12345678</p>
              <p>邮箱：contact@example.com</p>
              <p>地址：湖北省武汉市</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 湖北省工业软件公共服务平台 版权所有</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// 政策区块组件 - 带向下自动滚动动效，左侧联动切换
interface PolicySectionProps {
  policies: typeof policyList
}

function PolicySection({ policies }: PolicySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // 从下往上自动滚动动效
  useEffect(() => {
    if (isPaused) return

    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    const scrollSpeed = 0.5 // 滚动速度
    const halfHeight = scrollContainer.scrollHeight / 2

    // 初始位置设在底部（第二组数据的开始）
    let scrollPosition = halfHeight
    scrollContainer.scrollTop = scrollPosition

    const animate = () => {
      if (!scrollContainer) return

      scrollPosition -= scrollSpeed

      // 当滚动到顶部时，重置到底部实现无缝循环
      if (scrollPosition <= 0) {
        scrollPosition = halfHeight
      }

      scrollContainer.scrollTop = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [isPaused])

  // 监听滚动位置，计算当前显示的政策索引
  useEffect(() => {
    const scrollContainer = scrollRef.current
    const contentContainer = contentRef.current
    if (!scrollContainer || !contentContainer) return

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop
      const itemHeight = 116 // 每个政策项的高度（包含gap）
      const containerHeight = scrollContainer.clientHeight
      const visibleCenter = scrollTop + containerHeight / 2

      // 计算当前中心位置对应的索引
      let index = Math.floor(visibleCenter / itemHeight)
      // 处理循环（第二组数据）
      index = index % policies.length

      setActiveIndex(index)
    }

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始化

    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [policies.length])

  // 获取当前激活的政策
  const featuredPolicy = policies[activeIndex] || policies[0]

  return (
    <div className="policies-layout">
      {/* 左侧大图 - 显示当前激活政策详情 */}
      <div className="policy-featured">
        <Link to={`/policy/${featuredPolicy.id}`} className="policy-featured-card" key={featuredPolicy.id}>
          {/* 顶部视觉区域 */}
          <div className="policy-featured-visual">
            <div className="policy-featured-image">
              <FileTextOutlined />
            </div>
            <div className="policy-featured-badge">
              <CrownOutlined /> {featuredPolicy.type}
            </div>
          </div>
          
          {/* 内容区域 */}
          <div className="policy-featured-content">
            <h3 className="policy-featured-title">{featuredPolicy.title}</h3>
            <p className="policy-featured-summary">{featuredPolicy.desc || featuredPolicy.summary}</p>
            
            {/* 亮点标签 */}
            {featuredPolicy.highlights && featuredPolicy.highlights.length > 0 && (
              <div className="policy-featured-highlights">
                {featuredPolicy.highlights.map((highlight, idx) => (
                  <span key={idx} className="policy-highlight-tag">{highlight}</span>
                ))}
              </div>
            )}
            
            {/* 底部元信息 */}
            <div className="policy-featured-meta">
              <div className="policy-featured-meta-left">
                <span><ClockCircleOutlined /> {featuredPolicy.date}</span>
                <span><EyeOutlined /> {featuredPolicy.views}次浏览</span>
              </div>
              <div className="policy-featured-action">
                查看详情 <ArrowRightOutlined />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* 右侧列表 - 向下自动滚动 */}
      <div
        ref={scrollRef}
        className="policy-list-scroll-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={contentRef} className="policy-list-scroll-content">
          {/* 第一组 */}
          {policies.map((policy, index) => (
            <Link
              key={`first-${policy.id}`}
              to={`/policy/${policy.id}`}
              className={`policy-item-scroll ${index === activeIndex ? 'active' : ''}`}
            >
              <div className="policy-item-content">
                <div className="policy-item-header">
                  <span className="policy-type">{policy.type}</span>
                  <span className="policy-date">{policy.date}</span>
                </div>
                <h4 className="policy-item-title">{policy.title}</h4>
                <p className="policy-item-summary">{policy.summary}</p>
                <div className="policy-item-footer">
                  <span><EyeOutlined /> {policy.views}</span>
                  {policy.deadline && (
                    <span className="policy-deadline">
                      <ClockCircleOutlined /> {policy.deadline}
                    </span>
                  )}
                </div>
              </div>
              <div className="policy-item-arrow-wrapper">
                <RightOutlined className="policy-item-arrow" />
              </div>
            </Link>
          ))}
          {/* 第二组（复制用于无缝滚动） */}
          {policies.map((policy, index) => (
            <Link
              key={`second-${policy.id}`}
              to={`/policy/${policy.id}`}
              className={`policy-item-scroll ${index === activeIndex ? 'active' : ''}`}
            >
              <div className="policy-item-content">
                <div className="policy-item-header">
                  <span className="policy-type">{policy.type}</span>
                  <span className="policy-date">{policy.date}</span>
                </div>
                <h4 className="policy-item-title">{policy.title}</h4>
                <p className="policy-item-summary">{policy.summary}</p>
                <div className="policy-item-footer">
                  <span><EyeOutlined /> {policy.views}</span>
                  {policy.deadline && (
                    <span className="policy-deadline">
                      <ClockCircleOutlined /> {policy.deadline}
                    </span>
                  )}
                </div>
              </div>
              <div className="policy-item-arrow-wrapper">
                <RightOutlined className="policy-item-arrow" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
