import { NewsStatus } from "@/data/constants/constants";
import type { NewsItem } from "../../../model/news.model";
import { newsRepository } from "../repository/news.repository";

export const newsInteractor = {
  async getNewsListPublished(): Promise<NewsItem[]> {
    const news = await newsRepository.getNews();
    return news
      .filter((item) => item.status === NewsStatus.PUBLISHED)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  async getNewsList(): Promise<NewsItem[]> {
    const news = await newsRepository.getNews();
    return news
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  async getNewsById(id: number): Promise<NewsItem | null> {
    const news = await newsRepository.getNewsById(id);
    if (news && news.status === NewsStatus.PUBLISHED) {
      return news;
    }
    return null;
  },

  async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    const news = await newsRepository.getNewsBySlug(slug);
    if (news && news.status === NewsStatus.PUBLISHED) {
      return news;
    }
    return null;
  },

  async getNewsByIdAndSlug(id: number, slug: string): Promise<NewsItem | null> {
    const news = await newsRepository.getNewsByIdAndSlug(id, slug);
    if (news && news.status === NewsStatus.PUBLISHED) {
      return news;
    }
    return null;
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
