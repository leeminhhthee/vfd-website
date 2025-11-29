import { Expose } from 'class-transformer';

export class DocumentItem {
  @Expose({ name: 'id' })
  id!: string;
  @Expose({ name: 'title' })
  title!: string;
  @Expose({ name: 'category' })
  category!: string;
  @Expose({ name: 'size' })
  size!: number;
  @Expose({ name: 'doc_url' })
  docUrl!: string;
  @Expose({ name: 'created_at' })
  createdAt!: Date | null;
  @Expose({ name: 'updated_at' })
  updatedAt!: Date | null;
}
