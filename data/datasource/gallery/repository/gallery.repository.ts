import galleryMock from "../../../mockup/gallery.json";
import { GalleryAlbum } from "../../../model/gallery.model";
import { api } from "../../../remote/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const galleryRepository = {
  async getGalleryList(): Promise<GalleryAlbum[]> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return galleryMock;
    }

    const response = await api.get<GalleryAlbum[]>("/gallery");
    return response.data;
  },

  async getGalleryById(id: number): Promise<GalleryAlbum | undefined> {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const item = galleryMock.find((item) => item.id === id);
      return item;
    }

    try {
      const response = await api.get<GalleryAlbum>(`/gallery/${id}`);
      return response.data;
    } catch (error) {
      return undefined;
    }
  },
};
