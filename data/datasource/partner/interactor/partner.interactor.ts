import { PartnerItem } from "@/data/model/partner.model";
import { partnerRepository } from "../repository/partner.repository";

export const partnerInteractor = {
  async getPartnerList() {
    const list = await partnerRepository.getPartnerList();
    return list;
  },
  async createPartner(data: Partial<PartnerItem>) {
    // Gọi repository ở đây
    return await partnerRepository.createPartner(data);
  },

  async updatePartner(id: number, data: Partial<PartnerItem>) {
    // Gọi repository ở đây
    return await partnerRepository.updatePartner(id, data);
  },

  async deletePartner(id: number) {
    // Gọi repository ở đây
    return await partnerRepository.deletePartner(id);
  },
};
