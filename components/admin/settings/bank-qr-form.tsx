"use client";

import { BankQrItem } from "@/data/model/about.model";
import { confirmUnsavedChanges, uploadFile } from "@/lib/utils";
import { Button, Image, Input, notification } from "antd";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  initialData?: BankQrItem;
  onSave: (data: Partial<BankQrItem>) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasUnsavedChanges?: (changed: boolean) => void;
}

export default function BankQrEditorForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
  hasUnsavedChanges: notifyUnsavedChanges,
}: Props) {
  const [formData, setFormData] = useState<Partial<BankQrItem>>({
    id: initialData?.id,
    bankName: initialData?.bankName || "",
    branch: initialData?.branch || "",
    accountNumber: initialData?.accountNumber || "",
    fullName: initialData?.fullName || "",
    imageUrl: initialData?.imageUrl || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.imageUrl || ""
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
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    markAsChanged();
  };

  const handleSave = async () => {
    if (!formData.bankName?.trim()) {
      return notification.error({ message: "Vui lòng nhập tên ngân hàng" });
    }
    if (!formData.accountNumber?.trim()) {
      return notification.error({ message: "Vui lòng nhập số tài khoản" });
    }
    if (!formData.fullName?.trim()) {
      return notification.error({ message: "Vui lòng nhập tên chủ tài khoản" });
    }

    if (!formData.imageUrl && !imageFile) {
      return notification.error({ message: "Vui lòng tải lên mã QR" });
    }

    setIsUploading(true);

    try {
      let finalImageUrl = formData.imageUrl || "";

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

      const result: Partial<BankQrItem> = {
        ...formData,
        imageUrl: finalImageUrl,
      };

      onSave(result);
    } catch (error) {
      notification.error({ message: "Có lỗi xảy ra khi lưu dữ liệu" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInternalCancel = () => {
    if (isUploading) return;
    if (hasUnsavedChanges) {
      confirmUnsavedChanges(onCancel);
    } else {
      onCancel();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Hình ảnh QR Code <span className="text-red-500">*</span>
        </label>
        {imagePreview ? (
          <div className="relative w-fit">
            <Image
              src={imagePreview}
              alt="QR preview"
              className="object-contain rounded-lg border border-border"
              width={150}
              height={150}
              preview={{ mask: "Xem" }}
            />
            <Button
              type="text"
              danger
              size="small"
              icon={<X size={16} />}
              onClick={removeImage}
              disabled={isLoading || isUploading}
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
              isLoading || isUploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-card"
            }`}
            onDrop={(e) => {
              if (isLoading || isUploading) return;
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
              disabled={isLoading || isUploading}
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Tên ngân hàng <span className="text-red-500">*</span>
          </label>
          <Input
            size="large"
            name="bankName"
            value={formData.bankName}
            onChange={handleInputChange}
            placeholder="Ví dụ: MB Bank"
            disabled={isLoading || isUploading}
          />
        </div>
        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Chi nhánh
          </label>
          <Input
            size="large"
            name="branch"
            value={formData.branch}
            onChange={handleInputChange}
            placeholder="Ví dụ: CN Đà Nẵng"
            disabled={isLoading || isUploading}
          />
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Số tài khoản <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleInputChange}
          placeholder="0000xxxxx"
          disabled={isLoading || isUploading}
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Tên chủ tài khoản <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="LIEN DOAN BONG CHUYEN..."
          disabled={isLoading || isUploading}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button
          onClick={handleInternalCancel}
          disabled={isLoading || isUploading}
        >
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
