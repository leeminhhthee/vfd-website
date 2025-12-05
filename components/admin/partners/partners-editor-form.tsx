"use client";

import { PartnerItem } from "@/data/model/partner.model";
import { uploadFile } from "@/lib/utils";
import { Button, DatePicker, Image, Input, notification } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  initialData?: PartnerItem;
  onSave: (data: Partial<PartnerItem>) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasUnsavedChanges?: (changed: boolean) => void;
}

export default function PartnersEditorForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
  hasUnsavedChanges: notifyUnsavedChanges,
}: Props) {
  const [formData, setFormData] = useState<Partial<PartnerItem>>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    since: initialData?.since || `${new Date().getFullYear()}-01-01`,
  });

  const [currentImage, setCurrentImage] = useState<{
    url: string;
  } | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData?.imageUrl) {
      setCurrentImage({
        url: initialData.imageUrl,
      });
    } else {
      setCurrentImage(null);
    }
  }, [initialData]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    markAsChanged();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        notification.error({
          message: "File không hợp lệ",
          description: "Chỉ chấp nhận file ảnh (PNG, JPG, JPEG)",
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        notification.error({
          message: "File quá lớn",
          description: "Kích thước ảnh không được vượt quá 5MB",
        });
        return;
      }

      setSelectedImage(file);
      setCurrentImage({
        url: URL.createObjectURL(file),
      });
      markAsChanged();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    if (isUploading || isLoading) return;
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        notification.error({
          message: "File không hợp lệ",
          description: "Chỉ chấp nhận file ảnh (PNG, JPG, JPEG)",
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        notification.error({
          message: "File quá lớn",
          description: "Kích thước ảnh không được vượt quá 5MB",
        });
        return;
      }

      setSelectedImage(file);
      setCurrentImage({
        url: URL.createObjectURL(file),
      });
      markAsChanged();
    }
  };

  const removeImage = () => {
    setCurrentImage(null);
    setSelectedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    markAsChanged();
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      notification.error({ message: "Vui lòng nhập tên đối tác" });
      return;
    }
    if (!formData.since) {
      notification.error({ message: "Vui lòng chọn năm bắt đầu" });
      return;
    }

    setIsUploading(true);

    try {
      let finalImageUrl = initialData?.imageUrl || "";

      if (selectedImage) {
        try {
          const uploadResult = await uploadFile(selectedImage);
          finalImageUrl = uploadResult.link;
        } catch (error) {
          notification.error({
            message: "Lỗi upload ảnh",
            description: (error as Error).message,
          });
          setIsUploading(false);
          return;
        }
      } else if (currentImage && !selectedImage) {
        finalImageUrl = currentImage.url;
      }

      const result: Partial<PartnerItem> = {
        ...(initialData?.id && { id: initialData.id }),
        name: formData.name.trim(),
        email: formData.email?.trim() || null,
        since: formData.since,
        imageUrl: finalImageUrl,
      };

      console.log("📦 Saving partner:", result);
      onSave(result);
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: (error as Error).message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isProcessing = isLoading || isUploading;

  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Tên đối tác <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Ví dụ: Techcombank, Vingroup..."
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Email liên hệ
        </label>
        <Input
          size="large"
          name="email"
          value={formData.email || ""}
          onChange={handleInputChange}
          placeholder="contact@partner.com"
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Hợp tác từ năm <span className="text-red-500">*</span>
        </label>
        <DatePicker
          picker="year"
          size="large"
          style={{ width: "100%" }}
          placeholder="Chọn năm"
          value={formData.since ? dayjs(formData.since, "YYYY-MM-DD") : null}
          onChange={(date: Dayjs | null) => {
            const dateString = date ? `${date.year()}-01-01` : undefined;
            setFormData((prev) => ({
              ...prev,
              since: dateString,
            }));
            markAsChanged();
          }}
          disabled={isProcessing}
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Logo đối tác
        </label>

        {currentImage ? (
          <div className="relative w-fit">
            <div className="border-2 border-border rounded-lg p-4 bg-muted/30">
              <Image
                src={currentImage.url}
                alt="Logo preview"
                className="object-contain"
                width={200}
                height={120}
                preview={{ mask: "Phóng to" }}
              />
            </div>
            <Button
              type="text"
              danger
              size="small"
              icon={<X size={16} />}
              onClick={removeImage}
              disabled={isProcessing}
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                zIndex: 10,
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
              }}
              className="shadow-sm rounded-full"
            />
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed rounded-lg transition-colors ${
              isProcessing
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-card border-border hover:border-accent"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center justify-center">
              <Sparkles size={24} className="text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">Nhấp để chọn</span>{" "}
                hoặc kéo thả ảnh vào đây
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, JPEG (tối đa 5MB)
              </p>
            </div>
            <input
              ref={imageInputRef}
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
            ? "Đang tải ảnh lên..."
            : initialData
            ? "Cập nhật"
            : "Thêm đối tác"}
        </Button>
      </div>
    </div>
  );
}
