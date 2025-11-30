import { BoardDirectorItem } from "@/data/model/about.model";
import { aboutRepository } from "../repository/about.repository";

export const aboutInteractor = {
  // --- Static Content ---
  async getIntroduction() {
    const data = await aboutRepository.getStaticContent();
    return data.introduction;
  },

  async getAffectedObject() {
    const data = await aboutRepository.getStaticContent();
    return data.affectedObject;
  },

  // --- Board Directors (CRUD) ---
  async getBoardDirectors() {
    return await aboutRepository.getBoardDirectors();
  },

  async createBoardDirector(data: Partial<BoardDirectorItem>) {
    return await aboutRepository.createBoardDirector(data);
  },

  async updateBoardDirector(id: number, data: Partial<BoardDirectorItem>) {
    return await aboutRepository.updateBoardDirector(id, data);
  },

  async deleteBoardDirector(id: number) {
    return await aboutRepository.deleteBoardDirector(id);
  },

  async getBankQrUrl() {
    const data = await aboutRepository.getBankQr();
    return data?.qrCodeUrl || "";
  },

  async updateBankQr(url: string) {
    return await aboutRepository.updateBankQr(url);
  }
};