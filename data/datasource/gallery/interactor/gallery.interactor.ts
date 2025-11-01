import { galleryRepository } from "../repository/gallery.repository";

export const galleryInteractor = {
  async getGalleryList() {
    const galleries = await galleryRepository.getGalleryList();
    return galleries;
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
      .filter((item) => item.id !== currentId && item.images && item.images.length > 0)
      .slice(0, limit);
  },
};