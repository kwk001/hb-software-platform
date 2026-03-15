import {
  RiseOutlined,
  BankOutlined,
  FileTextOutlined,
  AimOutlined,
  TeamOutlined,
  StarOutlined,
  TrophyOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'

// 政策数据接口
export interface Policy {
  id: number
  title: string
  category: string
  type: string
  date: string
  views: number
  summary: string
  tags: string[]
  // 首页展示用字段
  isTop?: boolean
  deadline?: string
  icon?: ReactNode
  color?: string
  desc?: string
  highlights?: string[]
}

// 政策列表数据
export const policyList: Policy[] = [
  {
    id: 1,
    title: '湖北省促进工业软件高质量发展若干措施',
    category: '产业政策',
    type: '省级',
    date: '2026-03-01',
    views: 1256,
    summary:
      '为贯彻落实国家软件发展战略，加快推动湖北省工业软件产业高质量发展，制定以下措施...',
    tags: ['工业软件', '高质量发展', '政策支持'],
    // 首页展示字段
    isTop: true,
    deadline: '长期有效',
    icon: <StarOutlined />,
    color: '#ef4444',
    desc: '为贯彻落实国家软件发展战略，加快推动湖北省工业软件产业高质量发展，提供全方位政策支持。',
    highlights: ['资金扶持', '税收优惠', '人才支持'],
  },
  {
    id: 2,
    title: '2026年度湖北省工业软件补贴券申报指南',
    category: '申报通知',
    type: '省级',
    date: '2026-03-10',
    views: 2341,
    summary:
      '为支持工业企业采购工业软件，提升企业数字化水平，现组织开展2026年度工业软件补贴券申报工作...',
    tags: ['补贴券', '申报指南', '2026'],
    isTop: true,
    deadline: '2026-12-31',
    icon: <RiseOutlined />,
    color: '#6366f1',
    desc: '为支持工业企业采购工业软件，提升企业数字化水平，组织开展2026年度工业软件补贴券申报工作。',
    highlights: ['单企最高100万', '补贴比例50%', '在线申报'],
  },
  {
    id: 3,
    title: '关于组织开展2026年工业软件优秀产品征集工作的通知',
    category: '申报通知',
    type: '省级',
    date: '2026-03-08',
    views: 1892,
    summary:
      '为推广优秀工业软件产品，促进软件产业生态建设，现面向全省征集2026年工业软件优秀产品...',
    tags: ['优秀产品', '征集', '2026'],
    isTop: false,
    deadline: '2026-06-30',
    icon: <TrophyOutlined />,
    color: '#10b981',
    desc: '为推广优秀工业软件产品，促进软件产业生态建设，面向全省征集2026年工业软件优秀产品。',
    highlights: ['产品展示', '优先推荐', '政策支持'],
  },
  {
    id: 4,
    title: '湖北省工业软件产业发展专项资金管理办法',
    category: '补贴政策',
    type: '省级',
    date: '2026-03-05',
    views: 967,
    summary:
      '为规范工业软件产业发展专项资金管理，提高资金使用效益，根据相关法律法规，制定本办法...',
    tags: ['专项资金', '管理办法'],
    isTop: false,
    deadline: '长期有效',
    icon: <BankOutlined />,
    color: '#f59e0b',
    desc: '为规范工业软件产业发展专项资金管理，提高资金使用效益，制定专项资金管理办法。',
    highlights: ['资金规范', '项目管理', '绩效评估'],
  },
  {
    id: 5,
    title: '关于加快工业软件创新发展的指导意见',
    category: '产业政策',
    type: '国家级',
    date: '2026-02-28',
    views: 1567,
    summary:
      '工业软件是工业制造的"大脑"和"神经"，为推动工业软件创新发展，提出以下指导意见...',
    tags: ['创新发展', '指导意见'],
    isTop: false,
    deadline: '长期有效',
    icon: <RocketOutlined />,
    color: '#8b5cf6',
    desc: '工业软件是工业制造的"大脑"和"神经"，为推动工业软件创新发展，提出指导意见。',
    highlights: ['技术攻关', '生态建设', '应用推广'],
  },
  {
    id: 6,
    title: '武汉市工业软件产业发展扶持办法',
    category: '产业政策',
    type: '市级',
    date: '2026-02-20',
    views: 823,
    summary:
      '为加快武汉市工业软件产业发展，培育壮大工业软件企业，制定以下扶持办法...',
    tags: ['武汉市', '扶持办法'],
    isTop: false,
    deadline: '2027-12-31',
    icon: <AimOutlined />,
    color: '#06b6d4',
    desc: '为加快武汉市工业软件产业发展，培育壮大工业软件企业，制定扶持办法。',
    highlights: ['企业培育', '园区建设', '人才引进'],
  },
  {
    id: 7,
    title: '湖北省工业软件产业发展白皮书（2025）',
    category: '产业政策',
    type: '省级',
    date: '2026-02-25',
    views: 756,
    summary:
      '本白皮书全面分析了湖北省工业软件产业发展现状、存在问题及发展趋势...',
    tags: ['白皮书', '产业发展'],
    isTop: false,
    deadline: '长期有效',
    icon: <FileTextOutlined />,
    color: '#ec4899',
    desc: '本白皮书全面分析了湖北省工业软件产业发展现状、存在问题及发展趋势。',
    highlights: ['产业分析', '趋势预测', '政策建议'],
  },
  {
    id: 8,
    title: '关于组织申报2026年工业软件研发项目的通知',
    category: '申报通知',
    type: '省级',
    date: '2026-02-15',
    views: 1123,
    summary:
      '为支持工业软件关键技术攻关，现组织开展2026年工业软件研发项目申报工作...',
    tags: ['研发项目', '申报'],
    isTop: false,
    deadline: '2026-05-31',
    icon: <TeamOutlined />,
    color: '#14b8a6',
    desc: '为支持工业软件关键技术攻关，组织开展2026年工业软件研发项目申报工作。',
    highlights: ['技术攻关', '项目资助', '成果转化'],
  },
]

// 获取类型标签颜色
export const getTypeColor = (type: string) => {
  switch (type) {
    case '国家级':
      return 'red'
    case '省级':
      return 'blue'
    case '市级':
      return 'green'
    default:
      return 'default'
  }
}

// 获取分类标签颜色
export const getCategoryColor = (category: string) => {
  switch (category) {
    case '补贴政策':
      return 'orange'
    case '产业政策':
      return 'purple'
    case '申报通知':
      return 'cyan'
    default:
      return 'default'
  }
}
