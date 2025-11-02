import { plainToInstance } from "class-transformer";
import tournamentMock from "../../../mockup/tournament.json";
import { TournamentItem } from "../../../model/tournament.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const tournamentRepository = {
  async getTournamentList(): Promise<TournamentItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(TournamentItem, tournamentMock);
    }

    const response = await api.get<TournamentItem[]>("/tournament");
    return plainToInstance(TournamentItem, response.data);
  },

  async getTournamentById(id: number): Promise<TournamentItem | null> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(TournamentItem, tournamentMock).find(item => item.id === id) || null;
    }

    const response = await api.get<TournamentItem>(`/tournament/${id}`);
    return plainToInstance(TournamentItem, response.data);
  },
};
