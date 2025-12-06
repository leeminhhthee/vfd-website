import { api } from "@/app/api/api";
import { plainToInstance } from "class-transformer";
import { HeroItem } from "../../../model/hero.model";

const API_HERO_BASE = '/heroes';

export const homeRepository = {
  async getManualHeroes(): Promise<HeroItem[]> {
    const response = await api.get<HeroItem[]>(`${API_HERO_BASE}`);
    return plainToInstance(HeroItem, response.data);
  },

  async createHero(data: Partial<HeroItem>): Promise<HeroItem> {
    const response = await api.post<HeroItem>(`${API_HERO_BASE}`, data);
    return plainToInstance(HeroItem, response.data);
  },

  async updateHero(id: number, data: Partial<HeroItem>): Promise<HeroItem> {
    const response = await api.patch<HeroItem>(`${API_HERO_BASE}/${id}`, data);
    return plainToInstance(HeroItem, response.data);
  },

  async deleteHero(id: number): Promise<{ success: boolean }> {
    await api.delete(`${API_HERO_BASE}/${id}`);
    return { success: true };
  }
};
