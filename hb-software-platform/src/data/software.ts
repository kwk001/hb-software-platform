// 软件产品数据接口
export interface SoftwareItem {
  id: string
  name: string
  category: string
  categoryLabel: string
  company: string
  description: string
  tags: string[]
  views: number
  rating: number
  price: string
  logo: string
  color: string
  isFree?: boolean
  likes?: number
}

// 分类配置
export const softwareCategories = [
  { value: 'all', label: '全部' },
  { value: 'cad', label: 'CAD设计', color: '#6366f1' },
  { value: 'cam', label: 'CAM制造', color: '#06b6d4' },
  { value: 'cae', label: 'CAE仿真', color: '#8b5cf6' },
  { value: 'mes', label: 'MES系统', color: '#10b981' },
  { value: 'erp', label: 'ERP管理', color: '#f59e0b' },
  { value: 'plm', label: 'PLM生命周期', color: '#ec4899' },
  { value: 'scm', label: 'SCM供应链', color: '#6366f1' },
]

// 获取分类颜色
export const getCategoryColor = (cat: string): string => {
  const colors: Record<string, string> = {
    cad: '#6366f1',
    cam: '#06b6d4',
    cae: '#8b5cf6',
    mes: '#10b981',
    erp: '#f59e0b',
    plm: '#ec4899',
    scm: '#6366f1',
  }
  return colors[cat] || '#64748b'
}

// 获取分类标签
export const getCategoryLabel = (cat: string): string => {
  const item = softwareCategories.find((c) => c.value === cat)
  return item?.label || cat
}

// 软件产品列表数据
export const softwareList: SoftwareItem[] = [
  {
    id: '1',
    name: '智能CAD设计平台',
    category: 'cad',
    categoryLabel: 'CAD设计',
    company: '华中数控',
    description: '面向机械制造业的专业CAD设计软件，支持2D/3D设计、参数化建模、智能装配等功能',
    tags: ['CAD', '3D建模', '机械设计'],
    views: 2341,
    rating: 4.8,
    price: '5-20万',
    logo: '/images/software/cad.svg',
    color: '#6366f1',
  },
  {
    id: '2',
    name: '工业MES管理系统',
    category: 'mes',
    categoryLabel: 'MES系统',
    company: '武汉天喻',
    description: '智能制造执行系统，实现生产计划、工艺管理、质量控制、设备监控全流程数字化',
    tags: ['MES', '智能制造', '生产管理'],
    views: 1856,
    rating: 4.6,
    price: '10-50万',
    logo: '/images/software/mes.svg',
    color: '#10b981',
  },
  {
    id: '3',
    name: 'CAE仿真分析平台',
    category: 'cae',
    categoryLabel: 'CAE仿真',
    company: '达索系统',
    description: '多物理场仿真分析软件，支持结构、流体、电磁等多领域仿真计算',
    tags: ['CAE', '仿真', '工程分析'],
    views: 1523,
    rating: 4.7,
    price: '20-100万',
    logo: '/images/software/cae.png',
    color: '#8b5cf6',
  },
  {
    id: '4',
    name: '企业ERP管理系统',
    category: 'erp',
    categoryLabel: 'ERP管理',
    company: '用友网络',
    description: '集成财务、供应链、生产、人力资源等模块的企业资源计划管理系统',
    tags: ['ERP', '企业管理', '财务'],
    views: 3421,
    rating: 4.5,
    price: '8-30万',
    logo: '/images/software/erp.svg',
    color: '#f59e0b',
  },
  {
    id: '5',
    name: 'PLM产品生命周期管理',
    category: 'plm',
    categoryLabel: 'PLM生命周期',
    company: '西门子',
    description: '产品全生命周期管理平台，支持产品设计、工艺规划、生产制造、服务维护',
    tags: ['PLM', '生命周期', '协同设计'],
    views: 1287,
    rating: 4.9,
    price: '15-80万',
    logo: '/images/software/plm.png',
    color: '#ec4899',
  },
  {
    id: '6',
    name: 'CAM数控编程系统',
    category: 'cam',
    categoryLabel: 'CAM制造',
    company: 'Mastercam',
    description: '专业数控加工编程软件，支持2-5轴加工、车铣复合、线切割等工艺',
    tags: ['CAM', '数控编程', '加工'],
    views: 2156,
    rating: 4.4,
    price: '3-15万',
    logo: '/images/software/cam.png',
    color: '#06b6d4',
  },
  {
    id: '7',
    name: '供应链SCM管理平台',
    category: 'scm',
    categoryLabel: 'SCM供应链',
    company: 'SAP',
    description: '端到端供应链管理平台，实现采购、库存、物流、分销全流程可视化',
    tags: ['SCM', '供应链', '物流'],
    views: 987,
    rating: 4.3,
    price: '25-120万',
    logo: '/images/software/scm.png',
    color: '#6366f1',
  },
  {
    id: '8',
    name: '工业物联网平台',
    category: 'mes',
    categoryLabel: 'MES系统',
    company: '海尔卡奥斯',
    description: '工业互联网平台，支持设备接入、数据采集、边缘计算、云端分析',
    tags: ['物联网', '工业互联网', '大数据'],
    views: 2754,
    rating: 4.7,
    price: '12-60万',
    logo: '/images/software/iot.svg',
    color: '#14b8a6',
  },
]
