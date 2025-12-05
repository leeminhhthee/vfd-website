import { Expose, Type } from 'class-transformer';
import 'reflect-metadata';
import { AuthData } from './auth.model';

export class DocumentItem {
  @Expose({ name: 'id' })
  id!: string;
  @Expose({ name: 'title' })
  title!: string;
  @Expose({ name: 'category' })
  category!: string;
  @Expose({ name: 'fileUrl' })
  fileUrl!: string;
  @Expose({ name: 'fileName' })
  fileName?: string;
  @Expose({ name: 'fileType' })
  fileType?: string;
  @Expose({ name: 'fileSize' })
  fileSize?: number;
  @Expose({ name: 'createdAt' })
  createdAt!: Date;
  @Expose({ name: 'updatedAt' })
  updatedAt!: Date;
  @Expose({ name: 'uploadedBy' })
  @Type(() => AuthData)
  uploadedBy!: AuthData;
}
