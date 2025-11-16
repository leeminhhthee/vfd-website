import { authenticationRepository } from "../repository/authentication.repository";

export const authenticationInteractor = {
  async login(email: string, password: string) {
    const res = await authenticationRepository.login(email, password);
    return res;
  }
};
