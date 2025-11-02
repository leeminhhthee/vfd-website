"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import { trans } from "@/app/generated/AppLocalization"

interface GalleryDetailSliderProps {
  images: string[]
  title: string
}

export default function GalleryDetailSlider({ images, title }: GalleryDetailSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="space-y-6">
      {/* Main Image Container */}
      <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
        <div className="relative w-full aspect-video">
          <Image
            src={images[currentIndex] || "/placeholder.svg?height=600&width=900&query=gallery"}
            alt={`${title} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all z-10"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full transition-all z-10"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden transition-all border-2 ${
              index === currentIndex ? "border-primary shadow-lg" : "border-gray-300 hover:border-primary"
            }`}
          >
            <Image
              src={image || "/placeholder.svg?height=80&width=80"}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Share Button */}
      <div className="flex gap-3 pt-4 border-t">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Share2 size={18} />
          {trans.share}
        </button>
      </div>
    </div>
  )
}
