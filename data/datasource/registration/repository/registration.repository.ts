import { plainToInstance } from "class-transformer";
import registrationMock from "../../../mockup/registration.json";
import { RegistrationItem } from "../../../model/registration.model";
import { api } from "../../../remote/api";
import { RegistrationStatus } from "@/data/constants/constants";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const registrationRepository = {
  async getRegistrationList(): Promise<RegistrationItem[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(RegistrationItem, registrationMock);
    }

    const response = await api.get<RegistrationItem[]>("/registration");
    return plainToInstance(RegistrationItem, response.data);
  },

  async updateRegistrationStatus(id: number, status: RegistrationStatus): Promise<boolean> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      console.log(`Mock Update: Registration ${id} -> ${status}`);
      // Trong môi trường thật mock sẽ không persist lại vào file json, 
      // nhưng interactor sẽ trả về true để UI cập nhật optimistic hoặc invalidate query
      return true;
    }

    // Gọi API thực tế
    // Ví dụ: PATCH /registrations/1/status
    await api.patch(`/registrations/${id}`, { status });
    return true;
  },
};
