"use client";

import { aboutInteractor } from "@/data/datasource/about/interactor/about.interactor";
import { BoardDirectorItem } from "@/data/model/about.model";
import {
  isValidEmail,
  isValidVietnamPhoneNumber,
  uploadFile,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, Input, notification } from "antd";
import { Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  initialData?: BoardDirectorItem;
  onSave: (data: Partial<BoardDirectorItem>) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasUnsavedChanges?: (changed: boolean) => void;
}

export default function DirectorEditorForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
  hasUnsavedChanges: notifyUnsavedChanges,
}: Props) {
  const [formData, setFormData] = useState<Partial<BoardDirectorItem>>({
    id: initialData?.id,
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phoneNumber || "",
    role: initialData?.role || "",
    term: initialData?.term || "",
    imageUrl: initialData?.imageUrl || "",
    bio: initialData?.bio || "",
  });

  const [bioText, setBioText] = useState<string>(initialData?.bio || "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.imageUrl || ""
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  // Fetch all directors to check duplicate
  const { data: allDirectors = [] } = useQuery({
    queryKey: ["directors"],
    queryFn: aboutInteractor.getBoardDirectors,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    markAsChanged();

    // Real-time validation
    if (name === "email") {
      if (!value.trim()) {
        setEmailError("");
      } else if (!isValidEmail(value)) {
        setEmailError("Email không hợp lệ");
      } else {
        // Check duplicate email
        const isDuplicate = allDirectors.some(
          (director) =>
            director.email?.toLowerCase() === value.toLowerCase() &&
            director.id !== initialData?.id
        );
        if (isDuplicate) {
          setEmailError("Email này đã được sử dụng bởi thành viên khác");
        } else {
          setEmailError("");
        }
      }
    }

    if (name === "phoneNumber") {
      if (!value.trim()) {
        setPhoneError("");
      } else if (!isValidVietnamPhoneNumber(value)) {
        setPhoneError("Số điện thoại phải là 10 chữ số bắt đầu bằng 0");
      } else {
        // Check duplicate phone
        const isDuplicate = allDirectors.some(
          (director) =>
            director.phoneNumber === value && director.id !== initialData?.id
        );
        if (isDuplicate) {
          setPhoneError(
            "Số điện thoại này đã được sử dụng bởi thành viên khác"
          );
        } else {
          setPhoneError("");
        }
      }
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBioText(e.target.value);
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
    if (!formData.fullName?.trim()) {
      return notification.error({ message: "Vui lòng nhập họ tên" });
    }
    if (!formData.role?.trim()) {
      return notification.error({ message: "Vui lòng nhập chức vụ" });
    }
    if (!formData.term?.trim()) {
      return notification.error({ message: "Vui lòng nhập nhiệm kỳ" });
    }

    if (emailError) {
      return notification.error({ message: emailError });
    }
    if (phoneError) {
      return notification.error({ message: phoneError });
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

      const result: Partial<BoardDirectorItem> = {
        ...formData,
        imageUrl: finalImageUrl,
        bio: bioText.trim(),
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
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Nhập họ và tên..."
          disabled={isProcessing}
          allowClear
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Chức vụ <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          placeholder="Ví dụ: Chủ tịch Liên đoàn..."
          disabled={isProcessing}
          allowClear
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Nhiệm kỳ <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="term"
          value={formData.term}
          onChange={handleInputChange}
          placeholder="Ví dụ: Nhiệm kỳ 2020 – 2025"
          disabled={isProcessing}
          allowClear
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          size="large"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Nhập email..."
          disabled={isProcessing}
          allowClear
          status={emailError ? "error" : ""}
        />
        {emailError && (
          <p className="text-red-500 text-xs mt-1">{emailError}</p>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Số điện thoại
        </label>
        <Input
          size="large"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Nhập số điện thoại..."
          disabled={isProcessing}
          allowClear
          status={phoneError ? "error" : ""}
        />
        {phoneError && (
          <p className="text-red-500 text-xs mt-1">{phoneError}</p>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Tiểu sử (Mỗi dòng một mục)
        </label>
        <Input.TextArea
          rows={5}
          value={bioText}
          onChange={handleBioChange}
          placeholder="- Sinh năm 19xx&#10;- Nguyên giám đốc..."
          disabled={isProcessing}
          allowClear
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Hình ảnh
        </label>
        {imagePreview ? (
          <div className="relative w-fit">
            <Image
              src={imagePreview}
              alt="Director preview"
              className="object-cover rounded-lg border border-border"
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
          {initialData ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </div>
  );
}
