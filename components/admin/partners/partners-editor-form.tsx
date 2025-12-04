"use client";

import { PartnerItem } from "@/data/model/partner.model";
import { confirmUnsavedChanges, uploadFile } from "@/lib/utils";
import { Button, DatePicker, Image, Input, notification } from "antd";
import dayjs from "dayjs";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

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
    image: initialData?.image || "",
    since: initialData?.since || new Date().getFullYear().toString(),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.name?.trim()) {
      return notification.error({ message: "Vui lòng nhập tên đối tác" });
    }
    if (!formData.since) {
      return notification.error({ message: "Vui lòng chọn năm bắt đầu" });
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

      const result: Partial<PartnerItem> = {
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
          value={formData.since ? dayjs(formData.since, "YYYY") : null}
          onChange={(date) => {
            setFormData((prev) => ({
              ...prev,
              since: date ? date.format("YYYY") : "",
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
        {imagePreview ? (
          <div className="relative w-fit">
            <div className="border border-border rounded-lg p-2 bg-white">
              <Image
                src={imagePreview}
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
            className={`flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed border-border rounded-lg transition-colors ${
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
              <Sparkles size={24} className="text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                <span className="font-bold">Nhấp để chọn</span> hoặc kéo thả
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG (tối đa 5MB)
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
            : "Thêm đối tác"}
        </Button>
      </div>
    </div>
  );
}