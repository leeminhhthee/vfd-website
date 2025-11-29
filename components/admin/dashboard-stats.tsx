"use client"
// 1. Import thêm icon FileClock
import { Users, FileText, Trophy, ImageIcon, FileClock } from "lucide-react"

export default function DashboardStats() {
  const stats = [
    { label: "Người dùng", value: "1,234", icon: Users, color: "bg-blue-100 text-blue-600" },
    { label: "Tin tức", value: "45", icon: FileText, color: "bg-green-100 text-green-600" },
    { label: "Giải đấu", value: "12", icon: Trophy, color: "bg-yellow-100 text-yellow-600" },
    { label: "Hồ sơ chờ duyệt", value: "8", icon: FileClock, color: "bg-orange-100 text-orange-600" 
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}