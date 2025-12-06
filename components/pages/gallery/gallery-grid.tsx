"use client";

import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import { GalleryAlbum } from "@/data/model/gallery.model";
import Image from "next/image";
import Link from "next/link";

interface GalleryGridProps {
  images: GalleryAlbum[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  if (!images || images.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500 text-lg">{trans.noPhotosAvailable}</p>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
          >
            {/* Image Container */}
            <Link
              href={`/gallery/${image.id}/${image.slug}`}
              className="block cursor-pointer"
            >
              <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                <Image
                  src={image.imageUrl[0] || ASSETS.svg.placeholder}
                  alt={image.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Caption */}
              <div className="bg-blue-50 p-4">
                <p className="text-sm md:text-base font-semibold text-primary line-clamp-2">
                  {image.title}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
