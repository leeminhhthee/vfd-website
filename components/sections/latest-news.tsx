"use client";
import { trans } from "@/app/generated/AppLocalization";
import { newsInteractor } from "@/data/datasource/news/interactor/news.interactor";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LatestNews() {
  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latestNews"],
    queryFn: newsInteractor.getNewsListForHome,
  });

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="w-full h-screen flex items-center justify-center bg-slate-50">
          <Spin size="large" />
          <span className="text-gray-500 font-medium text-sm ml-5">
            {trans.loading}
          </span>
        </div>
      </section>
    );
  }

  if (error || !news || news.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">{trans.newsLoadingError}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-3xl font-black text-foreground mb-2 uppercase">
              {trans.latestNews}
            </h2>
            <p className="text-muted-foreground">
              {trans.updateNewFromFederation}
            </p>
          </div>
          <Link
            href="/news"
            className="hidden md:flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all hover:underline"
          >
            {trans.viewAll} <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-48 object-cover"
                priority={true}
                width={500}
                height={500}
                quality={100}
              />
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p
                  className="text-muted-foreground text-sm mb-4 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                <Link
                  href={`/news/${item.slug}`}
                  className="text-accent font-bold hover:text-accent-light transition-colors"
                >
                  {trans.readMore}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all hover:underline"
          >
            {trans.viewAll} <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
