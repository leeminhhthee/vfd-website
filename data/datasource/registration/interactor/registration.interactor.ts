import { RegistrationStatus } from "@/data/constants/constants";
import { registrationRepository } from "../repository/registration.repository";

export const registrationInteractor = {
  async getRegistrationList() {
    const list = await registrationRepository.getRegistrationList();
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async updateRegistrationStatus(id: number, status: RegistrationStatus) {
    return await registrationRepository.updateRegistrationStatus(id, status);
  },
};
