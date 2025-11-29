import { Expose } from 'class-transformer';

export class DocumentItem {
  @Expose({ name: 'id' })
  id!: string;
  @Expose({ name: 'title' })
  title!: string;
  @Expose({ name: 'content' })
  content!: string;
  @Expose({ name: 'category' })
  category!: string;
  @Expose({ name: 'file_url' })
  fileUrl?: string;
  @Expose({ name: 'file_name' })
  fileName?: string;
  @Expose({ name: 'file_size' })
  fileSize?: string;
  @Expose({ name: 'created_at' })
  createdAt!: Date | null;
  @Expose({ name: 'updated_at' })
  updatedAt!: Date | null;
}
