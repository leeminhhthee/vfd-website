"use client";

import {
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
import { Download, Eye } from "lucide-react";
import { useMemo, useState } from "react";

interface Registration {
  id: number;
  teamName: string;
  tournament: string;
  contactName: string;
  email: string;
  phone: string;
  organization: string;
  coach: string;
  players: number;
  date: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
  documentUrl?: string;
  updatedAt?: string;
}

const mockRegistrations: Registration[] = [
  {
    id: 1,
    teamName: "Đội Bóng Chuyền A",
    tournament: "Giải bóng chuyền nam TP Đà Nẵng",
    contactName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    organization: "Trung tâm TDTT Đà Nẵng",
    coach: "Nguyễn Văn A",
    players: 12,
    date: "2024-10-20",
    status: "Chờ duyệt",
    documentUrl: "https://example.com/doc1.pdf",
    updatedAt: "2024-10-20",
  },
  {
    id: 2,
    teamName: "Đội Bóng Chuyền B",
    tournament: "Giải bóng chuyền nữ TP Đà Nẵng",
    contactName: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0912345678",
    organization: "Công ty TNHH B",
    coach: "Trần Thị B",
    players: 10,
    date: "2024-10-19",
    status: "Đã duyệt",
    documentUrl: "https://example.com/doc2.pdf",
    updatedAt: "2024-10-21",
  },
  {
    id: 3,
    teamName: "Đội Bóng Chuyền C",
    tournament: "Giải bóng chuyền nam TP Đà Nẵng",
    contactName: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0923456789",
    organization: "Trường Đại học C",
    coach: "Lê Văn C",
    players: 11,
    date: "2024-10-18",
    status: "Từ chối",
    documentUrl: "https://example.com/doc3.pdf",
    updatedAt: "2024-10-19",
  },
];

export default function RegistrationsManagement() {
  const [registrations, setRegistrations] =
    useState<Registration[]>(mockRegistrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tournamentFilter, setTournamentFilter] = useState<string>("all");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  const tournaments = useMemo(() => {
    const unique = [...new Set(registrations.map((r) => r.tournament))];
    return unique;
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchSearch =
        reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.tournament.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "all" || reg.status === statusFilter;

      const matchTournament =
        tournamentFilter === "all" || reg.tournament === tournamentFilter;

      return matchSearch && matchStatus && matchTournament;
    });
  }, [registrations, searchTerm, statusFilter, tournamentFilter]);

  const handleShowDetail = (record: Registration) => {
    setSelectedRegistration(record);
    setDetailModalOpen(true);
  };

  const handleStatusChange = (
    registration: Registration,
    newStatus: "Đã duyệt" | "Từ chối"
  ) => {
    Modal.confirm({
      title: `Thay đổi trạng thái đăng ký`,
      content: `Bạn có chắc chắn muốn thay đổi trạng thái của "${registration.teamName}" thành "${newStatus}"?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      okType: newStatus === "Từ chối" ? "danger" : "primary",
      onOk: () => {
        setRegistrations(
          registrations.map((reg) =>
            reg.id === registration.id
              ? {
                  ...reg,
                  status: newStatus,
                  updatedAt: new Date().toLocaleDateString("vi-VN"),
                }
              : reg
          )
        );
        if (selectedRegistration?.id === registration.id) {
          setSelectedRegistration((prev) =>
            prev ? { ...prev, status: newStatus } : null
          );
        }
        notification.success({
          message: "Cập nhật trạng thái",
          description: `Trạng thái đã được thay đổi thành ${newStatus}`,
        });
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

  const columns: ColumnsType<Registration> = [
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
      render: (status: string) => {
        let color = "default";
        if (status === "Chờ duyệt") color = "orange";
        else if (status === "Đã duyệt") color = "green";
        else if (status === "Từ chối") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
      filters: [
        { text: "Chờ duyệt", value: "Chờ duyệt" },
        { text: "Đã duyệt", value: "Đã duyệt" },
        { text: "Từ chối", value: "Từ chối" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date?: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "-",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_: unknown, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<Eye size={18} className="text-blue-600" />}
            onClick={() => handleShowDetail(record)}
          />
          <Button
            type="text"
            icon={<Download size={18} className="text-green-600" />}
            onClick={() => handleDownloadDocument(record.documentUrl)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Tìm kiếm theo tên đội hoặc giải đấu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Space.Compact>
          <Button
            type={statusFilter === "all" ? "primary" : "default"}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </Button>
          <Button
            type={statusFilter === "Chờ duyệt" ? "primary" : "default"}
            onClick={() => setStatusFilter("Chờ duyệt")}
          >
            Chờ duyệt
          </Button>
          <Button
            type={statusFilter === "Đã duyệt" ? "primary" : "default"}
            onClick={() => setStatusFilter("Đã duyệt")}
          >
            Đã duyệt
          </Button>
          <Button
            type={statusFilter === "Từ chối" ? "primary" : "default"}
            onClick={() => setStatusFilter("Từ chối")}
          >
            Từ chối
          </Button>
        </Space.Compact>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredRegistrations}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Detail Drawer */}
      <Drawer
        title="Chi tiết đăng ký"
        placement="right"
        onClose={() => setDetailModalOpen(false)}
        open={detailModalOpen}
        width={500}
      >
        {selectedRegistration && (
          <div className="space-y-6">
            {/* Read-only Info */}
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
            </div>

            <Divider />

            {/* Contact Info */}
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

            {/* Document */}
            {selectedRegistration.documentUrl && (
              <div>
                <p className="text-muted-foreground text-sm mb-2">
                  Tài liệu đi kèm
                </p>
                <Button
                  type="primary"
                  icon={<Download size={18} />}
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

            {/* Status Actions */}
            <div className="space-y-3">
              <h3 className="font-bold text-foreground">Cập nhật trạng thái</h3>
              {selectedRegistration.status === "Chờ duyệt" && (
                <>
                  <Button
                    type="primary"
                    block
                    style={{
                      backgroundColor: "#22c55e",
                      borderColor: "#22c55e",
                    }}
                    onClick={() =>
                      handleStatusChange(selectedRegistration, "Đã duyệt")
                    }
                  >
                    Duyệt đơn
                  </Button>
                  <Button
                    danger
                    block
                    onClick={() =>
                      handleStatusChange(selectedRegistration, "Từ chối")
                    }
                  >
                    Từ chối đơn
                  </Button>
                </>
              )}
              {selectedRegistration.status === "Đã duyệt" && (
                <Button
                  danger
                  block
                  onClick={() =>
                    handleStatusChange(selectedRegistration, "Từ chối")
                  }
                >
                  Đổi sang Từ chối
                </Button>
              )}
              {selectedRegistration.status === "Từ chối" && (
                <Button
                  type="primary"
                  block
                  style={{ backgroundColor: "#22c55e", borderColor: "#22c55e" }}
                  onClick={() =>
                    handleStatusChange(selectedRegistration, "Đã duyệt")
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
