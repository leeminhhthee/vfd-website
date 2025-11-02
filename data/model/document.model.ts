import { Expose } from 'class-transformer';

export class DocumentItem {
  @Expose({ name: 'id' })
  id!: string;
  @Expose({ name: 'title' })
  title!: string;
  @Expose({ name: 'content' })
  content!: string;
  @Expose({ name: 'created_at' })
  createdAt!: Date | null;
  @Expose({ name: 'updated_at' })
  updatedAt!: Date | null;
}
