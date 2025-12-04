"use client";

import {
  getRegistrationStatusLabel,
  RegistrationStatus,
} from "@/data/constants/constants";
import { registrationInteractor } from "@/data/datasource/registration/interactor/registration.interactor";
import { RegistrationItem } from "@/data/model/registration.model";
import { useLoading } from "@/providers/loading-provider";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Divider,
  Drawer,
  Input,
  Modal,
  notification,
  Space,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";

export default function RegistrationsManagement() {
  const { showLoading, hideLoading } = useLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationItem | null>(null);

  const queryClient = useQueryClient();

  const {
    data: registrations = [],
    isLoading,
    error,
  } = useQuery<RegistrationItem[]>({
    queryKey: ["registrations"],
    queryFn: registrationInteractor.getRegistrationList,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: RegistrationStatus }) =>
      registrationInteractor.updateRegistrationStatus(id, status),
    onSuccess: (_, variables) => {
      const label = getRegistrationStatusLabel(variables.status);
      notification.success({
        message: "Cập nhật thành công",
        description: `Đã thay đổi trạng thái thành "${label}"`,
      });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });

      if (selectedRegistration?.id === variables.id) {
        setSelectedRegistration((prev) =>
          prev ? { ...prev, status: variables.status } : null
        );
      }
    },
    onError: () => {
      notification.error({ message: "Có lỗi xảy ra khi cập nhật trạng thái" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => registrationInteractor.deleteRegistration(id),
    onSuccess: () => {
      notification.success({
        message: "Xóa thành công",
        description: "Đơn đăng ký đã được xóa khỏi hệ thống.",
      });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      setDetailModalOpen(false);
      setSelectedRegistration(null);
    },
    onError: () => {
      notification.error({ message: "Có lỗi xảy ra khi xóa đơn đăng ký" });
    },
  });

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xóa đơn đăng ký?",
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

  const getStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.PENDING:
        return "orange";
      case RegistrationStatus.APPROVED:
        return "green";
      case RegistrationStatus.REJECTED:
        return "red";
      default:
        return "default";
    }
  };

  const tournaments = useMemo(() => {
    const unique = [...new Set(registrations.map((r) => r.tournament))];
    return unique;
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchSearch =
        reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.tournament.toLowerCase().includes(searchTerm.toLowerCase());

      return matchSearch;
    });
  }, [registrations, searchTerm]);

  const handleShowDetail = (record: RegistrationItem) => {
    setSelectedRegistration(record);
    setDetailModalOpen(true);
  };

  const handleStatusChange = (
    registration: RegistrationItem,
    newStatus: RegistrationStatus
  ) => {
    const newStatusLabel = getRegistrationStatusLabel(newStatus);
    Modal.confirm({
      title: `Thay đổi trạng thái đăng ký`,
      content: `Bạn có chắc chắn muốn thay đổi trạng thái của "${registration.teamName}" thành "${newStatusLabel}"?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      okType: newStatus === RegistrationStatus.REJECTED ? "danger" : "primary",
      onOk: () => {
        showLoading();
        updateStatusMutation.mutate(
          { id: registration.id, status: newStatus },
          {
            onSettled: () => {
              hideLoading();
            },
          }
        );
      },
    });
  };

  const handleDownloadDocument = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      notification.warning({ message: "Không có tài liệu để tải" });
    }
  };

  const columns: ColumnsType<RegistrationItem> = [
    {
      title: "Tên đội",
      dataIndex: "teamName",
      key: "teamName",
      render: (text: string) => (
        <strong className="text-foreground">{text}</strong>
      ),
    },
    {
      title: "Giải đấu đăng ký",
      dataIndex: "tournament",
      key: "tournament",
      filters: tournaments.map((t) => ({ text: t, value: t })),
      onFilter: (value, record) => record.tournament === value,
      render: (text: string) => (
        <span className="text-muted-foreground">{text}</span>
      ),
    },
    {
      title: "Trưởng đoàn",
      dataIndex: "coach",
      key: "coach",
      render: (text: string) => (
        <span className="text-muted-foreground">{text}</span>
      ),
    },
    {
      title: "Số lượng VĐV",
      dataIndex: "players",
      key: "players",
      align: "center",
      render: (num: number) => <span className="font-medium">{num}</span>,
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: RegistrationStatus) => (
        <Tag color={getStatusColor(status)}>
          {getRegistrationStatusLabel(status)}
        </Tag>
      ),
      filters: Object.values(RegistrationStatus).map((status) => ({
        text: getRegistrationStatusLabel(status),
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_: unknown, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleShowDetail(record)}
          />
          <Button
            type="text"
            icon={<DownloadOutlined />}
            className="text-green-600"
            onClick={() => handleDownloadDocument(record.documentUrl)}
            disabled={!record.documentUrl}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            loading={
              deleteMutation.isPending && deleteMutation.variables === record.id
            }
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
      <div className="flex gap-4 flex-wrap">
        <Space.Compact style={{ width: 320 }}>
          <Input
            placeholder="Tìm kiếm theo tên đội hoặc giải đấu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
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
          dataSource={filteredRegistrations}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isLoading}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Drawer
        title="Chi tiết đăng ký"
        placement="right"
        onClose={() => setDetailModalOpen(false)}
        open={detailModalOpen}
        width={500}
      >
        {selectedRegistration && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm">Tên đội</p>
                <p className="font-medium">{selectedRegistration.teamName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Giải đấu đăng ký
                </p>
                <p className="font-medium">{selectedRegistration.tournament}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Trưởng đoàn</p>
                <p className="font-medium">{selectedRegistration.coach}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Số lượng VĐV</p>
                <p className="font-medium">{selectedRegistration.players}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Ngày đăng ký</p>
                <p className="font-medium">
                  {new Date(selectedRegistration.date).toLocaleDateString(
                    "vi-VN"
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Trạng thái hiện tại
                </p>
                <Tag color={getStatusColor(selectedRegistration.status)}>
                  {getRegistrationStatusLabel(selectedRegistration.status)}
                </Tag>
              </div>
            </div>

            <Divider />

            <div className="space-y-4">
              <h3 className="font-bold text-foreground">
                Thông tin người đăng ký
              </h3>
              <div>
                <p className="text-muted-foreground text-sm">
                  Tên người liên hệ
                </p>
                <p className="font-medium">
                  {selectedRegistration.contactName}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium break-all">
                  {selectedRegistration.email}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Số điện thoại</p>
                <p className="font-medium">{selectedRegistration.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Đơn vị</p>
                <p className="font-medium">
                  {selectedRegistration.organization}
                </p>
              </div>
            </div>

            <Divider />

            {selectedRegistration.documentUrl && (
              <div>
                <p className="text-muted-foreground text-sm mb-2">
                  Tài liệu đi kèm
                </p>
                <Button
                  type="primary"
                  icon={<DownloadOutlined className="text-green-600" />}
                  onClick={() =>
                    handleDownloadDocument(selectedRegistration.documentUrl)
                  }
                  block
                >
                  Tải tài liệu
                </Button>
              </div>
            )}

            <Divider />

            <div className="space-y-3">
              <h3 className="font-bold text-foreground">Cập nhật trạng thái</h3>

              {selectedRegistration.status === RegistrationStatus.PENDING && (
                <>
                  <Button
                    type="primary"
                    block
                    loading={updateStatusMutation.isPending}
                    style={{
                      backgroundColor: "#22c55e",
                      borderColor: "#22c55e",
                    }}
                    onClick={() =>
                      handleStatusChange(
                        selectedRegistration,
                        RegistrationStatus.APPROVED
                      )
                    }
                  >
                    Duyệt đơn
                  </Button>
                  <Button
                    danger
                    block
                    loading={updateStatusMutation.isPending}
                    onClick={() =>
                      handleStatusChange(
                        selectedRegistration,
                        RegistrationStatus.REJECTED
                      )
                    }
                  >
                    Từ chối đơn
                  </Button>
                </>
              )}

              {selectedRegistration.status === RegistrationStatus.APPROVED && (
                <Button
                  danger
                  block
                  loading={updateStatusMutation.isPending}
                  onClick={() =>
                    handleStatusChange(
                      selectedRegistration,
                      RegistrationStatus.REJECTED
                    )
                  }
                >
                  Đổi sang Từ chối
                </Button>
              )}

              {selectedRegistration.status === RegistrationStatus.REJECTED && (
                <Button
                  type="primary"
                  block
                  loading={updateStatusMutation.isPending}
                  style={{
                    backgroundColor: "#22c55e",
                    borderColor: "#22c55e",
                  }}
                  onClick={() =>
                    handleStatusChange(
                      selectedRegistration,
                      RegistrationStatus.APPROVED
                    )
                  }
                >
                  Đổi sang Đã duyệt
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
