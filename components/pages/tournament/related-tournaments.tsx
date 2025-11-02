"use client"

import Link from "next/link"
import type { Tournament } from "@/lib/schedule-data"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"

interface RelatedTournamentsProps {
  tournaments: Tournament[]
}

export default function RelatedTournaments({ tournaments }: RelatedTournamentsProps) {
  if (tournaments.length === 0) return null

  return (
    <div className="mt-12 bg-white rounded-lg border border-border p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Giải đấu liên quan</h2>

      <div className="space-y-4">
        {tournaments.map((tournament) => (
          <Link key={tournament.id} href={`/schedule/${tournament.id}`}>
            <div className="p-4 m-2 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <h3 className="font-semibold text-primary mb-2">{tournament.name}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{tournament.description}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{format(parseISO(tournament.startDate), "dd/MM/yyyy", { locale: vi })}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                  {tournament.status === "upcoming"
                    ? "Sắp diễn ra"
                    : tournament.status === "ongoing"
                      ? "Đang diễn ra"
                      : "Đã kết thúc"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
