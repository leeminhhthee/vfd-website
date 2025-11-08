"use client"

import { newsInteractor } from "@/data/datasource/news/interactor/news.interactor"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Alert, Button, Input, Modal, notification, Space, Table, Tag } from "antd"
import type { ColumnsType } from "antd/es/table"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import NewsFormModal from "./news-form-modal"

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

type CreateNewsPayload = {
  title: string
  type: string
  content: string
  status?: string
  excerpt?: string
  aiSummary?: string
  createdAt?: string
}

type UpdateNewsPayload = Partial<Omit<NewsItem, "id">>

export default function NewsManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const queryClient = useQueryClient()

  const {
    data: allNews = [],
    isLoading,
    error,
  } = useQuery<NewsItem[]>({
    queryKey: ["adminNews"],
    queryFn: newsInteractor.getNewsList,
  })

  // Mutation types: <TData, TError, TVariables>
  const createNewsMutation = useMutation<NewsItem, Error, CreateNewsPayload>({
    mutationFn: (newNews) => newsInteractor.createNews(newNews),
    onSuccess: () => {
      notification.success({ message: "Tạo tin tức mới thành công!" })
      queryClient.invalidateQueries({ queryKey: ["adminNews"] })
      handleCloseModal()
    },
    onError: () => {
      notification.error({ message: "Tạo tin tức thất bại." })
    },
  })

  const updateNewsMutation = useMutation<NewsItem, Error, { id: number; data: UpdateNewsPayload }>({
    mutationFn: ({ id, data }) => newsInteractor.updateNews(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật tin tức thành công!" })
      queryClient.invalidateQueries({ queryKey: ["adminNews"] })
      handleCloseModal()
    },
    onError: () => {
      notification.error({ message: "Cập nhật thất bại." })
    },
  })

  const deleteNewsMutation = useMutation<{ success: boolean }, Error, number>({
    mutationFn: (id) => newsInteractor.deleteNews(id),
    onSuccess: () => {
      notification.success({ message: "Đã xóa tin tức!" })
      queryClient.invalidateQueries({ queryKey: ["adminNews"] })
    },
    onError: () => {
      notification.error({ message: "Xóa thất bại." })
    },
  })

  const filteredNews = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return allNews.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(term) ||
        (item.content || "").toLowerCase().includes(term)
    )
  }, [allNews, searchTerm])

  const handleShowCreateModal = () => {
    setEditingNews(null)
    setIsModalOpen(true)
  }

  const handleShowEditModal = (record: NewsItem) => {
    setEditingNews(record)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingNews(null)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa tin này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteNewsMutation.mutate(id),
    })
  }

  // Không dùng any: dùng union kiểu form values
  const handleFormSubmit = (values: CreateNewsPayload | UpdateNewsPayload) => {
    if (editingNews?.id) {
      updateNewsMutation.mutate({ id: editingNews.id, data: values })
    } else {
      // Ép kiểu về CreateNewsPayload (các field bắt buộc đã được form đảm bảo)
      createNewsMutation.mutate(values as CreateNewsPayload)
    }
  }

  const columns: ColumnsType<NewsItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <strong className="text-foreground">{text}</strong>,
    },
    {
      title: "Danh mục",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Thành phố", value: "Thành phố" },
        { text: "Trong nước", value: "Trong nước" },
        { text: "Quốc tế", value: "Quốc tế" },
      ],
      onFilter: (value, record) => (record.type || "").startsWith(String(value)),
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const s = status || "draft"
        const color = s === "published" ? "green" : "default"
        return <Tag color={color}>{s.toUpperCase()}</Tag>
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_: unknown, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<Edit2 size={18} className="text-yellow-600" />}
            onClick={() => handleShowEditModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 size={18} />}
            onClick={() => handleDelete(record.id)}
            loading={
              deleteNewsMutation.isPending &&
              deleteNewsMutation.variables === record.id
            }
          />
        </Space>
      ),
    },
  ]

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={(error as Error).message}
        type="error"
        showIcon
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* Thay Search bằng Space.Compact để tránh addonAfter deprecated */}
        <Space.Compact style={{ width: 420 }}>
          <Input
            placeholder="Tìm kiếm tiêu đề, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
          <Button type="primary" onClick={() => setSearchTerm(searchTerm)}>
            Tìm
          </Button>
        </Space.Compact>

        <Button type="primary" icon={<Plus size={20} />} onClick={handleShowCreateModal}>
          Thêm tin tức
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredNews}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <NewsFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingNews}
        isSubmitting={createNewsMutation.isPending || updateNewsMutation.isPending}
      />
    </div>
  )
}