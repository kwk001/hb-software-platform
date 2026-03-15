import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Steps,
  Upload,
  message,
  Row,
  Col,
  Radio,
  Cascader,
} from 'antd'
import {
  UploadOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select

// 行业列表
const industries = [
  { value: 'automotive', label: '汽车制造' },
  { value: 'electronics', label: '电子信息' },
  { value: 'equipment', label: '装备制造' },
  { value: 'steel', label: '钢铁冶金' },
  { value: 'chemical', label: '化工材料' },
  { value: 'food', label: '食品饮料' },
  { value: 'textile', label: '纺织服装' },
  { value: 'other', label: '其他' },
]

// 地区数据（简化版）
const regionOptions = [
  {
    value: 'hubei',
    label: '湖北省',
    children: [
      {
        value: 'wuhan',
        label: '武汉市',
        children: [
          { value: 'jiangan', label: '江岸区' },
          { value: 'jianghan', label: '江汉区' },
          { value: 'qiaokou', label: '硚口区' },
          { value: 'hongshan', label: '洪山区' },
          { value: 'dongxihu', label: '东西湖区' },
        ],
      },
      {
        value: 'xiangyang',
        label: '襄阳市',
        children: [
          { value: 'xiangcheng', label: '襄城区' },
          { value: 'fancheng', label: '樊城区' },
          { value: 'xiangzhou', label: '襄州区' },
        ],
      },
      {
        value: 'yichang',
        label: '宜昌市',
        children: [
          { value: 'xiling', label: '西陵区' },
          { value: 'wujiagang', label: '伍家岗区' },
          { value: 'dianjun', label: '点军区' },
        ],
      },
    ],
  },
]

const EnterpriseApply = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()

  const steps = [
    { title: '基本信息', description: '填写企业基本信息' },
    { title: '资质信息', description: '上传企业资质文件' },
    { title: '提交审核', description: '确认并提交申请' },
  ]

  const handleNext = async () => {
    try {
      await form.validateFields()
      setCurrentStep(currentStep + 1)
    } catch (error) {
      message.error('请完善表单信息')
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    message.success('入驻申请已提交，请等待审核')
    navigate('/enterprise')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="companyName"
                  label="企业名称"
                  rules={[{ required: true, message: '请输入企业名称' }]}
                >
                  <Input placeholder="请输入企业全称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="creditCode"
                  label="统一社会信用代码"
                  rules={[
                    { required: true, message: '请输入统一社会信用代码' },
                    { pattern: /^[A-Z0-9]{18}$/, message: '请输入18位统一社会信用代码' }
                  ]}
                >
                  <Input placeholder="请输入18位统一社会信用代码" maxLength={18} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="companyType"
                  label="企业类型"
                  rules={[{ required: true, message: '请选择企业类型' }]}
                >
                  <Select placeholder="请选择企业类型">
                    <Option value="supply">工业软件企业</Option>
                    <Option value="demand">工业制造企业</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="industry"
                  label="所属行业"
                  rules={[{ required: true, message: '请选择所属行业' }]}
                >
                  <Select placeholder="请选择所属行业">
                    {industries.map(industry => (
                      <Option key={industry.value} value={industry.value}>{industry.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="scale"
                  label="企业规模"
                  rules={[{ required: true, message: '请选择企业规模' }]}
                >
                  <Select placeholder="请选择企业规模">
                    <Option value="large">大型企业（1000人以上）</Option>
                    <Option value="medium">中型企业（300-1000人）</Option>
                    <Option value="small">小型企业（100-300人）</Option>
                    <Option value="micro">微型企业（100人以下）</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="region"
                  label="注册地址"
                  rules={[{ required: true, message: '请选择注册地址' }]}
                >
                  <Cascader
                    options={regionOptions}
                    placeholder="请选择省/市/区"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="contactName"
                  label="联系人姓名"
                  rules={[{ required: true, message: '请输入联系人姓名' }]}
                >
                  <Input placeholder="请输入联系人姓名" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="contactPhone"
                  label="联系人电话"
                  rules={[
                    { required: true, message: '请输入联系人电话' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
                  ]}
                >
                  <Input placeholder="请输入联系人电话" maxLength={11} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="contactEmail"
                  label="联系人邮箱"
                  rules={[
                    { required: true, message: '请输入联系人邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' },
                  ]}
                >
                  <Input placeholder="请输入联系人邮箱" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="address"
              label="企业地址"
              rules={[{ required: true, message: '请输入企业地址' }]}
            >
              <TextArea rows={2} placeholder="请输入详细地址" />
            </Form.Item>
            <Form.Item
              name="businessScope"
              label="经营范围"
              rules={[{ required: true, message: '请输入经营范围' }]}
            >
              <TextArea rows={3} placeholder="请描述企业主营业务和经营范围" />
            </Form.Item>
          </Form>
        )
      case 1:
        return (
          <div>
            <Form form={form} layout="vertical">
              <Form.Item
                name="license"
                label="营业执照"
                rules={[{ required: true, message: '请上传营业执照' }]}
              >
                <Upload.Dragger>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">支持 PDF、JPG、PNG 格式，文件大小不超过 10MB</p>
                </Upload.Dragger>
              </Form.Item>
              <Form.Item name="certificate" label="相关资质证书">
                <Upload.Dragger>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">支持 PDF、JPG、PNG 格式，文件大小不超过 10MB</p>
                </Upload.Dragger>
              </Form.Item>
            </Form>
          </div>
        )
      case 2:
        return (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <CheckCircleOutlined style={{ fontSize: '72px', color: '#00A870', marginBottom: '24px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1D2129', marginBottom: '16px' }}>
              确认提交入驻申请
            </h2>
            <p style={{ color: '#86909C', marginBottom: '32px' }}>
              提交后平台将在 3-5 个工作日内完成审核，请保持电话畅通
            </p>
            <div style={{ background: '#F5F7FA', padding: '24px', borderRadius: '8px', textAlign: 'left' }}>
              <h4 style={{ marginBottom: '16px' }}>申请信息预览</h4>
              <p><strong>企业名称：</strong>武汉XX科技有限公司</p>
              <p><strong>企业类型：</strong>工业软件企业</p>
              <p><strong>联系人：</strong>张三</p>
              <p><strong>联系电话：</strong>138****8888</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/enterprise')}>
          返回工作台
        </Button>
      </div>
      
      <Card title="企业入驻申请" style={{ borderRadius: '8px' }}>
        <Steps
          current={currentStep}
          style={{ marginBottom: '48px' }}
          items={steps.map((step) => ({ title: step.title, description: step.description }))}
        />

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {renderStepContent()}

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: '16px' }} onClick={handlePrev}>
                上一步
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={handleNext}>
                下一步
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" onClick={handleSubmit}>
                提交申请
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default EnterpriseApply
