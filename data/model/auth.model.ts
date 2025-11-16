import { Expose } from "class-transformer";

export class AuthData {
  @Expose({ name: "id" })
  id!: string;
  @Expose({ name: "email" })
  email!: string;
  @Expose({ name: "name" })
  name!: string;
  @Expose({ name: "access_token" })
  accessToken!: string;
  @Expose({ name: "refresh_token" })
  refreshToken!: string;
  @Expose({ name: "is_admin" })
  isAdmin!: boolean;
}
