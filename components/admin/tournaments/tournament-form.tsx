"use client";

import { Button, Image, Input, Modal, notification } from "antd";
import { ArrowLeft, Sparkles, X } from "lucide-react";
import { useState } from "react";

interface TournamentData {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  teams: number;
  banner?: string;
}

interface TournamentFormProps {
  initialData?: TournamentData;
  onSubmit: (data: TournamentData) => void;
  onCancel: () => void;
}

export default function TournamentForm({
  initialData,
  onSubmit,
  onCancel,
}: TournamentFormProps) {
  const [formData, setFormData] = useState(() => {
    return (
      initialData || {
        id: Math.random(),
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        teams: 0,
        banner: "",
      }
    );
  });

  const [bannerPreview, setBannerPreview] = useState<string | null>(
    initialData?.banner || null
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Modal.confirm({
        title: "Bạn có chắc chắn muốn thoát?",
        content: "Những thay đổi chưa được lưu sẽ bị mất.",
        okText: "Thoát",
        okType: "danger",
        cancelText: "Tiếp tục chỉnh sửa",
        onOk: onCancel,
      });
    } else {
      onCancel();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="text"
          icon={<ArrowLeft size={20} />}
          onClick={handleCancel}
        >
          Quay lại
        </Button>
        <h2 className="text-2xl font-bold text-foreground">
          {initialData ? "Chỉnh sửa giải đấu" : "Tạo giải đấu mới"}
        </h2>
        <div style={{ width: 48 }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="gap-6 p-6 bg-white rounded-lg border border-border overflow-hidden">
          {/* Tournament Name */}
          <div className="space-y-2 mb-3">
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
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Mô tả
            </label>
            <Input.TextArea
              rows={4}
              name="description"
              size="large"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả chi tiết về giải đấu..."
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 mb-3">
              <label className="block text-sm font-medium text-foreground">
                Ngày bắt đầu
              </label>
              <Input
                size="large"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2 mb-3">
              <label className="block text-sm font-medium text-foreground">
                Ngày kết thúc
              </label>
              <Input
                size="large"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Location & Teams */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 mb-3">
              <label className="block text-sm font-medium text-foreground">
                Địa điểm thi đấu
              </label>
              <Input
                size="large"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ví dụ: Nhà thi đấu Quân Ngũ, Đà Nẵng"
              />
            </div>

            <div className="space-y-2 mb-3">
              <label className="block text-sm font-medium text-foreground">
                Số lượng đội
              </label>
              <Input
                size="large"
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
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Banner giải đấu
            </label>

            {bannerPreview ? (
              <div className="relative">
                <Image
                  src={bannerPreview || "/placeholder.svg"}
                  alt="Banner preview"
                  className="w-full h-20 object-cover rounded-lg border border-border"
                  preview={{
                    mask: "Phóng to",
                  }}
                  height={120}
                />
                <Button
                  type="text"
                  danger
                  size="large"
                  icon={<X size={16} />}
                  onClick={removeBanner}
                  style={{ position: "absolute", top: 8, right: 8 }}
                />
              </div>
            ) : (
              <label
                className="flex flex-col items-center justify-center w-full h-48 px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-card transition-colors"
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const preview = event.target?.result as string;
                      setBannerPreview(preview);
                      setFormData((prev) => ({ ...prev, banner: preview }));
                      setHasUnsavedChanges(true);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex flex-col items-center justify-center">
                  <Sparkles size={32} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold">Nhấp để chọn</span> hoặc kéo thả
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG (tối đa 10MB)
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button onClick={handleCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            {initialData ? "Cập nhật" : "Tạo giải đấu"}
          </Button>
        </div>
      </form>
    </div>
  );
}
