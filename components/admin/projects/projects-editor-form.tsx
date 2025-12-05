"use client";

import {
  ProjectCategory,
  ProjectCategoryLabels,
} from "@/data/constants/constants";
import { aboutInteractor } from "@/data/datasource/about/interactor/about.interactor";
import { BankQrItem } from "@/data/model/about.model";
import { ProjectItem } from "@/data/model/project.model";
import { uploadFile } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, Input, notification, Select } from "antd";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  initialData?: ProjectItem;
  onSave: (data: Partial<ProjectItem>) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasUnsavedChanges?: (changed: boolean) => void;
}

const CATEGORY_OPTIONS = Object.values(ProjectCategory).map((cat) => ({
  value: cat,
  label: ProjectCategoryLabels[cat],
}));

export default function ProjectsEditorForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
  hasUnsavedChanges: notifyUnsavedChanges,
}: Props) {
  const [formData, setFormData] = useState<Partial<ProjectItem>>({
    title: initialData?.title || "",
    overview: initialData?.overview || "",
    duration: initialData?.duration || "",
    location: initialData?.location || "",
    price: initialData?.price || 0,
    category: initialData?.category,
    image: initialData?.image || "",
    goals: initialData?.goals || [],
    bankQrCode: initialData?.bankQrCode || undefined,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.image || ""
  );
  const [selectedBankQrId, setSelectedBankQrId] = useState<number | undefined>(
    initialData?.bankQrCode?.id
  );
  const [previewBankQrId, setPreviewBankQrId] = useState<number | undefined>();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch danh sách Bank QR
  const { data: bankQrs = [] } = useQuery<BankQrItem[]>({
    queryKey: ["bank-qrs"],
    queryFn: () => aboutInteractor.getBankQrs(),
  });

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    markAsChanged();
  };

  const handleGoalsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const goalsArray = e.target.value.split("\n").filter((g) => g.trim());
    setFormData((prev) => ({ ...prev, goals: goalsArray }));
    markAsChanged();
  };

  const handleCategoryChange = (value: ProjectCategory) => {
    setFormData((prev) => ({ ...prev, category: value }));
    markAsChanged();
  };

  const handleBankQrChange = (value: number) => {
    const selectedQr = bankQrs.find((qr) => qr.id === value);
    setSelectedBankQrId(value);
    setFormData((prev) => ({
      ...prev,
      bankQrCode: selectedQr,
    }));
    markAsChanged();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      markAsChanged();
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
    markAsChanged();
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      return notification.error({ message: "Vui lòng nhập tên dự án" });
    }
    if (!formData.category) {
      return notification.error({ message: "Vui lòng chọn danh mục" });
    }
    if (formData.price === undefined || formData.price === null) {
      return notification.error({ message: "Vui lòng nhập ngân sách/giá trị" });
    }
    if (!formData.duration?.trim()) {
      return notification.error({
        message: "Vui lòng nhập thời gian thực hiện",
      });
    }
    if (!formData.location?.trim()) {
      return notification.error({ message: "Vui lòng nhập địa điểm" });
    }
    if (!formData.overview?.trim()) {
      return notification.error({ message: "Vui lòng nhập mô tả tổng quan" });
    }
    if (!formData.image && !imageFile) {
      return notification.error({ message: "Vui lòng chọn hình ảnh dự án" });
    }

    setIsUploading(true);

    try {
      let finalImageUrl = formData.image || "";

      if (imageFile) {
        try {
          const uploadResult = await uploadFile(imageFile);
          finalImageUrl = uploadResult.link;
        } catch (error) {
          notification.error({
            message: "Lỗi upload ảnh: " + (error as Error).message,
          });
          setIsUploading(false);
          return;
        }
      }

      const result: Partial<ProjectItem> = {
        ...formData,
        image: finalImageUrl,
      };

      onSave(result);
    } catch (error) {
      notification.error({ message: "Có lỗi xảy ra khi lưu dữ liệu" });
    } finally {
      setIsUploading(false);
    }
  };

  const isProcessing = isLoading || isUploading;
  const selectedBankQr = bankQrs.find((qr) => qr.id === selectedBankQrId);
  const previewBankQr = bankQrs.find((qr) => qr.id === previewBankQrId);

  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Tên dự án <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Nhập tên dự án..."
          disabled={isProcessing}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <Select
            size="large"
            style={{ width: "100%" }}
            placeholder="Chọn danh mục"
            value={formData.category}
            onChange={handleCategoryChange}
            options={CATEGORY_OPTIONS}
            disabled={isProcessing}
          />
        </div>
        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Ngân sách / Giá trị <span className="text-red-500">*</span>
          </label>
          <Input
            size="large"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Ví dụ: 500000000"
            disabled={isProcessing}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Thời gian thực hiện <span className="text-red-500">*</span>
          </label>
          <Input
            size="large"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Ví dụ: 3 tháng, Năm 2024"
            disabled={isProcessing}
          />
        </div>
        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Địa điểm <span className="text-red-500">*</span>
          </label>
          <Input
            size="large"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Ví dụ: TP. Hồ Chí Minh"
            disabled={isProcessing}
          />
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Mô tả tổng quan <span className="text-red-500">*</span>
        </label>
        <Input.TextArea
          rows={5}
          name="overview"
          size="large"
          value={formData.overview}
          onChange={handleInputChange}
          placeholder="Mô tả chi tiết về dự án..."
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Mục tiêu (mỗi dòng là 1 mục tiêu)
        </label>
        <Input.TextArea
          rows={4}
          value={formData.goals?.join("\n") || ""}
          onChange={handleGoalsChange}
          placeholder="Mục tiêu 1&#10;Mục tiêu 2&#10;Mục tiêu 3"
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Hình ảnh dự án <span className="text-red-500">*</span>
        </label>
        {imagePreview ? (
          <div className="relative">
            <Image
              src={imagePreview}
              alt="Project preview"
              className="w-full h-48 object-cover rounded-lg border border-border"
              preview={{ mask: "Phóng to" }}
              height={200}
              width={"100%"}
            />
            <Button
              type="text"
              danger
              size="large"
              icon={<X size={16} />}
              onClick={removeImage}
              disabled={isProcessing}
              style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
            />
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-48 px-4 py-6 border-2 border-dashed border-border rounded-lg transition-colors ${
              isProcessing
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-card"
            }`}
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
              onChange={handleImageUpload}
              disabled={isProcessing}
            />
          </label>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Thông tin ngân hàng</h3>

        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-foreground">
            Chọn tài khoản ngân hàng <span className="text-red-500">*</span>
          </label>
          <Select
            size="large"
            style={{ width: "100%" }}
            placeholder="Chọn tài khoản ngân hàng"
            value={selectedBankQrId}
            onChange={handleBankQrChange}
            disabled={isProcessing}
            options={bankQrs.map((qr) => ({
              value: qr.id,
              label: `${qr.bankName} - ${qr.accountNumber} (${qr.accountName})`,
            }))}
          />
        </div>

        {selectedBankQr && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">
                Tài khoản đã chọn
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Tên ngân hàng
                </label>
                <Input
                  value={selectedBankQr.bankName}
                  disabled
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Số tài khoản
                </label>
                <Input
                  value={selectedBankQr.accountNumber}
                  disabled
                  className="bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Tên chủ tài khoản
                </label>
                <Input
                  value={selectedBankQr.accountName}
                  disabled
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Chi nhánh
                </label>
                <Input
                  value={selectedBankQr.branchName}
                  disabled
                  className="bg-white"
                />
              </div>
            </div>

            {selectedBankQr.qrCodeUrl && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">
                  QR Code thanh toán
                </label>
                <Image
                  src={selectedBankQr.qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48 object-cover rounded-lg border border-border"
                  preview={{ mask: "Phóng to" }}
                  width={200}
                  height={200}
                />
              </div>
            )}
          </div>
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
            : "Tạo dự án"}
        </Button>
      </div>
    </div>
  );
}
