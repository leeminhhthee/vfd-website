import UserLayout from "@/components/layouts/user-layout"
import RegistrationButton from "@/components/pages/tournament/registration-button"
import RelatedTournaments from "@/components/pages/tournament/related-tournaments"
import TournamentDescription from "@/components/pages/tournament/tournament-description"
import TournamentHeader from "@/components/pages/tournament/tournament-header"
import TournamentResults from "@/components/pages/tournament/tournament-results"
import TournamentScheduleImage from "@/components/pages/tournament/tournament-schedule-image"
import { getTournamentById, getRelatedTournaments } from "@/lib/schedule-data"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function TournamentDetailPage({ params }: Props) {
  const { id } = await params
  const tournament = getTournamentById(id)

  if (!tournament) {
    notFound()
  }

  const relatedTournaments = getRelatedTournaments(tournament.id)

  const hasScheduleImage = !!tournament.scheduleImage

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TournamentHeader name={tournament.name} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Bên trái: 3/5 width */}
          <div className="lg:col-span-3">
            <TournamentDescription
              description={tournament.description}
              startDate={tournament.startDate}
              endDate={tournament.endDate}
              location={tournament.location}
              status={tournament.status}
              relatedFiles={tournament.relatedFiles}
            />

            <TournamentScheduleImage imageUrl={tournament.scheduleImage} tournamentName={tournament.name} />
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

              <TournamentResults results={tournament.results} hasScheduleImage={!!tournament.scheduleImage} />
            </div>
          </div>
        </div>

        {/* Phần cuối: Giải liên quan */}
        <RelatedTournaments tournaments={relatedTournaments} />
      </div>
    </UserLayout>
  )
}
