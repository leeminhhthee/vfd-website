"use client";

import {
  ActionType,
  ActionTypeLabels,
  getActionTypeLabel,
  getTargetTableLabel,
  TargetTable,
  TargetTableLabels,
} from "@/data/constants/constants";
import { logsInteractor } from "@/data/datasource/logs/interactor/logs.interactor";
import { LogItem } from "@/data/model/logs.model";
import { useLoading } from "@/providers/loading-provider";
import { ReloadOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Modal,
  notification,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function LogsManagement() {
  const { showLoading, hideLoading } = useLoading();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const queryClient = useQueryClient();

  const {
    data: logs = [],
    isLoading,
    isFetching,
  } = useQuery<LogItem[]>({
    queryKey: ["logs"],
    queryFn: () => logsInteractor.getLogs(),
  });

  const deleteLogsMutation = useMutation({
    mutationFn: (ids: number[]) => logsInteractor.deleteLogs(ids),
    onSuccess: () => {
      notification.success({ message: "Đã xóa log thành công" });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      setSelectedRowKeys([]);
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  const clearAllLogsMutation = useMutation({
    mutationFn: () => logsInteractor.clearAllLogs(),
    onSuccess: () => {
      notification.success({ message: "Đã xóa toàn bộ log" });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
      setSelectedRowKeys([]);
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleDeleteSelected = () => {
    if (selectedRowKeys.length === 0) return;
    Modal.confirm({
      title: `Xóa ${selectedRowKeys.length} dòng nhật ký?`,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        showLoading();
        deleteLogsMutation.mutate(selectedRowKeys as number[], {
          onSettled: () => {
            hideLoading();
          },
        });
      },
    });
  };

  const handleClearAll = () => {
    Modal.confirm({
      title: "Xóa TẤT CẢ nhật ký?",
      content: "CẢNH BÁO: Toàn bộ dữ liệu nhật ký sẽ bị xóa vĩnh viễn.",
      okText: "Xóa tất cả",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        showLoading();
        clearAllLogsMutation.mutate(undefined, {
          onSettled: () => {
            hideLoading();
          },
        });
      },
    });
  };

  const getActionColor = (type: ActionType) => {
    switch (type) {
      case ActionType.CREATE:
        return "success";
      case ActionType.UPDATE:
        return "processing";
      case ActionType.DELETE:
        return "error";
      case ActionType.LOGIN:
        return "warning";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<LogItem> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Hành động",
      dataIndex: "actionType",
      key: "actionType",
      width: 140,
      filters: Object.values(ActionType).map((type) => ({
        text: ActionTypeLabels[type],
        value: type,
      })),
      onFilter: (value, record) => record.actionType === value,
      render: (type: ActionType) => (
        <Badge status={getActionColor(type)} text={getActionTypeLabel(type)} />
      ),
    },
    {
      title: "Khu vực",
      dataIndex: "targetTable",
      key: "targetTable",
      width: 150,
      filters: Object.values(TargetTable).map((table) => ({
        text: TargetTableLabels[table],
        value: table,
      })),
      onFilter: (value, record) => record.targetTable === value,
      render: (table: string) => <Tag>{getTargetTableLabel(table)}</Tag>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Người thực hiện",
      dataIndex: "fullName",
      key: "fullName",
      width: 180,
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: Date) =>
        date ? dayjs(date).format("HH:mm DD/MM/YYYY") : "-",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            icon={<ReloadOutlined />}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["logs"] })
            }
            loading={isFetching}
          >
            Làm mới
          </Button>
        </div>

        <Space>
          {selectedRowKeys.length > 0 && (
            <Button
              danger
              onClick={handleDeleteSelected}
              loading={deleteLogsMutation.isPending}
            >
              Xóa ({selectedRowKeys.length})
            </Button>
          )}

          <Tooltip title="Xóa sạch toàn bộ lịch sử">
            <Button
              danger
              type="primary"
              icon={<Trash2 size={16} />}
              onClick={handleClearAll}
              disabled={logs.length === 0}
              loading={clearAllLogsMutation.isPending}
            >
              Xóa tất cả
            </Button>
          </Tooltip>
        </Space>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng cộng ${total} dòng`,
          }}
          scroll={{ x: 900 }}
        />
      </div>
    </div>
  );
}
