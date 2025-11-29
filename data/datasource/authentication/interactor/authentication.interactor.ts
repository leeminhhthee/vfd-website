import { AuthRequest } from "@/data/model/auth.model";
import { authenticationRepository } from "../repository/authentication.repository";

export const authenticationInteractor = {
  async login(payload: AuthRequest) {
    const res = await authenticationRepository.login(payload);
    return res;
  }
};
