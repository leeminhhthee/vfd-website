"use client";

import { newsInteractor } from "@/data/datasource/news/interactor/news.interactor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Input,
  Modal,
  notification,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import NewsEditorForm from "./news-editor-form";

interface NewsItem {
  id: number;
  title: string;
  type: string;
  content: string;
  status: string;
  createdAt: string;
  excerpt?: string;
  aiSummary?: string;
  coverImage?: string;
}

type CreateNewsPayload = {
  title: string;
  type: string;
  content: string;
  status?: string;
  excerpt?: string;
  aiSummary?: string;
  coverImage?: string;
  createdAt?: string;
};

type UpdateNewsPayload = Partial<Omit<NewsItem, "id">>;

export default function NewsManagement() {
  const [editingMode, setEditingMode] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([
    "Thành phố",
    "Trong nước",
    "Quốc tế",
  ]);
  const queryClient = useQueryClient();

  const {
    data: allNews = [],
    isLoading,
    error,
  } = useQuery<NewsItem[]>({
    queryKey: ["adminNews"],
    queryFn: newsInteractor.getNewsList,
  });

  const createNewsMutation = useMutation<NewsItem, Error, CreateNewsPayload>({
    mutationFn: (newNews) => newsInteractor.createNews(newNews),
    onSuccess: () => {
      notification.success({ message: "Tạo tin tức mới thành công!" });
      queryClient.invalidateQueries({ queryKey: ["adminNews"] });
      handleCloseEditor();
    },
    onError: () => {
      notification.error({ message: "Tạo tin tức thất bại." });
    },
  });

  const updateNewsMutation = useMutation<
    NewsItem,
    Error,
    { id: number; data: UpdateNewsPayload }
  >({
    mutationFn: ({ id, data }) => newsInteractor.updateNews(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật tin tức thành công!" });
      queryClient.invalidateQueries({ queryKey: ["adminNews"] });
      handleCloseEditor();
    },
    onError: () => {
      notification.error({ message: "Cập nhật thất bại." });
    },
  });

  const deleteNewsMutation = useMutation<{ success: boolean }, Error, number>({
    mutationFn: (id) => newsInteractor.deleteNews(id),
    onSuccess: () => {
      notification.success({ message: "Đã xóa tin tức!" });
      queryClient.invalidateQueries({ queryKey: ["adminNews"] });
    },
    onError: () => {
      notification.error({ message: "Xóa thất bại." });
    },
  });

  const filteredNews = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allNews.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(term) ||
        (item.content || "").toLowerCase().includes(term)
    );
  }, [allNews, searchTerm]);

  const handleShowCreateEditor = () => {
    setEditingNews(null);
    setEditingMode(true);
  };

  const handleShowEditEditor = (record: NewsItem) => {
    setEditingNews(record);
    setEditingMode(true);
  };

  const handleCloseEditor = () => {
    setEditingMode(false);
    setEditingNews(null);
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa tin này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteNewsMutation.mutate(id),
    });
  };

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
      width: 680,
      render: (text: string) => (
        <strong className="text-foreground">{text}</strong>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "type",
      key: "type",
      filters: categories.map((cat) => ({ text: cat, value: cat })),
      onFilter: (value, record) =>
        (record.type || "").startsWith(String(value)),
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
      align: "center",
      render: (status: string) => {
        const s = status || "draft";
        const color = s === "published" ? "green" : "default";
        return <Tag color={color}>{s.toUpperCase()}</Tag>;
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
            onClick={() => handleShowEditEditor(record)}
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
  ];

  if (error) {
    return (
      <Alert
        message="Lỗi tải dữ liệu"
        description={(error as Error).message}
        type="error"
        showIcon
      />
    );
  }

  if (editingMode) {
    return (
      <NewsEditorForm
        news={editingNews as NewsItem | undefined}
        categories={categories}
        onAddCategory={handleAddCategory}
        onSaveDraft={(data) => {
          if (editingNews?.id) {
            updateNewsMutation.mutate({ id: editingNews.id, data });
          } else {
            createNewsMutation.mutate({ ...data, status: "draft" });
          }
        }}
        onPublish={(data) => {
          if (editingNews?.id) {
            updateNewsMutation.mutate({
              id: editingNews.id,
              data: { ...data, status: "published" },
            });
          } else {
            createNewsMutation.mutate({ ...data, status: "published" });
          }
        }}
        onCancel={handleCloseEditor}
        isLoading={createNewsMutation.isPending || updateNewsMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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

        <Button
          type="primary"
          icon={<Plus size={20} />}
          onClick={handleShowCreateEditor}
        >
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
    </div>
  );
}
