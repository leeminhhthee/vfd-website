import { RegistrationStatus } from "@/data/constants/constants";
import { RegistrationItem } from "@/data/model/registration.model";
import { registrationRepository } from "../repository/registration.repository";

export const registrationInteractor = {
  async getRegistrationList() {
    const list = await registrationRepository.getRegistrationList();
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async createRegistration(data: Partial<RegistrationItem>) {
    return await registrationRepository.createRegistration(data);
  },

  async updateRegistrationStatus(id: number, status: RegistrationStatus) {
    return await registrationRepository.updateRegistrationStatus(id, status);
  },
};
