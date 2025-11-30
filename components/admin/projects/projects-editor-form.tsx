"use client";

import {
  ProjectCategory,
  ProjectCategoryLabels,
} from "@/data/constants/constants";
import { ProjectItem } from "@/data/model/project.model";
import { uploadFile } from "@/lib/utils";
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
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.image || ""
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    markAsChanged();
  };

  const handleCategoryChange = (value: ProjectCategory) => {
    setFormData((prev) => ({ ...prev, category: value }));
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
            placeholder="Ví dụ: 500.000.000 VNĐ"
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
            onDrop={(e) => {
              if (isProcessing) return;
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith("image/")) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
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
              onChange={handleImageUpload}
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
            : "Tạo dự án"}
        </Button>
      </div>
    </div>
  );
}
