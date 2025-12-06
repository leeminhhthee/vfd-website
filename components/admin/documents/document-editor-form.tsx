"use client";

import {
  DocumentCategorys,
  getDocumentCategoryLabel,
} from "@/data/constants/constants";
import { DocumentItem } from "@/data/model/document.model";
import { uploadFile } from "@/lib/utils";
import { Button, Input, notification, Select, Space } from "antd";
import { FileText, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  document?: DocumentItem;
  categories: DocumentCategorys[];
  onAddCategory: (cat: DocumentCategorys) => void;
  onSaveDraft: (data: Partial<DocumentItem>) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasUnsavedChanges?: (changed: boolean) => void;
}

export default function DocumentEditorForm({
  document,
  categories,
  onSaveDraft,
  onCancel,
  isLoading,
  hasUnsavedChanges: notifyUnsavedChanges,
}: Props) {
  const [formData, setFormData] = useState<Partial<DocumentItem>>({
    title: document?.title || "",
    category: document?.category || "",
  });

  const [currentFile, setCurrentFile] = useState<{
    name: string;
    url: string;
    size: number;
    type: string;
  } | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document?.fileUrl && document?.fileName) {
      setCurrentFile({
        name: document.fileName,
        url: document.fileUrl,
        size: document.fileSize || 0,
        type: document.fileType || "application/pdf",
      });
    } else {
      setCurrentFile(null);
    }
  }, [document]);

  useEffect(() => {
    if (notifyUnsavedChanges) {
      notifyUnsavedChanges(hasUnsavedChanges);
    }
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
    setHasUnsavedChanges(true);
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
    setHasUnsavedChanges(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        notification.error({
          message: "File không hợp lệ",
          description: "Chỉ chấp nhận file PDF, DOC, DOCX",
        });
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        notification.error({
          message: "File quá lớn",
          description: "Kích thước file không được vượt quá 10MB",
        });
        return;
      }

      setSelectedFile(file);
      setCurrentFile({
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    if (isUploading || isLoading) return;
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        notification.error({
          message: "File không hợp lệ",
          description: "Chỉ chấp nhận file PDF, DOC, DOCX",
        });
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        notification.error({
          message: "File quá lớn",
          description: "Kích thước file không được vượt quá 10MB",
        });
        return;
      }

      setSelectedFile(file);
      setCurrentFile({
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveFile = () => {
    setCurrentFile(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setHasUnsavedChanges(true);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      notification.error({ message: "Vui lòng nhập tên tài liệu" });
      return;
    }
    if (!formData.category?.trim()) {
      notification.error({ message: "Vui lòng chọn danh mục" });
      return;
    }
    if (!currentFile && !selectedFile) {
      notification.error({ message: "Vui lòng chọn file" });
      return;
    }

    setIsUploading(true);

    try {
      let finalFileUrl = document?.fileUrl || "";
      let finalFileName = document?.fileName || "";
      let finalFileSize = document?.fileSize || 0;
      let finalFileType = document?.fileType || "";

      if (selectedFile) {
        try {
          const uploadResult = await uploadFile(selectedFile);
          finalFileUrl = uploadResult.link;
          finalFileName = selectedFile.name;
          finalFileSize = selectedFile.size;
          finalFileType = selectedFile.type;
        } catch (error) {
          notification.error({
            message: "Lỗi upload file",
            description: (error as Error).message,
          });
          setIsUploading(false);
          return;
        }
      } else if (currentFile && !selectedFile) {
        finalFileUrl = currentFile.url;
        finalFileName = currentFile.name;
        finalFileSize = currentFile.size;
        finalFileType = currentFile.type;
      }

      if (!finalFileUrl) {
        notification.error({ message: "Không thể lấy được link file" });
        setIsUploading(false);
        return;
      }

      const result: Partial<DocumentItem> = {
        id: document?.id,
        title: formData.title.trim(),
        category: formData.category,
        fileName: finalFileName,
        fileUrl: finalFileUrl,
        fileType: finalFileType,
        fileSize: finalFileSize,
      };

      onSaveDraft(result);
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
          Tên tài liệu <span className="text-red-500">*</span>
        </label>
        <Input
          size="large"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Nhập tên tài liệu..."
          disabled={isProcessing}
          allowClear
        />
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Danh mục <span className="text-red-500">*</span>
        </label>
        <Space.Compact style={{ width: "100%" }}>
          <Select
            size="large"
            style={{ width: "100%" }}
            value={formData.category || undefined}
            onChange={handleCategoryChange}
            options={categories.map((cat) => ({
              label: getDocumentCategoryLabel(cat),
              value: cat,
            }))}
            placeholder="Chọn danh mục"
            disabled={isProcessing}
          />
        </Space.Compact>
      </div>

      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Chọn file <span className="text-red-500">*</span>
        </label>

        {currentFile ? (
          <div className="relative border-2 border-border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText size={24} className="text-accent flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {currentFile.name}
                  </p>
                  {/* 🔥 HIỂN THỊ SIZE FORMATTED */}
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(currentFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {currentFile.url && !selectedFile && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => window.open(currentFile.url, "_blank")}
                    disabled={isProcessing}
                  >
                    Xem
                  </Button>
                )}
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<X size={16} />}
                  onClick={handleRemoveFile}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-48 px-4 py-6 border-2 border-dashed rounded-lg transition-colors ${
              isProcessing
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-card border-border hover:border-accent"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center justify-center">
              <Upload size={48} className="text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-bold text-foreground">Nhấp để chọn</span>{" "}
                hoặc kéo thả file vào đây
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, DOCX (tối đa 10MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={isProcessing}
              onChange={handleFileChange}
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
            ? "Đang tải file lên..."
            : document?.id
            ? "Cập nhật"
            : "Tải lên"}
        </Button>
      </div>
    </div>
  );
}
