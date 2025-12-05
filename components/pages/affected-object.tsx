"use client";

import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import { aboutInteractor } from "@/data/datasource/about/interactor/about.interactor";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import Image from "next/image";

export default function AffectedObjects() {
  const {
    data: allAffectedObjects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["affectedObjects"],
    queryFn: aboutInteractor.getAffectedObject,
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

  if (error) {
    return <div className="text-center py-12">{trans.loadingError}</div>;
  }

  return (
    <section className="py-4 md:py-4 bg-white font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề chính */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary text-center mt-12 mb-8 uppercase font-heading">
          {trans.affectedObjects}
        </h2>

        {/* Lưới 3 cột trên desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allAffectedObjects.map((obj) => (
            <div
              key={obj.id}
              className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl border border-border/50"
            >
              {/* Hình ảnh (Sử dụng tỷ lệ 4:3) */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={obj.imageUrl || ASSETS.svg.placeholder}
                  alt={obj.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Nội dung */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-foreground mb-3 uppercase font-heading">
                  {obj.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow text-justify">
                  {obj.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
