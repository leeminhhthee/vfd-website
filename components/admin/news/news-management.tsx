"use client";

import {
  getNewsStatusLabel,
  getNewsTypeLabel,
  NewsStatus,
  NewsType,
} from "@/data/constants/constants";
import { newsInteractor } from "@/data/datasource/news/interactor/news.interactor";
import { NewsItem } from "@/data/model/news.model";
import { confirmUnsavedChanges } from "@/lib/utils";
import { useLoading } from "@/providers/loading-provider";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import NewsEditorForm from "./news-editor-form";
import formatDateSafe from "@/utils/formatDateSafe";

export default function NewsManagement() {
  const { showLoading, hideLoading } = useLoading();
  const [editingMode, setEditingMode] = useState(false);
  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<NewsType[]>(
    Object.values(NewsType)
  );
  const [unsavedChanges, setUnsavedChanges] = useState(false);
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
    onError: (error) => {
      console.error("CHI TIẾT LỖI TẠO TIN:", error);
      notification.error({
        message: "Tạo tin tức thất bại",
        description: error.message // Hiển thị chi tiết lỗi lên thông báo
      });
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
    setUnsavedChanges(false);
  };

  const handleCancelEditor = () => {
    if (unsavedChanges) {
      confirmUnsavedChanges(handleCloseEditor);
    } else {
      handleCloseEditor();
    }
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
      onOk: () => {
        showLoading();
        deleteNewsMutation.mutate(id, {
          onSettled: () => {
            hideLoading();
          },
        });
      },
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
      width: 500,
      render: (text: string) => (
        <div
          style={{
            display: "WebkitBox",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: 500,
            lineHeight: "1.4",
          }}
          className="text-foreground font-semibold"
        >
          {text}
        </div>
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
      render: (date: string) => formatDateSafe(date),
      sorter: (a, b) => {
        // Cần xử lý an toàn cho cả sorter để tránh lỗi NaN
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
      },
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
            icon={<EditOutlined />}
            onClick={() => handleShowEditEditor(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
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
            showLoading();
            updateNewsMutation.mutate(
              {
                id: editingNews.id,
                data,
              },
              {
                onSettled: () => {
                  hideLoading();
                },
              }
            );
          } else {
            showLoading();
            createNewsMutation.mutate(
              { ...data },
              {
                onSettled: () => {
                  hideLoading();
                },
              }
            );
          }
        }}
        onPublish={(data) => {
          if (editingNews?.id) {
            showLoading();
            updateNewsMutation.mutate(
              {
                id: editingNews.id,
                data,
              },
              {
                onSettled: () => {
                  hideLoading();
                },
              }
            );
          } else {
            showLoading();
            createNewsMutation.mutate(
              { ...data },
              {
                onSettled: () => {
                  hideLoading();
                },
              }
            );
          }
        }}
        onCancel={handleCancelEditor}
        isLoading={createNewsMutation.isPending || updateNewsMutation.isPending}
        hasUnsavedChanges={setUnsavedChanges}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Space.Compact style={{ width: 320 }}>
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
        </div>

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
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}
