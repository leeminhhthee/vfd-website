"use client";

import {
  DocumentCategorys,
  getDocumentCategoryLabel,
} from "@/data/constants/constants";
import { DocumentItem } from "@/data/model/document.model";
import { uploadFile } from "@/lib/utils";
import { Button, Input, notification, Select, Space } from "antd";
import { FileText, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [formData, setFormData] = useState({
    title: document?.title || "",
    category: document?.category || "",
    file: undefined as File | undefined,
  });

  const [currentFile, setCurrentFile] = useState<{
    name: string;
    url: string;
    size?: number;
  } | null>(
    document?.fileUrl && document?.fileName
      ? {
          name: document.fileName,
          url: document.fileUrl,
          size: document.fileSize,
        }
      : null
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileChange = (file: File) => {
    setFormData((prev) => ({ ...prev, file }));
    setCurrentFile({
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
    });
    setHasUnsavedChanges(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    if (isUploading || isLoading) return;
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleSave = async () => {
    if (!formData.title)
      return notification.error({ message: "Vui lòng nhập tên tài liệu" });
    if (!formData.category)
      return notification.error({ message: "Vui lòng chọn danh mục" });
    if (!formData.file && !currentFile?.url)
      return notification.error({ message: "Vui lòng chọn file" });

    setIsUploading(true);

    try {
      let finalFileUrl = currentFile?.url || "";
      let finalFileName = currentFile?.name || "";

      if (formData.file) {
        try {
          const uploadResult = await uploadFile(formData.file);
          finalFileUrl = uploadResult.link;
          finalFileName = formData.file.name;
        } catch (error) {
          notification.error({
            message: "Lỗi upload file: " + (error as Error).message,
          });
          setIsUploading(false);
          return;
        }
      }

      const result: Partial<DocumentItem> = {
        title: formData.title,
        category: formData.category,
        fileUrl: finalFileUrl,
        fileName: finalFileName,
      };

      onSaveDraft(result);
    } catch (error) {
      notification.error({ message: "Có lỗi xảy ra" });
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
          <div className="relative flex items-center justify-between border border-border rounded-lg p-4 hover:bg-muted">
            <div className="flex items-center gap-2 overflow-hidden">
              <FileText size={24} className="flex-shrink-0" />
              <span className="truncate max-w-[300px]">{currentFile.name}</span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {currentFile.url && !formData.file && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => window.open(currentFile.url, "_blank")}
                >
                  Xem
                </Button>
              )}
              <Button
                type="text"
                danger
                size="small"
                icon={<X size={16} />}
                disabled={isProcessing}
                onClick={() => {
                  setCurrentFile(null);
                  setFormData((prev) => ({ ...prev, file: undefined }));
                  setHasUnsavedChanges(true);
                }}
              />
            </div>
          </div>
        ) : (
          <label
            className={`flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed border-border rounded-lg transition-colors ${
              isProcessing
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-card"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col items-center justify-center">
              <FileText size={24} className="text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground text-center">
                <span className="font-bold">Nhấp để chọn</span> hoặc kéo thả
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, DOCX (tối đa 20MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              disabled={isProcessing}
              onChange={(e) =>
                e.target.files && handleFileChange(e.target.files[0])
              }
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
            ? "Đang tải file..."
            : document?.id
            ? "Cập nhật"
            : "Tải lên"}
        </Button>
      </div>
    </div>
  );
}
