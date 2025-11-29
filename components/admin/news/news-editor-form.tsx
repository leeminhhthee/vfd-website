"use client";

import { Button, Image, Input, Modal, notification, Select, Tag } from "antd";
import { ArrowLeft, Sparkles, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import {
  getNewsTypeLabel,
  NewsStatus,
  NewsType,
} from "@/data/constants/constants";
import { NewsItem } from "@/data/model/news.model";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), {
  ssr: false,
});

interface NewsEditorFormProps {
  news?: NewsItem;
  categories: NewsType[];
  onAddCategory: (cat: NewsType) => void;
  onSaveDraft: (data: Partial<NewsItem>) => void;
  onPublish: (data: Partial<NewsItem>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function NewsEditorForm({
  news,
  categories,
  onSaveDraft,
  onPublish,
  onCancel,
  isLoading,
}: NewsEditorFormProps) {
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: "",
    type: "",
    content: "",
    imageUrl: "",
  });

  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const initialFormRef = useRef(
    JSON.stringify(
      news || {
        title: "",
        type: "",
        content: "",
        imageUrl: "",
      }
    )
  );

  const config = {
    placeholderText: "Nhập nội dung tin tức...",
    imageUpload: true,
    imageUploadURL: "/api/upload-image",
    imageUploadParam: "file",
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
  };

  useEffect(() => {
    const loadPlugins = async () => {
      await import("froala-editor/js/plugins.pkgd.min.js");
      await import("froala-editor/js/plugins/align.min.js");
    };
    loadPlugins();
  }, []);

  useEffect(() => {
    if (news) {
      setFormData(news);
      if (news.imageUrl) {
        setCoverPreview(news.imageUrl);
      }
    }
  }, [news]);

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(formData) !== initialFormRef.current);
  }, [formData]);

  const handleBack = () => {
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

  const generateAITitles = async () => {
    if (!formData.content?.trim()) {
      notification.warning({ message: "Vui lòng nhập nội dung trước" });
      return;
    }

    setIsGeneratingTitles(true);
    try {
      const response = await fetch("/api/generate-titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formData.content }),
      });
      const data = await response.json();
      setSuggestedTitles(data.titles || []);
    } catch (error) {
      notification.error({ message: "Lỗi tạo tiêu đề AI" });
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setCoverPreview(url);
        setFormData((prev) => ({ ...prev, imageUrl: url }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (status: NewsStatus.DRAFT | NewsStatus.PUBLISHED) => {
    if (!formData.title?.trim()) {
      notification.error({ message: "Vui lòng nhập tiêu đề" });
      return;
    }
    if (!formData.type?.trim()) {
      notification.error({ message: "Vui lòng chọn danh mục" });
      return;
    }
    if (!formData.content?.trim()) {
      notification.error({ message: "Vui lòng nhập nội dung" });
      return;
    }

    if (status === NewsStatus.DRAFT) {
      onSaveDraft({
        title: formData.title || "",
        type: formData.type || "",
        content: formData.content || "",
        status: NewsStatus.DRAFT,
        imageUrl: formData.imageUrl,
      });
    } else {
      onPublish({
        title: formData.title || "",
        type: formData.type || "",
        content: formData.content || "",
        status: NewsStatus.PUBLISHED,
        imageUrl: formData.imageUrl,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          type="text"
          onClick={handleBack}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </Button>
        <h2 className="text-2xl font-bold text-foreground">
          {news?.id ? "Chỉnh sửa tin tức" : "Tạo tin tức mới"}
        </h2>
        <div style={{ width: 48 }} />
      </div>

      <div className="grid grid-cols-3 gap-6 p-12 bg-white rounded-lg border border-border overflow-hidden">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Tiêu đề
            </label>
            <Input
              size="large"
              placeholder="Nhập tiêu đề tin tức..."
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          {/* AI Suggested Titles */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">
                Gợi ý tiêu đề từ AI
              </label>
              <Button
                type="dashed"
                size="small"
                icon={<Sparkles size={16} />}
                onClick={generateAITitles}
                loading={isGeneratingTitles}
              >
                Tạo gợi ý
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedTitles.map((title, idx) => (
                <Tag
                  key={idx}
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => setFormData((prev) => ({ ...prev, title }))}
                >
                  {title}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Danh mục
            </label>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Chọn danh mục"
              value={formData.type || undefined}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
              options={categories.map((cat) => ({
                label: getNewsTypeLabel(cat),
                value: getNewsTypeLabel(cat),
              }))}
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Ảnh bìa
            </label>
            {coverPreview ? (
              <div className="relative">
                <Image
                  src={coverPreview || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-full h-full object-cover rounded-lg border border-border"
                  preview={{
                    mask: "Phóng to",
                  }}
                />
                <Button
                  type="text"
                  danger
                  size="large"
                  icon={<X size={16} />}
                  onClick={() => {
                    setCoverPreview("");
                    setFormData((prev) => ({ ...prev, imageUrl: "" }));
                  }}
                  style={{ position: "absolute", top: 0, right: 10 }}
                />
              </div>
            ) : (
              <label
                className="flex flex-col items-center justify-center w-full h-48 px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-card transition-colors"
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const url = event.target?.result as string;
                      setCoverPreview(url);
                      setFormData((prev) => ({ ...prev, imageUrl: url }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex flex-col items-center justify-center">
                  <Sparkles size={32} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold">Nhấp để chọn</span> hoặc kéo thả
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG (tối đa 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div className="col-span-3 pb-6">
          <label className="block text-sm font-medium text-foreground pb-2">
            Nội dung
          </label>
          <FroalaEditor
            tag="textarea"
            config={config}
            model={formData.content || ""}
            onModelChange={(content: string) =>
              setFormData((prev) => ({ ...prev, content }))
            }
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button onClick={onCancel}>Hủy</Button>
        <Button
          onClick={() => handleSave(NewsStatus.DRAFT)}
          loading={isLoading}
        >
          Lưu bản nháp
        </Button>
        <Button
          type="primary"
          onClick={() => handleSave(NewsStatus.PUBLISHED)}
          loading={isLoading}
        >
          {news?.id ? "Cập nhật" : "Đăng bài"}
        </Button>
      </div>
    </div>
  );
}
