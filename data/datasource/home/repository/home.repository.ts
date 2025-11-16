import { plainToInstance } from "class-transformer";
import { api } from "../../../../app/api/api";
import heroMock from "../../../mockup/hero.json";
import { HeroItem } from "../../../model/hero.model";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const homeRepository = {
  async getHeroes(): Promise<HeroItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(HeroItem, heroMock);
    }

    const response = await api.get<HeroItem[]>("/home/hero");
    return plainToInstance(HeroItem, response.data);
  },
};
