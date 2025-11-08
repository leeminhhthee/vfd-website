"use client"

import { Button, Form, Input, Modal, Select, Space } from "antd"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Import CKEditor động để tránh lỗi SSR
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
)
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

const { Option } = Select

interface NewsItem {
  id: number
  title: string
  type: string
  content: string
  status: string
  createdAt: string
  excerpt?: string
  aiSummary?: string
}

interface NewsFormValues {
  title: string
  type: string
  content: string
  status?: string
  excerpt?: string
  aiSummary?: string
}

interface NewsFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: NewsFormValues) => void
  initialData: Partial<NewsItem> | null
  isSubmitting: boolean
}

export default function NewsFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: NewsFormModalProps) {
  const [form] = Form.useForm<NewsFormValues>()
  const [content, setContent] = useState(initialData?.content || "")
  const isEditing = !!initialData

  useEffect(() => {
    if (!open) return
    if (initialData) {
      form.setFieldsValue(initialData)
      setContent(initialData.content || "")
    } else {
      form.resetFields()
      setContent("")
    }
  }, [initialData, open, form])

  const onFinish = (values: NewsFormValues) => {
    onSubmit({ ...values, content })
  }

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa tin tức" : "Tạo tin tức mới"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      closable={!isSubmitting}
      maskClosable={!isSubmitting}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ type: "Thành phố" }}
        disabled={isSubmitting}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Danh mục"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select placeholder="Chọn danh mục">
            <Option value="Thành phố">Thành phố</Option>
            <Option value="Trong nước">Trong nước</Option>
            <Option value="Quốc tế">Quốc tế</Option>
          </Select>
        </Form.Item>

        {/* CKEditor 5 */}
        <Form.Item
          label="Nội dung bài viết"
          required
          tooltip="Bạn có thể chỉnh font, thêm ảnh hoặc video"
        >
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(_, editor) => setContent(editor.getData())}
            config={{
              toolbar: [
                "undo",
                "redo",
                "|",
                "heading",
                "|",
                "fontSize",
                "fontColor",
                "fontBackgroundColor",
                "|",
                "bold",
                "italic",
                "underline",
                "|",
                "alignment",
                "bulletedList",
                "numberedList",
                "|",
                "link",
                "imageUpload",
                "blockQuote",
                "insertTable",
                "mediaEmbed",
                "emoji",
              ],
            }}
          />
        </Form.Item>

        <Form.Item name="excerpt" label="Tóm tắt thủ công">
          <Input.TextArea rows={3} placeholder="Nhập tóm tắt thủ công (ưu tiên hiển thị)" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {isEditing ? "Cập nhật" : "Tạo mới"}
            </Button>
            <Button onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
