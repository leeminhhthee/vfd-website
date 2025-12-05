import { Expose, Type } from "class-transformer";
import { ProjectCategory } from "../constants/constants";
import { BankQrItem } from "./about.model";

export class ProjectItem {
  @Expose({ name: 'id' })
  id!: number;
  @Expose({ name: 'title' })
  title!: string;
  @Expose({ name: 'overview' })
  overview!: string;
  @Expose({ name: 'duration' })
  duration!: string;
  @Expose({ name: 'location' })
  location!: string;
  @Expose({ name: 'price' })
  price!: number;
  @Expose({ name: 'image' })
  image!: string;
  @Expose({ name: 'category' })
  category!: ProjectCategory;
  @Expose({ name: 'bank_qr_code' })
  @Type(() => BankQrItem)
  bankQrCode!: BankQrItem;
  @Expose({ name: 'goals' })
  goals!: string[];
  @Expose({ name: 'created_at' })
  createdAt!: Date;
}
