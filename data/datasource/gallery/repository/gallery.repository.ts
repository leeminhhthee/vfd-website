import { plainToInstance } from "class-transformer";
import galleryMock from "../../../mockup/gallery.json";
import { GalleryAlbum } from "../../../model/gallery.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const galleryRepository = {
  async getGalleryList(): Promise<GalleryAlbum[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return plainToInstance(GalleryAlbum, galleryMock);
    }

    const response = await api.get<GalleryAlbum[]>("/gallery");
    return plainToInstance(GalleryAlbum, response.data);
  },

  async getGalleryById(id: number): Promise<GalleryAlbum | undefined> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const item = plainToInstance(GalleryAlbum, galleryMock.find((item) => item.id === id));
      return item;
    }

    try {
      const response = await api.get<GalleryAlbum>(`/gallery/${id}`);
      return plainToInstance(GalleryAlbum, response.data);
    } catch (error) {
      return undefined;
    }
  },

  async createGallery(data: Partial<GalleryAlbum>) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      console.log("Mock Create Gallery:", data);
      return plainToInstance(GalleryAlbum, { id: Date.now(), ...data });
    }

    const response = await api.post<GalleryAlbum>("/gallery", data);
    return plainToInstance(GalleryAlbum, response.data);
  },

  async updateGallery(id: number, data: Partial<GalleryAlbum>) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      console.log("Mock Update Gallery:", id, data);
      return plainToInstance(GalleryAlbum, { id, ...data });
    }

    const response = await api.put<GalleryAlbum>(`/gallery/${id}`, data);
    return plainToInstance(GalleryAlbum, response.data);
  },

  async deleteGallery(id: number) {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      console.log("Mock Delete Gallery:", id);
      return true;
    }

    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  }
};