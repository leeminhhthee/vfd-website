import { plainToInstance } from "class-transformer";
import { api } from "../../../../app/api/api";
import { PartnerItem } from "../../../model/partner.model";

// const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const API_BASE = "/partners";

export const partnerRepository = {
  async getPartnerList(): Promise<PartnerItem[]> {
    const response = await api.get<PartnerItem[]>(`${API_BASE}`);
    return plainToInstance(PartnerItem, response.data);
  },

  async createPartner(data: Partial<PartnerItem>): Promise<PartnerItem> {
    const response = await api.post<PartnerItem>(`${API_BASE}`, data);
    return plainToInstance(PartnerItem, response.data);
  },

  async updatePartner(id: number, data: Partial<PartnerItem>): Promise<PartnerItem> {
    const response = await api.patch<PartnerItem>(`${API_BASE}/${id}`, data);
    return plainToInstance(PartnerItem, response.data);
  },

  async deletePartner(id: number): Promise<boolean> {
    await api.delete(`${API_BASE}/${id}`);
    return true;
  },
};