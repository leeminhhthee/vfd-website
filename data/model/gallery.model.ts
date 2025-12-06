import 'reflect-metadata';
import { Expose, Type } from "class-transformer";
import { TournamentItem } from "./tournament.model";

export class GalleryAlbum {
  @Expose({ name: "id" })
  id!: number;
  @Expose({ name: "slug" })
  slug!: string;
  @Expose({ name: "category" })
  category!: string;
  @Expose({ name: "title" })
  title!: string;
  @Expose({ name: "imageUrl" })
  imageUrl!: string[];
  @Expose({ name: "tournament" })
  @Type(() => TournamentItem)
  tournament!: TournamentItem;
  @Expose({ name: "createdAt" })
  createdAt!: Date;
  @Expose({ name: "updatedAt" })
  updatedAt!: Date;
}