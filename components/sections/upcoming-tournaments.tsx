"use client"
import Link from "next/link"
import { Calendar, MapPin, Users } from "lucide-react"

export default function UpcomingTournaments() {
  const tournaments = [
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
    {
      id: 3,
      name: "Giải bóng chuyền trẻ toàn quốc",
      date: "2024-12-01",
      location: "Nhà thi đấu Tiên Sơn",
      teams: 20,
    },
  ]

  return (
    <section className="py-8 md:py-12 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-3xl font-black text-foreground mb-8 uppercase">Giải đấu sắp tới</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white rounded-lg p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-foreground mb-4">{tournament.name}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar size={18} className="text-accent" />
                  <span>{new Date(tournament.date).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin size={18} className="text-accent" />
                  <span>{tournament.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users size={18} className="text-accent" />
                  <span>{tournament.teams} đội tham gia</span>
                </div>
              </div>

              <Link
                href={`/schedule/${tournament.id}`}
                className="w-full block text-center px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/schedule"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Xem tất cả lịch thi đấu
          </Link>
        </div>
      </div>
    </section>
  )
}
