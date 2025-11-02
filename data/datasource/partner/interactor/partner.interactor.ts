import { partnerRepository } from "../repository/partner.repository";

export const partnerInteractor = {
  async getPartnerList() {
    const list = await partnerRepository.getPartnerList();
    return list;
  },
};
