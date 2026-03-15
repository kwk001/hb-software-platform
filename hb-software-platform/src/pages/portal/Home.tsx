import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button, Statistic } from 'antd'
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
import { policyList } from '../../data/policies.tsx'
import { softwareList } from '../../data/software'
import './home-styles.css'

// 数据
const homeSoftwareList = softwareList.slice(0, 8)
const policies = policyList.slice(0, 5)

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
  { name: '湖北省工信厅', abbr: '湖北工信', color: '#6366f1' },
  { name: '武汉市经信局', abbr: '武汉经信', color: '#8b5cf6' },
  { name: '东风汽车', abbr: '东风', color: '#ec4899' },
  { name: '烽火通信', abbr: '烽火', color: '#f59e0b' },
  { name: '华工科技', abbr: '华工', color: '#10b981' },
  { name: '中国信科', abbr: '信科', color: '#06b6d4' },
  { name: '三峡集团', abbr: '三峡', color: '#6366f1' },
  { name: '武钢集团', abbr: '武钢', color: '#8b5cf6' },
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

// Hero 背景配置
const HERO_BACKGROUNDS = [
  {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
    title: '湖北省工业软件公共服务平台',
    subtitle: '汇聚优质工业软件资源，助力企业数字化转型',
    desc: '为制造企业提供工业软件产品发现和补贴申请服务，为软件企业提供产品展示和需求对接服务',
  },
]

export default function Home() {
  const [currentBg, setCurrentBg] = useState(0)
  const [hoveredSoftware, setHoveredSoftware] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)

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

  const bg = HERO_BACKGROUNDS[currentBg]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div 
          className="hero-bg"
          style={{ backgroundImage: `url(${bg.image})` }}
        />
        <div className="hero-overlay" />
        <div className="hero-glow" />
        
        <div className="hero-content">
          <div className="container">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span>平台已正式上线运营</span>
            </div>
            
            <h1 className="hero-title">{bg.title}</h1>
            <p className="hero-subtitle">{bg.subtitle}</p>
            <p className="hero-desc">{bg.desc}</p>
            
            <div className="hero-buttons">
              <Link to="/software">
                <Button type="primary" size="large" className="hero-btn-primary">
                  浏览软件产品 <ArrowRightOutlined />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="large" className="hero-btn-secondary">
                  企业入驻
                </Button>
              </Link>
            </div>
            
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="hero-stat-item">
                  <div className="hero-stat-value">{stat.value}{stat.suffix}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="hero-scroll" style={{ opacity: Math.max(0, 1 - scrollY / 300) }}>
          <div className="hero-scroll-mouse">
            <div className="hero-scroll-wheel" />
          </div>
        </div>
      </section>

      {/* Stats Section - 数据统计大屏 */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`stat-card ${statsVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="stat-icon" style={{ background: `linear-gradient(135deg, ${stat.color || '#6366f1'}20, ${stat.color || '#6366f1'}10)` }}>
                  <stat.icon style={{ color: stat.color || '#6366f1' }} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">
                    {statsVisible ? (
                      <Statistic 
                        value={stat.value} 
                        suffix={stat.suffix}
                        precision={stat.decimals || 0}
                        valueStyle={{ color: '#f8fafc', fontSize: 36, fontWeight: 700 }}
                      />
                    ) : (
                      <span>0</span>
                    )}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
                <div className="stat-trend">
                  <ArrowUpOutlined /> +{12 + index * 5}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Section - 3D悬浮卡片 */}
      <section className="software-section">
        <div className="section-glow" />
        <div className="container">
          <div className="section-header">
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
          
          <div className="software-grid">
            {homeSoftwareList.map((software, index) => (
              <Link 
                to={`/software/${software.id}`} 
                key={software.id}
                className="software-card-wrapper"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`software-card ${hoveredSoftware === software.id ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredSoftware(software.id)}
                  onMouseLeave={() => setHoveredSoftware(null)}
                >
                  <div className="software-card-glow" />
                  <div className="software-card-border" />
                  
                  <div className="software-card-image">
                    <img src={software.logo} alt={software.name} />
                    <div className="software-card-overlay">
                      <PlayCircleOutlined className="play-icon" />
                    </div>
                  </div>
                  
                  <div className="software-card-content">
                    <div className="software-card-tags">
                      <span className="software-tag">{software.categoryLabel}</span>
                      {software.isFree && <span className="software-tag free">免费</span>}
                    </div>
                    
                    <h3 className="software-card-title">{software.name}</h3>
                    <p className="software-card-desc">{software.description}</p>
                    
                    <div className="software-card-footer">
                      <div className="software-rating">
                        {[...Array(5)].map((_, i) => (
                          <StarOutlined 
                            key={i} 
                            className={i < Math.floor(software.rating) ? 'filled' : ''}
                          />
                        ))}
                        <span>{software.rating}</span>
                      </div>
                      <div className="software-stats">
                        <span><EyeOutlined /> {software.views}</span>
                        <span><HeartOutlined /> {software.likes || 128}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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

      {/* Process Section - 垂直时间轴 */}
      <section className="process-section">
        <div className="process-glow" />
        <div className="container">
          <div className="section-header center">
            <h2 className="section-title">
              <SafetyOutlined className="section-icon" />
              入驻流程
            </h2>
            <p className="section-subtitle">简单四步，快速入驻平台，享受全方位服务支持</p>
          </div>
          
          <div className="process-timeline">
            {processSteps.map((step, index) => (
              <div 
                key={index} 
                className="process-item"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="process-connector" />
                <div className="process-number" style={{ background: step.color }}>
                  <step.icon />
                </div>
                <div className="process-content">
                  <h3 className="process-title">{step.title}</h3>
                  <p className="process-desc">{step.desc}</p>
                </div>
                <div className="process-step">Step {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies Section - 左右非对称布局 */}
      <section className="policies-section">
        <div className="container">
          <div className="section-header">
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
          
          <div className="policies-layout">
            {/* 左侧大图 - 置顶政策 */}
            <div className="policy-featured">
              <Link to={`/policy/${policies[0].id}`} className="policy-featured-card">
                <div className="policy-featured-glow" />
                <div className="policy-featured-image">
                  <FileTextOutlined />
                </div>
                <div className="policy-featured-content">
                  <div className="policy-featured-badge">
                    <CrownOutlined /> 置顶政策
                  </div>
                  <h3 className="policy-featured-title">{policies[0].title}</h3>
                  <p className="policy-featured-summary">{policies[0].summary}</p>
                  <div className="policy-featured-meta">
                    <span><ClockCircleOutlined /> {policies[0].date}</span>
                    <span><EyeOutlined /> {policies[0].views}次浏览</span>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* 右侧列表 */}
            <div className="policy-list">
              {policies.slice(1).map((policy, index) => (
                <Link 
                  to={`/policy/${policy.id}`} 
                  key={policy.id}
                  className="policy-item"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="policy-timeline-dot" />
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
                          <ClockCircleOutlined /> 截止：{policy.deadline}
                        </span>
                      )}
                    </div>
                  </div>
                  <RightOutlined className="policy-item-arrow" />
                </Link>
              ))}
            </div>
          </div>
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
                <div className="partner-glow" />
                <div className="partner-logo">
                  <span style={{ color: partner.color }}>{partner.abbr}</span>
                </div>
                <div className="partner-name">{partner.name}</div>
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
