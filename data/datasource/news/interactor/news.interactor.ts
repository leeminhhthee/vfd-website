import { newsRepository } from "../repository/news.repository";

export const newsInteractor = {
  async getNewsListForHome() {
    const news = await newsRepository.getNews();
    return news
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
  },
};
