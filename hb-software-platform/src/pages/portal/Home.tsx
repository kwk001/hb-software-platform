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
} from '@ant-design/icons'
import { softwareList, softwareCategories, industryCategories, type SoftwareItem } from '../../data/software'
import './home-styles.css'

// 智能滚动卡片组件 - 卡片到达中心时放大并暂停
interface SmartScrollCardsProps {
  softwareList: SoftwareItem[]
}

function SmartScrollCards({ softwareList }: SmartScrollCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [centerIndex, setCenterIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<number | null>(null)
  const positionRef = useRef(0)
  const speedRef = useRef(0.5)
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 检测哪个卡片在中心
  const detectCenterCard = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return

    const container = containerRef.current
    const track = trackRef.current
    const cards = track.querySelectorAll('.jsdesign-card')
    const containerRect = container.getBoundingClientRect()
    const centerX = containerRect.left + containerRect.width / 2

    let closestIndex = -1
    let closestDistance = Infinity

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect()
      const cardCenterX = cardRect.left + cardRect.width / 2
      const distance = Math.abs(cardCenterX - centerX)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    const normalizedIndex = closestIndex % softwareList.length

    // 如果中心卡片变化了，触发暂停
    if (closestIndex !== -1 && normalizedIndex !== centerIndex && closestDistance < 60) {
      setCenterIndex(normalizedIndex)
      setIsPaused(true)

      // 清除之前的暂停定时器
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }

      // 1秒后恢复滚动
      pauseTimeoutRef.current = setTimeout(() => {
        setIsPaused(false)
      }, 1000)
    }
  }, [centerIndex, softwareList.length])

  // 动画循环
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const animate = () => {
      if (!isPaused) {
        positionRef.current -= speedRef.current

        // 无缝循环：当滚动到一半时重置
        const trackWidth = track.scrollWidth / 2
        if (Math.abs(positionRef.current) >= trackWidth) {
          positionRef.current = 0
        }

        track.style.transform = `translateX(${positionRef.current}px)`
      }

      // 检测中心卡片
      detectCenterCard()

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
    }
  }, [isPaused, detectCenterCard])

  // 鼠标悬停时暂停
  const handleMouseEnter = () => {
    setIsPaused(true)
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  // 复制一份数据用于无缝循环
  const duplicatedList = [...softwareList, ...softwareList]

  return (
    <div className="jsdesign-right">
      <div
        className="jsdesign-scroll-container"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="jsdesign-scroll-track-smart" ref={trackRef}>
          {duplicatedList.map((software, index) => (
            <Link
              to={`/software/${software.id}`}
              key={`${software.id}-${index}`}
              className={`jsdesign-card ${centerIndex === index % softwareList.length && isPaused ? 'center-active' : ''}`}
            >
              <div className="jsdesign-card-inner">
                <div className="jsdesign-card-preview" style={{ background: `${software.color}15` }}>
                  <div className="jsdesign-card-icon" style={{ background: software.color }}>
                    {software.name.charAt(0)}
                  </div>
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
      {/* 分类导航 - 位于右侧卡片底部 */}
      <div className="jsdesign-tab-bar-right">
        {[
          { value: 'all', label: '全部', icon: '⊞' },
          { value: 'machinery', label: '机械制造', icon: '⚙' },
          { value: 'electronics', label: '电子信息', icon: '◈' },
          { value: 'software', label: '软件服务', icon: '◉' },
          { value: 'enterprise', label: '企业服务', icon: '◐' },
          { value: 'automotive', label: '汽车制造', icon: '▣' },
          { value: 'iot', label: '工业互联网', icon: '◫' },
        ].map((tab, index) => (
          <Link
            key={tab.value}
            to={`/software?industry=${tab.value === 'all' ? '' : tab.value}`}
            className={`jsdesign-tab-item-right ${index === 0 ? 'active' : ''}`}
          >
            <span className="jsdesign-tab-icon-right">{tab.icon}</span>
            <span className="jsdesign-tab-label-right">{tab.label}</span>
          </Link>
        ))}
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

// 合作伙伴组件 - 全新高端UI/UX设计
interface Partner {
  name: string
  abbr: string
  tag: string
}

interface PartnersSectionProps {
  partners: Partner[]
  partnerAnim: { ref: React.RefObject<HTMLDivElement | null>, isVisible: boolean }
}

function PartnersSection({ partners, partnerAnim }: PartnersSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 复制数据实现无缝滚动
  const duplicatedPartners = [...partners, ...partners, ...partners]

  return (
    <section className={`section-v2 partners-v2-new ${partnerAnim.isVisible ? 'visible' : ''}`} ref={partnerAnim.ref}>
      <div className="container-v2">
        {/* 标题区域 - 与其他模块保持一致 */}
        <div className="section-header-v2">
          <div className="section-tag">PARTNERS</div>
          <h2 className="section-title-v2">
            <TrophyOutlined />
            合作伙伴
          </h2>
          <p className="section-desc-v2">携手行业领军企业，共建工业软件生态</p>
        </div>

        {/* Logo墙 - 无限滚动 */}
        <div className="partners-logo-wall">
          <div className="logo-wall-track" ref={scrollRef}>
            {duplicatedPartners.map((partner, index) => (
              <div
                key={index}
                className={`logo-wall-item ${hoveredIndex === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="logo-item-inner">
                  <span className="logo-text">{partner.abbr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 精选合作伙伴展示 */}
        <div className="partners-featured-new">
          <div className="featured-main-card">
            <div className="featured-glass-effect" />
            <div className="featured-content">
              <div className="featured-badge">
                <TrophyOutlined />
                战略合作伙伴
              </div>
              <h3 className="featured-name">湖北省工信厅</h3>
              <p className="featured-desc">指导单位 · 政策支撑 · 产业引领</p>
              <div className="featured-divider" />
              <div className="featured-metrics">
                <div className="featured-metric">
                  <span className="metric-value">100+</span>
                  <span className="metric-label">政策支持</span>
                </div>
                <div className="featured-metric">
                  <span className="metric-value">50+</span>
                  <span className="metric-label">企业扶持</span>
                </div>
                <div className="featured-metric">
                  <span className="metric-value">10亿</span>
                  <span className="metric-label">资金支持</span>
                </div>
              </div>
            </div>
            <div className="featured-glow" />
          </div>

          {/* 其他合作伙伴网格 */}
          <div className="partners-grid-new">
            {partners.slice(0, 6).map((partner, index) => (
              <div
                key={index}
                className="partner-grid-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="partner-grid-inner">
                  <div className="partner-grid-logo">
                    {partner.abbr.charAt(0)}
                  </div>
                  <div className="partner-grid-info">
                    <span className="partner-grid-name">{partner.name}</span>
                    <span className="partner-grid-tag">{partner.tag}</span>
                  </div>
                </div>
                <div className="partner-grid-shine" />
              </div>
            ))}
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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!solutionAnim.isVisible || !isAutoPlaying) return

    intervalRef.current = setInterval(() => {
      handleSwitch((prev) => (prev + 1) % solutions.length)
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [solutionAnim.isVisible, isAutoPlaying, solutions.length])

  const handleSwitch = (indexFn: (prev: number) => number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setActiveIndex(indexFn)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const handleClick = (index: number) => {
    if (index === activeIndex || isTransitioning) return
    handleSwitch(() => index)
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
            className={`solution-card-v3 ${isTransitioning ? 'transitioning' : ''}`}
            style={{ '--card-color': activeSolution.color, '--card-gradient': activeSolution.gradient } as React.CSSProperties}
          >
            {/* 动态背景 */}
            <div className="solution-card-bg">
              <div className="card-bg-glow" />
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

            {/* 卡片底部 */}
            <div className="solution-card-footer">
              <Link to={`/solutions/${activeSolution.id}`} className="card-action-btn">
                <span>查看详情</span>
                <div className="btn-icon">
                  <ArrowRightOutlined />
                </div>
              </Link>
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentIndexRef = useRef(0)

  // 每3.5秒滑动1条政策数据
  useEffect(() => {
    const container = containerRef.current
    if (!container || isHovering) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // 确保容器可以滚动
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    
    if (scrollHeight <= clientHeight) {
      return
    }

    const itemHeight = 80 // 每条政策的高度
    const maxIndex = policies.length // 第一组数据的条目数
    
    // 每3.5秒滚动到下一条
    intervalRef.current = setInterval(() => {
      if (!container) return
      
      currentIndexRef.current += 1
      
      // 无缝循环：滚动完第一组数据后重置
      if (currentIndexRef.current >= maxIndex) {
        currentIndexRef.current = 0
        container.scrollTo({ top: 0, behavior: 'auto' })
      } else {
        const scrollTop = currentIndexRef.current * itemHeight
        container.scrollTo({ top: scrollTop, behavior: 'smooth' })
      }
    }, 3500) // 3.5秒间隔

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovering, policies.length])

  // 点击时选中
  const handleItemClick = (index: number) => {
    onSelect(index)
  }

  // 复制数据实现无缝循环（3倍数据确保平滑）
  const duplicatedPolicies = [...policies, ...policies, ...policies]

  return (
    <div
      className="policy-list-container-v2"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="policy-list-v2 auto-scroll" ref={containerRef}>
        {duplicatedPolicies.map((policy, index) => {
          const actualIndex = index % policies.length
          const isActive = actualIndex === selectedIndex
          return (
            <div
              key={`${policy.id}-${index}`}
              className={`policy-list-item-v2 ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(actualIndex)}
            >
              <div className="policy-item-content">
                <div className="policy-item-top">
                  <span className="policy-item-category">{policy.category}</span>
                  <span className="policy-item-date">{policy.date}</span>
                </div>
                <h4 className="policy-item-title" title={policy.title}>
                  {policy.title}
                </h4>
                <div className="policy-item-summary">
                  {policy.summary.slice(0, 40)}...
                </div>
              </div>
              <div className="policy-item-arrow">
                <ArrowRightOutlined />
              </div>
            </div>
          )
        })}
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
          {/* 动态背景 */}
          <div className="policy-featured-bg">
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
          </div>

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

          {/* 装饰角标 */}
          <div className="policy-corner policy-corner-tl" />
          <div className="policy-corner policy-corner-tr" />
          <div className="policy-corner policy-corner-bl" />
          <div className="policy-corner policy-corner-br" />
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

const solutions = [
  {
    id: 'smart-manufacturing',
    title: '智能制造',
    subtitle: 'Smart Manufacturing',
    desc: 'MES/ERP/PLM 一体化解决方案，实现生产全流程数字化管理，助力企业打造智能工厂',
    icon: SettingOutlined,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    features: ['生产计划排程', '质量追溯管理', '设备预测维护', '智能仓储物流'],
    stats: { users: '500+', efficiency: '30%', cases: '120+' }
  },
  {
    id: 'industrial-iot',
    title: '工业互联',
    subtitle: 'Industrial IoT',
    desc: 'IoT 平台与边缘计算服务，构建万物互联的工业生态，实现设备互联互通',
    icon: CloudOutlined,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    features: ['设备远程监控', '数据采集分析', '边缘智能计算', '云端协同管理'],
    stats: { users: '800+', efficiency: '45%', cases: '200+' }
  },
  {
    id: 'digital-twin',
    title: '数字孪生',
    subtitle: 'Digital Twin',
    desc: '3D 可视化与仿真模拟，打造虚实融合的智能制造，实现产品全生命周期管理',
    icon: ApiOutlined,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    features: ['3D 可视化建模', '实时数据映射', '虚拟调试验证', '预测性分析'],
    stats: { users: '300+', efficiency: '25%', cases: '80+' }
  },
  {
    id: 'ai-inspection',
    title: 'AI 质检',
    subtitle: 'AI Quality Inspection',
    desc: '智能视觉检测与质量分析，提升产品质量与检测效率，实现零缺陷目标',
    icon: LineChartOutlined,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
          
          <div className="section-footer-v2">
            <Link to="/policy" className="link-arrow-v2">
              查看全部政策 <ArrowRightOutlined />
            </Link>
          </div>
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
            <div className="section-tag">PRODUCTS</div>
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
                <Link to="/software" className="jsdesign-btn">
                  进入软件中心 <ArrowRightOutlined />
                </Link>
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
    </div>
  )
}
