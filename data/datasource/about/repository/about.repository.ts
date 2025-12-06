import { api } from "@/app/api/api";
import aboutMock from "@/data/mockup/about.json";
import {
  AboutModel,
  BankQrItem,
  BoardDirectorItem,
} from "@/data/model/about.model";
import { plainToInstance } from "class-transformer";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

// Biến local dùng để giả lập lưu trữ khi edit/delete trong phiên làm việc (khi dùng Mock)
let localDirectors = [...aboutMock.board_directors];

const API_BANK_BASE = '/banks';

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
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      // Trả về biến local để thấy sự thay đổi khi thêm/sửa/xóa
      return plainToInstance(BoardDirectorItem, localDirectors);
    }

    const response = await api.get<BoardDirectorItem[]>("/directors");
    return plainToInstance(BoardDirectorItem, response.data);
  },

  async createBoardDirector(
    data: Partial<BoardDirectorItem>
  ): Promise<BoardDirectorItem> {
    const response = await api.post<BoardDirectorItem>("/directors", data);
    return plainToInstance(BoardDirectorItem, response.data);
  },

  async updateBoardDirector(
    id: number,
    data: Partial<BoardDirectorItem>
  ): Promise<BoardDirectorItem> {
    const response = await api.put<BoardDirectorItem>(`/directors/${id}`, data);
    return plainToInstance(BoardDirectorItem, response.data);
  },

  async deleteBoardDirector(id: number): Promise<boolean> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      localDirectors = localDirectors.filter((d) => d.id !== id);
      return true;
    }

    await api.delete(`/directors/${id}`);
    return true;
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