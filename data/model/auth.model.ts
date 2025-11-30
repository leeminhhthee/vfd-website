import { Expose } from "class-transformer";

export class AuthData {
  @Expose({ name: "id" })
  id!: string;
  @Expose({ name: "email" })
  email!: string;
  @Expose({ name: "fullName" })
  fullName!: string;
  @Expose({ name: "phoneNumber" })
  phoneNumber!: string;
  @Expose({ name: "imageUrl" })
  imageUrl!: string;
  @Expose({ name: "admin" })
  admin!: boolean;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthData;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  imageUrl?: string;
  admin: boolean;
}
