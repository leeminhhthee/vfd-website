"use client"

import { useState } from "react"
import { FileText, Download, Eye } from "lucide-react"

export default function DocumentsList() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const documents = [
    {
      id: 1,
      title: "Quy định tham gia giải đấu 2024",
      category: "Quy định",
      date: "2024-10-01",
      size: "2.5 MB",
      url: "#",
    },
    {
      id: 2,
      title: "Hướng dẫn đăng ký thành viên",
      category: "Hướng dẫn",
      date: "2024-09-15",
      size: "1.2 MB",
      url: "#",
    },
    {
      id: 3,
      title: "Biểu mẫu đơn đăng ký giải đấu",
      category: "Biểu mẫu",
      date: "2024-09-01",
      size: "0.8 MB",
      url: "#",
    },
    {
      id: 4,
      title: "Thể lệ thi đấu bóng chuyền",
      category: "Quy định",
      date: "2024-08-20",
      size: "3.1 MB",
      url: "#",
    },
  ]

  const categories = ["all", "Quy định", "Hướng dẫn", "Biểu mẫu"]

  const filteredDocs =
    selectedCategory === "all" ? documents : documents.filter((doc) => doc.category === selectedCategory)

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === cat ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {cat === "all" ? "Tất cả" : cat}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Tên tài liệu</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Danh mục</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Ngày tải</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Kích thước</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <FileText size={20} className="text-accent" />
                    <span className="font-medium text-foreground">{doc.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{doc.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(doc.date).toLocaleDateString("vi-VN")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{doc.size}</span>
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
  )
}
