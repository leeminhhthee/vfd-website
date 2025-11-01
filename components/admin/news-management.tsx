"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Edit2, Trash2, Eye, Sparkles, Loader } from "lucide-react"

export default function NewsManagement() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Giải đấu",
    aiSummary: "",
  })

  const [newsList] = useState([
    {
      id: 1,
      title: "Giải vô địch bóng chuyền TP Đà Nẵng 2024",
      category: "Giải đấu",
      date: "2024-10-25",
      status: "Đã xuất bản",
    },
    {
      id: 2,
      title: "Đội tuyển Đà Nẵng vô địch giải quốc gia",
      category: "Thành tích",
      date: "2024-10-20",
      status: "Đã xuất bản",
    },
  ])

  const handleGenerateSummary = async () => {
    if (!formData.content) {
      alert("Vui lòng nhập nội dung trước")
      return
    }

    setLoadingSummary(true)

    // Simulate AI summary generation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockSummary = `${formData.content.substring(0, 100)}...`
    setFormData((prev) => ({ ...prev, aiSummary: mockSummary }))

    setLoadingSummary(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowForm(false)
    setFormData({ title: "", excerpt: "", content: "", category: "Giải đấu", aiSummary: "" })
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
      >
        <Plus size={20} />
        Thêm tin tức
      </button>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            {editingId ? "Chỉnh sửa tin tức" : "Tạo tin tức mới"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Tiêu đề *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Nhập tiêu đề"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Danh mục *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Giải đấu</option>
                <option>Thành tích</option>
                <option>Sự kiện</option>
                <option>Tuyển dụng</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Nội dung *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="Nhập nội dung"
                rows={6}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* AI Summary Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Sparkles size={18} className="text-accent" />
                  Tóm tắt AI (Tự động)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={loadingSummary}
                  className="flex items-center gap-2 px-3 py-1 bg-accent text-primary rounded font-bold hover:bg-accent-light transition-colors disabled:opacity-50"
                >
                  {loadingSummary ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Tạo tóm tắt
                    </>
                  )}
                </button>
              </div>

              <textarea
                value={formData.aiSummary}
                onChange={(e) => setFormData({ ...formData, aiSummary: e.target.value })}
                placeholder="Tóm tắt sẽ được tạo tự động bằng AI"
                rows={2}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Tóm tắt thủ công</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Hoặc nhập tóm tắt thủ công"
                rows={2}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                {editingId ? "Cập nhật" : "Tạo"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-muted text-foreground rounded-lg font-bold hover:bg-border transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* News Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Tiêu đề</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Danh mục</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Ngày tạo</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Trạng thái</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((news) => (
                <tr key={news.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{news.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{news.category}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(news.date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-white bg-green-600 px-3 py-1 rounded-full">
                      {news.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Eye size={18} className="text-primary" />
                      </button>
                      <button
                        onClick={() => setEditingId(news.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-accent" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Trash2 size={18} className="text-red-600" />
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
