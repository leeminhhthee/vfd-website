import { newsRepository } from "../repository/news.repository";

export const newsInteractor = {
  async getNewsListForHome() {
    const news = await newsRepository.getNews();
    return news
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  },
  
  async getNewsList() {
    const news = await newsRepository.getNews();
    return news.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getNewsById(id: number) {
    return await newsRepository.getNewsById(id);
  },
};
