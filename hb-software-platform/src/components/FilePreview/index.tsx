import { useState } from 'react'
import { Modal, Image, Space, Button, Typography, Tag } from 'antd'
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons'

const { Text } = Typography

interface FilePreviewProps {
  fileName: string
  fileUrl: string
  fileType?: string
}

// 获取文件图标
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
      return <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />
    case 'doc':
    case 'docx':
      return <FileWordOutlined style={{ color: '#1677ff', fontSize: 24 }} />
    case 'xls':
    case 'xlsx':
      return <FileExcelOutlined style={{ color: '#52c41a', fontSize: 24 }} />
    case 'ppt':
    case 'pptx':
      return <FilePptOutlined style={{ color: '#fa8c16', fontSize: 24 }} />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FileImageOutlined style={{ color: '#722ed1', fontSize: 24 }} />
    case 'txt':
      return <FileTextOutlined style={{ color: '#8c8c8c', fontSize: 24 }} />
    default:
      return <FileOutlined style={{ color: '#8c8c8c', fontSize: 24 }} />
  }
}

// 获取文件类型标签
const getFileTypeTag = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const typeMap: Record<string, { color: string; text: string }> = {
    pdf: { color: 'red', text: 'PDF' },
    doc: { color: 'blue', text: 'Word' },
    docx: { color: 'blue', text: 'Word' },
    xls: { color: 'green', text: 'Excel' },
    xlsx: { color: 'green', text: 'Excel' },
    ppt: { color: 'orange', text: 'PPT' },
    pptx: { color: 'orange', text: 'PPT' },
    jpg: { color: 'purple', text: '图片' },
    jpeg: { color: 'purple', text: '图片' },
    png: { color: 'purple', text: '图片' },
    gif: { color: 'purple', text: '图片' },
    txt: { color: 'default', text: '文本' },
  }
  const { color, text } = typeMap[ext || ''] || { color: 'default', text: '文件' }
  return <Tag color={color}>{text}</Tag>
}

// 检查是否可预览
const isPreviewable = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(ext || '')
}

// 文件预览组件
export default function FilePreview({ fileName, fileUrl }: FilePreviewProps) {
  const [visible, setVisible] = useState(false)
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileName.split('.').pop()?.toLowerCase() || '')
  const canPreview = isPreviewable(fileName)

  return (
    <>
      <Space>
        {getFileIcon(fileName)}
        <Text>{fileName}</Text>
        {getFileTypeTag(fileName)}
        {canPreview && (
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setVisible(true)}
          >
            预览
          </Button>
        )}
        <Button
          type="link"
          icon={<DownloadOutlined />}
          href={fileUrl}
          download={fileName}
        >
          下载
        </Button>
      </Space>

      <Modal
        title={fileName}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="download" type="primary" icon={<DownloadOutlined />} href={fileUrl} download={fileName}>
            下载文件
          </Button>,
          <Button key="close" onClick={() => setVisible(false)}>
            关闭
          </Button>,
        ]}
        width={isImage ? 800 : '80%'}
      >
        {isImage ? (
          <Image src={fileUrl} alt={fileName} style={{ maxWidth: '100%' }} />
        ) : (
          <div style={{ height: '60vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Space direction="vertical" align="center">
              <FilePdfOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
              <Text>PDF预览功能需要集成PDF.js或其他PDF预览库</Text>
              <Text type="secondary">当前仅支持图片预览，其他文件请下载查看</Text>
            </Space>
          </div>
        )}
      </Modal>
    </>
  )
}

// 文件列表预览组件
export function FileListPreview({ files }: { files: Array<{ name: string; url: string }> }) {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {files.map((file, index) => (
        <FilePreview key={index} fileName={file.name} fileUrl={file.url} />
      ))}
    </Space>
  )
}
