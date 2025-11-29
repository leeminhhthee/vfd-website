"use client";

import { DocumentItem } from "@/data/model/document.model";
import { Button, Input, Modal, notification, Select, Space } from "antd";
import { FileText, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  document?: DocumentItem;
  categories: string[];
  onAddCategory: (cat: string) => void;
  onSaveDraft: (data: {
    title: string;
    category: string;
    file?: File;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function DocumentEditorForm({
  document,
  categories,
  onAddCategory,
  onSaveDraft,
  onCancel,
  isLoading,
}: Props) {
 const [formData, setFormData] = useState({
    title: document?.title || "",
    category: document?.category || "",
    file: undefined as File | undefined,
  });

 const [filePreview, setFilePreview] = useState<{ name: string; url: string } | null>(
    document?.fileUrl && document?.fileName
      ? { name: document.fileName, url: document.fileUrl }
      : null
  );

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
    setFilePreview({ name: file.name, url: URL.createObjectURL(file) });
    setHasUnsavedChanges(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleSave = () => {
    if (!formData.title)
      return notification.error({ message: "Vui lòng nhập tên tài liệu" });
    if (!formData.category)
      return notification.error({ message: "Vui lòng chọn danh mục" });
    if (!formData.file && !filePreview)
      return notification.error({ message: "Vui lòng chọn file" });

    onSaveDraft(formData);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Modal.confirm({
        title: "Bạn có chắc chắn muốn thoát?",
        content: "Những thay đổi chưa được lưu sẽ bị mất.",
        okText: "Thoát",
        okType: "danger",
        cancelText: "Tiếp tục chỉnh sửa",
        onOk: onCancel,
      });
    } else {
      onCancel();
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      {/* Title */}
      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Tên tài liệu
        </label>
        <Input
          size="large"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Nhập tên tài liệu..."
        />
      </div>

      {/* Category */}
      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Danh mục
        </label>
        <Space.Compact style={{ width: "100%" }}>
          <Select
            size="large"
            style={{ width: "100%" }}
            value={formData.category || undefined}
            onChange={handleCategoryChange}
            options={categories.map((cat) => ({ label: cat, value: cat }))}
            placeholder="Chọn danh mục"
          />
        </Space.Compact>
      </div>

      {/* File Upload */}
      <div className="space-y-2 mb-3">
        <label className="block text-sm font-medium text-foreground">
          Chọn file
        </label>
        {filePreview ? (
          <div className="relative flex items-center justify-between border border-border rounded-lg p-4 hover:bg-muted">
            <div className="flex items-center gap-2">
              <FileText size={24} />
              <span className="truncate">{filePreview.name}</span>
            </div>
            <div className="flex gap-2">
              {filePreview.url && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => window.open(filePreview.url, "_blank")}
                >
                  Xem
                </Button>
              )}
              <Button
                type="text"
                danger
                size="small"
                icon={<X size={16} />}
                onClick={() => {
                  setFilePreview(null);
                  setFormData((prev) => ({ ...prev, file: undefined }));
                  setHasUnsavedChanges(true);
                }}
              />
            </div>
          </div>
        ) : (
          <label
            className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-card transition-colors"
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
              onChange={(e) =>
                e.target.files && handleFileChange(e.target.files[0])
              }
            />
          </label>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button onClick={handleCancel}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {document?.id ? "Cập nhật" : "Tải lên"}
        </Button>
      </div>
    </form>
  );
}
