"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Users } from "lucide-react"

export default function TournamentsManagement() {
  const [showForm, setShowForm] = useState(false)
  const [tournaments] = useState([
    {
      id: 1,
      name: "Giải bóng chuyền nam TP Đà Nẵng",
      startDate: "2024-11-15",
      endDate: "2024-11-20",
      teams: 12,
      status: "Sắp diễn ra",
    },
    {
      id: 2,
      name: "Giải bóng chuyền nữ TP Đà Nẵng",
      startDate: "2024-11-22",
      endDate: "2024-11-27",
      teams: 10,
      status: "Sắp diễn ra",
    },
  ])

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
      >
        <Plus size={20} />
        Tạo giải đấu
      </button>

      {showForm && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Tạo giải đấu mới</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setShowForm(false)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Tên giải đấu *</label>
              <input
                type="text"
                required
                placeholder="Nhập tên giải đấu"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Ngày bắt đầu *</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Ngày kết thúc *</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Mô tả *</label>
              <textarea
                required
                placeholder="Nhập mô tả giải đấu"
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
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
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Tên giải đấu</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Ngày bắt đầu</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Ngày kết thúc</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Đội</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Trạng thái</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((tournament) => (
                <tr key={tournament.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{tournament.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(tournament.startDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(tournament.endDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users size={16} />
                      {tournament.teams}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-full">
                      {tournament.status}
                    </span>
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
