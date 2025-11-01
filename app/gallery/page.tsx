"use client"

import UserLayout from "@/components/layouts/user-layout"
import GalleryGrid from "@/components/pages/gallery/gallery-grid"
import GalleryHeader from "@/components/pages/gallery/gallery-header"
import GalleryPagination from "@/components/pages/gallery/gallery-pagination"
import GalleryTabs from "@/components/pages/gallery/gallery-tabs"
import { ALL_GALLERY_IMAGES, GALLERY_CATEGORIES, ITEMS_PER_PAGE } from "@/lib/gallery-data"
import { useState } from "react"

export default function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState("doi-tuyen")
    const [currentPage, setCurrentPage] = useState(1)

    const filteredImages = ALL_GALLERY_IMAGES.filter((image) => image.category === activeCategory)

    const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedImages = filteredImages.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handleCategoryChange = (categoryId: string) => {
        setActiveCategory(categoryId)
        setCurrentPage(1)
    }

    return (
        <UserLayout>
            <div className="min-h-screen bg-white">
                <GalleryHeader title="THƯ VIỆN ẢNH" categories={GALLERY_CATEGORIES} />
                <GalleryTabs
                    categories={GALLERY_CATEGORIES}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                />
                <GalleryGrid images={paginatedImages} />
                <GalleryPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </UserLayout>
    )
}
