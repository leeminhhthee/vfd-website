"use client";

import { trans } from "@/app/generated/AppLocalization";
import {
  DocumentCategorys,
  getDocumentCategoryLabel,
} from "@/data/constants/constants";
import { documentInteractor } from "@/data/datasource/document/interactor/document.interactor";
import { useQuery } from "@tanstack/react-query";
import { Download, Eye, FileText, Trophy } from "lucide-react";
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
    queryFn: () => documentInteractor.getDocumentList(),
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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{trans.loading}</p>
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
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-white"
                : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {cat === "all" ? "Tất cả" : getDocumentCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                  Tên tài liệu
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                  Ngày tải
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">
                  Kích thước
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-border hover:bg-muted transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <FileText size={20} className="text-accent" />
                    <span className="font-medium text-foreground">
                      {doc.title}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {getDocumentCategoryLabel(doc.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(doc.createdAt ?? "").toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {doc.size}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Eye size={18} className="text-primary" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Download size={18} className="text-accent" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
