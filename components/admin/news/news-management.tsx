"use client";

import {
  getNewsStatusLabel,
  getNewsTypeLabel,
  NewsStatus,
  NewsType,
} from "@/data/constants/constants";
import { newsInteractor } from "@/data/datasource/news/interactor/news.interactor";
import { NewsItem } from "@/data/model/news.model";
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

export default function NewsManagement() {
  const [editingMode, setEditingMode] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<NewsType[]>(
    Object.values(NewsType)
  );
  const queryClient = useQueryClient();

  const {
    data: allNews = [],
    isLoading,
    error,
  } = useQuery<NewsItem[]>({
    queryKey: ["adminNews"],
    queryFn: newsInteractor.getNewsList,
  });

  const createNewsMutation = useMutation<NewsItem, Error, Partial<NewsItem>>({
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
    { id: number; data: Partial<NewsItem> }
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

  const handleAddCategory = (category: NewsType) => {
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

  const statusOptions = [
    { text: getNewsStatusLabel(NewsStatus.DRAFT), value: NewsStatus.DRAFT },
    {
      text: getNewsStatusLabel(NewsStatus.PUBLISHED),
      value: NewsStatus.PUBLISHED,
    },
  ];

  const categoryOptions = Object.values(NewsType).map((cat) => ({
    text: getNewsTypeLabel(cat),
    value: cat,
  }));

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
      filters: categoryOptions,
      onFilter: (value, record) => record.type === value,
      render: (type: string) => (
        <Tag color="blue">{getNewsTypeLabel(type as NewsType)}</Tag>
      ),
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
      filters: statusOptions,
      onFilter: (value, record) =>
        (record.status || NewsStatus.DRAFT) === value,
      render: (status: string) => {
        const color = status === NewsStatus.PUBLISHED ? "green" : "default";
        return (
          <Tag color={color}>{getNewsStatusLabel(status as NewsStatus)}</Tag>
        );
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
            updateNewsMutation.mutate({
              id: editingNews.id,
              data,
            });
          } else {
            createNewsMutation.mutate({ ...data });
          }
        }}
        onPublish={(data) => {
          if (editingNews?.id) {
            updateNewsMutation.mutate({
              id: editingNews.id,
              data,
            });
          } else {
            createNewsMutation.mutate({ ...data });
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
