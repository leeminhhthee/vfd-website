"use client";

import { trans } from "@/app/generated/AppLocalization";
import UserLayout from "@/components/layouts/user-layout";
import RegistrationButton from "@/components/pages/tournament/registration-button";
import RelatedTournaments from "@/components/pages/tournament/related-tournaments";
import TournamentDescription from "@/components/pages/tournament/tournament-description";
import TournamentHeader from "@/components/pages/tournament/tournament-header";
import TournamentResults from "@/components/pages/tournament/tournament-results";
import TournamentScheduleImage from "@/components/pages/tournament/tournament-schedule-image";
import { tournamentInteractor } from "@/data/datasource/tournament/interactor/tournament.interactor";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { notFound, useParams } from "next/navigation";

export default function TournamentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: tournament,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tournament-details", id],
    queryFn: () => tournamentInteractor.getTournamentById(Number(id)),
  });

  const { data: relatedTournaments = [] } = useQuery({
    queryKey: ["related-tournaments", id],
    queryFn: () => tournamentInteractor.getRelatedTournaments(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <UserLayout>
        <div className="w-full h-[50vh] flex items-center justify-center">
          <Spin size="large" />
          <span className="text-gray-500 font-medium text-sm ml-5">
            {trans.loading}
          </span>
        </div>
      </UserLayout>
    );
  }

  if (error || !tournament) {
    notFound();
  }

  const hasScheduleImage = !!tournament.scheduleImg;

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TournamentHeader name={tournament.name} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Bên trái: 3/5 width */}
          <div className="lg:col-span-3">
            <TournamentDescription
              description={tournament.description ?? ""}
              startDate={tournament.startDate.toString() ?? ""}
              endDate={tournament.endDate.toString() ?? ""}
              location={tournament.location ?? ""}
              status={tournament.status ?? ""}
              relatedFiles={tournament.relatedFiles ?? []}
            />

            <TournamentScheduleImage
              imageUrls={tournament.scheduleImg ?? []}
              tournamentName={tournament.name}
            />
          </div>

          {/* Bên phải: 2/5 width */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-6">
              <RegistrationButton
                tournamentId={tournament.id}
                tournamentName={tournament.name}
                registrationOpen={tournament.registrationOpen}
                status={tournament.status}
                hasScheduleImage={hasScheduleImage}
              />

              <TournamentResults
                results={tournament.matchSchedules ?? []}
                hasScheduleImage={!!tournament.scheduleImg}
              />
            </div>
          </div>
        </div>

        {/* Phần cuối: Giải liên quan */}
        <RelatedTournaments tournaments={relatedTournaments} />
      </div>
    </UserLayout>
  );
}
