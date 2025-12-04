"use client";
import { trans } from "@/app/generated/AppLocalization";
import { tournamentInteractor } from "@/data/datasource/tournament/interactor/tournament.interactor";
import { useQuery } from "@tanstack/react-query";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

export default function UpcomingTournaments() {
  const {
    data: tournaments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["upcomingTournaments"],
    queryFn: () => tournamentInteractor.getUpcomingTournaments(),
  });

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-3xl font-black text-foreground mb-8 uppercase">
            {trans.upcomingTournaments}
          </h2>
          <div className="text-center text-muted-foreground">
            {trans.loading}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 md:py-12 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-3xl font-black text-foreground mb-8 uppercase">
            {trans.upcomingTournaments}
          </h2>
          <div className="text-center text-red-500">{trans.loadingError}</div>
        </div>
      </section>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-3xl font-black text-foreground mb-8 uppercase">
            {trans.upcomingTournaments}
          </h2>
          <div className="text-center text-muted-foreground">
            {trans.noUpcomingTournaments}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-3xl font-black text-foreground mb-8 uppercase">
          {trans.upcomingTournaments}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tournaments.slice(0, 3).map((tournament) => (
            <div
              key={tournament.id}
              className="bg-white rounded-lg p-6 border border-border hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-foreground mb-4">
                {tournament.name}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar size={18} className="text-accent" />
                  <span>
                    {new Date(tournament.startDate).toLocaleDateString("vi-VN")}{" "}
                    - {new Date(tournament.endDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin size={18} className="text-accent" />
                  <span>{tournament.location}</span>
                </div>
                {tournament.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tournament.description}
                  </p>
                )}
              </div>

              <Link
                href={`/schedule/${tournament.id}`}
                className="w-full block text-center px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                {trans.viewDetails}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/schedule"
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            {trans.viewAllSchedules}
          </Link>
        </div>
      </div>
    </section>
  );
}
