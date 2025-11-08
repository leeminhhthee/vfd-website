import { ScheduleStatus } from "@/data/constants/constants";
import { tournamentRepository } from "../repository/tournament.repository";

export const tournamentInteractor = {
  async getTournamentList() {
    const list = await tournamentRepository.getTournamentList();
    return list;
  },

  async getTournamentById(id: number) {
    return await tournamentRepository.getTournamentById(id);
  },

  async getRelatedTournaments(id: number) {
    return await tournamentRepository.getRelatedTournaments(id);
  },

  async getUpcomingTournaments() {
    const tournaments = await tournamentRepository.getTournamentList();
    const now = new Date();
    
    return tournaments
      .filter(tournament => {
        const endDate = new Date(tournament.endDate);
        return endDate >= now && tournament.status === ScheduleStatus.COMING;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3);
  },
};
