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
};
