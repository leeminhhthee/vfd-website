"use client"

import { useParams } from "next/navigation"
import UserLayout from "@/components/layouts/user-layout"
import GalleryDetailSlider from "@/components/pages/gallery/gallery-detail-slider"
import GalleryRelatedAlbums from "@/components/pages/gallery/gallery-related-albums"
import { getGalleryItem, getRelatedAlbums } from "@/lib/gallery-utils"
import Link from "next/link"

export default function GalleryDetailPage() {
  const params = useParams()
  const id = (params?.id as string) ?? ""

  const album = id ? getGalleryItem(id) : undefined
  const relatedAlbums = id ? getRelatedAlbums(Number.parseInt(id, 10), 4) : []

  if (!album) {
    return (
      <UserLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">Album không tìm thấy</h1>
            <Link href="/gallery" className="text-accent hover:underline">
              Quay lại thư viện ảnh
            </Link>
          </div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b">
          <Link href="/gallery" className="text-accent hover:text-primary transition-colors">
            Thư viện ảnh
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700 font-medium">{album.title}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-12">{album.title}</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GalleryDetailSlider images={album.images || [album.image]} title={album.title} />
            </div>
            <div>
              <GalleryRelatedAlbums albums={relatedAlbums} />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}