"use client";

import {
  getProjectCategoryLabel,
  ProjectCategory,
} from "@/data/constants/constants"; // Giả định đường dẫn
import { projectInteractor } from "@/data/datasource/project/interactor/project.interactor";
import { ProjectItem } from "@/data/model/project.model";
import { confirmUnsavedChanges, formatCurrencyVND } from "@/lib/utils";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Avatar,
  Button,
  Drawer,
  Input,
  Modal,
  notification,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import ProjectsEditorForm from "./projects-editor-form";

export default function ProjectsManagement() {
  const [editingMode, setEditingMode] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading: tableLoading,
    error,
  } = useQuery<ProjectItem[]>({
    queryKey: ["projects"],
    queryFn: projectInteractor.getProjectList,
  });

  const handleCloseEditor = () => {
    setEditingMode(false);
    setEditingProject(null);
    setIsFormDirty(false);
  };

  const handleDrawerClose = () => {
    if (isFormDirty) {
      confirmUnsavedChanges(() => {
        handleCloseEditor();
      });
    } else {
      handleCloseEditor();
    }
  };

  const createMutation = useMutation<ProjectItem, Error, Partial<ProjectItem>>({
    mutationFn: (data) => projectInteractor.createProject(data),
    onSuccess: () => {
      notification.success({ message: "Tạo dự án thành công" });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Tạo dự án thất bại" }),
  });

  const updateMutation = useMutation<
    ProjectItem,
    Error,
    { id: number; data: Partial<ProjectItem> }
  >({
    mutationFn: ({ id, data }) => projectInteractor.updateProject(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật thành công" });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteMutation = useMutation<boolean, Error, number>({
    mutationFn: (id) => projectInteractor.deleteProject(id),
    onSuccess: () => {
      notification.success({ message: "Đã xóa dự án" });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return projects.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(term) ||
        (getProjectCategoryLabel(item.category) || "")
          .toLowerCase()
          .includes(term) ||
        (item.location || "").toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  const handleShowEditor = (record?: ProjectItem) => {
    setEditingProject(record || null);
    setEditingMode(true);
    setIsFormDirty(false);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa dự án này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const columns: ColumnsType<ProjectItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (url: string) => (
        <Avatar
          src={url}
          shape="square"
          size={64}
          style={{ objectFit: "cover" }}
        >
          IMG
        </Avatar>
      ),
    },
    {
      title: "Tên dự án",
      dataIndex: "title",
      key: "title",
      width: 350,
      render: (text: string) => (
        <div
          className="font-semibold text-base"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            wordBreak: "break-word",
            maxWidth: 350,
            display: "inline-block",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => (
        <Tag color="blue">{getProjectCategoryLabel(cat) || cat}</Tag>
      ),
      filters: Object.values(ProjectCategory).map((cat) => ({
        text: getProjectCategoryLabel(cat),
        value: cat,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Ngân sách",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatCurrencyVND(price) || "-",
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      render: (duration: string) => duration || "-",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      render: (location: string) => location || "-",
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
  ];

  if (error) {
    return (
      <Alert
        type="error"
        message="Lỗi tải dữ liệu"
        description={(error as Error).message}
        showIcon
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Space.Compact style={{ width: 320 }}>
            <Input
              placeholder="Tìm kiếm dự án..."
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
          Thêm dự án
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="id"
          loading={tableLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Drawer
        title={editingProject ? "Chỉnh sửa dự án" : "Tạo dự án mới"}
        placement="right"
        onClose={handleDrawerClose}
        open={editingMode}
        width={600}
        closeIcon={<X size={20} />}
        destroyOnClose
        maskClosable={true}
      >
        <ProjectsEditorForm
          key={editingProject ? editingProject.id : "create-new"}
          initialData={editingProject ?? undefined}
          onSave={(data) => {
            if (editingProject?.id) {
              updateMutation.mutate({
                id: editingProject.id,
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
