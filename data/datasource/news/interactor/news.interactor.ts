import type { NewsItem } from "../../../model/news.model";
import { newsRepository } from "../repository/news.repository";

export const newsInteractor = {
  async getNewsListForHome(): Promise<NewsItem[]> {
    const news = await newsRepository.getNews();
    return news
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
  },

  async getNewsList(): Promise<NewsItem[]> {
    const news = await newsRepository.getNews();
    return news.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getNewsById(id: number): Promise<NewsItem | null> {
    return await newsRepository.getNewsById(id);
  },

  async createNews(payload: Partial<NewsItem>): Promise<NewsItem> {
    return await newsRepository.createNews(payload);
  },

  async updateNews(id: number, payload: Partial<NewsItem>): Promise<NewsItem> {
    return await newsRepository.updateNews(id, payload);
  },

  async deleteNews(id: number): Promise<{ success: boolean }> {
    return await newsRepository.deleteNews(id);
  },
};
