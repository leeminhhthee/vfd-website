import { AuthRequest } from "@/data/model/auth.model";
import { authenticationRepository } from "../repository/authentication.repository";

export const authenticationInteractor = {
  async login(payload: AuthRequest) {
    const res = await authenticationRepository.login(payload);
    return res;
  },
  async logout() {
    const res = await authenticationRepository.logout();
    return res;
  },
  async forgetPassword(email: string) {
    const res = await authenticationRepository.forgetPassword(email);
    return res;
  },
  async forgetPasswordVerifyOtp(email: string, otp: string) {
    const res = await authenticationRepository.forgetPasswordVerifyOtp(email, otp);
    return res;
  },
  async resetPassword(data: { resetToken: string; newPassword: string; confirmPassword: string }) {
    const res = await authenticationRepository.resetPassword(data);
    return res;
  },
  async otpChangePassword(email: string) {
    const res = await authenticationRepository.otpChangePassword(email);
    return res;
  },
  async changePassword(data: { email: string; otp: string; oldPassword: string; newPassword: string }) {
    const res = await authenticationRepository.changePassword(data);
    return res;
  }
};
