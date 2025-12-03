import { plainToInstance } from "class-transformer";
import tournamentMock from "../../../mockup/tournament.json";
import { MatchSchedule, TournamentItem } from "../../../model/tournament.model";
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

  async getRelatedTournaments(currentId: number, limit = 3): Promise<TournamentItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(TournamentItem, tournamentMock)
        .filter(item => item.id !== currentId)
        .slice(0, limit);
    }

    const response = await api.get<TournamentItem[]>(`/tournament/${currentId}/related?limit=${limit}`);
    return plainToInstance(TournamentItem, response.data);
  },

  async createTournament(data: Partial<TournamentItem>): Promise<TournamentItem> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return plainToInstance(TournamentItem, data);
    }

    const response = await api.post<TournamentItem>("/tournament", data);
    return plainToInstance(TournamentItem, response.data);
  },

  async updateTournament(id: number, data: Partial<TournamentItem>): Promise<TournamentItem> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      // Giả lập trả về object đã update
      return plainToInstance(TournamentItem, { ...data, id, updatedAt: new Date() });
    }

    const response = await api.put<TournamentItem>(`/tournament/${id}`, data);
    return plainToInstance(TournamentItem, response.data);
  },

  async deleteTournament(id: number): Promise<boolean> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      return true;
    }

    await api.delete(`/tournament/${id}`);
    return true;
  },

  async generateScheduleFromImages(imageUrls: string[]): Promise<MatchSchedule[]> {
    // Logic API thật:
    // const response = await api.post<MatchSchedule[]>('/gen-schedule-endpoint', { images: imageUrls });
    // return response.data;

    // --- MOCK DATA ---
    await new Promise((r) => setTimeout(r, 2000)); // Delay giả lập xử lý AI
    console.log("Generating schedule from URLs:", imageUrls);

    const mockGeneratedMatches = [
      {
        round: "group",
        table: "A",
        match_date: "2024-12-01T10:00:00Z",
        team_A: "Đội AI 1",
        team_B: "Đội AI 2",
        score_A: null,
        score_B: null,
      },
      {
        round: "group",
        table: "B",
        match_date: "2024-12-02T10:00:00Z",
        team_A: "Đội AI 3",
        team_B: "Đội AI 4",
        score_A: null,
        score_B: null,
      },
      {
        round: "quarter-final",
        table: "",
        match_date: "2024-12-05T14:00:00Z",
        team_A: "Đội AI 1",
        team_B: "Đội AI 3",
        score_A: null,
        score_B: null,
      }
    ];

    const matches = plainToInstance(MatchSchedule, mockGeneratedMatches);

    // Gán ID tạm thời để UI không bị lỗi key (vì API gen chưa lưu nên chưa có ID thật)
    matches.forEach((m, index) => {
      m.id = Date.now() + index;
    });

    return matches;
  },
};
