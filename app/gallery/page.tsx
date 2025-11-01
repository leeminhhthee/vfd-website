"use client";

import UserLayout from "@/components/layouts/user-layout";
import GalleryGrid from "@/components/pages/gallery/gallery-grid";
import GalleryHeader from "@/components/pages/gallery/gallery-header";
import GalleryPagination from "@/components/pages/gallery/gallery-pagination";
import GalleryTabs from "@/components/pages/gallery/gallery-tabs";
import { galleryInteractor } from "@/data/datasource/gallery/interactor/gallery.interactor";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const GALLERY_CATEGORIES = [
  { id: "doi-tuyen", label: "Các đội tuyển" },
  { id: "quoc-gia", label: "Giải quốc gia" },
  { id: "tre", label: "Đội tuyển trẻ" },
  { id: "cong-dong", label: "Hoạt động cộng đồng" },
];

const ITEMS_PER_PAGE = 8;

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("doi-tuyen");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: galleryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["gallery"],
    queryFn: galleryInteractor.getGalleryList,
  });

  // Filter by category
  const filteredImages =
    galleryData?.filter((item) => item.category === activeCategory) || [];

  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedImages = filteredImages.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-lg text-gray-500">Đang tải...</p>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-lg text-red-500">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      </UserLayout>
    );
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
        <GalleryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </UserLayout>
  );
}
