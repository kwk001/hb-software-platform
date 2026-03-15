import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Tag,
  Button,
  Divider,
  Space,
  Breadcrumb,
} from 'antd'
import {
  HomeOutlined,
  CalendarOutlined,
  EyeOutlined,
  BankOutlined,
  FileTextOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  MoneyCollectOutlined,
  CheckCircleOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { maskEnterpriseName } from '../../utils/mask'

const DemandDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // 模拟需求详情数据
  const demandData = {
    id: Number(id),
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
    contactPerson: '张经理',
    contactPhone: '138****8888',
    content: `
      <h2>一、项目背景</h2>
      <p>随着公司业务的快速发展，传统的生产管理模式已无法满足日益增长的订单需求。为提升生产效率、降低运营成本，公司决定实施智能制造升级项目，引入MES系统实现生产过程的全面数字化管理。</p>
      
      <h2>二、项目目标</h2>
      <p>1. 实现生产计划的智能排产和实时调整</p>
      <p>2. 建立全流程质量追溯体系</p>
      <p>3. 实现设备状态实时监控和预测性维护</p>
      <p>4. 提升生产透明度，实现数据驱动决策</p>
      
      <h2>三、功能需求</h2>
      <h3>（一）生产计划管理</h3>
      <p>支持基于订单、库存、产能等多维度因素的智能排产，具备计划调整、进度跟踪、异常预警等功能。</p>
      
      <h3>（二）生产过程监控</h3>
      <p>实时采集生产数据，监控设备运行状态、生产进度、质量指标等关键数据，支持可视化展示。</p>
      
      <h3>（三）质量管理系统</h3>
      <p>覆盖来料检验、过程检验、成品检验全流程，支持质量追溯、SPC分析、不合格品处理等功能。</p>
      
      <h3>（四）设备管理系统</h3>
      <p>设备台账管理、维护保养计划、故障管理、备件管理等功能模块。</p>
      
      <h2>四、技术要求</h2>
      <p>1. 系统架构：支持云端部署和本地部署</p>
      <p>2. 集成能力：提供标准API接口，支持与ERP、PLM、WMS等系统集成</p>
      <p>3. 扩展性：支持二次开发和功能扩展</p>
      <p>4. 安全性：符合工业信息安全等级保护要求</p>
      
      <h2>五、商务要求</h2>
      <p>1. 项目周期：6个月内完成实施</p>
      <p>2. 付款方式：按项目里程碑分期付款</p>
      <p>3. 售后服务：提供至少2年免费运维服务</p>
      <p>4. 培训服务：提供系统操作和管理培训</p>
    `,
    relatedDemands: [
      {
        id: 2,
        title: '工业数据采集平台开发',
        category: '物联网',
        budget: '30-50万',
      },
      {
        id: 3,
        title: 'ERP系统升级服务',
        category: 'ERP系统',
        budget: '20-30万',
      },
    ],
  }

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中':
        return { bg: 'rgba(59, 130, 246, 0.08)', text: '#6366f1' }
      case '已对接':
        return { bg: 'rgba(16, 185, 129, 0.08)', text: '#059669' }
      case '已关闭':
        return { bg: 'rgba(148, 163, 184, 0.08)', text: '#64748b' }
      default:
        return { bg: 'rgba(100, 116, 139, 0.08)', text: '#64748b' }
    }
  }

  const statusColor = getStatusColor(demandData.status)

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 64px)' }}>
      {/* 面包屑导航 */}
      <div style={{
        background: '#FAFBFC',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div className="container" style={{ padding: '8px 24px 6px' }}>
          <Breadcrumb
            separator={<span style={{ color: '#CBD5E1', margin: '0 6px', fontSize: '12px' }}>›</span>}
            items={[
              {
                title: (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#64748B',
                    fontSize: '13px',
                    transition: 'color 0.2s ease',
                  }}>
                    <HomeOutlined style={{ fontSize: '13px' }} />
                    <span style={{ fontWeight: 500 }}>首页</span>
                  </span>
                ),
                href: '/'
              },
              {
                title: (
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#64748B',
                    fontSize: '13px',
                    transition: 'color 0.2s ease',
                  }}>
                    <BankOutlined style={{ fontSize: '13px' }} />
                    <span style={{ fontWeight: 500 }}>需求广场</span>
                  </span>
                ),
                href: '/demand'
              },
              {
                title: (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#1D4ED8',
                    fontWeight: 600,
                    fontSize: '13px',
                    background: '#EFF6FF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #BFDBFE',
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      background: '#3B82F6',
                      borderRadius: '50%'
                    }} />
                    {demandData.title}
                  </span>
                )
              },
            ]}
          />
        </div>
      </div>

      <div className="container" style={{ padding: '32px 0' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* 左侧主要内容 */}
          <div style={{ flex: 1 }}>
            <Card
              style={{
                borderRadius: '16px',
                border: '1px solid rgba(0, 0, 0, 0.04)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.04)',
              }}
            >
              {/* 头部信息 */}
              <div style={{ marginBottom: '24px' }}>
                {/* 标签 */}
                <Space size="small" style={{ marginBottom: '16px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      background: 'rgba(59, 130, 246, 0.08)',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#6366f1',
                    }}
                  >
                    {demandData.category}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      background: statusColor.bg,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: statusColor.text,
                    }}
                  >
                    {demandData.status}
                  </span>
                </Space>

                {/* 标题 */}
                <h1
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: '0 0 16px 0',
                    lineHeight: 1.4,
                    letterSpacing: '-0.3px',
                  }}
                >
                  {demandData.title}
                </h1>

                {/* 元信息 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    color: 'var(--text-tertiary)',
                    fontSize: '14px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BankOutlined style={{ fontSize: '14px' }} />
                    {maskEnterpriseName(demandData.company)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CalendarOutlined style={{ fontSize: '14px' }} />
                    发布时间：{demandData.publishDate}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <EyeOutlined style={{ fontSize: '14px' }} />
                    {demandData.views.toLocaleString()} 次浏览
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--brand-primary)',
                      fontWeight: 600,
                    }}
                  >
                    <MoneyCollectOutlined style={{ fontSize: '14px' }} />
                    预算：{demandData.budget}
                  </span>
                </div>
              </div>

              <Divider style={{ margin: '24px 0', borderColor: 'var(--border-light)' }} />

              {/* 需求描述 */}
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: '0 0 12px 0',
                  }}
                >
                  需求概述
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {demandData.description}
                </p>
              </div>

              {/* 具体要求 */}
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: '0 0 12px 0',
                  }}
                >
                  具体要求
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {demandData.requirements.map((req, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '15px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                      }}
                    >
                      <CheckCircleOutlined style={{ color: 'var(--brand-primary)', marginTop: '3px', flexShrink: 0 }} />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Divider style={{ margin: '24px 0', borderColor: 'var(--border-light)' }} />

              {/* 详细内容 */}
              <div
                style={{
                  fontSize: '15px',
                  lineHeight: '1.8',
                  color: 'var(--text-secondary)',
                }}
                dangerouslySetInnerHTML={{ __html: demandData.content }}
              />

            </Card>
          </div>

          {/* 右侧侧边栏 */}
          <div style={{ width: '320px' }}>
            {/* 相关需求 */}
            <Card
              title="相关需求"
              style={{
                borderRadius: '16px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                background: 'var(--bg-card)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {demandData.relatedDemands.map((demand) => (
                  <div
                    key={demand.id}
                    style={{
                      padding: '16px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => navigate(`/demand/${demand.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-quaternary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-tertiary)'
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        margin: '0 0 8px 0',
                        lineHeight: 1.5,
                      }}
                    >
                      {demand.title}
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#6366f1',
                          fontWeight: 500,
                        }}
                      >
                        {demand.category}
                      </span>
                      <span style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600 }}>
                        {demand.budget}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemandDetail
