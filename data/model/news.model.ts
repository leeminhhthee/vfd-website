import { Expose } from "class-transformer";

export class NewsItem {
  @Expose({ name: 'id' })
  id!: number;
  @Expose({ name: 'title' })
  title!: string;
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

  @Expose() authorBy!: {
    id: number;
    fullName: string;
    email: string;
    imageUrl?: string | null;
  };

  @Expose() tags!: string;
}
