import newsMock from "../../../mockup/news.json";
import { NewsItem } from "../../../model/news.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const newsRepository = {
  async getNews(): Promise<NewsItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return newsMock;
    }

    const response = await api.get<NewsItem[]>("/home/news");
    return response.data;
  },
};
