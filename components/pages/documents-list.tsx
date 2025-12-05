"use client";

import { trans } from "@/app/generated/AppLocalization";
import {
  DocumentCategorys,
  getDocumentCategoryLabel,
} from "@/data/constants/constants";
import { documentInteractor } from "@/data/datasource/document/interactor/document.interactor";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { Download, FileText, Trophy } from "lucide-react";
import { useState } from "react";

export default function DocumentsList() {
  const [selectedCategory, setSelectedCategory] = useState<
    DocumentCategorys | "all"
  >("all");

  const {
    data: documents = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: () => documentInteractor.getDocumentsList(),
  });

  const categories: (DocumentCategorys | "all")[] = [
    "all",
    DocumentCategorys.REGULATIONS,
    DocumentCategorys.CHARTER,
    DocumentCategorys.PLAN,
    DocumentCategorys.FORMS,
    DocumentCategorys.OTHER,
  ];

  const filteredDocs =
    selectedCategory === "all"
      ? documents
      : documents.filter(
          (doc) => doc.category === (selectedCategory as string)
        );

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <Spin size="large" />
        <span className="text-gray-500 font-medium text-sm ml-5">
          {trans.loading}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Trophy size={48} className="mx-auto text-red-500 mb-4" />
        <p className="text-red-500 text-lg">{trans.loadingError}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter - Gọn hơn */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {cat === "all" ? "Tất cả" : getDocumentCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* 🔥 DESKTOP VIEW - Table */}
      <div className="hidden md:block bg-white rounded-lg border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  Tên tài liệu
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  Ngày tải
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">
                  Kích thước
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider">
                  File
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText
                        size={16}
                        className="text-accent flex-shrink-0"
                      />
                      <span className="font-medium text-sm text-foreground line-clamp-1">
                        {doc.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      {getDocumentCategoryLabel(doc.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      {doc.createdAt
                        ? new Date(doc.createdAt).toLocaleDateString("vi-VN")
                        : "--"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground font-medium">
                      {doc.fileSize}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDownload(doc.fileUrl, doc.title)}
                      title="Tải xuống"
                      className="inline-flex items-center justify-center p-1.5 hover:bg-accent/10 rounded-md transition-colors group cursor-pointer"
                    >
                      <Download
                        size={16}
                        className="text-accent group-hover:text-accent-dark"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredDocs.length === 0 && (
          <div className="py-8 text-center">
            <FileText
              size={40}
              className="mx-auto text-muted-foreground/50 mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Không có tài liệu nào trong danh mục này
            </p>
          </div>
        )}
      </div>

      {/* 🔥 MOBILE VIEW - Card List (CHỈ TÊN VÀ NÚT TẢI) */}
      <div className="md:hidden space-y-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-3">
              {/* 🔥 TÊN TÀI LIỆU */}
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <FileText
                  size={18}
                  className="text-accent flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground line-clamp-2">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      {getDocumentCategoryLabel(doc.category)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {doc.fileSize} MB
                    </span>
                  </div>
                </div>
              </div>

              {/* 🔥 NÚT TẢI */}
              <button
                onClick={() => handleDownload(doc.fileUrl, doc.title)}
                className="flex-shrink-0 p-2.5 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors"
              >
                <Download size={20} className="text-accent" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State Mobile */}
        {filteredDocs.length === 0 && (
          <div className="py-12 text-center">
            <FileText
              size={40}
              className="mx-auto text-muted-foreground/50 mb-2"
            />
            <p className="text-sm text-muted-foreground">
              Không có tài liệu nào trong danh mục này
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
