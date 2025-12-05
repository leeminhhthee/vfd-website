"use client";

import { trans } from "@/app/generated/AppLocalization";
import UserLayout from "@/components/layouts/user-layout";
import NewsDetailContent from "@/components/pages/news-detail-content";
import NewsRelated from "@/components/pages/news-related";
import { newsInteractor } from "@/data/datasource/news/interactor/news.interactor";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { useParams } from "next/navigation";

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news", slug],
    queryFn: () => newsInteractor.getNewsBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <UserLayout>
        <div className="w-full h-screen flex items-center justify-center bg-slate-50">
          <Spin size="large" />
          <span className="text-gray-500 font-medium text-sm ml-5">
            {trans.loading}
          </span>
        </div>
      </UserLayout>
    );
  }

  if (error || !news) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-center">{trans.newsLoadingError}</p>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsDetailContent newsSlug={slug} />
        <div className="mt-16 border-t border-border pt-12">
          <NewsRelated currentNewsSlug={slug} />
        </div>
      </div>
    </UserLayout>
  );
}
