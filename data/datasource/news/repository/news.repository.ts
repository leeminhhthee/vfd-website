import { plainToInstance } from "class-transformer";
import newsMock from "../../../mockup/news.json";
import { NewsItem } from "../../../model/news.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const newsRepository = {
  async getNews(): Promise<NewsItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(NewsItem, newsMock);
    }

    const response = await api.get<NewsItem[]>("/home/news");
    return plainToInstance(NewsItem, response.data);
  },

  async getNewsById(id: number): Promise<NewsItem | null> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const newsItems = plainToInstance(NewsItem, newsMock);
      return newsItems.find(item => item.id === id) || null;
    }

    const response = await api.get<NewsItem>(`/news/${id}`);
    return plainToInstance(NewsItem, response.data);
  },
};
