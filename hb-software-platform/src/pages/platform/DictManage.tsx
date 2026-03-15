import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Row,
  Col,
  message,
  Modal,
  Form,
  Tree,
  Switch,
  Popconfirm,
  Tabs,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  DragOutlined,
  ImportOutlined,
  ExportOutlined,
  FolderOutlined,
  FileOutlined,
} from '@ant-design/icons'
import type { TabsProps } from 'antd'

const { Search } = Input
const { Option } = Select
const { TabPane } = Tabs

// 字典分类
const dictCategories = [
  { code: 'industry', name: '企业行业分类', isMultiLevel: true, description: '企业所属行业分类，支持多级' },
  { code: 'software_category', name: '软件类别', isMultiLevel: false, description: '软件产品类别' },
  { code: 'enterprise_scale', name: '企业规模', isMultiLevel: false, description: '企业人员规模' },
  { code: 'region', name: '地区信息', isMultiLevel: true, description: '省市区三级结构' },
  { code: 'budget_range', name: '预算范围', isMultiLevel: false, description: '项目预算区间' },
  { code: 'expected_time', name: '期望上线时间', isMultiLevel: false, description: '项目期望完成时间' },
  { code: 'requirement_type', name: '需求类型', isMultiLevel: false, description: '需求对接类型' },
  { code: 'urgency', name: '紧急程度', isMultiLevel: false, description: '需求紧急程度' },
]

// 模拟字典数据
const dictData: Record<string, any[]> = {
  industry: [
    { id: '1', value: 'automotive', label: '汽车制造', sort: 1, enabled: true, children: [
      { id: '1-1', value: 'automotive_parts', label: '汽车零部件', sort: 1, enabled: true },
      { id: '1-2', value: 'automotive_assembly', label: '整车制造', sort: 2, enabled: true },
    ]},
    { id: '2', value: 'electronics', label: '电子信息', sort: 2, enabled: true, children: [
      { id: '2-1', value: 'semiconductor', label: '半导体', sort: 1, enabled: true },
      { id: '2-2', value: 'consumer_electronics', label: '消费电子', sort: 2, enabled: true },
    ]},
    { id: '3', value: 'equipment', label: '装备制造', sort: 3, enabled: true },
    { id: '4', value: 'steel', label: '钢铁冶金', sort: 4, enabled: true },
    { id: '5', value: 'chemical', label: '化工材料', sort: 5, enabled: true },
    { id: '6', value: 'food', label: '食品饮料', sort: 6, enabled: true },
    { id: '7', value: 'textile', label: '纺织服装', sort: 7, enabled: true },
    { id: '8', value: 'pharmaceutical', label: '医药制造', sort: 8, enabled: true },
    { id: '9', value: 'metallurgy', label: '冶金行业', sort: 9, enabled: false },
    { id: '10', value: 'other', label: '其他', sort: 10, enabled: true },
  ],
  software_category: [
    { id: '1', value: 'MES', label: '制造执行系统(MES)', sort: 1, enabled: true },
    { id: '2', value: 'ERP', label: '企业资源计划(ERP)', sort: 2, enabled: true },
    { id: '3', value: 'PLM', label: '产品生命周期管理(PLM)', sort: 3, enabled: true },
    { id: '4', value: 'SCM', label: '供应链管理(SCM)', sort: 4, enabled: true },
    { id: '5', value: 'CRM', label: '客户关系管理(CRM)', sort: 5, enabled: true },
    { id: '6', value: 'WMS', label: '仓储管理系统(WMS)', sort: 6, enabled: true },
    { id: '7', value: 'QMS', label: '质量管理系统(QMS)', sort: 7, enabled: true },
    { id: '8', value: 'APS', label: '高级计划排程(APS)', sort: 8, enabled: true },
    { id: '9', value: 'BI', label: '商业智能(BI)', sort: 9, enabled: true },
    { id: '10', value: 'OTHER', label: '其他', sort: 10, enabled: true },
  ],
  enterprise_scale: [
    { id: '1', value: 'large', label: '大型企业（1000人以上）', sort: 1, enabled: true },
    { id: '2', value: 'medium', label: '中型企业（300-1000人）', sort: 2, enabled: true },
    { id: '3', value: 'small', label: '小型企业（100-300人）', sort: 3, enabled: true },
    { id: '4', value: 'micro', label: '微型企业（100人以下）', sort: 4, enabled: true },
  ],
  region: [
    { id: '1', value: 'hubei', label: '湖北省', sort: 1, enabled: true, children: [
      { id: '1-1', value: 'wuhan', label: '武汉市', sort: 1, enabled: true, children: [
        { id: '1-1-1', value: 'jiangan', label: '江岸区', sort: 1, enabled: true },
        { id: '1-1-2', value: 'jianghan', label: '江汉区', sort: 2, enabled: true },
        { id: '1-1-3', value: 'qiaokou', label: '硚口区', sort: 3, enabled: true },
      ]},
      { id: '1-2', value: 'xiangyang', label: '襄阳市', sort: 2, enabled: true },
      { id: '1-3', value: 'yichang', label: '宜昌市', sort: 3, enabled: true },
    ]},
  ],
  budget_range: [
    { id: '1', value: '0-10', label: '10万以下', sort: 1, enabled: true },
    { id: '2', value: '10-50', label: '10-50万', sort: 2, enabled: true },
    { id: '3', value: '50-100', label: '50-100万', sort: 3, enabled: true },
    { id: '4', value: '100-500', label: '100-500万', sort: 4, enabled: true },
    { id: '5', value: '500+', label: '500万以上', sort: 5, enabled: true },
  ],
  expected_time: [
    { id: '1', value: '1_month', label: '1个月内', sort: 1, enabled: true },
    { id: '2', value: '3_months', label: '3个月内', sort: 2, enabled: true },
    { id: '3', value: '6_months', label: '6个月内', sort: 3, enabled: true },
    { id: '4', value: '1_year', label: '1年内', sort: 4, enabled: true },
    { id: '5', value: 'flexible', label: '时间灵活', sort: 5, enabled: true },
  ],
  requirement_type: [
    { id: '1', value: 'new_system', label: '新建系统', sort: 1, enabled: true },
    { id: '2', value: 'system_upgrade', label: '系统升级', sort: 2, enabled: true },
    { id: '3', value: 'system_integration', label: '系统集成', sort: 3, enabled: true },
    { id: '4', value: 'consultation', label: '技术咨询', sort: 4, enabled: true },
  ],
  urgency: [
    { id: '1', value: 'urgent', label: '紧急', sort: 1, enabled: true },
    { id: '2', value: 'normal', label: '一般', sort: 2, enabled: true },
    { id: '3', value: 'planning', label: '长期规划', sort: 3, enabled: true },
  ],
}

const DictManage = () => {
  const [activeCategory, setActiveCategory] = useState('industry')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')

  const currentCategory = dictCategories.find(c => c.code === activeCategory)
  const currentData = dictData[activeCategory] || []

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      render: (sort: number) => (
        <Tag color="blue">{sort}</Tag>
      ),
    },
    {
      title: '字典值',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '字典标签',
      dataIndex: 'label',
      key: 'label',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean, record: any) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleStatusChange(record, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除此字典项吗？"
            onConfirm={() => handleDelete(record)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" size="small" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleStatusChange = (record: any, enabled: boolean) => {
    message.success(`${record.label} 已${enabled ? '启用' : '禁用'}`)
  }

  const handleAdd = () => {
    setIsEdit(false)
    setSelectedRecord(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: any) => {
    setIsEdit(true)
    setSelectedRecord(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (record: any) => {
    message.success(`${record.label} 已删除`)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (isEdit) {
        message.success('字典项已更新')
      } else {
        message.success('字典项已添加')
      }
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      message.error('请完善表单信息')
    }
  }

  const handleImport = () => {
    message.info('导入功能开发中')
  }

  const handleExport = () => {
    message.success('字典数据已导出')
  }

  const renderTreeData = (data: any[]): any[] => {
    return data.map(item => ({
      title: (
        <Space>
          <span>{item.label}</span>
          <Tag color={item.enabled ? 'success' : 'default'}>{item.enabled ? '启用' : '禁用'}</Tag>
        </Space>
      ),
      key: item.id,
      children: item.children ? renderTreeData(item.children) : undefined,
    }))
  }

  return (
    <div>
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <Select
              value={activeCategory}
              onChange={setActiveCategory}
              style={{ width: '100%' }}
              placeholder="选择字典分类"
            >
              {dictCategories.map(cat => (
                <Option key={cat.code} value={cat.code}>{cat.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Search
              placeholder="搜索字典项"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={24} lg={8} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<ImportOutlined />} onClick={handleImport}>
                导入
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增
              </Button>
            </Space>
          </Col>
        </Row>
        {currentCategory && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
            <Space>
              <span style={{ fontWeight: 500 }}>{currentCategory.name}</span>
              <Tag color={currentCategory.isMultiLevel ? 'blue' : 'green'}>
                {currentCategory.isMultiLevel ? '多级' : '单级'}
              </Tag>
              <span style={{ color: '#666' }}>{currentCategory.description}</span>
            </Space>
          </div>
        )}
      </Card>

      {currentCategory?.isMultiLevel ? (
        <Card style={{ borderRadius: '12px' }}>
          <Tree
            treeData={renderTreeData(currentData)}
            defaultExpandAll
            showLine
            showIcon
          />
        </Card>
      ) : (
        <Card style={{ borderRadius: '12px' }}>
          <Table
            columns={columns}
            dataSource={currentData.filter(item => 
              !searchText || 
              item.label.includes(searchText) || 
              item.value.includes(searchText)
            )}
            rowKey="id"
            pagination={{
              total: currentData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </Card>
      )}

      {/* 新增/编辑弹窗 */}
      <Modal
        title={isEdit ? '编辑字典项' : '新增字典项'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText={isEdit ? '保存' : '添加'}
        cancelText="取消"
        width={560}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="value"
            label="字典值"
            rules={[{ required: true, message: '请输入字典值' }]}
          >
            <Input placeholder="请输入字典值（英文或数字）" />
          </Form.Item>
          <Form.Item
            name="label"
            label="字典标签"
            rules={[{ required: true, message: '请输入字典标签' }]}
          >
            <Input placeholder="请输入字典标签（中文显示名称）" />
          </Form.Item>
          <Form.Item
            name="sort"
            label="排序号"
            rules={[{ required: true, message: '请输入排序号' }]}
          >
            <Input type="number" placeholder="请输入排序号，数字越小越靠前" />
          </Form.Item>
          <Form.Item
            name="enabled"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DictManage
