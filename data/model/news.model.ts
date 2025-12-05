import 'reflect-metadata';
import { Expose, Type } from "class-transformer";
import { AuthData } from "./auth.model";

export class NewsItem {
  @Expose({ name: 'id' })
  id!: number;
  @Expose({ name: 'title' })
  title!: string;
  @Expose({ name: 'slug' })
  slug!: string;
  @Expose({ name: 'type' })
  type!: string;
  @Expose({ name: 'content' })
  content!: string;
  @Expose({ name: 'status' })
  status!: string;
  // @Expose({ name: 'author_id' })
  // authorId!: number;
  @Expose({ name: 'imageUrl' })
  imageUrl!: string;
  @Expose({ name: 'createdAt' })
  createdAt!: Date;
  @Expose({ name: 'updatedAt' })
  updatedAt?: Date | null;

  @Expose({ name: 'authorBy' })
  @Type(() => AuthData)
  authorBy!: AuthData;

  @Expose() tags!: string;
}
