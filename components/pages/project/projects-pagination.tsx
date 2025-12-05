"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProjectsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProjectsPaginationProps) {
  if (totalPages <= 1) return null;

  // Tính toán page hiển thị (chỉ hiển thị 5 trang)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // Số trang hiển thị mỗi bên

    if (totalPages <= 7) {
      // Nếu ít hơn 7 trang, hiển thị tất cả
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Luôn hiển thị trang đầu
    pages.push(1);

    // Tính toán vùng hiển thị xung quanh trang hiện tại
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Thêm dấu ... nếu cần
    if (start > 2) pages.push("...");

    // Thêm các trang ở giữa
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Thêm dấu ... nếu cần
    if (end < totalPages - 1) pages.push("...");

    // Luôn hiển thị trang cuối
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-white border border-border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        aria-label="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "bg-white border border-border hover:bg-gray-50 text-foreground"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 text-muted-foreground">
              {page}
            </span>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-white border border-border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
        aria-label="Trang tiếp theo"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
