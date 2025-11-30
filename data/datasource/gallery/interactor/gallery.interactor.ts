import { GalleryAlbum } from "@/data/model/gallery.model";
import { galleryRepository } from "../repository/gallery.repository";

export const galleryInteractor = {
  async getGalleryList() {
    const galleries = await galleryRepository.getGalleryList();
    return galleries.sort((a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
    );
  },

  async getGalleryById(id: string) {
    const itemId = Number.parseInt(id, 10);
    if (isNaN(itemId)) return undefined;
    
    const gallery = await galleryRepository.getGalleryById(itemId);
    return gallery;
  },

  async getRelatedAlbums(currentId: number, limit = 6) {
    const galleries = await galleryRepository.getGalleryList();
    return galleries
      .filter((item) => item.id !== currentId && item.images?.length > 0)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime())
      .slice(0, limit);
  },

  async createGallery(data: Partial<GalleryAlbum>) {
    const created = await galleryRepository.createGallery(data);
    return created;
  },

  async updateGallery(id: number, data: Partial<GalleryAlbum>) {
    const updated = await galleryRepository.updateGallery(id, data);
    return updated;
  },

  async deleteGallery(id: number) {
    const result = await galleryRepository.deleteGallery(id);
    return result;
  }
};