"use client";

import type React from "react";

import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import { aboutInteractor } from "@/data/datasource/about/interactor/about.interactor";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Spin } from "antd";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function BoardOfDirectors() {
  const {
    data: allDirector = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["directors"],
    queryFn: aboutInteractor.getBoardDirectors,
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected = useMemo(() => {
    if (selectedId !== null) {
      return (
        allDirector.find((d) => d.id === selectedId) || allDirector[0] || null
      );
    }
    return allDirector[0] || null;
  }, [allDirector, selectedId]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScroll(container.scrollWidth > container.clientWidth);
    }
  }, [allDirector]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (allDirector.length <= 3) return;
    setIsDragging(true);
    setDragStart(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - dragStart) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[40vh] flex items-center justify-center">
        <Spin size="large" />
        <span className="text-gray-500 font-medium text-sm ml-5">
          {trans.loading}
        </span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8">{trans.loadingError}</div>;
  }

  if (!selected) {
    return null;
  }

  return (
    <section className="bg-blue-50 py-8 md:py-10">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Title */}
        <h2 className="text-lg md:text-2xl font-bold uppercase text-center text-blue-700 mb-6 md:mb-8 leading-tight">
          {trans.boardDirectorsVFD}
        </h2>

        {/* Detail Section - Compact Layout */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-5 items-start">
            {/* Image with Avatar - Use Avatar for fixed dimensions */}
            <div className="flex justify-center md:justify-start">
              <Avatar
                size={300}
                src={selected.imageUrl || ASSETS.logo.vfd_logo}
                alt={`Ảnh ${selected.fullName}`}
                shape="square"
                className="rounded-md shadow-sm"
              />
            </div>

            {/* Info */}
            <div className="md:pl-2">
              <p className="text-base md:text-lg font-bold text-foreground">
                {trans.mrMs} {selected.fullName}
              </p>
              <p className="text-sm md:text-base text-blue-600 font-semibold mb-3">
                {selected.role} {selected.term ? `• ${selected.term}` : ""}
              </p>

              {/* Email and Phone Section */}
              {(selected.email || selected.phoneNumber) && (
                <div className="flex flex-col gap-2 mb-3 text-xs md:text-sm">
                  {selected.email && (
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <Mail size={16} className="flex-shrink-0" />
                      {selected.email}
                    </a>
                  )}
                  {selected.phoneNumber && (
                    <a
                      href={`tel:${selected.phoneNumber}`}
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <Phone size={16} className="flex-shrink-0" />
                      {selected.phoneNumber}
                    </a>
                  )}
                </div>
              )}

              {/* Bio - Compact scrollable */}
              <div className="max-h-36 md:max-h-40 overflow-y-auto pr-2 space-y-1">
                {(selected.bio
                  ? selected.bio
                      .split("\n")
                      .filter((line) => line.trim() !== "")
                  : ["Đang cập nhật thông tin."]
                ).map((line, idx) => (
                  <p
                    key={idx}
                    className="text-xs md:text-sm text-foreground/85 leading-relaxed"
                  >
                    • {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Section - Scroll Drag */}
        <div className="max-w-4xl mx-auto">
          <style jsx>{`
            .scrollbar-hide {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div className="relative group">
            <div
              ref={scrollContainerRef}
              className={`flex gap-3 overflow-x-auto scroll-smooth ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              } scrollbar-hide`}
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {allDirector.map((leader) => (
                <div
                  key={leader.id}
                  className="flex-shrink-0 w-[calc(33.333%-8px)] m-2"
                >
                  <figure
                    className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md h-full ${
                      selected.id === leader.id
                        ? "ring-2 ring-blue-600 shadow-md"
                        : "hover:ring-1 hover:ring-blue-300"
                    }`}
                    onClick={() => {
                      if (!isDragging) {
                        setSelectedId(leader.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setSelectedId(leader.id);
                    }}
                  >
                    <Image
                      src={leader.imageUrl || ASSETS.logo.vfd_logo}
                      width={320}
                      height={180}
                      alt={`Ảnh ${leader.fullName}`}
                      className="w-full h-36 md:h-40 object-cover"
                      draggable={false}
                    />
                    <figcaption className="p-3 bg-white">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {leader.fullName}
                      </p>
                      <p className="text-xs text-foreground/70 line-clamp-2">
                        {leader.role}
                      </p>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>

            {canScroll && allDirector.length > 3 && (
              <div className="absolute right-0 top-0 bottom-0 w-12  from-blue-50 to-transparent pointer-events-none" />
            )}
          </div>
          {allDirector.length > 3 && (
            <p className="text-xs text-center text-foreground/60 mt-2 md:mt-3">Kéo ngang để xem</p>
          )}
        </div>
      </div>
    </section>
  );
}
