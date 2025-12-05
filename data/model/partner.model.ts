import { Expose } from "class-transformer";
import 'reflect-metadata';

export class PartnerItem {
  @Expose({ name: "id" })
  id!: number;
  @Expose({ name: "name" })
  name!: string;
  @Expose({ name: "email" })
  email!: string | null;
  @Expose({ name: "imageUrl" })
  imageUrl!: string;
  @Expose({ name: "since" })
  since!: string;
  @Expose({ name: "createdAt" })
  createdAt!: Date;
  @Expose({ name: "updatedAt" })
  updatedAt!: Date;
}