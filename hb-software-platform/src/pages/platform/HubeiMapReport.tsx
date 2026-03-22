import { useState, useEffect, useRef } from 'react'
import { Card, Row, Col, Statistic, Badge, Tooltip, Progress, Table, Tag, DatePicker, Select, Button, Alert } from 'antd'
import {
  EnvironmentOutlined,
  ShopOutlined,
  AppstoreOutlined,
  MoneyCollectOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  PieChartOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'

const { RangePicker } = DatePicker
const { Option } = Select

// 湖北省地市数据
const hubeiCities = [
  { name: '武汉市', code: '420100', center: [114.305393, 30.593099] },
  { name: '黄石市', code: '420200', center: [115.038906, 30.201082] },
  { name: '十堰市', code: '420300', center: [110.787916, 32.646907] },
  { name: '宜昌市', code: '420500', center: [111.286471, 30.691967] },
  { name: '襄阳市', code: '420600', center: [112.122414, 32.008986] },
  { name: '鄂州市', code: '420700', center: [114.895594, 30.396536] },
  { name: '荆门市', code: '420800', center: [112.199265, 31.035423] },
  { name: '孝感市', code: '420900', center: [113.916938, 30.924568] },
  { name: '荆州市', code: '421000', center: [112.23813, 30.326857] },
  { name: '黄冈市', code: '421100', center: [114.872029, 30.453905] },
  { name: '咸宁市', code: '421200', center: [114.322878, 29.84135] },
  { name: '随州市', code: '421300', center: [113.382458, 31.69011] },
  { name: '恩施土家族苗族自治州', code: '422800', center: [109.488172, 30.272156] },
  { name: '省直辖县级行政区', code: '429000', center: [112.938814, 30.056372] },
]

// 模拟业务数据
const mockBusinessData: Record<string, {
  manufacturingEnterprises: number
  softwareEnterprises: number
  softwareProducts: number
  subsidyAmount: number
  growthRate: number
  topIndustries: string[]
  monthlyTrend: number[]
}> = {
  '420100': {
    manufacturingEnterprises: 2856,
    softwareEnterprises: 892,
    softwareProducts: 1256,
    subsidyAmount: 56800000,
    growthRate: 15.2,
    topIndustries: ['汽车制造', '电子信息', '生物医药'],
    monthlyTrend: [420, 450, 480, 520, 550, 580, 620, 650, 680, 720, 750, 780],
  },
  '420200': {
    manufacturingEnterprises: 856,
    softwareEnterprises: 168,
    softwareProducts: 245,
    subsidyAmount: 12800000,
    growthRate: 12.5,
    topIndustries: ['冶金', '建材', '装备制造'],
    monthlyTrend: [120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175],
  },
  '420300': {
    manufacturingEnterprises: 1125,
    softwareEnterprises: 256,
    softwareProducts: 368,
    subsidyAmount: 18500000,
    growthRate: 18.3,
    topIndustries: ['汽车制造', '装备制造', '电子信息'],
    monthlyTrend: [180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290],
  },
  '420500': {
    manufacturingEnterprises: 1456,
    softwareEnterprises: 312,
    softwareProducts: 456,
    subsidyAmount: 22800000,
    growthRate: 14.8,
    topIndustries: ['化工', '装备制造', '食品饮料'],
    monthlyTrend: [220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330],
  },
  '420600': {
    manufacturingEnterprises: 1325,
    softwareEnterprises: 278,
    softwareProducts: 412,
    subsidyAmount: 20500000,
    growthRate: 16.5,
    topIndustries: ['汽车制造', '纺织服装', '农产品加工'],
    monthlyTrend: [200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310],
  },
  '420700': {
    manufacturingEnterprises: 425,
    softwareEnterprises: 68,
    softwareProducts: 98,
    subsidyAmount: 5200000,
    growthRate: 10.2,
    topIndustries: ['冶金', '建材', '装备制造'],
    monthlyTrend: [60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82],
  },
  '420800': {
    manufacturingEnterprises: 756,
    softwareEnterprises: 145,
    softwareProducts: 215,
    subsidyAmount: 9800000,
    growthRate: 13.6,
    topIndustries: ['石化', '装备制造', '农产品加工'],
    monthlyTrend: [110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165],
  },
  '420900': {
    manufacturingEnterprises: 1125,
    softwareEnterprises: 198,
    softwareProducts: 286,
    subsidyAmount: 14200000,
    growthRate: 11.8,
    topIndustries: ['食品加工', '纺织服装', '装备制造'],
    monthlyTrend: [150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205],
  },
  '421000': {
    manufacturingEnterprises: 985,
    softwareEnterprises: 176,
    softwareProducts: 258,
    subsidyAmount: 12800000,
    growthRate: 12.3,
    topIndustries: ['石化', '装备制造', '轻工'],
    monthlyTrend: [140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195],
  },
  '421100': {
    manufacturingEnterprises: 1156,
    softwareEnterprises: 215,
    softwareProducts: 312,
    subsidyAmount: 16500000,
    growthRate: 14.2,
    topIndustries: ['医药化工', '装备制造', '建材'],
    monthlyTrend: [170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225],
  },
  '421200': {
    manufacturingEnterprises: 625,
    softwareEnterprises: 98,
    softwareProducts: 142,
    subsidyAmount: 7800000,
    growthRate: 13.5,
    topIndustries: ['竹木加工', '茶叶', '建材'],
    monthlyTrend: [85, 88, 91, 94, 97, 100, 103, 106, 109, 112, 115, 118],
  },
  '421300': {
    manufacturingEnterprises: 756,
    softwareEnterprises: 128,
    softwareProducts: 185,
    subsidyAmount: 9200000,
    growthRate: 11.6,
    topIndustries: ['专用汽车', '农产品加工', '纺织服装'],
    monthlyTrend: [105, 108, 111, 114, 117, 120, 123, 126, 129, 132, 135, 138],
  },
  '422800': {
    manufacturingEnterprises: 568,
    softwareEnterprises: 85,
    softwareProducts: 125,
    subsidyAmount: 6800000,
    growthRate: 15.8,
    topIndustries: ['烟草', '茶叶', '中药材'],
    monthlyTrend: [75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108],
  },
  '429000': {
    manufacturingEnterprises: 425,
    softwareEnterprises: 52,
    softwareProducts: 78,
    subsidyAmount: 4800000,
    growthRate: 9.5,
    topIndustries: ['纺织服装', '农产品加工', '化工'],
    monthlyTrend: [55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77],
  },
}

// 计算全省汇总数据
const calculateTotalData = () => {
  let totalManufacturing = 0
  let totalSoftware = 0
  let totalProducts = 0
  let totalSubsidy = 0

  Object.values(mockBusinessData).forEach((data) => {
    totalManufacturing += data.manufacturingEnterprises
    totalSoftware += data.softwareEnterprises
    totalProducts += data.softwareProducts
    totalSubsidy += data.subsidyAmount
  })

  return {
    manufacturingEnterprises: totalManufacturing,
    softwareEnterprises: totalSoftware,
    softwareProducts: totalProducts,
    subsidyAmount: totalSubsidy,
    growthRate: 14.5,
    topIndustries: ['汽车制造', '电子信息', '装备制造', '化工', '纺织服装'],
    monthlyTrend: [2100, 2180, 2260, 2340, 2420, 2500, 2580, 2660, 2740, 2820, 2900, 2980],
  }
}

// 湖北省地图 GeoJSON 数据（简化版）
const hubeiGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "武汉市", "code": "420100" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[114.0, 30.3], [114.5, 30.3], [114.5, 30.8], [114.0, 30.8], [114.0, 30.3]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "黄石市", "code": "420200" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[114.8, 29.9], [115.2, 29.9], [115.2, 30.3], [114.8, 30.3], [114.8, 29.9]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "十堰市", "code": "420300" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[110.5, 32.3], [111.2, 32.3], [111.2, 32.9], [110.5, 32.9], [110.5, 32.3]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "宜昌市", "code": "420500" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[110.8, 30.4], [111.6, 30.4], [111.6, 31.0], [110.8, 31.0], [110.8, 30.4]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "襄阳市", "code": "420600" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[111.6, 31.8], [112.5, 31.8], [112.5, 32.4], [111.6, 32.4], [111.6, 31.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "鄂州市", "code": "420700" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[114.6, 30.2], [115.0, 30.2], [115.0, 30.5], [114.6, 30.5], [114.6, 30.2]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "荆门市", "code": "420800" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[111.8, 30.8], [112.5, 30.8], [112.5, 31.4], [111.8, 31.4], [111.8, 30.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "孝感市", "code": "420900" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[113.5, 30.6], [114.3, 30.6], [114.3, 31.3], [113.5, 31.3], [113.5, 30.6]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "荆州市", "code": "421000" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[111.8, 29.8], [112.6, 29.8], [112.6, 30.5], [111.8, 30.5], [111.8, 29.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "黄冈市", "code": "421100" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[114.5, 29.8], [115.5, 29.8], [115.5, 31.0], [114.5, 31.0], [114.5, 29.8]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "咸宁市", "code": "421200" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[113.8, 29.4], [114.6, 29.4], [114.6, 30.0], [113.8, 30.0], [113.8, 29.4]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "随州市", "code": "421300" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[112.9, 31.4], [113.6, 31.4], [113.6, 32.0], [112.9, 32.0], [112.9, 31.4]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "恩施土家族苗族自治州", "code": "422800" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[108.8, 29.3], [110.0, 29.3], [110.0, 31.5], [108.8, 31.5], [108.8, 29.3]]]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "省直辖县级行政区", "code": "429000" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[112.5, 29.8], [113.5, 29.8], [113.5, 30.5], [112.5, 30.5], [112.5, 29.8]]]
      }
    }
  ]
}

export default function HubeiMapReport() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(1, 'year'), dayjs()])
  const [loading, setLoading] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapData, setMapData] = useState<any>(null)
  const mapRef = useRef<ReactECharts>(null)

  // 加载并注册湖北省地图
  useEffect(() => {
    const loadMap = async () => {
      try {
        // 检查地图是否已注册
        const existingMap = echarts.getMap('hubei')
        if (existingMap) {
          setMapLoaded(true)
          return
        }

        // 从外部文件加载真实地图数据
        const response = await fetch('/hubei.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const geoJson = await response.json()
        
        echarts.registerMap('hubei', geoJson)
        setMapData(geoJson)
        setMapLoaded(true)
        console.log('湖北省地图加载成功')
      } catch (error) {
        console.error('地图加载失败:', error)
        // 如果加载失败，使用简化地图作为后备
        try {
          echarts.registerMap('hubei', hubeiGeoJSON as any)
          setMapLoaded(true)
          console.log('使用简化地图作为后备')
        } catch (e) {
          console.error('后备地图也加载失败:', e)
        }
      }
    }

    loadMap()
  }, [])

  // 获取当前展示的数据
  const currentData = selectedCity ? mockBusinessData[selectedCity] : calculateTotalData()
  const currentCityName = selectedCity ? hubeiCities.find(c => c.code === selectedCity)?.name : '湖北省'

  // 地图配置
  const getMapOption = () => {
    const mapData = hubeiCities.map(city => ({
      name: city.name,
      value: mockBusinessData[city.code]?.softwareEnterprises || 0,
      code: city.code,
    }))

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#1f2937',
        },
        formatter: (params: any) => {
          const data = mockBusinessData[params.data?.code]
          if (!data) return params.name
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${params.name}</div>
              <div style="font-size: 12px; line-height: 1.8;">
                <div>工业制造企业：${data.manufacturingEnterprises.toLocaleString()} 家</div>
                <div>工业软件企业：${data.softwareEnterprises.toLocaleString()} 家</div>
                <div>软件产品：${data.softwareProducts.toLocaleString()} 个</div>
                <div>补贴券金额：¥${(data.subsidyAmount / 10000).toFixed(0)} 万</div>
              </div>
            </div>
          `
        },
      },
      visualMap: {
        min: 0,
        max: 1000,
        left: 'left',
        bottom: '20',
        text: ['高', '低'],
        calculable: true,
        inRange: {
          color: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#0284c7', '#0369a1'],
        },
        textStyle: {
          color: '#6b7280',
        },
      },
      series: [
        {
          name: '工业软件企业',
          type: 'map',
          map: 'hubei',
          roam: true,
          zoom: 1.2,
          center: [112.0, 31.0],
          emphasis: {
            label: {
              show: true,
              color: '#fff',
              fontWeight: 'bold',
            },
            itemStyle: {
              areaColor: '#f59e0b',
              shadowBlur: 20,
              shadowColor: 'rgba(245, 158, 11, 0.5)',
            },
          },
          select: {
            label: {
              show: true,
              color: '#fff',
            },
            itemStyle: {
              areaColor: '#f59e0b',
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
            areaColor: '#e5e7eb',
          },
          data: mapData,
        },
      ],
    }
  }

  // 趋势图表配置
  const getTrendOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisLine: {
          lineStyle: {
            color: '#e5e7eb',
          },
        },
        axisLabel: {
          color: '#6b7280',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
          },
        },
        axisLabel: {
          color: '#6b7280',
        },
      },
      series: [
        {
          name: '企业增长数',
          type: 'line',
          smooth: true,
          data: currentData.monthlyTrend,
          lineStyle: {
            color: '#3b82f6',
            width: 3,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ]),
          },
          itemStyle: {
            color: '#3b82f6',
          },
        },
      ],
    }
  }

  // 行业分布图表配置
  const getIndustryOption = () => {
    const industryData = currentData.topIndustries.map((industry, index) => ({
      name: industry,
      value: 100 - index * 15,
    }))

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: {
          color: '#6b7280',
        },
      },
      series: [
        {
          name: '行业分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          data: industryData,
          color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        },
      ],
    }
  }

  // 处理地图点击事件
  const handleMapClick = (params: any) => {
    if (params.data) {
      setSelectedCity(params.data.code)
    }
  }

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  // 地市排名表格数据
  const rankingColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 60,
      render: (rank: number) => (
        <Badge
          count={rank}
          style={{
            backgroundColor: rank <= 3 ? '#3b82f6' : '#9ca3af',
          }}
        />
      ),
    },
    {
      title: '地市',
      dataIndex: 'name',
    },
    {
      title: '工业制造企业',
      dataIndex: 'manufacturingEnterprises',
      sorter: (a: any, b: any) => a.manufacturingEnterprises - b.manufacturingEnterprises,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '软件企业',
      dataIndex: 'softwareEnterprises',
      sorter: (a: any, b: any) => a.softwareEnterprises - b.softwareEnterprises,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '软件产品',
      dataIndex: 'softwareProducts',
      sorter: (a: any, b: any) => a.softwareProducts - b.softwareProducts,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '补贴金额',
      dataIndex: 'subsidyAmount',
      sorter: (a: any, b: any) => a.subsidyAmount - b.subsidyAmount,
      render: (val: number) => `¥${(val / 10000).toFixed(0)}万`,
    },
    {
      title: '增长率',
      dataIndex: 'growthRate',
      sorter: (a: any, b: any) => a.growthRate - b.growthRate,
      render: (val: number) => (
        <Tag color={val >= 15 ? 'success' : val >= 10 ? 'warning' : 'default'}>
          {val >= 0 ? <RiseOutlined /> : <FallOutlined />} {val}%
        </Tag>
      ),
    },
  ]

  const rankingData = hubeiCities
    .map((city, index) => ({
      rank: index + 1,
      name: city.name,
      ...mockBusinessData[city.code],
    }))
    .sort((a, b) => b.softwareEnterprises - a.softwareEnterprises)
    .map((item, index) => ({ ...item, rank: index + 1 }))

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px 0', color: '#1f2937' }}>
          <EnvironmentOutlined style={{ marginRight: '12px', color: '#3b82f6' }} />
          湖北省工业软件产业地图
        </h1>
        <p style={{ margin: 0, color: '#6b7280' }}>
          实时展示各地市工业软件产业发展情况，点击地图区域查看详细数据
        </p>
      </div>

      {/* 地图加载提示 */}
      {!mapLoaded && (
        <Alert
          message="地图数据加载中..."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* 筛选栏 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <span style={{ color: '#6b7280', marginRight: '8px' }}>时间范围：</span>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
            />
          </Col>
          <Col>
            <span style={{ color: '#6b7280', marginRight: '8px' }}>数据维度：</span>
            <Select defaultValue="software" style={{ width: 150 }}>
              <Option value="software">软件企业数</Option>
              <Option value="manufacturing">制造企业数</Option>
              <Option value="products">软件产品数</Option>
              <Option value="subsidy">补贴金额</Option>
            </Select>
          </Col>
          <Col flex="auto" style={{ textAlign: 'right' }}>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} style={{ marginRight: '8px' }}>
              刷新数据
            </Button>
            <Button type="primary" icon={<DownloadOutlined />}>
              导出报表
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 核心指标卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title={<span style={{ color: '#6b7280' }}><TeamOutlined /> 工业制造企业注册数</span>}
              value={currentData.manufacturingEnterprises}
              suffix="家"
              valueStyle={{ color: '#3b82f6', fontSize: '28px', fontWeight: 600 }}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="success">
                <RiseOutlined /> +{currentData.growthRate}%
              </Tag>
              <span style={{ color: '#9ca3af', fontSize: '12px', marginLeft: '8px' }}>同比去年</span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title={<span style={{ color: '#6b7280' }}><ShopOutlined /> 工业软件企业入驻数</span>}
              value={currentData.softwareEnterprises}
              suffix="家"
              valueStyle={{ color: '#10b981', fontSize: '28px', fontWeight: 600 }}
            />
            <div style={{ marginTop: '8px' }}>
              <Progress
                percent={Math.round((currentData.softwareEnterprises / currentData.manufacturingEnterprises) * 100)}
                size="small"
                strokeColor="#10b981"
              />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title={<span style={{ color: '#6b7280' }}><AppstoreOutlined /> 软件产品发布数</span>}
              value={currentData.softwareProducts}
              suffix="个"
              valueStyle={{ color: '#f59e0b', fontSize: '28px', fontWeight: 600 }}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="warning">
                平均 {(currentData.softwareProducts / currentData.softwareEnterprises).toFixed(1)} 个/企业
              </Tag>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title={<span style={{ color: '#6b7280' }}><MoneyCollectOutlined /> 补贴券申报金额</span>}
              value={currentData.subsidyAmount}
              suffix="元"
              valueStyle={{ color: '#ef4444', fontSize: '28px', fontWeight: 600 }}
              formatter={(value) => `¥${(Number(value) / 10000).toFixed(0)}万`}
            />
            <div style={{ marginTop: '8px' }}>
              <Tag color="processing">
                已发放 ¥{((currentData.subsidyAmount * 0.75) / 10000).toFixed(0)}万
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 地图和数据展示区域 */}
      <Row gutter={16}>
        {/* 左侧地图 */}
        <Col span={16}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                  <EnvironmentOutlined style={{ marginRight: '8px', color: '#3b82f6' }} />
                  {currentCityName}产业分布地图
                </span>
                {selectedCity && (
                  <Button size="small" onClick={() => setSelectedCity(null)}>
                    返回全省视图
                  </Button>
                )}
              </div>
            }
            bodyStyle={{ padding: 0, height: '600px' }}
          >
            {mapLoaded && (
              <ReactECharts
                ref={mapRef}
                option={getMapOption()}
                style={{ height: '100%', width: '100%' }}
                onEvents={{
                  click: handleMapClick,
                }}
              />
            )}
          </Card>
        </Col>

        {/* 右侧图表 */}
        <Col span={8}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Card
                title={<span><BarChartOutlined style={{ marginRight: '8px' }} />增长趋势</span>}
                bodyStyle={{ height: '280px', padding: '12px' }}
              >
                <ReactECharts option={getTrendOption()} style={{ height: '100%', width: '100%' }} />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title={<span><PieChartOutlined style={{ marginRight: '8px' }} />行业分布TOP5</span>}
                bodyStyle={{ height: '280px', padding: '12px' }}
              >
                <ReactECharts option={getIndustryOption()} style={{ height: '100%', width: '100%' }} />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 地市排名表格 */}
      <Card
        title={<span><InfoCircleOutlined style={{ marginRight: '8px' }} />各地市详细数据</span>}
        style={{ marginTop: '24px' }}
      >
        <Table
          columns={rankingColumns}
          dataSource={rankingData}
          rowKey="name"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({
            onClick: () => {
              const city = hubeiCities.find(c => c.name === record.name)
              if (city) setSelectedCity(city.code)
            },
            style: { cursor: 'pointer' },
          })}
        />
      </Card>
    </div>
  )
}
