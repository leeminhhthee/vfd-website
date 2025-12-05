"use client";

import {
  getScheduleStatusLabel,
  ScheduleStatus,
} from "@/data/constants/constants";
import { TournamentItem } from "@/data/model/tournament.model";
import { uploadFile } from "@/lib/utils";
import {
  Button,
  DatePicker,
  Image,
  Input,
  notification,
  Select,
  Switch,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  initialData?: TournamentItem;
  onSave: (data: Partial<TournamentItem>) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasUnsavedChanges?: (changed: boolean) => void;
}

export default function TournamentEditorForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
  hasUnsavedChanges: notifyUnsavedChanges,
}: Props) {
  const [formData, setFormData] = useState<Partial<TournamentItem>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate || undefined,
    endDate: initialData?.endDate || undefined,
    location: initialData?.location || "",
    teams: initialData?.teams || 0,
    banner: initialData?.banner || "",
    status: (initialData?.status as ScheduleStatus) || ScheduleStatus.COMING,
    isVisibleOnHome: initialData?.isVisibleOnHome ?? false,
    registrationOpen: initialData?.registrationOpen ?? false, // Đổi từ isRegistrationOpen
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(
    initialData?.banner || ""
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const markAsChanged = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  useEffect(() => {
    if (notifyUnsavedChanges) notifyUnsavedChanges(hasUnsavedChanges);
  }, [hasUnsavedChanges, notifyUnsavedChanges]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "teams" ? parseInt(value) || 0 : value,
    }));
    markAsChanged();
  };

  const handleStatusChange = (value: ScheduleStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
    markAsChanged();
  };

  const handleVisibilityChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isVisibleOnHome: checked }));
    markAsChanged();
  };

  const handleRegistrationChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, registrationOpen: checked })); // Đổi từ isRegistrationOpen
    markAsChanged();
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
      markAsChanged();
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview("");
    setFormData((prev) => ({ ...prev, banner: "" }));
    markAsChanged();
  };

  const handleSave = async () => {
    if (!formData.name?.trim())
      return notification.error({ message: "Vui lòng nhập tên giải đấu" });
    if (!formData.startDate)
      return notification.error({ message: "Vui lòng chọn ngày bắt đầu" });
    if (!formData.endDate)
      return notification.error({ message: "Vui lòng chọn ngày kết thúc" });
    if (!formData.location?.trim())
      return notification.error({ message: "Vui lòng nhập địa điểm" });

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        return notification.error({
          message: "Ngày kết thúc phải sau ngày bắt đầu",
        });
      }
    }

    setIsUploading(true);

    try {
      let finalBannerUrl = formData.banner || "";

      if (bannerFile) {
        try {
          const uploadResult = await uploadFile(bannerFile);
          finalBannerUrl = uploadResult.link;
        } catch (error) {
          notification.error({
            message: "Lỗi upload banner: " + (error as Error).message,
          });
          setIsUploading(false);
          return;
        }
      }

      const result: Partial<TournamentItem> = {
        ...formData,
        banner: finalBannerUrl,
      };

      onSave(result);
    } catch (error) {
      notification.error({ message: "Có lỗi xảy ra khi lưu dữ liệu" });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusTag = (status: string) => {
    const label = getScheduleStatusLabel(status);
    switch (status) {
      case ScheduleStatus.COMING:
        return <Tag color="blue">{label}</Tag>;
      case ScheduleStatus.ONGOING:
        return <Tag color="green">{label}</Tag>;
      case ScheduleStatus.ENDED:
        return <Tag color="default">{label}</Tag>;
      case ScheduleStatus.POSTPONED:
        return <Tag color="orange">{label}</Tag>;
      default:
        return <Tag>{label}</Tag>;
    }
  };

  const isProcessing = isLoading || isUploading;

  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Tên giải đấu <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Ví dụ: Giải bóng chuyền nam TP Đà Nẵng 2024"
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Mô tả
        </label>
        <Input.TextArea
          rows={4}
          name="description"
          size="large"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Nhập mô tả chi tiết..."
          disabled={isProcessing}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Ngày bắt đầu <span className="text-red-500">*</span>
          </label>
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            placeholder="dd/mm/yyyy"
            format="DD/MM/YYYY"
            value={formData.startDate ? dayjs(formData.startDate) : null}
            onChange={(date) => {
              setFormData((prev) => ({
                ...prev,
                startDate: date ? date.toDate() : undefined,
              }));
              markAsChanged();
            }}
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Ngày kết thúc <span className="text-red-500">*</span>
          </label>
          <DatePicker
            size="large"
            style={{ width: "100%" }}
            placeholder="dd/mm/yyyy"
            format="DD/MM/YYYY"
            value={formData.endDate ? dayjs(formData.endDate) : null}
            onChange={(date) => {
              setFormData((prev) => ({
                ...prev,
                endDate: date ? date.toDate() : undefined,
              }));
              markAsChanged();
            }}
            disabled={isProcessing}
          />
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Địa điểm thi đấu <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Ví dụ: Nhà thi đấu Quân khu 5"
          disabled={isProcessing}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Số lượng đội
          </label>
          <Input
            size="large"
            type="number"
            name="teams"
            value={formData.teams ?? 0}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Trạng thái <span className="text-red-500">*</span>
          </label>
          <Select
            size="large"
            style={{ width: "100%" }}
            value={formData.status as ScheduleStatus}
            onChange={handleStatusChange}
            disabled={isProcessing}
            options={Object.values(ScheduleStatus).map((status) => ({
              value: status,
              label: getStatusTag(status),
            }))}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-gray-50">
          <Switch
            checked={formData.isVisibleOnHome}
            onChange={handleVisibilityChange}
            disabled={isProcessing}
          />
          <span className="text-sm font-medium text-foreground">
            Hiển thị trên trang chủ
          </span>
        </div>

        <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-gray-50">
          <Switch
            checked={formData.registrationOpen}
            onChange={handleRegistrationChange}
            disabled={isProcessing}
          />
          <span className="text-sm font-medium text-foreground">
            Mở đăng ký tham gia
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Banner giải đấu
        </label>
        {bannerPreview ? (
          <div className="relative">
            <Image
              src={bannerPreview}
              alt="Banner preview"
              className="w-full h-32 object-cover rounded-lg border border-border"
              preview={{ mask: "Phóng to" }}
              height={160}
              width={"100%"}
            />
            <Button
              type="text"
              danger
              size="large"
              icon={<X size={16} />}
              onClick={removeBanner}
              disabled={isProcessing}
              style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
            />
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-40 px-4 py-6 border-2 border-dashed border-border rounded-lg transition-colors ${
              isProcessing
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-card"
            }`}
            onDrop={(e) => {
              if (isProcessing) return;
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith("image/")) {
                setBannerFile(file);
                setBannerPreview(URL.createObjectURL(file));
                markAsChanged();
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
              disabled={isProcessing}
            />
          </label>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button onClick={onCancel} disabled={isProcessing}>
          Hủy
        </Button>
        <Button type="primary" onClick={handleSave} loading={isProcessing}>
          {isUploading
            ? "Đang tải ảnh..."
            : initialData
            ? "Cập nhật"
            : "Tạo giải đấu"}
        </Button>
      </div>
    </div>
  );
}