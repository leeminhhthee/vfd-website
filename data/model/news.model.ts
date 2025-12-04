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
  @Expose({ name: 'author_id' })
  authorId!: number;
  @Expose({ name: 'image_url' })
  imageUrl!: string;
  @Expose({ name: 'created_at' })
  createdAt!: Date;
  @Expose({ name: 'updated_at' })
  updatedAt?: Date | null;
}
