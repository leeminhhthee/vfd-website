"use client";

import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import { getNewsTypeLabel } from "@/data/constants/constants";
import { newsInteractor } from "@/data/datasource/news/interactor/news.interactor";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface NewsDetailContentProps {
  newsId: number;
}

export default function NewsDetailContent({ newsId }: NewsDetailContentProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news", newsId],
    queryFn: () => newsInteractor.getNewsById(newsId),
    enabled: !!newsId,
  });

  const { data: allNews = [] } = useQuery({
    queryKey: ["news"],
    queryFn: newsInteractor.getNewsList,
  });

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

  if (error || !news) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{trans.loadingError}.</p>
      </div>
    );
  }

  // Get recent news (excluding current)
  const recentNews = allNews.filter((item) => item.id !== newsId).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content - Left */}
      <article className="lg:col-span-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Link href="/news" className="hover:text-primary transition-colors">
            {trans.news}
          </Link>
          <ChevronRight size={16} />
          <span className="text-foreground font-medium">
            {getNewsTypeLabel(news.type)}
          </span>
        </div>

        {/* Article Header */}
        <h1 className="text-4xl font-bold text-primary mb-6 leading-tight">
          {news.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{new Date(news.createdAt).toLocaleString("vi-VN")}</span>
          </div>
          <span>{trans.source}: VFD</span>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <Image
            src={news.imageUrl || "/placeholder.svg"}
            alt={news.title}
            className="w-full h-auto object-cover"
            width={1920}
            height={1080}
          />
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none mb-8 text-justify"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Share & Actions */}
        <div className="flex items-center gap-4 py-8 border-t border-border">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isBookmarked
                ? "bg-primary text-white border-primary"
                : "border-border hover:bg-background"
            }`}
          >
            {isBookmarked ? trans.bookMarked : trans.saveArticle}
          </button>
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-background transition-colors">
            {trans.share}
          </button>
        </div>
      </article>

      {/* Sidebar - Right */}
      <aside className="lg:col-span-1">
        {/* Highlight Section */}
        <div className="bg-white border border-border rounded-lg p-6 sticky top-20">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Image
              src={ASSETS.logo.vfd_logo}
              alt="VFD Logo"
              className="h-32 w-auto"
              width={512}
              height={512}
            />
          </div>

          {/* Highlight Title */}
          <h3 className="text-lg font-bold text-primary mb-4">
            {trans.featured.toUpperCase()}
          </h3>

          {/* Recent News List */}
          <div className="space-y-4">
            {recentNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="block group"
              >
                <div className="flex gap-3 mb-3">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:opacity-80 transition-opacity"
                    width={64}
                    height={64}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View More Button */}
          <Link
            href="/news"
            className="mt-6 block text-center py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            {trans.seeAll}
          </Link>
        </div>
      </aside>
    </div>
  );
}
