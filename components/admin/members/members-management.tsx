"use client";

import {
  getMemberLevelLabel,
  getMemberRoleLabel,
  getMemberStatusLabel,
  MemberLevel,
  MemberLevelLabels,
  MemberRole,
  MemberRoleLabels,
  MemberStatus,
  MemberStatusLabels,
} from "@/data/constants/constants";
import { memberInteractor } from "@/data/datasource/member/interactor/member.interactor";
import { MemberItem } from "@/data/model/member.model";
import { confirmUnsavedChanges } from "@/lib/utils";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
import type { ColumnsType } from "antd/es/table";
import { Mail, Phone, X } from "lucide-react";
import { useMemo, useState } from "react";
import MembersEditorForm from "./members-editor-form";

export default function MembersManagement() {
  const [editingMode, setEditingMode] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: members = [],
    isLoading: tableLoading,
    error,
  } = useQuery<MemberItem[]>({
    queryKey: ["members"],
    queryFn: memberInteractor.getMemberList,
  });

  const handleCloseEditor = () => {
    setEditingMode(false);
    setEditingMember(null);
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

  const updateMutation = useMutation<
    MemberItem,
    Error,
    { id: number; data: Partial<MemberItem> }
  >({
    mutationFn: ({ id, data }) => memberInteractor.updateMember(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật thành công" });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteMutation = useMutation<boolean, Error, number>({
    mutationFn: (id) => memberInteractor.deleteMember(id),
    onSuccess: () => {
      notification.success({ message: "Đã xóa thành viên" });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  const filteredMembers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return members.filter((item) => {
      const matchesSearch =
        (item.name || "").toLowerCase().includes(term) ||
        (item.email || "").toLowerCase().includes(term) ||
        (item.phone || "").toLowerCase().includes(term);

      return matchesSearch;
    });
  }, [members, searchTerm]);

  const handleShowEditor = (record: MemberItem) => {
    setEditingMember(record);
    setEditingMode(true);
    setIsFormDirty(false);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa thành viên này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const getLevelColor = (level: MemberLevel) => {
    switch (level) {
      case MemberLevel.PHD:
      case MemberLevel.MASTERS_DEGREE:
        return "gold";
      case MemberLevel.UNIVERSITY:
        return "blue";
      case MemberLevel.COLLEGE:
        return "cyan";
      case MemberLevel.INTERMEDIATE:
      case MemberLevel.HIGH_SCHOOL:
        return "green";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: MemberStatus) => {
    switch (status) {
      case MemberStatus.ACTIVE:
        return "success";
      case MemberStatus.LOCK:
        return "error";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<MemberItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Thành viên",
      key: "name",
      width: 220,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-semibold text-base">{record.name}</div>
            <div className="text-xs text-muted-foreground">
              {getMemberRoleLabel(record.role)}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: 250,
      render: (_, record) => (
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-gray-400" />
            <span>{record.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" />
            <span>{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
      filters: Object.values(MemberRole).map((role) => ({
        text: MemberRoleLabels[role],
        value: role,
      })),
      onFilter: (value, record) => record.role === value,
      render: (role: MemberRole) => {
        const color = role === MemberRole.ADMIN ? "geekblue" : "default";
        return <Tag color={color}>{getMemberRoleLabel(role)}</Tag>;
      },
    },
    {
      title: "Trình độ",
      dataIndex: "level",
      key: "level",
      filters: Object.values(MemberLevel).map((lvl) => ({
        text: MemberLevelLabels[lvl],
        value: lvl,
      })),
      onFilter: (value, record) => record.level === value,
      render: (level: MemberLevel) => (
        <Tag color={getLevelColor(level)}>{getMemberLevelLabel(level)}</Tag>
      ),
    },
    {
      title: "Điểm",
      dataIndex: "accumulatedPoints",
      key: "accumulatedPoints",
      width: 80,
      align: "center",
      render: (points: number) => (
        <span className="font-semibold text-blue-600">{points || 0}</span>
      ),
      sorter: (a, b) => (a.accumulatedPoints || 0) - (b.accumulatedPoints || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: Object.values(MemberStatus).map((st) => ({
        text: MemberStatusLabels[st],
        value: st,
      })),
      onFilter: (value, record) => record.status === value,
      render: (status: MemberStatus) => (
        <Tag color={getStatusColor(status)}>{getMemberStatusLabel(status)}</Tag>
      ),
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
        <div className="flex items-center gap-2 flex-wrap">
          <Space.Compact style={{ width: 320 }}>
            <Input
              placeholder="Tìm kiếm tên, email, sđt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />
            <Button type="primary" onClick={() => setSearchTerm(searchTerm)}>
              Tìm
            </Button>
          </Space.Compact>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredMembers}
          rowKey="id"
          loading={tableLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Drawer
        title="Chi tiết & Cập nhật thành viên"
        placement="right"
        onClose={handleDrawerClose}
        open={editingMode}
        width={600}
        closeIcon={<X size={20} />}
        destroyOnClose
        maskClosable={true}
      >
        <MembersEditorForm
          key={editingMember ? editingMember.id : "view-edit"}
          initialData={editingMember ?? undefined}
          onSave={(data) => {
            if (editingMember?.id) {
              updateMutation.mutate({
                id: editingMember.id,
                data: data,
              });
            }
          }}
          onCancel={handleDrawerClose}
          isLoading={updateMutation.isPending}
          hasUnsavedChanges={setIsFormDirty}
        />
      </Drawer>
    </div>
  );
}
