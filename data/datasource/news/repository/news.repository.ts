import { NewsStatus } from "@/data/constants/constants";
import { plainToInstance } from "class-transformer";
import newsMock from "../../../mockup/news.json";
import { NewsItem } from "../../../model/news.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// In-memory store cho MOCK để có thể CRUD trong phiên làm việc
let mockNewsStore: NewsItem[] | null = null;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const ensureMockStore = () => {
  if (!mockNewsStore) {
    mockNewsStore = plainToInstance(NewsItem, newsMock).filter(
      (item) => item.status === NewsStatus.PUBLISHED
    );
  }
  return mockNewsStore!;
};

export const newsRepository = {
  async getNews(): Promise<NewsItem[]> {
    if (USE_MOCK) {
      await delay(300);
      return ensureMockStore();
    }

    // API public list (giữ nguyên endpoint đang dùng)
    const response = await api.get<NewsItem[]>("/home/news");
    return plainToInstance(NewsItem, response.data);
  },

  async getNewsById(id: number): Promise<NewsItem | null> {
    if (USE_MOCK) {
      await delay(300);
      const store = ensureMockStore();
      return store.find((item) => item.id === id) || null;
    }

    const response = await api.get<NewsItem>(`/news/${id}`);
    return plainToInstance(NewsItem, response.data);
  },

  async createNews(payload: Partial<NewsItem>): Promise<NewsItem> {
    if (USE_MOCK) {
      await delay(300);
      const store = ensureMockStore();
      const nextId =
        store.length > 0 ? Math.max(...store.map((n) => n.id)) + 1 : 1;
      const now = new Date().toISOString();
      const created = plainToInstance(NewsItem, {
        id: nextId,
        title: payload.title ?? "",
        type: payload.type ?? "",
        content: payload.content ?? "",
        status: payload.status ?? "draft",
        createdAt: payload.createdAt ?? now,
        // excerpt: payload.excerpt ?? "",
        // aiSummary: payload.aiSummary ?? "",
      });
      store.unshift(created);
      return created;
    }

    const response = await api.post<NewsItem>("/news", payload);
    return plainToInstance(NewsItem, response.data);
  },

  async updateNews(id: number, payload: Partial<NewsItem>): Promise<NewsItem> {
    if (USE_MOCK) {
      await delay(300);
      const store = ensureMockStore();
      const idx = store.findIndex((n) => n.id === id);
      if (idx === -1) throw new Error("News not found");
      const updated = plainToInstance(NewsItem, {
        ...store[idx],
        ...payload,
        id,
      });
      store[idx] = updated;
      return updated;
    }

    const response = await api.put<NewsItem>(`/news/${id}`, payload);
    return plainToInstance(NewsItem, response.data);
  },

  async deleteNews(id: number): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await delay(300);
      const store = ensureMockStore();
      const idx = store.findIndex((n) => n.id === id);
      if (idx !== -1) store.splice(idx, 1);
      return { success: true };
    }

    await api.delete(`/news/${id}`);
    return { success: true };
  },
};
