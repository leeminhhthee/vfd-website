"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Download } from "lucide-react"

export default function DocumentsManagement() {
  const [showForm, setShowForm] = useState(false)
  const [documents] = useState([
    {
      id: 1,
      title: "Quy định tham gia giải đấu 2024",
      category: "Quy định",
      date: "2024-10-01",
      size: "2.5 MB",
    },
    {
      id: 2,
      title: "Hướng dẫn đăng ký thành viên",
      category: "Hướng dẫn",
      date: "2024-09-15",
      size: "1.2 MB",
    },
  ])

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
      >
        <Plus size={20} />
        Tải lên tài liệu
      </button>

      {showForm && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Tải lên tài liệu mới</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowForm(false)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Tên tài liệu *</label>
              <input
                type="text"
                required
                placeholder="Nhập tên tài liệu"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Danh mục *</label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Quy định</option>
                <option>Hướng dẫn</option>
                <option>Biểu mẫu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Chọn file *</label>
              <input
                type="file"
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Tải lên
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

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Tên tài liệu</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Danh mục</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Kích thước</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Ngày tải</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{doc.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{doc.category}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{doc.size}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(doc.date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Download size={18} className="text-primary" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
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
