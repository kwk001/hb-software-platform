import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Popconfirm,
  Tabs,
  List,
  Empty,
  Typography,
  Divider,
  Alert,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  FileOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'

const { Text } = Typography

const { Search } = Input
const { Option } = Select

// 软件发布状态码（与PRD一致）
// 0: 草稿, 1: 待审核, 2: 已上架, 3: 已驳回, 4: 已下架, 5: 更新待审
const SOFTWARE_STATUS = {
  DRAFT: 0,
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  OFFLINE: 4,
  UPDATE_PENDING: 5,
}

// 草稿类型
interface SoftwareDraft {
  id: string
  name: string
  data: any
  createTime: string
  updateTime: string
}

const DRAFT_STORAGE_KEY = 'software_publish_drafts'

const MySoftware = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('all')
  const [activeTab, setActiveTab] = useState('published')
  const [drafts, setDrafts] = useState<SoftwareDraft[]>([])

  // 软件列表数据
  const softwareList = [
    {
      id: 1,
      name: '智能制造MES系统',
      version: 'V3.2.1',
      category: '生产制造',
      status: SOFTWARE_STATUS.APPROVED,
      downloads: 256,
      rating: 4.8,
      publishDate: '2026-03-01',
    },
    {
      id: 2,
      name: '工业物联网平台',
      version: 'V2.1.0',
      category: '物联网',
      status: SOFTWARE_STATUS.PENDING,
      downloads: 0,
      rating: 0,
      publishDate: '-',
    },
    {
      id: 3,
      name: '质量管理系统',
      version: 'V1.5.0',
      category: '生产制造',
      status: SOFTWARE_STATUS.DRAFT,
      downloads: 0,
      rating: 0,
      publishDate: '-',
    },
    {
      id: 4,
      name: '设备管理系统',
      version: 'V2.0.0',
      category: '生产制造',
      status: SOFTWARE_STATUS.REJECTED,
      downloads: 0,
      rating: 0,
      publishDate: '-',
    },
  ]

  // 加载草稿
  useEffect(() => {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (stored) {
      setDrafts(JSON.parse(stored))
    }
  }, [])

  // 删除草稿
  const handleDeleteDraft = (id: string) => {
    const stored = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (stored) {
      let draftList: SoftwareDraft[] = JSON.parse(stored)
      draftList = draftList.filter(d => d.id !== id)
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftList))
      setDrafts(draftList)
      message.success('草稿删除成功')
    }
  }

  // 编辑草稿
  const handleEditDraft = (draft: SoftwareDraft) => {
    navigate(`/enterprise/software/publish?draft=${draft.id}`)
  }

  // 获取状态标签
  const getStatusTag = (status: number) => {
    switch (status) {
      case SOFTWARE_STATUS.APPROVED:
        return <Tag color="success">已上架</Tag>
      case SOFTWARE_STATUS.PENDING:
        return <Tag color="processing">待审核</Tag>
      case SOFTWARE_STATUS.DRAFT:
        return <Tag>草稿</Tag>
      case SOFTWARE_STATUS.REJECTED:
        return <Tag color="error">已驳回</Tag>
      case SOFTWARE_STATUS.OFFLINE:
        return <Tag color="default">已下架</Tag>
      case SOFTWARE_STATUS.UPDATE_PENDING:
        return <Tag color="blue">更新待审</Tag>
      default:
        return <Tag>{status}</Tag>
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '软件名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusTag(status),
    },
    {
      title: '下载量',
      dataIndex: 'downloads',
      key: 'downloads',
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (rating > 0 ? `${rating}分` : '-'),
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      key: 'publishDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          {record.status === SOFTWARE_STATUS.DRAFT && (
            <Popconfirm
              title="确定删除该软件？"
              onConfirm={() => message.success('删除成功')}
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  // 草稿列表列定义
  const draftColumns = [
    {
      title: '草稿名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <FileOutlined style={{ color: '#1677ff' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SoftwareDraft) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditDraft(record)}
          >
            继续编辑
          </Button>
          <Popconfirm
            title="确定删除此草稿？"
            onConfirm={() => handleDeleteDraft(record.id)}
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/enterprise')}>
          返回工作台
        </Button>
      </div>

      <Card style={{ borderRadius: '8px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarExtraContent={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/enterprise/software/publish')}
            >
              发布软件
            </Button>
          }
        >
          <Tabs.TabPane tab="已发布软件" key="published">
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={8}>
                <Search
                  placeholder="搜索软件名称"
                  allowClear
                  enterButton={<><SearchOutlined /> 搜索</>}
                />
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Select
                  value={status}
                  onChange={setStatus}
                  style={{ width: '100%' }}
                  placeholder="选择状态"
                >
                  <Option value="all">全部状态</Option>
                  <Option value="published">已上架</Option>
                  <Option value="reviewing">审核中</Option>
                  <Option value="draft">草稿</Option>
                  <Option value="rejected">已驳回</Option>
                </Select>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={softwareList}
              rowKey="id"
              pagination={{
                total: softwareList.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                草稿箱
                {drafts.length > 0 && (
                  <Tag color="orange" style={{ marginLeft: 8 }}>
                    {drafts.length}
                  </Tag>
                )}
              </span>
            }
            key="drafts"
          >
            {drafts.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size="large">
                    <Text type="secondary">暂无草稿</Text>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => navigate('/enterprise/software/publish')}
                    >
                      创建新软件
                    </Button>
                  </Space>
                }
              />
            ) : (
              <>
                <Alert
                  message="草稿提示"
                  description="草稿仅保存在本地浏览器中，清除浏览器数据会导致草稿丢失。请及时提交或保存重要内容。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Table
                  columns={draftColumns}
                  dataSource={drafts}
                  rowKey="id"
                  pagination={{
                    total: drafts.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                  }}
                />
              </>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default MySoftware
