import { plainToInstance } from "class-transformer";
import { api } from "../../../../app/api/api";
import authenticationMock from "../../../mockup/login.json";
import { AuthData } from "../../../model/auth.model";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const authenticationRepository = {

  async login(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (USE_MOCK) {
      if (email === "admin@gmail.com" && password === "123456") {
        return plainToInstance(AuthData, authenticationMock);
      }

      throw new Error("Invalid email or password");
    }

    const response = await api.get<AuthData>("/authentication");
    return plainToInstance(AuthData, response.data);
  }
};
