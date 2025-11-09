"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function ScheduleManagement() {
  const [showForm, setShowForm] = useState(false)
  const [schedules] = useState([
    {
      id: 1,
      name: "Giải bóng chuyền nam TP Đà Nẵng",
      date: "2024-11-15",
      location: "Nhà thi đấu Tiên Sơn",
      teams: 12,
    },
    {
      id: 2,
      name: "Giải bóng chuyền nữ TP Đà Nẵng",
      date: "2024-11-22",
      location: "Nhà thi đấu Tiên Sơn",
      teams: 10,
    },
  ])

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
      >
        <Plus size={20} />
        Thêm lịch thi đấu
      </button>

      {showForm && (
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Tạo lịch thi đấu mới</h2>

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
                <label className="block text-sm font-bold text-foreground mb-2">Ngày thi đấu *</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Số đội *</label>
                <input
                  type="number"
                  required
                  placeholder="Nhập số đội"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Địa điểm *</label>
              <input
                type="text"
                required
                placeholder="Nhập địa điểm"
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
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Ngày thi đấu</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Địa điểm</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Số đội</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{schedule.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(schedule.date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{schedule.location}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{schedule.teams}</td>
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
