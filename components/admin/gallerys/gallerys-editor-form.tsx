"use client";

import {
  GalleryCategory,
  GalleryCategoryLabels,
} from "@/data/constants/constants";
import { GalleryAlbum } from "@/data/model/gallery.model";
import { uploadFile } from "@/lib/utils";
import { Button, Image, Input, notification, Select } from "antd";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  initialData?: GalleryAlbum;
  onSave: (data: Partial<GalleryAlbum>) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasUnsavedChanges?: (changed: boolean) => void;
}

const CATEGORY_OPTIONS = Object.values(GalleryCategory).map((cat) => ({
  value: cat,
  label: GalleryCategoryLabels[cat],
}));

export default function GallerysEditorForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
  hasUnsavedChanges: notifyUnsavedChanges,
}: Props) {
  const [formData, setFormData] = useState<Partial<GalleryAlbum>>({
    title: initialData?.title || "",
    category: initialData?.category || undefined,
    tournamentId: initialData?.tournamentId || undefined,
    images: initialData?.images || [],
  });

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialData?.images || []
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const markAsChanged = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    markAsChanged();
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    markAsChanged();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
      markAsChanged();
    }
  };

  const handleRemoveImage = (index: number) => {
    const totalOldImages = formData.images?.length || 0;

    if (index < totalOldImages) {
      const updatedOldImages = [...(formData.images || [])];
      updatedOldImages.splice(index, 1);
      setFormData((prev) => ({ ...prev, images: updatedOldImages }));
    } else {
      const newFileIndex = index - totalOldImages;
      const updatedNewFiles = [...newFiles];
      updatedNewFiles.splice(newFileIndex, 1);
      setNewFiles(updatedNewFiles);
    }

    const updatedPreviews = [...previewUrls];
    updatedPreviews.splice(index, 1);
    setPreviewUrls(updatedPreviews);
    markAsChanged();
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      return notification.error({ message: "Vui lòng nhập tên album" });
    }
    if (!formData.category) {
      return notification.error({ message: "Vui lòng chọn danh mục" });
    }
    if (previewUrls.length === 0) {
      return notification.error({
        message: "Vui lòng tải lên ít nhất một hình ảnh",
      });
    }

    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      if (newFiles.length > 0) {
        try {
          const uploadPromises = newFiles.map((file) => uploadFile(file));
          const results = await Promise.all(uploadPromises);
          results.forEach((res) => uploadedUrls.push(res.link));
        } catch (error) {
          notification.error({
            message: "Lỗi upload ảnh: " + (error as Error).message,
          });
          setIsUploading(false);
          return;
        }
      }

      const finalImages = [...(formData.images || []), ...uploadedUrls];

      const result: Partial<GalleryAlbum> = {
        ...formData,
        images: finalImages,
        createdAt: initialData?.createdAt || new Date(),
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
          Tên Album <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Nhập tên album..."
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
            ID Giải đấu (nếu có)
          </label>
          <Input
            size="large"
            type="number"
            name="tournamentId"
            value={formData.tournamentId || ""}
            onChange={handleInputChange}
            placeholder="Nhập ID giải đấu liên quan"
            disabled={isProcessing}
          />
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Hình ảnh <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square border border-border rounded-lg overflow-hidden group"
            >
              <Image
                src={url}
                alt={`Image ${index}`}
                className="w-full h-full object-cover"
                width={"100%"}
                height={"100%"}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                disabled={isProcessing}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <label
            className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-lg transition-colors ${
              isProcessing
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-card"
            }`}
          >
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Plus size={24} />
              <span className="text-xs mt-1">Thêm ảnh</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={isProcessing}
            />
          </label>
        </div>
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
            : "Tạo Album"}
        </Button>
      </div>
    </div>
  );
}
