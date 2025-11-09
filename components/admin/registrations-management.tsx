"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Eye, Download } from "lucide-react"

export default function RegistrationsManagement() {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [registrations] = useState([
    {
      id: 1,
      teamName: "Đội Bóng Chuyền A",
      tournament: "Giải bóng chuyền nam TP Đà Nẵng",
      coach: "Nguyễn Văn A",
      players: 12,
      date: "2024-10-20",
      status: "Chờ duyệt",
    },
    {
      id: 2,
      teamName: "Đội Bóng Chuyền B",
      tournament: "Giải bóng chuyền nữ TP Đà Nẵng",
      coach: "Trần Thị B",
      players: 10,
      date: "2024-10-19",
      status: "Đã duyệt",
    },
    {
      id: 3,
      teamName: "Đội Bóng Chuyền C",
      tournament: "Giải bóng chuyền nam TP Đà Nẵng",
      coach: "Lê Văn C",
      players: 11,
      date: "2024-10-18",
      status: "Từ chối",
    },
  ])

  const statuses = ["all", "Chờ duyệt", "Đã duyệt", "Từ chối"]

  const filteredRegistrations =
    selectedStatus === "all" ? registrations : registrations.filter((r) => r.status === selectedStatus)

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex flex-wrap gap-3">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === status ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-border"
            }`}
          >
            {status === "all" ? "Tất cả" : status}
          </button>
        ))}
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Tên đội</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Giải đấu</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Huấn luyện viên</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">VĐV</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Ngày đăng ký</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Trạng thái</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{reg.teamName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{reg.tournament}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{reg.coach}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{reg.players}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(reg.date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        reg.status === "Chờ duyệt"
                          ? "bg-yellow-100 text-yellow-700"
                          : reg.status === "Đã duyệt"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {reg.status}
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
                      {reg.status === "Chờ duyệt" && (
                        <>
                          <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                            <CheckCircle size={18} className="text-green-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                            <XCircle size={18} className="text-red-600" />
                          </button>
                        </>
                      )}
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
