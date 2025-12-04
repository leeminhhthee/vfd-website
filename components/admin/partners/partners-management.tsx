"use client";

import { partnerInteractor } from "@/data/datasource/partner/interactor/partner.interactor";
import { PartnerItem } from "@/data/model/partner.model";
import { confirmUnsavedChanges } from "@/lib/utils";
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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import PartnersEditorForm from "./partners-editor-form";

export default function PartnersManagement() {
  const [editingMode, setEditingMode] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: partners = [],
    isLoading: tableLoading,
    error,
  } = useQuery<PartnerItem[]>({
    queryKey: ["partners"],
    queryFn: partnerInteractor.getPartnerList,
  });

  const handleCloseEditor = () => {
    setEditingMode(false);
    setEditingPartner(null);
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

  const createMutation = useMutation<
    PartnerItem,
    Error,
    Partial<PartnerItem>
  >({
    mutationFn: (data) => partnerInteractor.createPartner(data),
    onSuccess: () => {
      notification.success({ message: "Thêm đối tác thành công" });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Thêm đối tác thất bại" }),
  });

  const updateMutation = useMutation<
    PartnerItem,
    Error,
    { id: number; data: Partial<PartnerItem> }
  >({
    mutationFn: ({ id, data }) => partnerInteractor.updatePartner(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật thành công" });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteMutation = useMutation<boolean, Error, number>({
    mutationFn: (id) => partnerInteractor.deletePartner(id),
    onSuccess: () => {
      notification.success({ message: "Đã xóa đối tác" });
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  const filteredPartners = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return partners.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(term) ||
        (item.email || "").toLowerCase().includes(term)
    );
  }, [partners, searchTerm]);

  const handleShowEditor = (record?: PartnerItem) => {
    setEditingPartner(record || null);
    setEditingMode(true);
    setIsFormDirty(false);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa đối tác này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const columns: ColumnsType<PartnerItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Logo",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (url: string) => (
        <Avatar
          src={url}
          shape="square"
          size={64}
          style={{ objectFit: "contain", backgroundColor: "#f0f0f0" }}
        >
          LOGO
        </Avatar>
      ),
    },
    {
      title: "Tên đối tác",
      dataIndex: "name",
      key: "name",
      width: 530,
       render: (text: string) => (
        <div
          className="font-semibold text-base"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            wordBreak: "break-word",
            maxWidth: 530,
            display: "inline-block",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string | null) => (
        <span className="text-muted-foreground">{text || "-"}</span>
      ),
    },
    {
      title: "Hợp tác từ",
      dataIndex: "since",
      key: "since",
      align: "center",
      width: 120,
      sorter: (a, b) => parseInt(a.since || "0") - parseInt(b.since || "0"),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 120,
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
              placeholder="Tìm kiếm đối tác..."
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
          Thêm đối tác
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredPartners}
          rowKey="id"
          loading={tableLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Drawer
        title={editingPartner ? "Chỉnh sửa đối tác" : "Thêm đối tác mới"}
        placement="right"
        onClose={handleDrawerClose}
        open={editingMode}
        width={500}
        closeIcon={<X size={20} />}
        destroyOnClose
        maskClosable={true}
      >
        <PartnersEditorForm
          key={editingPartner ? editingPartner.id : "create-new"}
          initialData={editingPartner ?? undefined}
          onSave={(data) => {
            if (editingPartner?.id) {
              updateMutation.mutate({
                id: editingPartner.id,
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