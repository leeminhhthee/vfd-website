"use client";

import { trans } from "@/app/generated/AppLocalization";
import { getNewsTypeLabel } from "@/data/constants/constants";
import { newsInteractor } from "@/data/datasource/news/interactor/news.interactor";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 9;
const SESSION_KEY = "news_current_page";

export default function NewsGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPage = sessionStorage.getItem(SESSION_KEY);
      return savedPage ? parseInt(savedPage) : 1;
    }
    return 1;
  });

  const {
    data: allNews = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news"],
    queryFn: newsInteractor.getNewsListPublished,
  });

  const filteredNews = useMemo(() => {
    return allNews.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allNews, searchTerm]);

  const sortedNews = filteredNews;

  const featuredNews = sortedNews[0];
  const remainingNews = sortedNews.slice(1);

  const sideSidebarNews = useMemo(() => {
    if (!featuredNews) return [];
    return remainingNews
      .filter((item) => item.type === featuredNews.type)
      .slice(0, 6);
  }, [featuredNews, remainingNews]);

  const totalPages = Math.ceil(remainingNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedNews = remainingNews.slice(startIndex, endIndex);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, currentPage.toString());
    }
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <Spin size="large" />
        <span className="text-gray-500 font-medium text-sm ml-5">
          {trans.loading}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {trans.newsLoadingError}
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search
            className="absolute left-4 top-3 text-muted-foreground"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Featured + Sidebar Section */}
      {featuredNews && (
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article - Left */}
          <article className="lg:col-span-2 bg-white rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
            <Image
              src={featuredNews.imageUrl || "/placeholder.svg"}
              alt={featuredNews.title}
              width={800}
              height={384}
              className="w-full h-96 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white bg-primary px-3 py-1 rounded-full">
                  {getNewsTypeLabel(featuredNews.type)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(featuredNews.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {featuredNews.title}
              </h2>
              <p
                className="text-muted-foreground text-base mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: featuredNews.content }}
              />
              <Link
                href={`/news/${featuredNews.id}/${featuredNews.slug}`}
                className="text-accent font-bold hover:text-accent-light transition-colors inline-flex items-center gap-2"
              >
                {trans.readMore}
              </Link>
            </div>
          </article>

          <aside className="space-y-4">
            {sideSidebarNews.length > 0 ? (
              sideSidebarNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}/${item.slug}`}
                  className="flex gap-3 group cursor-pointer"
                >
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {trans.noRelatedNews}
              </p>
            )}
          </aside>
        </div>
      )}

      {/* Remaining News Grid */}
      {paginatedNews.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedNews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
              >
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white bg-primary px-3 py-1 rounded-full">
                      {getNewsTypeLabel(item.type)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  <p
                    className="text-muted-foreground text-sm mb-4 line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                  <Link
                    href={`/news/${item.id}/${item.slug}`}
                    className="text-accent font-bold hover:text-accent-light transition-colors"
                  >
                    {trans.readMore}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-primary text-white font-bold"
                    : "border border-border hover:bg-background"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{trans.noNewsFound}</p>
        </div>
      )}
    </div>
  );
}
