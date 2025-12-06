import { api } from "@/app/api/api";
import aboutMock from "@/data/mockup/about.json";
import {
  AboutModel,
  BankQrItem,
  BoardDirectorItem,
} from "@/data/model/about.model";
import { plainToInstance } from "class-transformer";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const API_BANK_BASE = '/banks';
const API_DIRECTORS_BASE = '/board-directors';

export const aboutRepository = {
  // --- 1. Dữ liệu Tĩnh (Introduction, Affected Object) ---
  async getStaticContent(): Promise<AboutModel> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(AboutModel, aboutMock);
    }

    const response = await api.get<AboutModel>("/about");
    return plainToInstance(AboutModel, response.data);
  },

  // --- 2. Dữ liệu Ban giám đốc ---

  async getBoardDirectors(): Promise<BoardDirectorItem[]> {
    const response = await api.get<BoardDirectorItem[]>(`${API_DIRECTORS_BASE}`);
    return plainToInstance(BoardDirectorItem, response.data);
  },

  async createBoardDirector(
    data: Partial<BoardDirectorItem>
  ): Promise<BoardDirectorItem> {
    const response = await api.post<BoardDirectorItem>(`${API_DIRECTORS_BASE}`, data);
    return plainToInstance(BoardDirectorItem, response.data);
  },

  async updateBoardDirector(
    id: number,
    data: Partial<BoardDirectorItem>
  ): Promise<BoardDirectorItem> {
    const response = await api.patch<BoardDirectorItem>(`${API_DIRECTORS_BASE}/${id}`, data);
    return plainToInstance(BoardDirectorItem, response.data);
  },

  async deleteBoardDirector(id: number): Promise<{ success: boolean }> {
    await api.delete(`${API_DIRECTORS_BASE}/${id}`);
    return { success: true };
  },

  // --- 3. Dữ liệu QR Code ---

  async getBankQrs(): Promise<BankQrItem[]> {
    const response = await api.get<BankQrItem[]>(`${API_BANK_BASE}`);
    return plainToInstance(BankQrItem, response.data);
  },

  async createBankQr(data: Partial<BankQrItem>): Promise<BankQrItem> {
    const response = await api.post<BankQrItem>(`${API_BANK_BASE}`, data);
    return plainToInstance(BankQrItem, response.data);
  },

  async updateBankQr(id: number, data: Partial<BankQrItem>): Promise<BankQrItem> {
    const response = await api.patch<BankQrItem>(`${API_BANK_BASE}/${id}`, data);
    return plainToInstance(BankQrItem, response.data);
  },

  async deleteBankQr(id: number): Promise<{ success: boolean }> {
    await api.delete(`${API_BANK_BASE}/${id}`);
    return { success: true };
  }
};