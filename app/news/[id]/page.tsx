"use client";

import { trans } from "@/app/generated/AppLocalization";
import UserLayout from "@/components/layouts/user-layout";
import NewsDetailContent from "@/components/pages/news-detail-content";
import NewsRelated from "@/components/pages/news-related";
import { newsInteractor } from "@/data/datasource/news/interactor/news.interactor";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function NewsDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10);

  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news", id],
    queryFn: () => newsInteractor.getNewsById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-center">{trans.loading}</p>
      </div>
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
        <NewsDetailContent newsId={id} />
        <div className="mt-16 border-t border-border pt-12">
          <NewsRelated currentNewsId={id} />
        </div>
      </div>
    </UserLayout>
  );
}
