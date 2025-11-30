"use client";

import {
  DocumentCategorys,
  getDocumentCategoryLabel,
} from "@/data/constants/constants";
import { documentInteractor } from "@/data/datasource/document/interactor/document.interactor";
import { DocumentItem } from "@/data/model/document.model";
import { confirmUnsavedChanges, formatFileSize } from "@/lib/utils";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Drawer,
  Input,
  Modal,
  notification,
  Space,
  Table,
  Tag,
} from "antd";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import DocumentEditorForm from "./document-editor-form";

export default function DocumentsManagement() {
  const [editingDoc, setEditingDoc] = useState<Partial<DocumentItem> | null>(
    null
  );
  const [editingMode, setEditingMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [categories, setCategories] = useState<DocumentCategorys[]>(
    Object.values(DocumentCategorys)
  );
  const queryClient = useQueryClient();

  const {
    data: allDocs = [],
    isLoading,
    error,
  } = useQuery<DocumentItem[]>({
    queryKey: ["documents"],
    queryFn: documentInteractor.getDocumentsList,
  });

  const handleCloseEditor = () => {
    setEditingMode(false);
    setEditingDoc(null);
    setIsFormDirty(false);
  };

  const createMutation = useMutation<
    DocumentItem,
    Error,
    Partial<DocumentItem>
  >({
    mutationFn: (data) => documentInteractor.createDocument(data),
    onSuccess: () => {
      notification.success({ message: "Tải tài liệu thành công" });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Tải tài liệu thất bại" }),
  });

  const updateMutation = useMutation<
    DocumentItem,
    Error,
    { id: string; data: Partial<DocumentItem> }
  >({
    mutationFn: ({ id, data }) => documentInteractor.updateDocument(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật tài liệu thành công" });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteMutation = useMutation<{ success: boolean }, Error, string>({
    mutationFn: (id) => documentInteractor.deleteDocument(id),
    onSuccess: () => {
      notification.success({ message: "Xóa thành công" });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  const filteredDocs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allDocs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(term) ||
        (doc.content ? doc.content.toLowerCase().includes(term) : false)
    );
  }, [allDocs, searchTerm]);

  const handleShowEditor = (doc?: DocumentItem) => {
    setEditingDoc(doc || null);
    setEditingMode(true);
    setIsFormDirty(false);
  };

  const handleDrawerClose = () => {
    if (isFormDirty) {
      confirmUnsavedChanges(handleCloseEditor);
    } else {
      handleCloseEditor();
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa tài liệu này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  if (error)
    return (
      <Alert
        type="error"
        message="Lỗi tải dữ liệu"
        description={(error as Error).message}
        showIcon
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Space.Compact style={{ width: 320 }}>
            <Input
              placeholder="Tìm kiếm..."
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
          icon={<PlusOutlined />}
          onClick={() => handleShowEditor()}
        >
          Thêm tài liệu
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-x-auto">
        <Table
          columns={[
            { title: "ID", dataIndex: "id", key: "id" },
            {
              title: "Tiêu đề",
              dataIndex: "title",
              key: "title",
              width: 400,
              render: (text: string) => (
                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    wordBreak: "break-word",
                    maxWidth: 450,
                    display: "inline-block",
                  }}
                >
                  <strong>{text}</strong>
                </div>
              ),
            },
            {
              title: "Danh mục",
              dataIndex: "category",
              key: "category",
              render: (c) => (
                <Tag color="blue">{getDocumentCategoryLabel(c)}</Tag>
              ),
            },
            {
              title: "File",
              dataIndex: "fileUrl",
              key: "fileUrl",
              width: 220,
              render: (url: string, record) => (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    wordBreak: "break-word",
                    maxWidth: 200,
                    color: "#2563eb",
                    textDecoration: "underline",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  {record.fileName || record.title}
                </a>
              ),
            },
            {
              title: "Dung lượng",
              dataIndex: "fileSize",
              key: "fileSize",
              render: (fileSize) => <>{formatFileSize(fileSize)} MB</>,
            },
            {
              title: "Ngày tạo",
              dataIndex: "createdAt",
              key: "createdAt",
              render: (date) =>
                date ? new Date(date).toLocaleDateString("vi-VN") : "",
            },
            {
              title: "Hành động",
              key: "action",
              align: "center",
              render: (_, record) => (
                <Space size="middle">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleShowEditor(record)}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(record.id)}
                    loading={deleteMutation.isPending}
                  />
                </Space>
              ),
            },
          ]}
          dataSource={filteredDocs}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Drawer
        title={editingDoc ? "Chỉnh sửa tài liệu" : "Tải tài liệu mới"}
        placement="right"
        onClose={handleDrawerClose}
        open={editingMode}
        width={600}
        closeIcon={<X size={20} />}
        destroyOnClose
        maskClosable={true}
      >
        <DocumentEditorForm
          key={editingDoc ? editingDoc.id : "create-new"}
          document={editingDoc as DocumentItem}
          categories={categories}
          onAddCategory={(cat) => setCategories([...categories, cat])}
          onSaveDraft={(data) => {
            if (editingDoc?.id) {
              updateMutation.mutate({
                id: editingDoc.id,
                data: data,
              });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={handleDrawerClose}
          isLoading={createMutation.isPending || updateMutation.isPending}
          hasUnsavedChanges={setIsFormDirty}
        />
      </Drawer>
    </div>
  );
}
