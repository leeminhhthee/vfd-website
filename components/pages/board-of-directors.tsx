"use client";

import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import { aboutInteractor } from "@/data/datasource/about/interactor/about.interactor";
import { BoardDirectorItem } from "@/data/model/about.model";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";

export default function BoardOfDirectors() {
  const {
    data: allDirector = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["directors"],
    queryFn: aboutInteractor.getBoardDirectors,
  });

  // Leader được chọn để hiển thị ở khối trên
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Tính toán selected từ allDirector và selectedId
  const selected = useMemo(() => {
    if (selectedId !== null) {
      return (
        allDirector.find((d) => d.id === selectedId) || allDirector[0] || null
      );
    }
    return allDirector[0] || null;
  }, [allDirector, selectedId]);

  // Trang hóa carousel (4 thẻ/trang) — an toàn với React Compiler
  const pages = useMemo(() => chunk(allDirector, 4), [allDirector]);
  const [page, setPage] = useState(0);

  // Ref để cuộn mượt tới khối chi tiết khi chọn từ carousel
  const detailRef = useRef<HTMLDivElement>(null);
  const showDetail = (leader: BoardDirectorItem) => {
    setSelectedId(leader.id);
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
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

  if (!selected) {
    return null;
  }

  return (
    <section className="bg-blue-50">
      {/* Khối chi tiết/"Chủ tịch hiện tại" */}
      <div
        ref={detailRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10"
      >
        <h2 className="text-xl md:text-2xl font-extrabold uppercase text-center text-blue-700 mb-8 leading-tight">
          {trans.boardDirectorsVFD}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:gap-8 items-start">
          <div>
            <p className="text-base md:text-lg font-semibold text-foreground mb-1">
              {trans.mrMs} {selected.name}
            </p>
            <p className="text-sm md:text-base text-foreground/80 mb-3">
              {selected.role} {selected.term ? `• ${selected.term}` : ""}{" "}
              {selected.note ? `• ${selected.note}` : ""}
            </p>

            {/* giới hạn chiều cao để không tràn màn hình */}
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-foreground/90 max-h-48 md:max-h-56 overflow-y-auto pr-1">
              {(selected.bio?.length
                ? selected.bio
                : ["Đang cập nhật thông tin."]
              ).map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="order-first md:order-last flex justify-end items-end">
            <Image
              src={selected.imageUrl || ASSETS.svg.placeholder}
              width={300}
              height={320}
              alt={`Ảnh ${selected.name}`}
              className="w-[500px] h-[200px] md:h-80 object-cover rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Carousel các lãnh đạo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-10">
        <div className="relative overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${page * 100}%)` }}
            aria-live="polite"
          >
            {pages.map((group, idx) => (
              <div key={idx} className="min-w-full py-4 px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {group.map((leader) => (
                    <figure
                      key={leader.id}
                      className={`bg-white rounded-lg shadow-sm p-3 text-center cursor-pointer transition
                        hover:shadow-md ${
                          selected.id === leader.id
                            ? "ring-2 ring-blue-600"
                            : ""
                        }`}
                      onClick={() => showDetail(leader)}
                      aria-pressed={selected.id === leader.id}
                    >
                      <Image
                        src={leader.imageUrl || ASSETS.svg.placeholder}
                        width={360}
                        height={200}
                        alt={`Ảnh ${leader.name}`}
                        className="w-full h-60 md:h-48 object-cover rounded-md mb-3"
                      />
                      <figcaption>
                        <p className="text-xs md:text-sm text-foreground">
                          {trans.mrMs}{" "}
                          <span className="font-semibold">{leader.name}</span>
                        </p>
                        <p className="text-xs md:text-sm text-foreground/80">
                          {leader.role}
                        </p>
                        {leader.term && (
                          <p className="text-xs text-foreground/70">
                            {leader.term}
                          </p>
                        )}
                        {leader.note && (
                          <p className="text-xs text-foreground/60">
                            {leader.note}
                          </p>
                        )}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Điều hướng trang */}
          <div className="flex items-center justify-center gap-2.5 mt-4">
            {pages.map((_, i) => (
              <button
                key={i}
                aria-label={`Trang ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  page === i ? "bg-blue-600" : "bg-blue-300 hover:bg-blue-400"
                }`}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Utilities
function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}
