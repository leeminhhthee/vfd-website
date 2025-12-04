"use client";

import {
  getScheduleStatusLabel,
  ScheduleStatus,
} from "@/data/constants/constants";
import { tournamentInteractor } from "@/data/datasource/tournament/interactor/tournament.interactor";
import { TournamentItem } from "@/data/model/tournament.model";
import { getStatusColor } from "@/lib/utils";
import { EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Input,
  notification,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import ScheduleResultsEditor from "./schedule-results-editor";

export default function ScheduleResultsManagement() {
  const [editingMode, setEditingMode] = useState(false);
  const [editingTournament, setEditingTournament] =
    useState<TournamentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const {
    data: tournaments = [],
    isLoading: tableLoading,
    error,
  } = useQuery<TournamentItem[]>({
    queryKey: ["tournaments"],
    queryFn: tournamentInteractor.getTournamentList,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TournamentItem>;
    }) => tournamentInteractor.updateTournament(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật lịch thi đấu thành công!" });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const filteredTournaments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return tournaments.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(term) ||
        (item.location || "").toLowerCase().includes(term)
    );
  }, [tournaments, searchTerm]);

  const handleShowEditEditor = (record: TournamentItem) => {
    setEditingTournament(record);
    setEditingMode(true);
  };

  const handleCloseEditor = () => {
    setEditingMode(false);
    setEditingTournament(null);
  };

  const handleUpdateSchedule = (data: Partial<TournamentItem>) => {
    if (editingTournament) {
      updateMutation.mutate({
        id: editingTournament.id,
        data: data,
      });
    }
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
      width: 350,
      render: (text: string) => <strong className="text-foreground">{text}</strong>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      width: 130,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      width: 130,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        return (
          <Tag color={getStatusColor(status)}>
            {getScheduleStatusLabel(status) || status}
          </Tag>
        );
      },
    },
    {
      title: "Lịch đấu",
      key: "hasSchedule",
      align: "center",
      width: 100,
      render: (_, record) => {
        // Kiểm tra dựa trên matchSchedules hoặc scheduleImg
        const hasSchedule =
          (record.matchSchedules && record.matchSchedules.length > 0) ||
          (record.scheduleImg && record.scheduleImg.length > 0);
        return (
          <Tag color={hasSchedule ? "green" : "red"}>
            {hasSchedule ? "Có" : "Chưa"}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Tooltip title="Cập nhật lịch thi đấu">
          <Button
            type="text"
            icon={<EditOutlined className="text-blue-600" />}
            onClick={() => handleShowEditEditor(record)}
          />
        </Tooltip>
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

  if (editingMode && editingTournament) {
    return (
      <ScheduleResultsEditor
        tournament={editingTournament}
        onUpdate={handleUpdateSchedule}
        onCancel={handleCloseEditor}
        isLoading={updateMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <Space.Compact style={{ width: 420 }}>
          <Input
            placeholder="Tìm kiếm tên giải đấu, địa điểm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
          <Button type="primary" onClick={() => setSearchTerm(searchTerm)}>
            Tìm
          </Button>
        </Space.Compact>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredTournaments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={tableLoading}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
}