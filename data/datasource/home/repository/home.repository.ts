import { plainToInstance } from "class-transformer";
import heroMock from "../../../mockup/hero.json";
import { HeroItem } from "../../../model/hero.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

let localHeroes: HeroItem[] = plainToInstance(HeroItem, heroMock as unknown[]);

export const homeRepository = {
  async getManualHeroes(): Promise<HeroItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(HeroItem, heroMock);
    }

    const response = await api.get<HeroItem[]>("/home/hero");
    return plainToInstance(HeroItem, response.data);
  },

  async createHero(data: Partial<HeroItem>): Promise<HeroItem> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const newItem = { ...data, id: Date.now() } as HeroItem;
      localHeroes.push(newItem);
      return newItem;
    }
    const response = await api.post<HeroItem>("/heroes", data);
    return plainToInstance(HeroItem, response.data);
  },

  async updateHero(id: number, data: Partial<HeroItem>): Promise<HeroItem> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const index = localHeroes.findIndex((h) => h.id === id);
      if (index !== -1) {
        localHeroes[index] = { ...localHeroes[index], ...data };
        return plainToInstance(HeroItem, localHeroes[index]);
      }
      throw new Error("Hero not found");
    }
    const response = await api.put<HeroItem>(`/heroes/${id}`, data);
    return plainToInstance(HeroItem, response.data);
  },

  async deleteHero(id: number): Promise<boolean> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      localHeroes = localHeroes.filter((h) => h.id !== id);
      return true;
    }
    await api.delete(`/heroes/${id}`);
    return true;
  }
};
