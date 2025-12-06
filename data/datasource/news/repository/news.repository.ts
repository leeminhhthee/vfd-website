import { plainToInstance } from "class-transformer";
import { api } from "../../../../app/api/api";
// import newsMock from "../../../mockup/news.json";
import { NewsItem } from "../../../model/news.model";

// const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const API_BASE = "/news";

// In-memory store cho MOCK để có thể CRUD trong phiên làm việc
// let mockNewsStore: NewsItem[] | null = null;
// const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
// const ensureMockStore = () => {
//   if (!mockNewsStore) {
//     mockNewsStore = plainToInstance(NewsItem, newsMock);
//   }
//   return mockNewsStore!;
// };

export const newsRepository = {
  async getNews(): Promise<NewsItem[]> {
    // API public list (giữ nguyên endpoint đang dùng)
    const response = await api.get<NewsItem[]>(`${API_BASE}`);
    return plainToInstance(NewsItem, response.data);
  },

  async getNewsById(id: number): Promise<NewsItem | null> {
    try {
      const response = await api.get<NewsItem>(`${API_BASE}/${id}`);
      return plainToInstance(NewsItem, response.data);
    } catch (err: unknown) {
      // Nếu không tìm thấy, trả về null
      return null;
    }
  },

  async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    try {
      const response = await api.get<NewsItem>(`${API_BASE}/slug/${slug}`);
      return plainToInstance(NewsItem, response.data);
    } catch (err: unknown) {
      // Nếu không tìm thấy, trả về null
      return null;
    }
  },

  async getNewsByIdAndSlug(id: number, slug: string): Promise<NewsItem | null> {
    try {
      const response = await api.get<NewsItem>(`${API_BASE}/${id}/${slug}`);
      return plainToInstance(NewsItem, response.data);
    } catch (err: unknown) {
      // Nếu không tìm thấy, trả về null
      return null;
    }
  },

  async createNews(payload: Partial<NewsItem>): Promise<NewsItem> {
    const response = await api.post<NewsItem>(`${API_BASE}`, payload, {
      timeout: 60000, 
    });
    return plainToInstance(NewsItem, response.data);
  },

  async updateNews(id: number, payload: Partial<NewsItem>): Promise<NewsItem> {
    const response = await api.patch<NewsItem>(`${API_BASE}/${id}`, payload,
      {
        timeout: 60000, 
      }
    );
    return plainToInstance(NewsItem, response.data);
  },

  async deleteNews(id: number): Promise<{ success: boolean }> {
    await api.delete(`${API_BASE}/${id}`);
    return { success: true };
  },
};
