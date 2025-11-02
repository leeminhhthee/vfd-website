"use client";

import { trans } from "@/app/generated/AppLocalization";
import { newsInteractor } from "@/data/datasource/news/interactor/news.interactor";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface NewsRelatedProps {
  currentNewsId: number;
}

export default function NewsRelated({ currentNewsId }: NewsRelatedProps) {
  const { data: currentNews } = useQuery({
    queryKey: ["news", currentNewsId],
    queryFn: () => newsInteractor.getNewsById(currentNewsId),
    enabled: !!currentNewsId,
  });

  const { data: allNews = [], isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: newsInteractor.getNewsList,
  });

  const relatedNews = useMemo(() => {
    if (!currentNews) return [];

    return allNews
      .filter(
        (item) => item.id !== currentNewsId && item.type === currentNews.type
      )
      .slice(0, 5);
  }, [allNews, currentNewsId, currentNews]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{trans.loading}.</p>
      </div>
    );
  }

  if (relatedNews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{trans.noRelatedNews}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-8">{trans.relatedNews}</h2>

      <div className="space-y-6">
        {relatedNews.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`} className="group block">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-background transition-colors">
              {/* Arrow Icon */}
              <ChevronRight
                size={20}
                className="text-primary flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-white bg-primary px-2 py-1 rounded">
                    {item.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
