import { GalleryAlbum } from "@/data/model/gallery.model";
import { galleryRepository } from "../repository/gallery.repository";

type GalleryAlbumPayload = Omit<Partial<GalleryAlbum>, 'tournament'> & {
  tournament?: number;
};

export const galleryInteractor = {
  async getGalleryList() {
    const galleries = await galleryRepository.getGalleryList();
    return galleries.sort((a, b) =>
      new Date(b.createdAt || 0).getTime() -
      new Date(a.createdAt || 0).getTime()
    );
  },

  async getGalleryById(id: number) {
    const gallery = await galleryRepository.getGalleryById(id);
    return gallery;
  },

  async getRelatedAlbums(currentId: number, limit = 6) {
    const galleries = await galleryRepository.getGalleryList();
    return galleries
      .filter((item) => item.id !== currentId && item.imageUrl?.length > 0)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime())
      .slice(0, limit);
  },

  async createGallery(data: GalleryAlbumPayload) {
    const created = await galleryRepository.createGallery(data);
    return created;
  },

  async updateGallery(id: number, data: GalleryAlbumPayload) {
    const updated = await galleryRepository.updateGallery(id, data);
    return updated;
  },

  async deleteGallery(id: number) {
    const result = await galleryRepository.deleteGallery(id);
    return result;
  }
};