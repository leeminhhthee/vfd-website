"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function GalleryPagination({ currentPage, totalPages, onPageChange }: GalleryPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center gap-4 py-16">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                currentPage === page ? "bg-primary text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}
