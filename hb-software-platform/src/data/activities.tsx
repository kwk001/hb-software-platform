// 活动数据
export interface Activity {
  id: string
  title: string
  summary: string
  type: '线上' | '线下' | '混合'
  category: '培训' | '沙龙' | '展会' | '路演' | '对接会'
  status: '进行中' | '已结束' | '即将开始'
  startDate: string
  endDate: string
  location: string
  organizer: string
  tags: string[]
  views: number
  participants: number
  maxParticipants: number
  image?: string
}

export const activityList: Activity[] = [
  {
    id: '1',
    title: '2025湖北省工业软件创新发展论坛',
    summary: '汇聚行业专家、企业代表，共同探讨工业软件发展趋势、技术创新路径和产业生态构建，推动湖北省工业软件产业高质量发展。',
    type: '线下',
    category: '展会',
    status: '即将开始',
    startDate: '2025-04-15',
    endDate: '2025-04-17',
    location: '武汉光谷会展中心',
    organizer: '湖北省工信厅',
    tags: ['工业软件', '创新发展', '产业对接'],
    views: 3256,
    participants: 156,
    maxParticipants: 300,
  },
  {
    id: '2',
    title: '工业软件企业数字化转型培训会',
    summary: '针对工业软件企业的数字化转型需求，提供系统化的培训课程，涵盖数字化战略、技术应用、管理变革等多个维度。',
    type: '混合',
    category: '培训',
    status: '即将开始',
    startDate: '2025-03-28',
    endDate: '2025-03-30',
    location: '线上+武汉软件新城',
    organizer: '湖北省软件行业协会',
    tags: ['数字化转型', '企业培训', '管理升级'],
    views: 2156,
    participants: 89,
    maxParticipants: 200,
  },
  {
    id: '3',
    title: '工业软件投融资路演专场',
    summary: '为工业软件企业提供投融资对接平台，邀请知名投资机构参与，帮助企业获得资本支持，加速发展。',
    type: '线下',
    category: '路演',
    status: '即将开始',
    startDate: '2025-04-08',
    endDate: '2025-04-08',
    location: '武汉东湖新技术开发区',
    organizer: '湖北省科技厅',
    tags: ['投融资', '路演', '资本对接'],
    views: 1890,
    participants: 45,
    maxParticipants: 100,
  },
  {
    id: '4',
    title: '工业软件技术沙龙 - AI在工业设计中的应用',
    summary: '聚焦人工智能技术在设计领域的创新应用，分享最新技术成果和实践经验，促进技术交流与合作。',
    type: '线上',
    category: '沙龙',
    status: '即将开始',
    startDate: '2025-03-25',
    endDate: '2025-03-25',
    location: '腾讯会议',
    organizer: '湖北省工业软件公共服务平台',
    tags: ['人工智能', '工业设计', '技术交流'],
    views: 1456,
    participants: 234,
    maxParticipants: 500,
  },
  {
    id: '5',
    title: '产业链供需对接会 - 汽车软件专场',
    summary: '搭建汽车软件产业链上下游企业对接平台，促进供需匹配，推动产业链协同发展。',
    type: '线下',
    category: '对接会',
    status: '即将开始',
    startDate: '2025-04-20',
    endDate: '2025-04-20',
    location: '武汉经济技术开发区',
    organizer: '武汉市经信局',
    tags: ['汽车软件', '供需对接', '产业链'],
    views: 1234,
    participants: 67,
    maxParticipants: 150,
  },
  {
    id: '6',
    title: '工业软件标准宣贯会',
    summary: '解读国家及行业最新标准，帮助企业理解标准要求，提升产品质量和竞争力。',
    type: '线上',
    category: '培训',
    status: '已结束',
    startDate: '2025-02-28',
    endDate: '2025-02-28',
    location: '钉钉直播',
    organizer: '国家工业信息安全发展研究中心',
    tags: ['标准解读', '政策宣贯', '质量管理'],
    views: 4567,
    participants: 892,
    maxParticipants: 1000,
  },
  {
    id: '7',
    title: '2025春季工业软件人才招聘会',
    summary: '为工业软件企业和专业人才搭建对接平台，解决企业人才需求，促进人才就业。',
    type: '线下',
    category: '展会',
    status: '即将开始',
    startDate: '2025-04-10',
    endDate: '2025-04-11',
    location: '武汉人才市场',
    organizer: '湖北省人社厅',
    tags: ['人才招聘', '就业服务', '企业需求'],
    views: 5678,
    participants: 123,
    maxParticipants: 500,
  },
  {
    id: '8',
    title: '工业软件知识产权保护讲座',
    summary: '提升企业知识产权保护意识，讲解专利布局、侵权防范等实务知识。',
    type: '线上',
    category: '培训',
    status: '即将开始',
    startDate: '2025-04-05',
    endDate: '2025-04-05',
    location: 'Zoom会议',
    organizer: '湖北省知识产权局',
    tags: ['知识产权', '专利保护', '法律实务'],
    views: 987,
    participants: 156,
    maxParticipants: 300,
  },
]

// 获取活动类型颜色
export const getActivityTypeColor = (type: string) => {
  const colors: Record<string, { bg: string; color: string }> = {
    '线上': { bg: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6' },
    '线下': { bg: 'rgba(16, 185, 129, 0.08)', color: '#10b981' },
    '混合': { bg: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6' },
  }
  return colors[type] || { bg: 'rgba(100, 116, 139, 0.08)', color: '#64748b' }
}

// 获取活动分类颜色
export const getActivityCategoryColor = (category: string) => {
  const colors: Record<string, { bg: string; color: string }> = {
    '培训': { bg: 'rgba(249, 115, 22, 0.08)', color: '#f97316' },
    '沙龙': { bg: 'rgba(236, 72, 153, 0.08)', color: '#ec4899' },
    '展会': { bg: 'rgba(6, 182, 212, 0.08)', color: '#06b6d4' },
    '路演': { bg: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b' },
    '对接会': { bg: 'rgba(99, 102, 241, 0.08)', color: '#6366f1' },
  }
  return colors[category] || { bg: 'rgba(100, 116, 139, 0.08)', color: '#64748b' }
}

// 获取活动状态颜色
export const getActivityStatusColor = (status: string) => {
  const colors: Record<string, { bg: string; color: string }> = {
    '进行中': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
    '已结束': { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b' },
    '即将开始': { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  }
  return colors[status] || { bg: 'rgba(100, 116, 139, 0.1)', color: '#64748b' }
}
