"use client"

import { useState } from "react"
import { Calendar, MapPin, Users, Trophy } from "lucide-react"
import Link from "next/link"

export default function ScheduleList() {
  const [selectedStatus, setSelectedStatus] = useState("all")

  const schedules = [
    {
      id: 1,
      name: "Giải bóng chuyền nam TP Đà Nẵng",
      date: "2024-11-15",
      location: "Nhà thi đấu Tiên Sơn",
      teams: 12,
      status: "Sắp diễn ra",
      round: "Vòng loại",
    },
    {
      id: 2,
      name: "Giải bóng chuyền nữ TP Đà Nẵng",
      date: "2024-11-22",
      location: "Nhà thi đấu Tiên Sơn",
      teams: 10,
      status: "Sắp diễn ra",
      round: "Vòng loại",
    },
    {
      id: 3,
      name: "Giải bóng chuyền trẻ toàn quốc",
      date: "2024-12-01",
      location: "Nhà thi đấu Tiên Sơn",
      teams: 20,
      status: "Sắp diễn ra",
      round: "Vòng chung kết",
    },
    {
      id: 4,
      name: "Giải bóng chuyền nam TP Đà Nẵng 2024",
      date: "2024-10-25",
      location: "Nhà thi đấu Tiên Sơn",
      teams: 12,
      status: "Đã kết thúc",
      round: "Chung kết",
    },
  ]

  const statuses = ["all", "Sắp diễn ra", "Đang diễn ra", "Đã kết thúc"]

  const filteredSchedules = selectedStatus === "all" ? schedules : schedules.filter((s) => s.status === selectedStatus)

  return (
    <div>
      {/* Status Filter */}
      <div className="mb-8 flex flex-wrap gap-3">
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

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{schedule.name}</h3>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    schedule.status === "Sắp diễn ra"
                      ? "bg-blue-100 text-blue-700"
                      : schedule.status === "Đang diễn ra"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {schedule.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-accent">{schedule.round}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar size={18} className="text-accent" />
                <span>{new Date(schedule.date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin size={18} className="text-accent" />
                <span>{schedule.location}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users size={18} className="text-accent" />
                <span>{schedule.teams} đội tham gia</span>
              </div>
            </div>

            {/* <button */}
            <Link
              href={`/schedule/${schedule.id}`} className="w-full px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors">
              Xem chi tiết
            </Link>
            {/* </button> */}
          </div>
        ))}
      </div>

      {filteredSchedules.length === 0 && (
        <div className="text-center py-12">
          <Trophy size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">Không có lịch thi đấu nào</p>
        </div>
      )}
    </div>
  )
}
