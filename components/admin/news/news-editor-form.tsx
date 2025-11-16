"use client";

import { Button, Input, Select, Tag, notification } from "antd";
import { ArrowLeft, Sparkles, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";

const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), {
  ssr: false,
});

interface NewsItem {
  id?: number;
  title: string;
  type: string;
  content: string;
  status?: string;
  excerpt?: string;
  aiSummary?: string;
  coverImage?: string;
  createdAt?: string;
}

export type NewsFormData = {
  title: string;
  type: string;
  content: string;
  excerpt?: string;
  aiSummary?: string;
  coverImage?: string;
};

interface NewsEditorFormProps {
  news?: NewsItem;
  categories: string[];
  onAddCategory: (cat: string) => void;
  onSaveDraft: (data: NewsFormData) => void;
  onPublish: (data: NewsFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function NewsEditorForm({
  news,
  categories,
  onAddCategory,
  onSaveDraft,
  onPublish,
  onCancel,
  isLoading,
}: NewsEditorFormProps) {
  const [formData, setFormData] = useState<Partial<NewsItem>>({
    title: "",
    type: "",
    content: "",
    coverImage: "",
    aiSummary: "",
  });

  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);

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
      if (news.coverImage) {
        setCoverPreview(news.coverImage);
      }
    }
  }, [news]);

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
        setFormData((prev) => ({ ...prev, coverImage: url }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (status: "draft" | "published") => {
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

    const data = { ...formData, status };
    if (status === "draft") {
      onSaveDraft({
        title: formData.title || "",
        type: formData.type || "",
        content: formData.content || "",
        excerpt: formData.excerpt,
        aiSummary: formData.aiSummary,
        coverImage: formData.coverImage,
      });
    } else {
      onPublish({
        title: formData.title || "",
        type: formData.type || "",
        content: formData.content || "",
        excerpt: formData.excerpt,
        aiSummary: formData.aiSummary,
        coverImage: formData.coverImage,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          type="text"
          onClick={onCancel}
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
              options={categories.map((cat) => ({ label: cat, value: cat }))}
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Ảnh bìa
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="w-full"
              />
              {coverPreview && (
                <div className="relative">
                  <Image
                    src={coverPreview || "/placeholder.svg"}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg border border-border"
                    width={400}
                    height={192}
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<X size={16} />}
                    onClick={() => {
                      setCoverPreview("");
                      setFormData((prev) => ({ ...prev, coverImage: "" }));
                    }}
                    style={{ position: "absolute", top: 8, right: 8 }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        {/* <div className="space-y-2">
            
          </div> */}

        {/* Content Editor */}
        <div className="col-span-3 pb-6">
          <label className="block text-sm font-medium text-foreground pb-2">
            Nội dung
          </label>
          <FroalaEditor tag="textarea" config={config} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button onClick={onCancel}>Hủy</Button>
        <Button onClick={() => handleSave("draft")} loading={isLoading}>
          Lưu bản nháp
        </Button>
        <Button
          type="primary"
          onClick={() => handleSave("published")}
          loading={isLoading}
        >
          {news?.id ? "Cập nhật" : "Đăng bài"}
        </Button>
      </div>
    </div>
  );
}
