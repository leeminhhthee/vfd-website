"use client";

import {
  getScheduleStatusLabel,
  ScheduleStatus,
} from "@/data/constants/constants";
import { tournamentInteractor } from "@/data/datasource/tournament/interactor/tournament.interactor";
import { TournamentItem } from "@/data/model/tournament.model";
import { confirmUnsavedChanges, getStatusColor } from "@/lib/utils";
import { useLoading } from "@/providers/loading-provider";
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
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { CheckCircle2, X, XCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import TournamentEditorForm from "./tournament-form";

export default function TournamentsManagement() {
  const { showLoading, hideLoading } = useLoading();
  const [editingMode, setEditingMode] = useState(false);
  const [editingTournament, setEditingTournament] =
    useState<TournamentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: tournaments = [],
    isLoading: tableLoading,
    error,
  } = useQuery<TournamentItem[]>({
    queryKey: ["tournaments"],
    queryFn: tournamentInteractor.getTournamentList,
  });

  const handleCloseEditor = () => {
    setEditingMode(false);
    setEditingTournament(null);
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
    TournamentItem,
    Error,
    Partial<TournamentItem>
  >({
    mutationFn: (data) => tournamentInteractor.createTournament(data),
    onSuccess: () => {
      notification.success({ message: "Tạo giải đấu thành công" });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Tạo giải đấu thất bại" }),
  });

  const updateMutation = useMutation<
    TournamentItem,
    Error,
    { id: number; data: Partial<TournamentItem> }
  >({
    mutationFn: ({ id, data }) =>
      tournamentInteractor.updateTournament(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật thành công" });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteMutation = useMutation<boolean, Error, number>({
    mutationFn: (id) => tournamentInteractor.deleteTournament(id),
    onSuccess: () => {
      notification.success({ message: "Đã xóa giải đấu" });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  const filteredTournaments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return tournaments.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(term) ||
        (item.location || "").toLowerCase().includes(term)
    );
  }, [tournaments, searchTerm]);

  const statusOptions = [
    {
      text: getScheduleStatusLabel(ScheduleStatus.COMING),
      value: ScheduleStatus.COMING,
    },
    {
      text: getScheduleStatusLabel(ScheduleStatus.ONGOING),
      value: ScheduleStatus.ONGOING,
    },
    {
      text: getScheduleStatusLabel(ScheduleStatus.ENDED),
      value: ScheduleStatus.ENDED,
    },
    {
      text: getScheduleStatusLabel(ScheduleStatus.POSTPONED),
      value: ScheduleStatus.POSTPONED,
    },
  ];

  const handleShowEditor = (record?: TournamentItem) => {
    setEditingTournament(record || null);
    setEditingMode(true);
    setIsFormDirty(false);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa giải đấu này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        showLoading();
        deleteMutation.mutate(id, {
          onSettled: () => {
            hideLoading();
          },
        });
      },
    });
  };

  const columns: ColumnsType<TournamentItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tên giải đấu",
      dataIndex: "name",
      key: "name",
      width: 300,
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
            maxWidth: 350,
            lineHeight: "1.4",
          }}
          className="text-foreground font-semibold"
        >
          {text}
        </div>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: Date | string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
      sorter: (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: Date | string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
      sorter: (a, b) =>
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    },
    {
      title: "Số đội",
      dataIndex: "teams",
      key: "teams",
      render: (teams: number) => <span>{teams ?? '--'} đội</span>,
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      width: 100,
      render: (text: string) => (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            wordBreak: "break-word",
            maxWidth: 120,
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: statusOptions,
      onFilter: (value, record) => record.status === value,
      render: (_, record) => {
        return (
          <Tag color={getStatusColor(record.status)}>
            {getScheduleStatusLabel(record.status)}
          </Tag>
        );
      },
    },
    {
      title: "Trang chủ",
      dataIndex: "isVisibleOnHome",
      key: "isVisibleOnHome",
      align: "center",
      render: (visible: boolean) =>
        visible ? (
          <Tooltip title="Đang hiển thị trên trang chủ">
            <CheckCircle2 className="text-green-500 mx-auto" size={20} />
          </Tooltip>
        ) : (
          <Tooltip title="Không hiển thị">
            <XCircle className="text-gray-300 mx-auto" size={20} />
          </Tooltip>
        ),
    },
    {
      title: "Đăng ký",
      dataIndex: "registrationOpen",
      key: "registrationOpen",
      align: "center",
      render: (open: boolean) =>
        open ? (
          <Tooltip title="Đang mở đăng ký">
            <CheckCircle2 className="text-blue-500 mx-auto" size={20} />
          </Tooltip>
        ) : (
          <Tooltip title="Đã đóng đăng ký">
            <XCircle className="text-gray-300 mx-auto" size={20} />
          </Tooltip>
        ),
    },
    {
      title: "Thao tác",
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
              placeholder="Tìm kiếm giải đấu..."
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
          Thêm giải đấu
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredTournaments}
          rowKey="id"
          loading={tableLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Drawer
        title={editingTournament ? "Chỉnh sửa giải đấu" : "Tạo giải đấu mới"}
        placement="right"
        onClose={handleDrawerClose}
        open={editingMode}
        width={600}
        closeIcon={<X size={20} />}
        destroyOnClose
        maskClosable={true}
      >
        <TournamentEditorForm
          key={editingTournament ? editingTournament.id : "create-new"}
          initialData={editingTournament ?? undefined}
          onSave={(data) => {
            if (editingTournament?.id) {
              showLoading();
              updateMutation.mutate(
                { id: editingTournament.id, data: data },
                {
                  onSettled: () => {
                    hideLoading();
                  },
                }
              );
            } else {
              showLoading();
              createMutation.mutate(data, {
                onSettled: () => {
                  hideLoading();
                },
              });
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
