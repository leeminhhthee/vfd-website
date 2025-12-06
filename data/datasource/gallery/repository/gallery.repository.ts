import { api } from "@/app/api/api";
import { plainToInstance } from "class-transformer";
import { GalleryAlbum } from "../../../model/gallery.model";

// const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const API_BASE = "/galleries";

type GalleryAlbumPayload = Omit<Partial<GalleryAlbum>, 'tournament'> & {
  tournament?: number;
};

export const galleryRepository = {
  async getGalleryList(): Promise<GalleryAlbum[]> {
    const response = await api.get<GalleryAlbum[]>(`${API_BASE}`);
    return plainToInstance(GalleryAlbum, response.data);
  },

  async getGalleryById(id: number): Promise<GalleryAlbum | undefined> {
    try {
      const response = await api.get<GalleryAlbum>(`${API_BASE}/${id}`);
      return plainToInstance(GalleryAlbum, response.data);
    } catch (error) {
      return undefined;
    }
  },

  async createGallery(data: GalleryAlbumPayload) {
    const response = await api.post<GalleryAlbum>(`${API_BASE}`, data, {
      timeout: 60000,
    });
    return plainToInstance(GalleryAlbum, response.data);
  },

  async updateGallery(id: number, data: GalleryAlbumPayload) {
    const response = await api.patch<GalleryAlbum>(`${API_BASE}/${id}`, data, {
      timeout: 60000,
    });
    return plainToInstance(GalleryAlbum, response.data);
  },

  async deleteGallery(id: number) {
    const response = await api.delete(`${API_BASE}/${id}`);
    return response.data;
  }
};