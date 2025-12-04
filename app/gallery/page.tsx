"use client";

import UserLayout from "@/components/layouts/user-layout";
import GalleryGrid from "@/components/pages/gallery/gallery-grid";
import GalleryHeader from "@/components/pages/gallery/gallery-header";
import GalleryPagination from "@/components/pages/gallery/gallery-pagination";
import GalleryTabs from "@/components/pages/gallery/gallery-tabs";
import {
  GalleryCategory,
  GalleryCategoryLabels,
} from "@/data/constants/constants";
import { galleryInteractor } from "@/data/datasource/gallery/interactor/gallery.interactor";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { trans } from "../generated/AppLocalization";

const ITEMS_PER_PAGE = 8;
const SESSION_TAB_KEY = "gallery_current_tab";
const SESSION_PAGE_KEY = "gallery_current_page";

const GALLERY_CATEGORIES = Object.entries(GalleryCategoryLabels).map(
  ([id, label]) => ({
    id,
    label,
  })
);

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState(() => {
    // Load từ sessionStorage khi component mount
    if (typeof window !== "undefined") {
      const savedTab = sessionStorage.getItem(SESSION_TAB_KEY);
      return savedTab
        ? (savedTab as GalleryCategory)
        : GalleryCategory.TOURNAMENT;
    }
    return GalleryCategory.TOURNAMENT;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    // Load từ sessionStorage khi component mount
    if (typeof window !== "undefined") {
      const savedPage = sessionStorage.getItem(SESSION_PAGE_KEY);
      return savedPage ? parseInt(savedPage) : 1;
    }
    return 1;
  });

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

  // Lưu vào sessionStorage mỗi khi currentPage thay đổi
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_PAGE_KEY, currentPage.toString());
    }
  }, [currentPage]);

  // Lưu vào sessionStorage mỗi khi activeCategory thay đổi
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_TAB_KEY, activeCategory);
    }
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId as GalleryCategory);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-lg text-gray-500">{trans.loading}</p>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-lg text-red-500">{trans.loadingImageError}</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-white">
        <GalleryHeader
          title={trans.photoGallery.toUpperCase()}
          categories={GALLERY_CATEGORIES}
        />
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
