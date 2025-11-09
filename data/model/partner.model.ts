import { Expose } from "class-transformer";

export class PartnerItem {
  @Expose({ name: "id" })
  id!: number;
  @Expose({ name: "name" })
  name!: string;
  @Expose({ name: "email" })
  email!: string | null;
  @Expose({ name: "image_url" })
  image!: string;
  @Expose({ name: "since" })
  since!: string;
}