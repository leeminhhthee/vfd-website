import { Expose } from "class-transformer";

export class GalleryAlbum {
  @Expose({ name: "id" })
  id!: number;
  @Expose({ name: "category" })
  category!: string;
  @Expose({ name: "title" })
  title!: string;
  @Expose({ name: "images" })
  images!: string[];
  @Expose({ name: "created_at" })
  createdAt!: Date | null;
}