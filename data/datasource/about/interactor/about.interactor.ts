import { BankQrItem, BoardDirectorItem } from "@/data/model/about.model";
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

  // --- Bank QR Codes (CRUD) ---
  async getBankQrs() {
    const data = await aboutRepository.getBankQrs();
    return data
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  async createBankQr(data: Partial<BankQrItem>) {
    return await aboutRepository.createBankQr(data);
  },

  async updateBankQr(id: number, data: Partial<BankQrItem>) {
    return await aboutRepository.updateBankQr(id, data);
  },

  async deleteBankQr(id: number) {
    return await aboutRepository.deleteBankQr(id);
  }
};