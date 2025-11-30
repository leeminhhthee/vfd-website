"use client";

import { HeroItem } from "@/data/model/hero.model";
import { uploadFile } from "@/lib/utils";
import { Button, Image, Input, notification } from "antd";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  initialData?: HeroItem;
  onSave: (data: Partial<HeroItem>) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasUnsavedChanges?: (changed: boolean) => void;
}

export default function BannerEditorForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
  hasUnsavedChanges: notifyUnsavedChanges,
}: Props) {
  const [formData, setFormData] = useState<Partial<HeroItem>>({
    title: initialData?.title || "",
    subTitle: initialData?.subTitle || "",
    image: initialData?.image || "",
    buttonText: initialData?.buttonText || "",
    buttonHref: initialData?.buttonHref || "",
    buttonText2: initialData?.buttonText2 || "",
    buttonHref2: initialData?.buttonHref2 || "",
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

  // Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    markAsChanged();
  };

  // Handle Image Upload
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
    if (!formData.image && !imageFile) {
      return notification.error({ message: "Vui lòng chọn hình ảnh banner" });
    }

    setIsUploading(true);

    try {
      let finalImageUrl = formData.image || "";

      if (imageFile) {
        try {
          const uploadResult = await uploadFile(imageFile);
          finalImageUrl = uploadResult.link;
        } catch (error) {
          notification.error({ message: "Lỗi upload ảnh" });
          setIsUploading(false);
          return;
        }
      }

      const result: Partial<HeroItem> = {
        ...formData,
        image: finalImageUrl,
      };

      onSave(result);
    } catch (error) {
      notification.error({ message: "Có lỗi xảy ra" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Hình ảnh Banner <span className="text-red-500">*</span>
        </label>
        {imagePreview ? (
          <div className="relative w-full">
            <Image
              src={imagePreview}
              alt="Banner preview"
              className="w-full h-48 object-cover rounded-lg border border-border"
              preview={{ mask: "Xem" }}
              height={200}
              width={"100%"}
            />
            <Button
              type="text"
              danger
              size="small"
              icon={<X size={16} />}
              onClick={removeImage}
              disabled={isLoading}
              style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
            />
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-48 px-4 py-6 border-2 border-dashed border-border rounded-lg transition-colors ${
              isLoading
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
                1920x1080 (Khuyên dùng)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isLoading}
            />
          </label>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Tiêu đề chính
        </label>
        <Input
          size="large"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          placeholder="VD: Liên đoàn bóng chuyền Đà Nẵng"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Tiêu đề phụ (Mô tả)
        </label>
        <Input.TextArea
          rows={3}
          name="subTitle"
          value={formData.subTitle || ""}
          onChange={handleInputChange}
          placeholder="Mô tả ngắn gọn..."
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Nút 1 - Text
          </label>
          <Input
            name="buttonText"
            value={formData.buttonText || ""}
            onChange={handleInputChange}
            placeholder="VD: Đăng ký ngay"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Nút 1 - Link
          </label>
          <Input
            name="buttonHref"
            value={formData.buttonHref || ""}
            onChange={handleInputChange}
            placeholder="/path/to/page"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Nút 2 - Text
          </label>
          <Input
            name="buttonText2"
            value={formData.buttonText2 || ""}
            onChange={handleInputChange}
            placeholder="VD: Xem thêm"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Nút 2 - Link
          </label>
          <Input
            name="buttonHref2"
            value={formData.buttonHref2 || ""}
            onChange={handleInputChange}
            placeholder="/path/to/page"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          loading={isLoading || isUploading}
        >
          {initialData ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </div>
  );
}
