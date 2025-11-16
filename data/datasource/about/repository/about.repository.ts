import { plainToInstance } from "class-transformer";
import { api } from "../../../../app/api/api";
import aboutMock from "../../../mockup/about.json";
import { AboutModel } from "../../../model/about.model";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const aboutRepository = {
  async getAboutList(): Promise<AboutModel> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(AboutModel, aboutMock);
    }

    const response = await api.get<AboutModel>("/about");
    return plainToInstance(AboutModel, response.data);
  },
};
