"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function ProjectsManagement() {
  const [showForm, setShowForm] = useState(false)
  const [projects] = useState([
    {
      id: 1,
      title: "Dự án phát triển bóng chuyền trẻ",
      status: "Đang thực hiện",
      date: "2024-10-01",
    },
    {
      id: 2,
      title: "Xây dựng trung tâm đào tạo bóng chuyền",
      status: "Lên kế hoạch",
      date: "2024-09-15",
    },
  ])

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
      >
        <Plus size={20} />
        Thêm dự án
      </button>

      {showForm && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Tạo dự án mới</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowForm(false)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Tên dự án *</label>
              <input
                type="text"
                required
                placeholder="Nhập tên dự án"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Mô tả *</label>
              <textarea
                required
                placeholder="Nhập mô tả dự án"
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Trạng thái *</label>
              <select className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Lên kế hoạch</option>
                <option>Đang thực hiện</option>
                <option>Hoàn thành</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Tạo
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
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Tên dự án</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Ngày tạo</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{project.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        project.status === "Đang thực hiện"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(project.date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
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
