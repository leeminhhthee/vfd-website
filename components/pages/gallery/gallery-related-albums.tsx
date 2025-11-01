"use client";

import { GalleryAlbum } from "@/data/model/gallery.model";
import Image from "next/image";
import Link from "next/link";

interface GalleryRelatedAlbumsProps {
  albums: GalleryAlbum[];
}

export default function GalleryRelatedAlbums({
  albums,
}: GalleryRelatedAlbumsProps) {
  return (
    <div className="sticky top-20 space-y-4">
      {/* Related Albums */}
      <div className="space-y-4">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/gallery/${album.id}`}
            className="block group cursor-pointer border rounded-lg transition-colors"
          >
            <div className="relative h-32 rounded-t-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
              <Image
                src={album.images[0] || "/placeholder.svg?height=128&width=200"}
                alt={album.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors m-2">
              {album.title}
            </p>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <Link
        href="/gallery"
        className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        Xem tất cả ảnh
      </Link>
    </div>
  );
}
