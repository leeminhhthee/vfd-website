import { plainToInstance } from "class-transformer";
import { api } from "../../../../app/api/api";
// import authenticationMock from "../../../mockup/login.json";
import { AuthData, AuthRequest, AuthResponse } from "../../../model/auth.model";
import { isAxiosError } from "axios";

const API_BASE = "/auth";

export const authenticationRepository = {
  async login(payload: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await api.post(`${API_BASE}/login`, payload);

      // Chuyển dữ liệu raw sang instance AuthData
      const user = plainToInstance(AuthData, response.data.user, {
        excludeExtraneousValues: true,
      });

      return {
        user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error: unknown) {
      // Narrow the unknown error safely
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Login failed");
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  async logout(): Promise<{ message: string }> {
    try {
      const response = await api.post(`${API_BASE}/logout`);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Logout failed");
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  // forgetPassword
  async forgetPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post(`${API_BASE}/password/forgot/request-otp`, { email });
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Forget password failed");
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  // forgetPasswordVerifyOtp
  async forgetPasswordVerifyOtp(email: string, otp: string): Promise<{ resetToken: string }> {
    try {
      const response = await api.post(`${API_BASE}/password/forgot/verify-otp`, { email, otp });
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Forget password verify OTP failed");
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  // resetPassword
  async resetPassword(data: { resetToken: string; newPassword: string; confirmPassword: string }): Promise<{ message: string }> {
    try {
      const response = await api.post(`${API_BASE}/password/forgot/reset`, data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Reset password failed");
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  // changePassword
  async otpChangePassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post(`${API_BASE}/password/change/request-otp`, { email });
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Change password failed");
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  },

  // changePasswordVerifyOtp
  async changePassword(data: { email: string; otp: string; oldPassword: string; newPassword: string }): Promise<{ message: string }> {
    try {
      const response = await api.post(`${API_BASE}/password/change`, data);
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Change password verify OTP failed");
      }
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  },
};