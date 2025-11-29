"use client";

import { tournamentInteractor } from "@/data/datasource/tournament/interactor/tournament.interactor";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Drawer,
  Image,
  Input,
  Modal,
  notification,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Edit2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

interface Tournament {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  teams: number;
  banner?: string;
  status?: string;
}

const getStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "Chưa bắt đầu";
  if (now > end) return "Đã kết thúc";
  return "Đang diễn ra";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Đang diễn ra":
      return "green";
    case "Chưa bắt đầu":
      return "blue";
    case "Đã kết thúc":
      return "default";
    default:
      return "default";
  }
};

export default function TournamentsManagement() {
  const [editingMode, setEditingMode] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<
    Omit<Tournament, "id"> & { id?: number }
  >({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    teams: 0,
    banner: "",
  });
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    data: tournaments = [],
    isLoading: tableLoading,
    error,
    refetch,
  } = useQuery<Tournament[]>({
    queryKey: ["tournaments"],
    queryFn: tournamentInteractor.getTournamentList,
  });

  const filteredTournaments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return tournaments.filter(
      (item) =>
        (item.name || "").toLowerCase().includes(term) ||
        (item.location || "").toLowerCase().includes(term)
    );
  }, [tournaments, searchTerm]);

  const handleShowCreateEditor = () => {
    setEditingTournament(null);
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      teams: 0,
      banner: "",
    });
    setBannerPreview(null);
    setHasUnsavedChanges(false);
    setEditingMode(true);
  };

  const handleShowEditEditor = (record: Tournament) => {
    setEditingTournament(record);
    setFormData(record);
    setBannerPreview(record.banner || null);
    setHasUnsavedChanges(false);
    setEditingMode(true);
  };

  const handleCloseEditor = () => {
    if (hasUnsavedChanges) {
      Modal.confirm({
        title: "Bạn có chắc chắn muốn thoát?",
        content: "Những thay đổi chưa được lưu sẽ bị mất.",
        okText: "Thoát",
        okType: "danger",
        cancelText: "Tiếp tục chỉnh sửa",
        onOk: () => {
          setEditingMode(false);
          setEditingTournament(null);
        },
      });
    } else {
      setEditingMode(false);
      setEditingTournament(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "teams" ? parseInt(value) : value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setBannerPreview(preview);
        setFormData((prev) => ({ ...prev, banner: preview }));
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    setBannerPreview(null);
    setFormData((prev) => ({ ...prev, banner: "" }));
    setHasUnsavedChanges(true);
  };

  // Loading state for editor
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async () => {
    if (!formData.name?.trim()) {
      notification.error({ message: "Vui lòng nhập tên giải đấu" });
      return;
    }
    if (!formData.description?.trim()) {
      notification.error({ message: "Vui lòng nhập mô tả" });
      return;
    }
    if (!formData.startDate) {
      notification.error({ message: "Vui lòng chọn ngày bắt đầu" });
      return;
    }
    if (!formData.endDate) {
      notification.error({ message: "Vui lòng chọn ngày kết thúc" });
      return;
    }
    if (!formData.location?.trim()) {
      notification.error({ message: "Vui lòng nhập địa điểm" });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Nếu có API tạo/cập nhật thì gọi ở đây, sau đó refetch()
      // Ví dụ:
      // await tournamentInteractor.createTournament(formData);
      // await tournamentInteractor.updateTournament(formData);

      setIsLoading(false);
      setEditingMode(false);
      setEditingTournament(null);
      refetch();
      notification.success({
        message: editingTournament
          ? "Cập nhật giải đấu thành công!"
          : "Tạo giải đấu mới thành công!",
      });
    }, 1200); // giả lập loading
  };

  const columns: ColumnsType<Tournament> = [
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
      render: (text: string) => (
        <strong className="text-foreground">{text}</strong>
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) =>
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    },
    {
      title: "Số đội",
      dataIndex: "teams",
      key: "teams",
      render: (teams: number) => <span>{teams ?? 0} đội</span>,
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: unknown, record) => {
        const status = getStatus(record.startDate, record.endDate);
        return <Tag color={getStatusColor(status)}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 100,
      render: (_: unknown, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<Edit2 size={18} className="text-yellow-600" />}
            onClick={() => handleShowEditEditor(record)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 size={18} />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa giải đấu này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        // Nếu có API xóa thì gọi ở đây, sau đó refetch()
        // await tournamentInteractor.deleteTournament(id);
        refetch();
        notification.success({ message: "Đã xóa giải đấu!" });
      },
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <Tag color="red">Lỗi tải dữ liệu giải đấu!</Tag>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Space.Compact style={{ width: 320 }}>
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

        <Button
          type="primary"
          icon={<Plus size={20} />}
          onClick={handleShowCreateEditor}
        >
          Thêm giải đấu
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-border overflow-x-auto">
        <Spin spinning={tableLoading}>
          <Table
            columns={columns}
            dataSource={filteredTournaments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </div>

      <Drawer
        title={editingTournament ? "Chỉnh sửa giải đấu" : "Tạo giải đấu mới"}
        placement="right"
        onClose={handleCloseEditor}
        open={editingMode}
        width={600}
        closeIcon={<X size={20} />}
      >
        <Spin spinning={isLoading}>
          <div className="space-y-6">
            {/* Tournament Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Tên giải đấu
              </label>
              <Input
                size="large"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ví dụ: Giải bóng chuyền nam TP Đà Nẵng 2024"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Mô tả
              </label>
              <Input.TextArea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả chi tiết về giải đấu..."
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Ngày bắt đầu
                </label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Ngày kết thúc
                </label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Location & Teams */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Địa điểm thi đấu
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Nhà thi đấu Quân Ngũ, Đà Nẵng"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Số lượng đội
                </label>
                <Input
                  type="number"
                  name="teams"
                  value={formData.teams}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Banner Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Banner giải đấu
              </label>

              {bannerPreview ? (
                <div className="relative">
                  <Image
                    src={bannerPreview || "/placeholder.svg"}
                    alt="Banner preview"
                    className="w-full h-full object-cover rounded-lg border border-border"
                    preview={{
                      mask: "Phóng to",
                    }}
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<X size={16} />}
                    onClick={removeBanner}
                    style={{ position: "absolute", top: 0, right: 0 }}
                  />
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-card transition-colors"
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith("image/")) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const url = event.target?.result as string;
                        setBannerPreview(url);
                        setFormData((prev) => ({ ...prev, bannerImage: url }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="flex flex-col items-center justify-center">
                    <Sparkles
                      size={24}
                      className="text-muted-foreground mb-2"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      <span className="font-bold">Nhấp để chọn</span> hoặc kéo
                      thả
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleBannerUpload}
                  />
                </label>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button onClick={handleCloseEditor} disabled={isLoading}>
                Hủy
              </Button>
              <Button
                type="primary"
                onClick={handleFormSubmit}
                loading={isLoading}
              >
                {editingTournament ? "Cập nhật" : "Tạo giải đấu"}
              </Button>
            </div>
          </div>
        </Spin>
      </Drawer>
    </div>
  );
}
