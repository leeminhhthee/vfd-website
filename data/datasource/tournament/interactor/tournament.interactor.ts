import { ScheduleStatus } from "@/data/constants/constants";
import { tournamentRepository } from "../repository/tournament.repository";

export const tournamentInteractor = {
  async getTournamentList() {
    const list = await tournamentRepository.getTournamentList();
    return list.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
  },

  async getTournamentById(id: number) {
    return await tournamentRepository.getTournamentById(id);
  },

  async getRelatedTournaments(id: number) {
    const tournaments = await tournamentRepository.getRelatedTournaments(id);
    return tournaments.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
  },

  async getUpcomingTournaments() {
    const tournaments = await tournamentRepository.getTournamentList();
    const now = new Date();
    
    return tournaments
      .filter(tournament => {
        const endDate = new Date(tournament.endDate);
        return endDate >= now && tournament.status === ScheduleStatus.COMING;
      })
      .sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
      .slice(0, 3);
  },
};
