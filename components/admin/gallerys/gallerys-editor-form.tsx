"use client";

import {
  GalleryCategory,
  GalleryCategoryLabels,
} from "@/data/constants/constants";
import { tournamentInteractor } from "@/data/datasource/tournament/interactor/tournament.interactor";
import { GalleryAlbum } from "@/data/model/gallery.model";
import { uploadFile } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, Input, notification, Select } from "antd";
import { Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";

type GalleryAlbumPayload = Omit<Partial<GalleryAlbum>, 'tournament'> & {
  tournament?: number;
};

interface Props {
  initialData?: GalleryAlbum;
  onSave: (data: GalleryAlbumPayload) => void;
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
    tournament: initialData?.tournament || undefined,
    imageUrl: initialData?.imageUrl || [],
  });

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    initialData?.imageUrl || []
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch tournaments
  const { data: tournaments = [] } = useQuery({
    queryKey: ["tournaments"],
    queryFn: tournamentInteractor.getTournamentList,
  });

  // Create tournament options
  const tournamentOptions = tournaments.map((tournament) => ({
    value: tournament.id,
    label: `${tournament.id} - ${tournament.name}`,
  }));

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

  const handleTournamentChange = (value: number | null) => {
    const selectedTournament = value
      ? tournaments.find((t) => t.id === value)
      : undefined;

    setFormData((prev) => ({ ...prev, tournament: selectedTournament }));
    markAsChanged();
  };

  const processFiles = (files: FileList | File[]) => {
    const filesArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (filesArray.length === 0) {
      notification.warning({ message: "Vui lòng chỉ tải lên file hình ảnh" });
      return;
    }

    setNewFiles((prev) => [...prev, ...filesArray]);
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    markAsChanged();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isProcessing) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const totalOldImages = formData.imageUrl?.length || 0;

    if (index < totalOldImages) {
      const updatedOldImages = [...(formData.imageUrl || [])];
      updatedOldImages.splice(index, 1);
      setFormData((prev) => ({ ...prev, imageUrl: updatedOldImages }));
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

      const finalImages = [...(formData.imageUrl || []), ...uploadedUrls];

      const result: GalleryAlbumPayload = {
        ...formData,
        imageUrl: finalImages,
        tournament: formData.tournament?.id,
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
          allowClear
        />
      </div>

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
          Giải đấu (nếu có)
        </label>
        <Select
          size="large"
          style={{ width: "100%" }}
          placeholder="Chọn giải đấu"
          value={formData.tournament?.id}
          onChange={handleTournamentChange}
          options={tournamentOptions}
          disabled={isProcessing}
          allowClear
          showSearch
          placement="bottomLeft"
          listHeight={300}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Hình ảnh <span className="text-red-500">*</span>
        </label>

        {/* Image Grid with Add Button */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`grid grid-cols-4 gap-4 p-4 border-2 border-dashed rounded-lg transition-all ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border"
          } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
        >
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
                className="cursor-pointer absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                disabled={isProcessing}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Add Image Button - Small Icon at the end */}
          <label
            className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-lg transition-colors ${
              isProcessing
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-card hover:border-primary"
            }`}
          >
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Plus size={32} />
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

      <div className="flex justify-end gap-2 pt-4 border-border">
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
