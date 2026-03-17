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
} from '@ant-design/icons'

const PolicyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // 模拟政策详情数据
  const policyData = {
    id: Number(id),
    title: '湖北省促进工业软件高质量发展若干措施',
    category: '产业政策',
    type: '省级',
    date: '2026-03-01',
    views: 1256,
    source: '湖北省经济和信息化厅',
    tags: ['工业软件', '高质量发展', '政策支持'],
    content: `
      <h2>一、总体要求</h2>
      <p>为贯彻落实国家软件发展战略，加快推动湖北省工业软件产业高质量发展，制定以下措施。</p>
      
      <h2>二、支持措施</h2>
      <h3>（一）加大研发投入支持</h3>
      <p>对工业软件企业研发投入给予补贴，最高不超过实际研发投入的20%，单个企业年度最高补贴500万元。</p>
      
      <h3>（二）支持产品创新</h3>
      <p>对入选国家、省级工业软件优秀产品的企业，分别给予100万元、50万元奖励。</p>
      
      <h3>（三）推动应用示范</h3>
      <p>支持工业软件在重点行业的应用示范，对应用示范项目给予最高200万元支持。</p>
      
      <h2>三、申报条件</h2>
      <p>1. 在湖北省注册登记的独立法人企业；</p>
      <p>2. 主要从事工业软件研发、生产、销售和服务；</p>
      <p>3. 具有自主知识产权的工业软件产品；</p>
      <p>4. 近三年无重大违法违规记录。</p>
      
      <h2>四、申报流程</h2>
      <p>1. 企业在线提交申报材料；</p>
      <p>2. 市州经信部门初审；</p>
      <p>3. 省经信厅组织专家评审；</p>
      <p>4. 公示并下达资金计划。</p>
    `,
    relatedPolicies: [
      {
        id: 2,
        title: '2026年度湖北省工业软件补贴券申报指南',
        date: '2026-03-10',
      },
      {
        id: 4,
        title: '湖北省工业软件产业发展专项资金管理办法',
        date: '2026-03-05',
      },
    ],
  }

  // 获取类型标签颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case '国家级':
        return { bg: 'rgba(239, 68, 68, 0.08)', text: '#dc2626' }
      case '省级':
        return { bg: 'rgba(59, 130, 246, 0.08)', text: '#6366f1' }
      case '市级':
        return { bg: 'rgba(16, 185, 129, 0.08)', text: '#059669' }
      default:
        return { bg: 'rgba(100, 116, 139, 0.08)', text: '#64748b' }
    }
  }

  // 获取分类标签颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '补贴政策':
        return { bg: 'rgba(249, 115, 22, 0.08)', text: '#ea580c' }
      case '产业政策':
        return { bg: 'rgba(99, 102, 241, 0.08)', text: '#6366f1' }
      case '申报通知':
        return { bg: 'rgba(6, 182, 212, 0.08)', text: '#0891b2' }
      default:
        return { bg: 'rgba(100, 116, 139, 0.08)', text: '#64748b' }
    }
  }

  const typeColor = getTypeColor(policyData.type)
  const categoryColor = getCategoryColor(policyData.category)

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
                    <span style={{ fontWeight: 500 }}>政策中心</span>
                  </span>
                ),
                href: '/policy'
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
                    {policyData.title}
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
                      background: categoryColor.bg,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: categoryColor.text,
                    }}
                  >
                    {policyData.category}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      background: typeColor.bg,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: typeColor.text,
                    }}
                  >
                    {policyData.type}
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
                  {policyData.title}
                </h1>

                {/* 元信息 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    color: 'var(--text-tertiary)',
                    fontSize: '14px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BankOutlined style={{ fontSize: '14px' }} />
                    {policyData.source}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CalendarOutlined style={{ fontSize: '14px' }} />
                    发布时间：{policyData.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <EyeOutlined style={{ fontSize: '14px' }} />
                    {policyData.views.toLocaleString()} 次浏览
                  </span>
                </div>
              </div>

              <Divider style={{ margin: '24px 0', borderColor: 'var(--border-light)' }} />

              {/* 正文内容 */}
              <div
                style={{
                  fontSize: '15px',
                  lineHeight: '1.8',
                  color: 'var(--text-secondary)',
                }}
                dangerouslySetInnerHTML={{ __html: policyData.content }}
              />

              <Divider style={{ margin: '32px 0 24px' }} />

              {/* 底部操作 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* 标签 */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {policyData.tags.map((tag) => (
                    <Tag key={tag} style={{ borderRadius: '4px' }}>
                      {tag}
                    </Tag>
                  ))}
                </div>

                {/* 操作按钮 */}
                <Space>
                  <Button icon={<ShareAltOutlined />}>分享</Button>
                  <Button icon={<PrinterOutlined />}>打印</Button>
                </Space>
              </div>
            </Card>
          </div>

          {/* 右侧侧边栏 */}
          <div style={{ width: '320px' }}>
            {/* 相关政策 */}
            <Card
              title="相关政策"
              style={{
                borderRadius: '16px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '24px',
                background: 'var(--bg-card)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {policyData.relatedPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    style={{
                      padding: '16px',
                      background: 'var(--bg-tertiary)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => navigate(`/policy/${policy.id}`)}
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
                      {policy.title}
                    </h4>
                    <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                      {policy.date}
                    </span>
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

export default PolicyDetail
