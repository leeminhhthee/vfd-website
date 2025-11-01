import { ALL_GALLERY_IMAGES } from "./gallery-data"

export interface GalleryAlbum {
  id: number
  category: string
  image: string
  title: string
  images: string[]
}

export function getGalleryItem(id: string): GalleryAlbum | undefined {
  const itemId = Number.parseInt(id)
  return ALL_GALLERY_IMAGES.find((item) => item.id === itemId) as GalleryAlbum
}

export function getRelatedAlbums(currentId: number, limit = 6): GalleryAlbum[] {
  return ALL_GALLERY_IMAGES.filter((item) => item.id !== currentId).slice(0, limit) as GalleryAlbum[]
}
