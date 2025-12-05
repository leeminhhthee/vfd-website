"use client";

import {
  Button,
  Image,
  Input,
  message,
  Modal,
  notification,
  Select,
  Tag,
} from "antd";
import { ArrowLeft, Eye, Sparkles, Upload, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { api } from "@/app/api/api"; // ✅ Import api instance
import {
  getNewsTypeLabel,
  NewsStatus,
  NewsType,
} from "@/data/constants/constants";
import { NewsItem } from "@/data/model/news.model";
import { uploadFile } from "@/lib/utils";
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
  hasUnsavedChanges?: (changed: boolean) => void;
}

export default function NewsEditorForm({
  news,
  categories,
  onSaveDraft,
  onPublish,
  onCancel,
  isLoading,
  hasUnsavedChanges: notifyUnsavedChanges,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
    imageUploadURL: "/api/upload",
    imageUploadParam: "file",
    imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
    imageDefaultWidth: 0,
    pasteAllowLocalImages: true,
    height: 600,
    heightMin: 300,
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

  useEffect(() => {
    if (notifyUnsavedChanges) {
      notifyUnsavedChanges(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, notifyUnsavedChanges]);

  const handleBack = () => {
    onCancel();
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
      message.warning("Vui lòng nhập nội dung trước khi tạo gợi ý tiêu đề");
      return;
    }

    setIsGeneratingTitles(true);
    try {
      const response = await api.post("/news/suggest-title", {
        content: formData.content,
      });

      const titles = response.data.titles || [];
      setSuggestedTitles(titles);
      message.success("Đã tạo gợi ý tiêu đề!");
    } catch (error) {
      console.error("Error generating titles:", error);
      message.error("Không thể tạo gợi ý tiêu đề. Vui lòng thử lại!");
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setCoverPreview(url);
        setFormData((prev) => ({ ...prev, imageUrl: url }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverPreview("");
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
    setSelectedFile(null);
  };

  const handleSave = async (
    status: NewsStatus.DRAFT | NewsStatus.PUBLISHED
  ) => {
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

    if (!coverPreview && !selectedFile) {
      notification.error({ message: "Vui lòng chọn ảnh bìa" });
      return;
    }

    setIsUploading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      if (selectedFile) {
        try {
          const uploadResult = await uploadFile(selectedFile);
          finalImageUrl = uploadResult.link;
        } catch (error) {
          notification.error({
            message: "Lỗi upload ảnh bìa: " + (error as Error).message,
          });
          setIsUploading(false);
          return;
        }
      }

      // 🔥 KIỂM TRA LẦN CUỐI TRƯỚC KHI GỬI
      if (!finalImageUrl) {
        notification.error({ message: "Không thể tải ảnh bìa lên" });
        setIsUploading(false);
        return;
      }

      const finalData = {
        id: news?.id,
        title: formData.title || "",
        type: formData.type || "",
        content: formData.content || "",
        status: status,
        imageUrl: finalImageUrl,
      };

      if (status === NewsStatus.DRAFT) {
        onSaveDraft(finalData);
      } else {
        onPublish(finalData);
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: "Có lỗi xảy ra khi xử lý dữ liệu" });
    } finally {
      setIsUploading(false);
    }
  };

  const isProcessing = isUploading || isLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="text"
          onClick={handleBack}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
          disabled={isProcessing}
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </Button>
        <h2 className="text-2xl font-bold text-foreground">
          {news?.id ? "Chỉnh sửa tin tức" : "Tạo tin tức mới"}
        </h2>
        <Button
          type="default"
          icon={<Eye size={16} />}
          onClick={() => setIsPreviewOpen(true)}
          disabled={isProcessing}
        >
          Xem trước
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 p-12 bg-white rounded-lg border border-border overflow-hidden">
        <div className="col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <Input
              size="large"
              placeholder="Nhập tiêu đề tin tức..."
              value={formData.title || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">
                Gợi ý tiêu đề từ AI
              </label>
              <Button
                size="small"
                icon={<Sparkles size={16} />}
                onClick={generateAITitles}
                loading={isGeneratingTitles}
                disabled={isProcessing || !formData.content?.trim()}
              >
                Tạo gợi ý
              </Button>
            </div>
            {suggestedTitles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestedTitles.map((title, idx) => (
                  <Tag
                    key={idx}
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setFormData((prev) => ({ ...prev, title }))}
                  >
                    {title}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <Select
              size="large"
              style={{ width: "100%" }}
              placeholder="Chọn danh mục"
              value={formData.type || undefined}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
              disabled={isProcessing}
              options={categories.map((cat) => ({
                label: getNewsTypeLabel(cat),
                value: cat,
              }))}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Ảnh bìa <span className="text-red-500">*</span>
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
                  onClick={handleRemoveCoverImage}
                  disabled={isProcessing}
                  style={{ position: "absolute", top: 0, right: 10 }}
                />
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center w-full h-48 px-4 py-6 border-2 border-dashed border-border rounded-lg transition-colors ${
                  isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-card"
                }`}
                onDrop={(e) => {
                  if (isProcessing) return;
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    setSelectedFile(file);
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
                  <Upload size={32} className="text-muted-foreground mb-2" />
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
                  disabled={isProcessing}
                />
              </label>
            )}
          </div>
        </div>

        <div className="col-span-3 pb-6">
          <label className="block text-sm font-medium text-foreground pb-2">
            Nội dung <span className="text-red-500">*</span>
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

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button onClick={onCancel} disabled={isProcessing}>
          Hủy
        </Button>
        <Button
          icon={<Eye size={16} />}
          onClick={() => setIsPreviewOpen(true)}
          disabled={isProcessing}
        >
          Xem trước
        </Button>
        <Button
          onClick={() => handleSave(NewsStatus.DRAFT)}
          loading={isProcessing}
        >
          {isUploading ? "Đang tải ảnh..." : "Lưu bản nháp"}
        </Button>
        <Button
          type="primary"
          onClick={() => handleSave(NewsStatus.PUBLISHED)}
          loading={isProcessing}
        >
          {isUploading ? "Đang tải ảnh..." : news?.id ? "Cập nhật" : "Đăng bài"}
        </Button>
      </div>

      {/* Preview Modal */}
      <Modal
        title="Xem trước bài viết"
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: 1200, top: 20 }}
      >
        <article className="p-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <span>Tin tức</span>
            <span>/</span>
            <span className="text-foreground font-medium">
              {formData.type
                ? getNewsTypeLabel(formData.type as NewsType)
                : "Danh mục"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-primary mb-6 leading-tight">
            {formData.title || "Tiêu đề tin tức"}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border text-sm text-muted-foreground">
            <span>{new Date().toLocaleString("vi-VN")}</span>
            <span>Nguồn: VFD</span>
          </div>

          {/* Cover Image */}
          {coverPreview && (
            <div className="mb-8">
              <Image
                src={coverPreview}
                alt="Cover"
                className="w-full h-auto object-cover"
                preview={false}
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none mb-8 text-justify fr-view"
            dangerouslySetInnerHTML={{
              __html: formData.content || "<p>Nội dung tin tức...</p>",
            }}
          />
        </article>
      </Modal>
    </div>
  );
}
