import { plainToInstance } from "class-transformer";
import { api } from "../../../../app/api/api";
// import authenticationMock from "../../../mockup/login.json";
import { AuthData, AuthRequest, AuthResponse } from "../../../model/auth.model";
import { isAxiosError } from "axios";

export const authenticationRepository = {

  async login(payload: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", payload);

      // Chuyển dữ liệu raw sang instance AuthData
      const user = plainToInstance(AuthData, response.data.user, { excludeExtraneousValues: true });

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
};
