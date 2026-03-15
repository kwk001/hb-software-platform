import { useParams } from 'react-router-dom'
import {
  Row,
  Col,
  Card,
  Tag,
  List,
  Breadcrumb,
  Button,
  Divider,
  Space,
  Badge,
} from 'antd'
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  BuildOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  GlobalOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'

const SoftwareDetail = () => {
  const { id } = useParams()

  // 软件详情数据
  const software = {
    id: 1,
    name: '智能制造MES系统',
    company: '武汉XX科技有限公司',
    category: '生产制造',
    tags: ['MES', '智能制造', 'SaaS', '云端部署'],
    version: 'V3.2.1',
    updateDate: '2026-03-01',
    publishDate: '2025-06-15',
    contactPerson: '张经理',
    contactPhone: '13800138000',
    contactEmail: 'contact@example.com',
    address: '武汉市东湖高新区光谷大道123号',
    website: 'www.example.com',
    description:
      '智能制造MES系统是一款面向制造业的生产执行管理系统，通过实时数据采集、生产过程监控、质量追溯等功能，帮助企业实现生产过程的全面数字化管理。系统支持多种部署方式，可灵活适配不同规模企业的需求。',
    features: [
      '生产计划管理：智能排产、工单管理、进度跟踪',
      '生产过程监控：实时数据采集、设备状态监控、异常预警',
      '质量管理系统：来料检验、过程检验、成品检验、质量追溯',
      '设备管理系统：设备台账、维护保养、故障管理',
      '物料管理系统：库存管理、物料追溯、仓库管理',
      '数据分析报表：生产报表、质量报表、设备报表',
    ],
    screenshots: [
      'https://via.placeholder.com/800x450/0052D9/FFFFFF?text=截图1',
      'https://via.placeholder.com/800x450/409EFF/FFFFFF?text=截图2',
      'https://via.placeholder.com/800x450/00A870/FFFFFF?text=截图3',
    ],
  }

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
                    <AppstoreOutlined style={{ fontSize: '13px' }} /> 
                    <span style={{ fontWeight: 500 }}>软件产品</span>
                  </span>
                ), 
                href: '/software' 
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
                    {software.name}
                  </span>
                ) 
              },
            ]}
          />
        </div>
      </div>

      {/* 主内容区 */}
      <div className="container" style={{ padding: '24px 24px' }}>
        {/* 产品头部卡片 */}
        <Card
          style={{
            borderRadius: '20px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* 顶部装饰条 */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 50%, #3B82F6 100%)' }} />
          
          <div style={{ padding: '32px' }}>
            <Row gutter={[32, 24]} align="middle">
              {/* 产品图标 */}
              <Col xs={24} sm={3} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '28px',
                    fontWeight: 700,
                    margin: '0 auto',
                    boxShadow: '0 12px 30px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                    position: 'relative',
                  }}
                >
                  MES
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '20px',
                      height: '20px',
                      background: '#10B981',
                      borderRadius: '50%',
                      border: '3px solid #fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                </div>
              </Col>

              {/* 产品信息 */}
              <Col xs={24} sm={13}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <h1
                      style={{
                        fontSize: '30px',
                        fontWeight: 700,
                        color: '#0F172A',
                        margin: 0,
                        lineHeight: 1.2,
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {software.name}
                    </h1>
                    <Badge 
                      count="官方认证" 
                      style={{ 
                        backgroundColor: '#EFF6FF', 
                        color: '#1D4ED8',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid #BFDBFE',
                      }} 
                    />
                  </div>
                  <p
                    style={{
                      color: '#64748B',
                      fontSize: '15px',
                      margin: '0 0 16px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        background: '#F1F5F9',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <UserOutlined style={{ color: '#64748B', fontSize: '14px' }} />
                    </span>
                    {software.company}
                  </p>
                  <Space size={10} wrap>
                    {software.tags.map((tag) => (
                      <Tag
                        key={tag}
                        style={{
                          background: '#F8FAFC',
                          color: '#3B82F6',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          padding: '5px 14px',
                          fontSize: '13px',
                          fontWeight: 500,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </Col>

              {/* 联系按钮 */}
              <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PhoneOutlined />}
                    style={{
                      borderRadius: '12px',
                      height: '48px',
                      padding: '0 32px',
                      fontSize: '15px',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    联系咨询
                  </Button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} />
                    服务响应快
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* 内容网格 */}
        <Row gutter={[24, 24]}>
          {/* 左侧：产品详情 */}
          <Col xs={24} lg={17}>
            {/* 产品简介 */}
            <Card
              style={{
                borderRadius: '20px',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #E2E8F0',
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #BFDBFE',
                  }}
                >
                  <FileTextOutlined style={{ color: '#3B82F6', fontSize: '18px' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                    产品简介
                  </h2>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>Product Introduction</p>
                </div>
              </div>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.9',
                  fontSize: '15px',
                  margin: 0,
                  textAlign: 'justify',
                }}
              >
                {software.description}
              </p>
            </Card>

            {/* 核心功能 */}
            <Card
              style={{
                borderRadius: '20px',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--brand-success-bg)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--brand-success)',
                  }}
                >
                  <CheckCircleOutlined style={{ color: 'var(--brand-success)', fontSize: '18px' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    核心功能
                  </h2>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--text-quaternary)' }}>Core Features</p>
                </div>
              </div>
              <List
                grid={{ gutter: 16, xs: 1, sm: 2 }}
                dataSource={software.features}
                renderItem={(item) => (
                  <List.Item style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '18px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '14px',
                        height: '100%',
                        border: '1px solid var(--border-light)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '22px',
                          height: '22px',
                          background: 'var(--brand-primary)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        <CheckCircleOutlined style={{ color: '#fff', fontSize: '12px' }} />
                      </div>
                      <span style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '14px', fontWeight: 500 }}>
                        {item}
                      </span>
                    </div>
                  </List.Item>
                )}
              />
            </Card>

            {/* 产品截图 */}
            <Card
              style={{
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #E2E8F0',
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #FCD34D',
                  }}
                >
                  <BuildOutlined style={{ color: '#F59E0B', fontSize: '18px' }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                    产品截图
                  </h2>
                  <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#94A3B8' }}>Product Screenshots</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {software.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    style={{
                      flex: '1 1 calc(33.333% - 11px)',
                      minWidth: '200px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      border: '1px solid #E2E8F0',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <img
                      src={screenshot}
                      alt={`截图${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* 右侧：软件信息 */}
          <Col xs={24} lg={7}>
            <Card
              style={{
                borderRadius: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid #E2E8F0',
                position: 'sticky',
                top: '24px',
                overflow: 'hidden',
              }}
              bodyStyle={{ padding: 0 }}
            >
              {/* 软件信息标题 */}
              <div
                style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #FAFBFC 0%, #F8FAFC 100%)',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#0F172A',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      width: '4px',
                      height: '18px',
                      background: 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                      borderRadius: '2px',
                    }}
                  />
                  软件信息
                </h3>
                <p style={{ margin: '4px 0 0 12px', fontSize: '12px', color: '#94A3B8' }}>Software Information</p>
              </div>

              {/* 信息列表 */}
              <div style={{ padding: '8px 0' }}>
                {[
                  { label: '版本号', value: software.version },
                  { label: '软件分类', value: software.category },
                  { label: '开发商', value: software.company },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '16px 24px',
                      borderBottom: index < 2 ? '1px solid #F1F5F9' : 'none',
                    }}
                  >
                    <div
                      style={{
                        color: '#64748B',
                        fontSize: '12px',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        color: '#0F172A',
                        fontSize: '15px',
                        fontWeight: 600,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <Divider style={{ margin: 0 }} />

              {/* 日期信息 */}
              <div style={{ padding: '8px 0' }}>
                {[
                  { label: '更新日期', value: software.updateDate },
                  { label: '发布日期', value: software.publishDate },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '16px 24px',
                      borderBottom: index < 1 ? '1px solid #F1F5F9' : 'none',
                    }}
                  >
                    <div
                      style={{
                        color: 'var(--text-quaternary)',
                        fontSize: '12px',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <CalendarOutlined style={{ color: 'var(--text-quaternary)', fontSize: '14px' }} />
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <Divider style={{ margin: 0, borderColor: 'var(--border-light)' }} />

              {/* 联系信息 */}
              <div
                style={{
                  padding: '24px',
                  background: 'var(--bg-tertiary)',
                }}
              >
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: '0 0 20px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      width: '4px',
                      height: '16px',
                      background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                      borderRadius: '2px',
                    }}
                  />
                  联系方式
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div
                      style={{
                        color: 'var(--text-quaternary)',
                        fontSize: '12px',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      联系人
                    </div>
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '15px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          background: 'var(--brand-primary-bg)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <UserOutlined style={{ color: 'var(--brand-primary)', fontSize: '14px' }} />
                      </span>
                      {software.contactPerson}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        color: '#64748B',
                        fontSize: '12px',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      联系电话
                    </div>
                    <div
                      style={{
                        color: '#0F172A',
                        fontSize: '15px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          background: '#F0FDF4',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PhoneOutlined style={{ color: '#10B981', fontSize: '14px' }} />
                      </span>
                      {software.contactPhone}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SoftwareDetail
