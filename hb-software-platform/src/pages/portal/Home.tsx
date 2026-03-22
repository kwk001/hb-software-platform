import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { policyList } from '../../data/policies.tsx'
import {
  ArrowRightOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  RocketOutlined,
  TrophyOutlined,
  CrownOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ApiOutlined,
  LineChartOutlined,
  SettingOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  FormOutlined,
  AuditOutlined,
  PlayCircleOutlined,
  RightOutlined,
  StarOutlined,
  StarFilled,
  HeartOutlined,
  ArrowUpOutlined,
  EyeOutlined,
  CheckCircleFilled,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  QrcodeOutlined,
  WechatOutlined,
  WeiboOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { softwareList, softwareCategories, industryCategories, type SoftwareItem } from '../../data/software'
import './home-styles.css'

// 智能滚动卡片组件 - CSS 匀速滑动
interface SmartScrollCardsProps {
  softwareList: SoftwareItem[]
}

function SmartScrollCards({ softwareList }: SmartScrollCardsProps) {
  // 复制一份数据用于无缝循环
  const duplicatedList = [...softwareList, ...softwareList]

  return (
    <div className="jsdesign-right">
      <div className="jsdesign-scroll-container">
        <div className="jsdesign-scroll-track-smart">
          {duplicatedList.map((software, index) => (
            <Link
              to={`/software/${software.id}`}
              key={`${software.id}-${index}`}
              className="jsdesign-card"
            >
              <div className="jsdesign-card-inner">
                <div className="jsdesign-card-icon" style={{ background: software.color }}>
                  {software.name.charAt(0)}
                </div>
                <div className="jsdesign-card-info">
                  <span className="jsdesign-card-category">{software.categoryLabel}</span>
                  <h4 className="jsdesign-card-name">{software.name}</h4>
                  <p className="jsdesign-card-company">{software.company}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// 入驻流程组件 - 带自动选中切换动效
interface ProcessStep {
  title: string
  desc: string
  icon: React.FC<any>
}

interface ProcessSectionProps {
  processSteps: ProcessStep[]
  processAnim: { ref: React.RefObject<HTMLDivElement | null>, isVisible: boolean }
}

function ProcessSection({ processSteps, processAnim }: ProcessSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!processAnim.isVisible) return

    // 自动切换选中状态
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % processSteps.length)
    }, 2500)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [processAnim.isVisible, processSteps.length])

  return (
    <section className={`section-v2 process-v2 ${processAnim.isVisible ? 'visible' : ''}`} ref={processAnim.ref}>
      <div className="container-v2">
        <div className="section-header-v2">
          <div className="section-tag">PROCESS</div>
          <h2 className="section-title-v2">
            <SafetyOutlined />
            入驻流程
          </h2>
          <p className="section-desc-v2">简单四步，快速入驻平台</p>
        </div>

        <div className="process-timeline-v2">
          {processSteps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === activeIndex
            return (
              <div
                key={index}
                className={`process-step-v2 ${isActive ? 'active' : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="process-number-v2">0{index + 1}</div>
                <div className="process-icon-v2">
                  <Icon />
                </div>
                <h3 className="process-title-v2">{step.title}</h3>
                <p className="process-desc-v2">{step.desc}</p>
                {index < processSteps.length - 1 && (
                  <div className={`process-connector-v2 ${isActive ? 'active' : ''}`}>
                    <RightOutlined />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// 合作伙伴组件 - 参考 gemcoder.com Logo墙设计（横向无限滚动）
interface Partner {
  name: string
  abbr: string
  tag: string
  logo?: string
}

interface PartnersSectionProps {
  partners: Partner[]
  partnerAnim: { ref: React.RefObject<HTMLDivElement | null>, isVisible: boolean }
}

function PartnersSection({ partners, partnerAnim }: PartnersSectionProps) {
  // 扩展合作伙伴数据（多行跑马灯）- 支持Logo图片
  const row1Partners: Partner[] = [
    { name: '湖北省工信厅', abbr: '湖北工信', tag: '政府机构', logo: '/images/partners/hubei-gongxin.svg' },
    { name: '武汉市经信局', abbr: '武汉经信', tag: '政府机构', logo: '/images/partners/wuhan-jingxin.svg' },
    { name: '东风汽车', abbr: '东风', tag: '制造企业', logo: '/images/partners/dongfeng.svg' },
    { name: '烽火通信', abbr: '烽火', tag: '科技企业', logo: '/images/partners/fenghuo.svg' },
    { name: '华工科技', abbr: '华工', tag: '科技企业', logo: '/images/partners/huagong.svg' },
    { name: '中国信科', abbr: '信科', tag: '科技企业', logo: '/images/partners/zhongguo-xinke.svg' },
    { name: '三峡集团', abbr: '三峡', tag: '能源企业', logo: '/images/partners/sanxia.svg' },
    { name: '武钢集团', abbr: '武钢', tag: '制造企业', logo: '/images/partners/wugang.svg' },
  ]

  const row2Partners: Partner[] = [
    { name: '中铁十一局', abbr: '中铁', tag: '建筑企业', logo: '/images/partners/zhongtie.svg' },
    { name: '中交二航局', abbr: '中交', tag: '建筑企业', logo: '/images/partners/zhongjiao.svg' },
    { name: '人福医药', abbr: '人福', tag: '医药企业', logo: '/images/partners/renfu.svg' },
    { name: '九州通', abbr: '九州通', tag: '医药企业', logo: '/images/partners/jiuzhoutong.svg' },
    { name: '高德红外', abbr: '高德', tag: '科技企业', logo: '/images/partners/gaode.svg' },
    { name: '锐科激光', abbr: '锐科', tag: '科技企业', logo: '/images/partners/ruike.svg' },
    { name: '精测电子', abbr: '精测', tag: '科技企业', logo: '/images/partners/jingce.svg' },
    { name: '华中数控', abbr: '华中数控', tag: '制造企业', logo: '/images/partners/huazhong.svg' },
  ]

  // 复制数据实现无缝滚动
  const duplicatedRow1 = [...row1Partners, ...row1Partners, ...row1Partners]
  const duplicatedRow2 = [...row2Partners, ...row2Partners, ...row2Partners]

  // Logo加载失败时显示文字
  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none'
    const textSpan = e.currentTarget.nextElementSibling as HTMLElement
    if (textSpan) textSpan.style.display = 'block'
  }

  return (
    <section className={`section-v2 partners-v2-marquee ${partnerAnim.isVisible ? 'visible' : ''}`} ref={partnerAnim.ref}>
      <div className="container-v2">
        {/* 标题区域 */}
        <div className="section-header-v2">
          <div className="section-tag">合作伙伴</div>
          <h2 className="section-title-v2">
            <TrophyOutlined />
            合作伙伴
          </h2>
          <p className="section-desc-v2">携手行业领军企业，共建工业软件生态</p>
        </div>

        {/* Logo跑马灯墙 */}
        <div className="partners-marquee-container">
          {/* 第一行 - 向左滚动 */}
          <div className="marquee-row">
            <div className="marquee-track marquee-left">
              {duplicatedRow1.map((partner, index) => (
                <div key={`r1-${index}`} className="marquee-item" title={partner.name}>
                  {partner.logo ? (
                    <>
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="marquee-logo"
                        onError={handleLogoError}
                      />
                      <span className="marquee-text" style={{ display: 'none' }}>{partner.abbr}</span>
                    </>
                  ) : (
                    <span className="marquee-text">{partner.abbr}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* 第二行 - 向右滚动 */}
          <div className="marquee-row">
            <div className="marquee-track marquee-right">
              {duplicatedRow2.map((partner, index) => (
                <div key={`r2-${index}`} className="marquee-item" title={partner.name}>
                  {partner.logo ? (
                    <>
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="marquee-logo"
                        onError={handleLogoError}
                      />
                      <span className="marquee-text" style={{ display: 'none' }}>{partner.abbr}</span>
                    </>
                  ) : (
                    <span className="marquee-text">{partner.abbr}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 行业解决方案组件 - 精致高端UI/UX设计
interface Solution {
  id: string
  title: string
  subtitle: string
  desc: string
  icon: React.FC<any>
  color: string
  gradient: string
  features: string[]
  stats: { users: string; efficiency: string; cases: string }
}

interface SolutionsSectionProps {
  solutions: Solution[]
  solutionAnim: { ref: React.RefObject<HTMLDivElement | null>; isVisible: boolean }
}

function SolutionsSection({ solutions, solutionAnim }: SolutionsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!solutionAnim.isVisible || !isAutoPlaying) return

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % solutions.length)
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [solutionAnim.isVisible, isAutoPlaying, solutions.length])

  const handleClick = (index: number) => {
    if (index === activeIndex) return
    setActiveIndex(index)
  }

  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  const activeSolution = solutions[activeIndex]
  const Icon = activeSolution.icon

  return (
    <section
      className={`section-v2 solutions-v2 ${solutionAnim.isVisible ? 'visible' : ''}`}
      ref={solutionAnim.ref}
    >
      <div className="container-v2">
        <div className="section-header-v2">
          <div className="section-tag">SOLUTIONS</div>
          <h2 className="section-title-v2">
            <RocketOutlined />
            行业解决方案
          </h2>
          <p className="section-desc-v2">覆盖制造业全流程的数字化解决方案</p>
        </div>

        <div 
          className="solutions-showcase-v3" 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
        >
          {/* 左侧：精致导航列表 */}
          <div className="solutions-nav">
            <div className="solutions-nav-header">
              <span className="nav-label">解决方案</span>
              <span className="nav-count">{String(activeIndex + 1).padStart(2, '0')} / {String(solutions.length).padStart(2, '0')}</span>
            </div>
            <div className="solutions-nav-list">
              {solutions.map((solution, index) => (
                <button
                  key={solution.id}
                  className={`solution-nav-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => handleClick(index)}
                  style={{ 
                    '--item-color': solution.color,
                    animationDelay: `${index * 80}ms`
                  } as React.CSSProperties}
                >
                  <div className="nav-item-progress" />
                  <div className="nav-item-content">
                    <span className="nav-item-number">{String(index + 1).padStart(2, '0')}</span>
                    <div className="nav-item-text">
                      <span className="nav-item-title">{solution.title}</span>
                      <span className="nav-item-subtitle">{solution.subtitle}</span>
                    </div>
                  </div>
                  <div className="nav-item-icon">
                    <ArrowRightOutlined />
                  </div>
                </button>
              ))}
            </div>
            {/* 进度指示器 */}
            <div className="solutions-progress">
              {solutions.map((_, index) => (
                <div 
                  key={index} 
                  className={`progress-dot ${index === activeIndex ? 'active' : ''}`}
                  style={{ '--dot-color': solutions[index].color } as React.CSSProperties}
                />
              ))}
            </div>
          </div>

          {/* 右侧：高端详情卡片 */}
          <div 
            className="solution-card-v3"
            style={{ '--card-color': activeSolution.color, '--card-gradient': activeSolution.gradient } as React.CSSProperties}
          >
            {/* 动态背景 - 已隐藏渐变背景色 */}
            <div className="solution-card-bg">
              <div className="card-bg-grid" />
            </div>

            {/* 卡片头部 */}
            <div className="solution-card-header">
              <div className="card-header-icon">
                <Icon />
                <div className="icon-ring" />
                <div className="icon-ring icon-ring-2" />
              </div>
              <div className="card-header-text">
                <h3>{activeSolution.title}</h3>
                <span>{activeSolution.subtitle}</span>
              </div>
            </div>

            {/* 卡片内容 */}
            <div className="solution-card-content">
              <p className="card-desc">{activeSolution.desc}</p>

              {/* 功能标签 - 玻璃态设计 */}
              <div className="card-features">
                <div className="features-label">
                  <span className="label-line" />
                  <span>核心功能</span>
                  <span className="label-line" />
                </div>
                <div className="features-list">
                  {activeSolution.features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="feature-item"
                      style={{ animationDelay: `${idx * 80 + 200}ms` }}
                    >
                      <div className="feature-icon">
                        <CheckCircleOutlined />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 统计数据 - 数字动效 */}
              <div className="card-stats">
                {Object.entries(activeSolution.stats).map(([key, value], idx) => (
                  <div 
                    key={key} 
                    className="stat-box"
                    style={{ animationDelay: `${idx * 100 + 400}ms` }}
                  >
                    <div className="stat-value-wrapper">
                      <span className="stat-number">{value}</span>
                    </div>
                    <span className="stat-name">
                      {key === 'users' && '服务企业'}
                      {key === 'efficiency' && '效率提升'}
                      {key === 'cases' && '成功案例'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 装饰元素 */}
            <div className="card-decoration">
              <div className="deco-circle" />
              <div className="deco-line" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 数字递增动画 Hook - 使用 key 触发重新渲染
function useCountUp(end: number, duration: number = 2000, decimals: number = 0, startKey: number = 0) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    // 重置并开始动画
    setCount(0)
    startTimeRef.current = null
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }
      
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
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
    }
  }, [end, duration, decimals, startKey])

  return count
}

// 政策列表自动滑动组件 - 每3.5秒滑动1条
interface PolicyAutoScrollListProps {
  policies: typeof policyList
  selectedIndex: number
  onSelect: (index: number) => void
}

function PolicyAutoScrollList({ policies, selectedIndex, onSelect }: PolicyAutoScrollListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const rafRef = useRef<number | null>(null)
  const currentIndexRef = useRef(0)

  // 过滤掉选中项的其他政策列表
  const otherPolicies = policies.filter((_, index) => index !== selectedIndex)

  // 使用 requestAnimationFrame 实现流畅滚动（仅对非选中项列表）
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || isHovering || otherPolicies.length === 0) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    const itemHeight = 88 // 每条政策的高度（包含间距）
    const maxIndex = otherPolicies.length
    const scrollDuration = 800 // 滚动动画持续时间
    const pauseDuration = 3500 // 暂停时间

    let startTime: number | null = null
    let startScrollTop = 0
    let targetScrollTop = 0
    let phase: 'idle' | 'scrolling' | 'pausing' = 'idle'
    let pauseStartTime = 0

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = (timestamp: number) => {
      if (!container) return

      if (phase === 'idle') {
        // 开始新的滚动周期
        currentIndexRef.current += 1
        if (currentIndexRef.current >= maxIndex) {
          currentIndexRef.current = 0
          container.scrollTop = 0
        }
        startScrollTop = container.scrollTop
        targetScrollTop = currentIndexRef.current * itemHeight
        startTime = timestamp
        phase = 'scrolling'
      }

      if (phase === 'scrolling') {
        const elapsed = timestamp - (startTime || 0)
        const progress = Math.min(elapsed / scrollDuration, 1)
        const easedProgress = easeOutCubic(progress)

        container.scrollTop = startScrollTop + (targetScrollTop - startScrollTop) * easedProgress

        if (progress >= 1) {
          phase = 'pausing'
          pauseStartTime = timestamp
        }
      }

      if (phase === 'pausing') {
        const pauseElapsed = timestamp - pauseStartTime
        if (pauseElapsed >= pauseDuration) {
          phase = 'idle'
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isHovering, otherPolicies.length])

  // 点击时选中
  const handleItemClick = (originalIndex: number) => {
    onSelect(originalIndex)
  }

  // 获取选中项的样式
  const getCategoryStyle = (category: string) => {
    const categoryColors: Record<string, { bg: string; color: string }> = {
      '申报通知': { bg: '#eff6ff', color: '#0369a1' },
      '补贴政策': { bg: '#f0fdf4', color: '#15803d' },
      '产业政策': { bg: '#fffbeb', color: '#b45309' },
    }
    return categoryColors[category] || { bg: '#f1f5f9', color: '#475569' }
  }

  const selectedPolicy = policies[selectedIndex]
  const selectedStyle = selectedPolicy ? getCategoryStyle(selectedPolicy.category) : { bg: '#f1f5f9', color: '#475569' }

  return (
    <div
      className="policy-list-container-v2 policy-list-fixed-top"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 顶部固定：当前选中项 */}
      {selectedPolicy && (
        <div className="policy-selected-fixed">
          <div className="policy-list-item-v2 active">
            <div className="policy-item-icon" style={{ background: selectedStyle.bg, color: selectedStyle.color }}>
              {selectedPolicy.icon || <FileTextOutlined />}
            </div>
            <div className="policy-item-content">
              <div className="policy-item-header">
                <span className="policy-item-category" style={{ color: selectedStyle.color, background: selectedStyle.bg }}>
                  {selectedPolicy.category}
                </span>
                <span className="policy-item-date">{selectedPolicy.date}</span>
              </div>
              <h4 className="policy-item-title" title={selectedPolicy.title}>
                {selectedPolicy.title}
              </h4>
            </div>
            <div className="policy-item-arrow">
              <ArrowRightOutlined />
            </div>
          </div>
        </div>
      )}

      {/* 底部滚动：其他政策列表 */}
      <div className="policy-list-scroll-wrapper" ref={scrollContainerRef}>
        <div className="policy-list-v2 auto-scroll">
          {otherPolicies.map((policy) => {
            const originalIndex = policies.findIndex(p => p.id === policy.id)
            const style = getCategoryStyle(policy.category)
            return (
              <div
                key={policy.id}
                className="policy-list-item-v2"
                onClick={() => handleItemClick(originalIndex)}
              >
                <div className="policy-item-icon" style={{ background: style.bg, color: style.color }}>
                  {policy.icon || <FileTextOutlined />}
                </div>
                <div className="policy-item-content">
                  <div className="policy-item-header">
                    <span className="policy-item-category" style={{ color: style.color, background: style.bg }}>
                      {policy.category}
                    </span>
                    <span className="policy-item-date">{policy.date}</span>
                  </div>
                  <h4 className="policy-item-title" title={policy.title}>
                    {policy.title}
                  </h4>
                </div>
                <div className="policy-item-arrow">
                  <ArrowRightOutlined />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 政策展示组件 - 高端精致设计
function PolicyShowcase({ policies }: { policies: typeof policyList }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedPolicy = policies[selectedIndex]

  // 自动滚动效果 - 4秒切换
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      handlePolicyChange((prev) => (prev + 1) % policies.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPaused, policies.length])

  // 滚动到选中项
  useEffect(() => {
    if (listRef.current) {
      const itemHeight = 88
      listRef.current.scrollTo({
        top: selectedIndex * itemHeight,
        behavior: 'smooth'
      })
    }
  }, [selectedIndex])

  const handlePolicyChange = (indexFn: (prev: number) => number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSelectedIndex(indexFn)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const handleClick = (index: number) => {
    if (index === selectedIndex || isTransitioning) return
    handlePolicyChange(() => index)
  }

  return (
    <div className="policy-showcase-v2">
      {/* 左侧 - 精选政策展示 */}
      <div className="policy-showcase-left-v2">
        <div className={`policy-featured-v2 ${isTransitioning ? 'transitioning' : ''}`}>
          {/* 动态背景已隐藏 */}
          {/* <div className="policy-featured-bg">
            <div className="policy-bg-glow" />
            <div className="policy-bg-grid" />
            <div className="policy-bg-particles">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="particle" style={{ 
                  '--i': i,
                  left: `${15 + i * 15}%`,
                  animationDelay: `${i * 0.5}s`
                } as React.CSSProperties} />
              ))}
            </div>
          </div> */}

          {/* 顶部装饰 */}
          <div className="policy-featured-header">
            <div className="policy-badge-v2">
              <div className="badge-icon-wrapper">
                <StarFilled />
              </div>
              <span>精选政策</span>
              <div className="badge-glow" />
            </div>
          </div>

          {/* 内容区域 */}
          <div className="policy-featured-content-v2">
            <div className="policy-meta-v2">
              <span className="policy-category-v2">{selectedPolicy.category}</span>
              <span className="policy-divider" />
              <span className="policy-type-v2">{selectedPolicy.type}</span>
            </div>

            <h3 className="policy-title-v2">{selectedPolicy.title}</h3>

            <p className="policy-summary-v2">{selectedPolicy.summary}</p>

            {selectedPolicy.highlights && (
              <div className="policy-highlights-v2">
                {selectedPolicy.highlights.map((highlight, idx) => (
                  <span key={idx} className="highlight-tag-v2" style={{ animationDelay: `${idx * 100}ms` }}>
                    <CheckCircleFilled /> {highlight}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 底部信息 */}
          <div className="policy-featured-footer-v2">
            <div className="policy-stats-v2">
              <div className="policy-stat">
                <EyeOutlined />
                <span className="stat-value">{selectedPolicy.views}</span>
                <span className="stat-label">浏览</span>
              </div>
              <div className="policy-stat">
                <ClockCircleOutlined />
                <span className="stat-value">{selectedPolicy.date}</span>
              </div>
              {selectedPolicy.deadline && (
                <div className="policy-stat deadline">
                  <CalendarOutlined />
                  <span className="stat-label">截止</span>
                  <span className="stat-value highlight">{selectedPolicy.deadline}</span>
                </div>
              )}
            </div>

            <Link to={`/policy/${selectedPolicy.id}`} className="btn-view-policy-v2">
              <span>查看详情</span>
              <div className="btn-arrow">
                <ArrowRightOutlined />
              </div>
            </Link>
          </div>

        </div>
      </div>

      {/* 右侧 - 政策列表（自动上下滚动） */}
      <div className="policy-showcase-right-v2">
        <PolicyAutoScrollList 
          policies={policies}
          selectedIndex={selectedIndex}
          onSelect={handleClick}
        />
      </div>
    </div>
  )
}

// 数据 - 使用全部政策数据
const homeSoftwareList = softwareList.slice(0, 8)
const policies = policyList

const processSteps = [
  { 
    title: '注册账号', 
    desc: '填写基本信息完成企业注册',
    icon: FormOutlined,
  },
  { 
    title: '提交申请', 
    desc: '完善企业资质和产品信息',
    icon: FileTextOutlined,
  },
  { 
    title: '平台审核', 
    desc: '专业团队1-3个工作日审核',
    icon: AuditOutlined,
  },
  { 
    title: '正式入驻', 
    desc: '享受平台全部服务与资源',
    icon: CheckCircleOutlined,
  },
]

const partners = [
  { name: '湖北省工信厅', abbr: '湖北工信', tag: '政府机构' },
  { name: '武汉市经信局', abbr: '武汉经信', tag: '政府机构' },
  { name: '东风汽车', abbr: '东风', tag: '制造企业' },
  { name: '烽火通信', abbr: '烽火', tag: '科技企业' },
  { name: '华工科技', abbr: '华工', tag: '科技企业' },
  { name: '中国信科', abbr: '信科', tag: '科技企业' },
  { name: '三峡集团', abbr: '三峡', tag: '能源企业' },
  { name: '武钢集团', abbr: '武钢', tag: '制造企业' },
]

interface StatItem {
  label: string
  value: number
  suffix: string
  icon: React.FC<any>
  decimals?: number
}

const stats: StatItem[] = [
  { label: '入驻企业', value: 128, suffix: '+', icon: TeamOutlined },
  { label: '软件产品', value: 568, suffix: '+', icon: AppstoreOutlined },
  { label: '覆盖行业', value: 15, suffix: '+', icon: DatabaseOutlined },
  { label: '申报券金额', value: 2.8, suffix: '', icon: LineChartOutlined, decimals: 1 },
]

// 主题色定义 - 统一使用蓝紫色系
const THEME_COLOR = '#6366f1'
const THEME_GRADIENT = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'

const solutions = [
  {
    id: 'smart-manufacturing',
    title: '智能制造',
    subtitle: 'Smart Manufacturing',
    desc: 'MES/ERP/PLM 一体化解决方案，实现生产全流程数字化管理，助力企业打造智能工厂',
    icon: SettingOutlined,
    color: THEME_COLOR,
    gradient: THEME_GRADIENT,
    features: ['生产计划排程', '质量追溯管理', '设备预测维护', '智能仓储物流'],
    stats: { users: '500+', efficiency: '30%', cases: '120+' }
  },
  {
    id: 'industrial-iot',
    title: '工业互联',
    subtitle: 'Industrial IoT',
    desc: 'IoT 平台与边缘计算服务，构建万物互联的工业生态，实现设备互联互通',
    icon: CloudOutlined,
    color: THEME_COLOR,
    gradient: THEME_GRADIENT,
    features: ['设备远程监控', '数据采集分析', '边缘智能计算', '云端协同管理'],
    stats: { users: '800+', efficiency: '45%', cases: '200+' }
  },
  {
    id: 'digital-twin',
    title: '数字孪生',
    subtitle: 'Digital Twin',
    desc: '3D 可视化与仿真模拟，打造虚实融合的智能制造，实现产品全生命周期管理',
    icon: ApiOutlined,
    color: THEME_COLOR,
    gradient: THEME_GRADIENT,
    features: ['3D 可视化建模', '实时数据映射', '虚拟调试验证', '预测性分析'],
    stats: { users: '300+', efficiency: '25%', cases: '80+' }
  },
  {
    id: 'ai-inspection',
    title: 'AI 质检',
    subtitle: 'AI Quality Inspection',
    desc: '智能视觉检测与质量分析，提升产品质量与检测效率，实现零缺陷目标',
    icon: LineChartOutlined,
    color: THEME_COLOR,
    gradient: THEME_GRADIENT,
    features: ['视觉缺陷检测', '尺寸精度测量', '表面质量分析', '智能分类分拣'],
    stats: { users: '600+', efficiency: '60%', cases: '150+' }
  },
]

// 滚动动画 Hook - 支持每次进入视口都触发
function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [triggerKey, setTriggerKey] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setTriggerKey(prev => prev + 1)
        } else {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible, triggerKey }
}

export default function Home() {
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [isSoftwarePaused, setIsSoftwarePaused] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsKey, setStatsKey] = useState(1)

  // 软件产品自动轮播
  useEffect(() => {
    if (isSoftwarePaused) return
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % homeSoftwareList.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isSoftwarePaused])

  // 统计数据动画 - 每次进入视口都触发
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsKey(prev => prev + 1)
        }
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const heroAnim = useScrollAnimation()
  const policyAnim = useScrollAnimation()
  const solutionAnim = useScrollAnimation()
  const productAnim = useScrollAnimation()
  const processAnim = useScrollAnimation()
  const partnerAnim = useScrollAnimation()

  return (
    <div className="home-page-v2">
      {/* ========================================
          Hero Section - 沉浸式海报
          ======================================== */}
      <section className="hero-v2">
        <div className="hero-v2-bg">
          <div className="hero-v2-grid" />
          <div className="hero-v2-glow hero-glow-1" />
          <div className="hero-v2-glow hero-glow-2" />
          <div className="hero-v2-glow hero-glow-3" />
        </div>
        
        <div className={`hero-v2-content ${heroAnim.isVisible ? 'visible' : ''}`} ref={heroAnim.ref}>
          {/* 顶部徽章 */}
          <div className="hero-v2-badge">
            <span className="badge-dot" />
            <span>平台已正式上线运营</span>
          </div>
          
          {/* 主标题区域 */}
          <div className="hero-v2-main">
            <h1 className="hero-v2-title">
              <span className="title-text">湖北省工业软件公共服务平台</span>
            </h1>
            
            <p className="hero-v2-subtitle">
              汇聚优质工业软件资源，助力企业数字化转型
            </p>
            
            <div className="hero-v2-actions">
              <Link to="/software" className="btn-primary-v2">
                <span>浏览软件产品</span>
                <ArrowRightOutlined />
              </Link>
              <Link to="/register" className="btn-secondary-v2">
                <PlayCircleOutlined />
                <span>企业入驻</span>
              </Link>
            </div>
          </div>
          
          {/* 底部数据统计 - 横向排列 */}
          <div className="hero-v2-stats-bar" ref={statsRef}>
            {stats.map((stat, index) => {
              const animatedValue = useCountUp(stat.value, 2000, stat.decimals || 0, statsKey)
              return (
                <div key={`${statsKey}-${index}`} className="stat-item-v2" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="stat-content-v2">
                    <div className="stat-value-wrapper">
                      <span className="stat-value-v2">{animatedValue}</span>
                      <span className="stat-suffix">{stat.suffix}</span>
                      <span className="stat-arrow">↑</span>
                    </div>
                    <div className="stat-label-v2">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="hero-v2-scroll">
          <div className="scroll-indicator">
            <span>向下滚动</span>
            <div className="scroll-arrow" />
          </div>
        </div>
      </section>

      {/* ========================================
          Policies Section - 最新政策 (左右布局)
          ======================================== */}
      <section className={`section-v2 policies-v2 ${policyAnim.isVisible ? 'visible' : ''}`} ref={policyAnim.ref}>
        <div className="container-v2">
          <div className="section-header-v2">
            <div className="section-tag">POLICIES</div>
            <h2 className="section-title-v2">
              <CrownOutlined />
              最新政策
            </h2>
            <p className="section-desc-v2">及时了解最新产业政策，把握发展机遇</p>
          </div>
          
          <PolicyShowcase policies={policies} />
          
          {/* 查看全部政策按钮已隐藏 */}
          {/* <div className="section-footer-v2">
            <Link to="/policy" className="link-arrow-v2">
              查看全部政策 <ArrowRightOutlined />
            </Link>
          </div> */}
        </div>
      </section>

      {/* ========================================
          Solutions Section - 解决方案
          ======================================== */}
      <SolutionsSection solutions={solutions} solutionAnim={solutionAnim} />

      {/* ========================================
          Products Section - 推荐产品 (参考 js.design 设计)
          ======================================== */}
      <section className={`section-v2 products-v2 ${productAnim.isVisible ? 'visible' : ''}`} ref={productAnim.ref}>
        <div className="container-v2">
          {/* 模块标题 */}
          <div className="section-header-v2">
            <div className="section-tag">软件产品</div>
            <h2 className="section-title-v2">
              <ThunderboltOutlined />
              软件产品
            </h2>
            <p className="section-desc-v2">精选优质工业软件，助力企业数字化转型</p>
          </div>

          {/* js.design 风格展示区域 - 左侧 + 右侧卡片 */}
          <div className="jsdesign-showcase-wrapper">
            <div className="jsdesign-showcase-main">
              {/* 左侧：卡片区域 */}
              <div className="jsdesign-left-card">
                <div className="jsdesign-tag">软件中心</div>
                <h3 className="jsdesign-title">
                  精选工业软件，<br />
                  <span className="jsdesign-title-sub">助力数字化转型</span>
                </h3>
                <div className="jsdesign-stats">
                  <div className="jsdesign-stat-item">
                    <span className="jsdesign-stat-value">{softwareList.length}+</span>
                    <span className="jsdesign-stat-label">软件产品</span>
                  </div>
                  <div className="jsdesign-stat-item">
                    <span className="jsdesign-stat-value">50+</span>
                    <span className="jsdesign-stat-label">入驻企业</span>
                  </div>
                  <div className="jsdesign-stat-item">
                    <span className="jsdesign-stat-value">8</span>
                    <span className="jsdesign-stat-label">分类领域</span>
                  </div>
                </div>

              </div>

              {/* 右侧：智能滚动卡片 + 分类导航 */}
              <SmartScrollCards softwareList={softwareList} />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          Process Section - 入驻流程
          ======================================== */}
      <ProcessSection processSteps={processSteps} processAnim={processAnim} />

      {/* ========================================
          Partners Section - 合作伙伴
          ======================================== */}
      <PartnersSection partners={partners} partnerAnim={partnerAnim} />

      {/* ========================================
          CTA Section - 行动号召
          ======================================== */}
      <section className="cta-v2">
        <div className="cta-v2-bg">
          <div className="cta-glow-1" />
          <div className="cta-glow-2" />
        </div>
        <div className="container-v2">
          <div className="cta-content-v2">
            <h2 className="cta-title-v2">准备好开始数字化转型了吗？</h2>
            <p className="cta-desc-v2">立即入驻平台，享受政策补贴、产品展示、需求对接等全方位服务</p>
            <div className="cta-actions-v2">
              <Link to="/register" className="btn-primary-v2 btn-large">
                <span>立即入驻</span>
                <ArrowRightOutlined />
              </Link>
              <Link to="/contact" className="btn-secondary-v2 btn-large">
                <span>联系我们</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          Footer - 底部导航
          ======================================== */}
      <footer className="home-footer-v2">
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
                <a href="#" className="social-link-v2" title="微博">
                  <WeiboOutlined />
                </a>
                <a href="#" className="social-link-v2" title="抖音">
                  <VideoCameraOutlined />
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
