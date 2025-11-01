"use client"

import Image from "next/image"
import Link from "next/link"

interface GalleryImage {
  id: number
  category: string
  image: string
  title: string
}

interface GalleryGridProps {
  images: GalleryImage[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  if (!images || images.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500 text-lg">
          Danh mục này hiện tại chưa có ảnh.
        </p>
      </div>
    )
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
            <Link href={`/gallery/${image.id}`} className="block cursor-pointer">
              <div className="relative w-full h-64 bg-gray-200 overflow-hidden">
                <Image
                  src={image.image || "/placeholder.svg?height=256&width=256"}
                  alt={image.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Caption */}
              <div className="bg-blue-50 p-4">
                <p className="text-sm md:text-base font-semibold text-primary line-clamp-2">{image.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
