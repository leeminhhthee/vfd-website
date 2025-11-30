import { plainToInstance } from "class-transformer";
import partnerMock from "../../../mockup/partner.json";
import { PartnerItem } from "../../../model/partner.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const partnerRepository = {
  async getPartnerList(): Promise<PartnerItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(PartnerItem, partnerMock);
    }

    const response = await api.get<PartnerItem[]>("/partner");
    return plainToInstance(PartnerItem, response.data);
  },

  async createPartner(data: Partial<PartnerItem>): Promise<PartnerItem> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      console.log("Mock Create Partner:", data);
      return plainToInstance(PartnerItem, { id: Date.now(), ...data });
    }
    const response = await api.post<PartnerItem>("/partner", data);
    return plainToInstance(PartnerItem, response.data);
  },

  async updatePartner(id: number, data: Partial<PartnerItem>): Promise<PartnerItem> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      console.log(`Mock Update Partner ${id}:`, data);
      return plainToInstance(PartnerItem, { id, ...data });
    }
    const response = await api.put<PartnerItem>(`/partner/${id}`, data);
    return plainToInstance(PartnerItem, response.data);
  },

  async deletePartner(id: number): Promise<boolean> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      console.log(`Mock Delete Partner ${id}`);
      return true;
    }
    await api.delete(`/partner/${id}`);
    return true;
  }, 
};