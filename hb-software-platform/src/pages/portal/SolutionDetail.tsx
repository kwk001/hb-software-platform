import { useParams, Link } from 'react-router-dom'
import {
  SettingOutlined,
  CloudOutlined,
  ApiOutlined,
  LineChartOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  TeamOutlined,
  ToolOutlined,
  SafetyOutlined,
  BulbOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons'
import './solution-detail-styles.css'

const solutionsData = [
  {
    id: 'smart-manufacturing',
    title: '智能制造',
    subtitle: 'Smart Manufacturing',
    desc: 'MES/ERP/PLM 一体化解决方案，实现生产全流程数字化管理，助力企业打造智能工厂',
    icon: SettingOutlined,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    features: [
      { title: '生产计划排程', desc: '智能排产算法，优化资源配置，提升生产效率' },
      { title: '质量追溯管理', desc: '全程质量追踪，快速定位问题，保障产品质量' },
      { title: '设备预测维护', desc: 'AI 预测性维护，降低设备故障率，延长设备寿命' },
      { title: '智能仓储物流', desc: '自动化仓储管理，优化物流路径，降低库存成本' },
    ],
    stats: { users: '500+', efficiency: '30%', cases: '120+' },
    benefits: [
      '生产效率提升 30%',
      '库存周转率提升 25%',
      '设备故障率降低 40%',
      '产品不良率降低 50%',
    ],
    cases: [
      { name: '某汽车零部件企业', result: '生产效率提升 35%，库存成本降低 20%' },
      { name: '某电子制造企业', result: '产品良率从 92% 提升至 98%' },
      { name: '某机械加工企业', result: '设备综合效率 OEE 提升 28%' },
    ],
  },
  {
    id: 'industrial-iot',
    title: '工业互联',
    subtitle: 'Industrial IoT',
    desc: 'IoT 平台与边缘计算服务，构建万物互联的工业生态，实现设备互联互通',
    icon: CloudOutlined,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    features: [
      { title: '设备远程监控', desc: '实时监控设备状态，远程诊断故障，快速响应问题' },
      { title: '数据采集分析', desc: '多源数据采集，大数据分析，洞察生产规律' },
      { title: '边缘智能计算', desc: '边缘端实时处理，降低延迟，提升响应速度' },
      { title: '云端协同管理', desc: '云端统一管控，多工厂协同，资源优化配置' },
    ],
    stats: { users: '800+', efficiency: '45%', cases: '200+' },
    benefits: [
      '设备联网率 100%',
      '数据采集实时性 <100ms',
      '运维成本降低 35%',
      '决策效率提升 60%',
    ],
    cases: [
      { name: '某钢铁企业', result: '能耗降低 15%，产能提升 12%' },
      { name: '某化工企业', result: '安全事故减少 80%，环保达标率 100%' },
      { name: '某能源企业', result: '设备利用率提升 30%，维护成本降低 25%' },
    ],
  },
  {
    id: 'digital-twin',
    title: '数字孪生',
    subtitle: 'Digital Twin',
    desc: '3D 可视化与仿真模拟，打造虚实融合的智能制造，实现产品全生命周期管理',
    icon: ApiOutlined,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    features: [
      { title: '3D 可视化建模', desc: '高精度三维建模，真实还原物理世界' },
      { title: '实时数据映射', desc: '虚实数据同步，实时反映物理状态' },
      { title: '虚拟调试验证', desc: '虚拟环境调试，降低试错成本' },
      { title: '预测性分析', desc: '基于孪生模型的预测分析，提前预警' },
    ],
    stats: { users: '300+', efficiency: '25%', cases: '80+' },
    benefits: [
      '设计周期缩短 40%',
      '试错成本降低 60%',
      '产品迭代速度提升 50%',
      '客户满意度提升 35%',
    ],
    cases: [
      { name: '某航空制造企业', result: '新产品研发周期缩短 45%' },
      { name: '某汽车设计院', result: '虚拟验证替代 70% 物理样机' },
      { name: '某装备制造企业', result: '售后服务响应速度提升 60%' },
    ],
  },
  {
    id: 'ai-inspection',
    title: 'AI 质检',
    subtitle: 'AI Quality Inspection',
    desc: '智能视觉检测与质量分析，提升产品质量与检测效率，实现零缺陷目标',
    icon: LineChartOutlined,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    features: [
      { title: '视觉缺陷检测', desc: 'AI 视觉识别，自动检测产品缺陷' },
      { title: '尺寸精度测量', desc: '高精度尺寸测量，误差小于 0.01mm' },
      { title: '表面质量分析', desc: '表面瑕疵检测，纹理分析评估' },
      { title: '智能分类分拣', desc: '自动分类分拣，提升处理效率' },
    ],
    stats: { users: '600+', efficiency: '60%', cases: '150+' },
    benefits: [
      '检测精度 >99.5%',
      '检测速度提升 10 倍',
      '漏检率降低 95%',
      '人工成本降低 70%',
    ],
    cases: [
      { name: '某半导体企业', result: '芯片缺陷检测准确率 99.8%' },
      { name: '某食品企业', result: '异物检测速度提升 15 倍' },
      { name: '某纺织企业', result: '瑕疵检出率从 85% 提升至 99%' },
    ],
  },
]

function SolutionDetail() {
  const { id } = useParams<{ id: string }>()
  const solution = solutionsData.find((s) => s.id === id)

  if (!solution) {
    return (
      <div className="solution-detail-page">
        <div className="container-v2">
          <div className="solution-not-found">
            <h2>解决方案不存在</h2>
            <Link to="/" className="back-link">
              <ArrowLeftOutlined /> 返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const Icon = solution.icon

  return (
    <div className="solution-detail-page">
      {/* Hero Section */}
      <section className="solution-hero" style={{ background: solution.gradient }}>
        <div className="solution-hero-bg">
          <div className="solution-hero-pattern" />
        </div>
        <div className="container-v2">
          <Link to="/" className="solution-back-btn">
            <ArrowLeftOutlined /> 返回首页
          </Link>
          <div className="solution-hero-content">
            <div className="solution-hero-icon">
              <Icon />
            </div>
            <h1 className="solution-hero-title">{solution.title}</h1>
            <p className="solution-hero-subtitle">{solution.subtitle}</p>
            <p className="solution-hero-desc">{solution.desc}</p>
            <div className="solution-hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">{solution.stats.users}</span>
                <span className="hero-stat-label">服务企业</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">{solution.stats.efficiency}</span>
                <span className="hero-stat-label">效率提升</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">{solution.stats.cases}</span>
                <span className="hero-stat-label">成功案例</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="solution-features-section">
        <div className="container-v2">
          <div className="section-header-v2">
            <div className="section-tag">FEATURES</div>
            <h2 className="section-title-v2">
              <ToolOutlined />
              核心功能
            </h2>
            <p className="section-desc-v2">全面的功能模块，满足企业多样化需求</p>
          </div>
          <div className="solution-features-grid">
            {solution.features.map((feature, index) => (
              <div key={index} className="solution-feature-card" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="feature-card-number">0{index + 1}</div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="solution-benefits-section">
        <div className="container-v2">
          <div className="section-header-v2">
            <div className="section-tag">BENEFITS</div>
            <h2 className="section-title-v2">
              <BulbOutlined />
              应用价值
            </h2>
            <p className="section-desc-v2">为企业带来显著的效益提升</p>
          </div>
          <div className="solution-benefits-grid">
            {solution.benefits.map((benefit, index) => (
              <div key={index} className="solution-benefit-item" style={{ animationDelay: `${index * 100}ms` }}>
                <CheckCircleOutlined className="benefit-icon" style={{ color: solution.color }} />
                <span className="benefit-text">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="solution-cases-section">
        <div className="container-v2">
          <div className="section-header-v2">
            <div className="section-tag">成功案例</div>
            <h2 className="section-title-v2">
              <TeamOutlined />
              成功案例
            </h2>
            <p className="section-desc-v2">众多企业的信赖之选</p>
          </div>
          <div className="solution-cases-list">
            {solution.cases.map((caseItem, index) => (
              <div key={index} className="solution-case-card" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="case-card-header">
                  <RocketOutlined className="case-card-icon" style={{ color: solution.color }} />
                  <h3 className="case-card-title">{caseItem.name}</h3>
                </div>
                <div className="case-card-result">
                  <SafetyOutlined className="result-icon" />
                  <span>{caseItem.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="solution-cta-section" style={{ background: solution.gradient }}>
        <div className="container-v2">
          <div className="solution-cta-content">
            <h2>开启数字化转型之旅</h2>
            <p>立即联系我们，获取专属解决方案</p>
            <div className="solution-cta-buttons">
              <a href="tel:400-888-8888" className="cta-btn cta-btn-primary">
                <PhoneOutlined /> 电话咨询
              </a>
              <a href="mailto:contact@example.com" className="cta-btn cta-btn-secondary">
                <MailOutlined /> 邮件咨询
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SolutionDetail
