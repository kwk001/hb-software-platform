import { useState, useEffect, useRef } from 'react'
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
  HeartOutlined,
  ArrowUpOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { softwareList } from '../../data/software'
import './home-styles.css'

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

// 政策展示组件 - 左右布局+滚动动效
function PolicyShowcase({ policies }: { policies: typeof policyList }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedPolicy = policies[selectedIndex]

  // 自动滚动效果 - 2.5秒切换
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % policies.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [isPaused, policies.length])

  // 滚动到选中项 - 始终保持在第1行
  useEffect(() => {
    if (listRef.current) {
      // 计算需要滚动的位置，使选中项始终显示在第1行
      const itemHeight = 76 // 每个列表项的高度（包含间距）
      listRef.current.scrollTo({
        top: selectedIndex * itemHeight,
        behavior: 'smooth'
      })
    }
  }, [selectedIndex])

  return (
    <div className="policy-showcase">
      {/* 左侧 - 详细政策展示 */}
      <div className="policy-showcase-left">
        <div className="policy-featured">
          <div className="policy-featured-badge">
            <span className="badge-icon">★</span>
            <span>精选政策</span>
          </div>

          <div className="policy-featured-content">
            <div className="policy-featured-meta">
              <span className="policy-featured-category">{selectedPolicy.category}</span>
              <span className="policy-featured-type">{selectedPolicy.type}</span>
            </div>

            <h3 className="policy-featured-title">{selectedPolicy.title}</h3>

            <p className="policy-featured-summary">{selectedPolicy.summary}</p>

            {selectedPolicy.highlights && (
              <div className="policy-featured-highlights">
                {selectedPolicy.highlights.map((highlight, idx) => (
                  <span key={idx} className="highlight-tag">{highlight}</span>
                ))}
              </div>
            )}

            <div className="policy-featured-footer">
              <div className="policy-featured-info">
                <span className="info-item">
                  <EyeOutlined /> {selectedPolicy.views} 浏览
                </span>
                <span className="info-item">
                  <ClockCircleOutlined /> {selectedPolicy.date}
                </span>
                {selectedPolicy.deadline && (
                  <span className="info-item deadline">
                    <span className="deadline-label">截止:</span> {selectedPolicy.deadline}
                  </span>
                )}
              </div>

              <Link to={`/policy/${selectedPolicy.id}`} className="btn-view-policy">
                查看详情 <ArrowRightOutlined />
              </Link>
            </div>
          </div>

          {/* 装饰元素 */}
          <div className="policy-featured-glow" />
        </div>
      </div>

      {/* 右侧 - 政策列表（滚动动效） */}
      <div className="policy-showcase-right">
        <div
          className="policy-list-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="policy-list" ref={listRef}>
            {policies.map((policy, index) => (
              <div
                key={policy.id}
                className={`policy-list-item ${index === selectedIndex ? 'active' : ''}`}
                onClick={() => setSelectedIndex(index)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="policy-item-content">
                  <div className="policy-item-meta">
                    <span className="policy-item-category">{policy.category}</span>
                    <span className="policy-item-date">{policy.date}</span>
                  </div>
                  <h4 className="policy-item-title">{policy.title}</h4>
                </div>
                <div className="policy-item-arrow">
                  <ArrowRightOutlined />
                </div>
              </div>
            ))}
          </div>
        </div>
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
  { label: '交易金额', value: 2.8, suffix: '亿', icon: LineChartOutlined, decimals: 1 },
]

const solutions = [
  { title: '智能制造', desc: 'MES/ERP/PLM 一体化解决方案', icon: SettingOutlined },
  { title: '工业互联', desc: 'IoT 平台与边缘计算服务', icon: CloudOutlined },
  { title: '数字孪生', desc: '3D 可视化与仿真模拟', icon: ApiOutlined },
  { title: 'AI 质检', desc: '智能视觉检测与质量分析', icon: LineChartOutlined },
]

// 滚动动画 Hook
function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

export default function Home() {
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [isSoftwarePaused, setIsSoftwarePaused] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  // 软件产品自动轮播
  useEffect(() => {
    if (isSoftwarePaused) return
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % homeSoftwareList.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isSoftwarePaused])

  // 统计数据动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
          observer.unobserve(entry.target)
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
          <div className="hero-v2-badge">
            <span className="badge-dot" />
            <span>平台已正式上线运营</span>
          </div>
          
          <h1 className="hero-v2-title">
            <span className="title-line">湖北省</span>
            <span className="title-line title-highlight">工业软件</span>
            <span className="title-line">公共服务平台</span>
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
          
          <div className="hero-v2-stats" ref={statsRef}>
            {stats.map((stat, index) => {
              const animatedValue = useCountUp(stat.value, 2000, stat.decimals || 0, statsVisible)
              const Icon = stat.icon
              return (
                <div key={index} className="stat-card-v2" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="stat-icon-v2">
                    <Icon />
                  </div>
                  <div className="stat-value-v2">
                    {animatedValue}
                    <span className="stat-suffix">{stat.suffix}</span>
                  </div>
                  <div className="stat-label-v2">{stat.label}</div>
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
      <section className={`section-v2 solutions-v2 ${solutionAnim.isVisible ? 'visible' : ''}`} ref={solutionAnim.ref}>
        <div className="container-v2">
          <div className="section-header-v2">
            <div className="section-tag">SOLUTIONS</div>
            <h2 className="section-title-v2">
              <RocketOutlined />
              行业解决方案
            </h2>
            <p className="section-desc-v2">覆盖制造业全流程的数字化解决方案</p>
          </div>
          
          <div className="solutions-grid-v2">
            {solutions.map((solution, index) => {
              const Icon = solution.icon
              return (
                <div 
                  key={index} 
                  className="solution-card-v2"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="solution-icon-v2">
                    <Icon />
                  </div>
                  <h3 className="solution-title-v2">{solution.title}</h3>
                  <p className="solution-desc-v2">{solution.desc}</p>
                  <div className="solution-arrow-v2">
                    <ArrowRightOutlined />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================
          Products Section - 推荐产品
          ======================================== */}
      <section className={`section-v2 products-v2 ${productAnim.isVisible ? 'visible' : ''}`} ref={productAnim.ref}>
        <div className="container-v2">
          <div className="section-header-v2">
            <div className="section-tag">PRODUCTS</div>
            <h2 className="section-title-v2">
              <ThunderboltOutlined />
              推荐产品
            </h2>
            <p className="section-desc-v2">精选优质工业软件，助力企业数字化转型</p>
          </div>
          
          <div 
            className="products-grid-v2"
            onMouseEnter={() => setIsSoftwarePaused(true)}
            onMouseLeave={() => setIsSoftwarePaused(false)}
          >
            {homeSoftwareList.slice(0, 6).map((software, index) => (
              <Link 
                to={`/software/${software.id}`} 
                key={software.id}
                className="product-card-v2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="product-card-glow" style={{ background: software.color }} />
                <div className="product-card-content">
                  <div className="product-icon-v2" style={{ background: software.color }}>
                    {software.name.charAt(0)}
                  </div>
                  <div className="product-info-v2">
                    <span className="product-category-v2">{software.categoryLabel}</span>
                    <h3 className="product-name-v2">{software.name}</h3>
                    <p className="product-desc-v2">{software.description.slice(0, 50)}...</p>
                  </div>
                  <div className="product-footer-v2">
                    <span className="product-price-v2">
                      {software.isFree ? '免费' : software.price}
                    </span>
                    <span className="product-arrow-v2">
                      <ArrowRightOutlined />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="section-footer-v2">
            <Link to="/software" className="link-arrow-v2">
              查看全部产品 <ArrowRightOutlined />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          Process Section - 入驻流程
          ======================================== */}
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
              return (
                <div 
                  key={index} 
                  className="process-step-v2"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="process-number-v2">0{index + 1}</div>
                  <div className="process-icon-v2">
                    <Icon />
                  </div>
                  <h3 className="process-title-v2">{step.title}</h3>
                  <p className="process-desc-v2">{step.desc}</p>
                  {index < processSteps.length - 1 && (
                    <div className="process-connector-v2">
                      <RightOutlined />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================
          Partners Section - 合作伙伴
          ======================================== */}
      <section className={`section-v2 partners-v2 ${partnerAnim.isVisible ? 'visible' : ''}`} ref={partnerAnim.ref}>
        <div className="container-v2">
          <div className="section-header-v2">
            <div className="section-tag">PARTNERS</div>
            <h2 className="section-title-v2">
              <TrophyOutlined />
              合作伙伴
            </h2>
            <p className="section-desc-v2">携手行业领军企业，共建工业软件生态</p>
          </div>
          
          <div className="partners-grid-v2">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="partner-card-v2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="partner-logo-v2">
                  {partner.abbr.charAt(0)}
                </div>
                <div className="partner-info-v2">
                  <span className="partner-name-v2">{partner.name}</span>
                  <span className="partner-tag-v2">{partner.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
