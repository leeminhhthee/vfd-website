"use client";

import { trans } from "@/app/generated/AppLocalization";
import {
  GalleryCategory,
  GalleryCategoryLabels,
} from "@/data/constants/constants";
import { galleryInteractor } from "@/data/datasource/gallery/interactor/gallery.interactor";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ITEMS_TO_SHOW = 8;

const photoTabs = Object.entries(GalleryCategoryLabels).map(([id, label]) => ({
  id,
  label,
}));

export default function PhotoGalleryTeaser() {
  const [activeTab, setActiveTab] = useState(GalleryCategory.INSIDE);

  const {
    data: galleryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["gallery"],
    queryFn: galleryInteractor.getGalleryList,
  });

  const filteredImages =
    (galleryData || [])
      .filter((img) => img.category === activeTab)
      .slice(0, ITEMS_TO_SHOW) || [];

  const handleTabChange = (categoryId: string) => {
    setActiveTab(categoryId as GalleryCategory);
  };

  return (
    <section className="w-full md:py-8 bg-white font-body">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end px-4 pt-10">
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <div className="absolute top-0 left-0 h-full w-full bg-primary -skew-x-12 origin-top-left shadow-lg transform -translate-x-10"></div>

            <h2 className="relative z-10 text-xl md:text-2xl font-extrabold text-white uppercase p-4 pl-10 tracking-wider">
              {trans.photoGallery}
            </h2>
          </div>

          {/* Navigation Tabs */}
          <div className="flex-1 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium uppercase text-gray-700 justify-start md:justify-end">
            {photoTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-2 px-2 transition-colors duration-200 border-b-2 
                  ${activeTab === tab.id
                    ? "text-primary border-primary font-bold"
                    : "text-gray-500 border-transparent hover:text-primary"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link
            href="/gallery"
            className="hidden md:flex absolute top-10 right-4 md:relative md:top-0 ml-6 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg items-center gap-1 transition-colors shadow-md"
          >
            {trans.seeMore.toUpperCase()} <ArrowRight size={16} />
          </Link>
        </div>

        {/* --- Photo Grid mới: Lưới đồng nhất 2x4 trên Desktop --- */}
        <div className="p-4 mt-8">
          {isLoading ? (
            <div className="col-span-full py-10 text-center text-gray-500">
              {trans.loading}
            </div>
          ) : error ? (
            <div className="col-span-full py-10 text-center text-red-500">
              {trans.loadingImageError}
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-500 ease-in-out`}
            >
              {filteredImages.length > 0 ? (
                filteredImages.map((photo) => {
                  return (
                    <Link
                      key={photo.id}
                      href={`/gallery/${photo.id}`}
                      className={`
                        relative w-full aspect-[4/3] h-auto overflow-hidden rounded-xl shadow-lg group cursor-pointer 
                        col-span-1 
                      `}
                    >
                      <Image
                        src={photo.images[0]}
                        alt={photo.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-end p-4">
                        <span
                          className="text-white text-sm font-semibold transition-opacity line-clamp-2"
                          >
                          {photo.title}
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full py-10 text-center text-gray-500">
                  {trans.noPhotosAvailable}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-8 mb-4 md:hidden px-4">
          <Link
            href="/gallery"
            className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-md"
          >
            {trans.seeAll.toUpperCase()} <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
