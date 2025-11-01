"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

// Dữ liệu giả lập cho các tab và ảnh
const photoTabs = [
  { label: "Các đội tuyển quốc gia", slug: "nam" },
  { label: "Giải Quốc gia", slug: "quoc-gia" },
  { label: "Đội tuyển Trẻ", slug: "tre" },
  { label: "Hoạt động Cộng đồng", slug: "cong-dong" },
]

// Dữ liệu ảnh giả lập (Sử dụng đường dẫn bạn cung cấp)
const mockImages = [
  { id: 1, url: "/photos/volleyball-team-photo.jpg", alt: "Đội tuyển Quốc gia", tag: "nam" },
  { id: 2, url: "/photos/volleyball-event.jpg", alt: "Giải Vô địch Quốc gia", tag: "quoc-gia" },
  { id: 3, url: "/photos/volleyball-female-team.jpg", alt: "Đội tuyển Trẻ thi đấu", tag: "tre" },
  { id: 4, url: "/photos/volleyball-international-match.jpg", alt: "Giải Quốc tế lớn", tag: "nam" },
  { id: 5, url: "/photos/volleyball-league.jpg", alt: "Khán giả và giải đấu", tag: "quoc-gia" },
  { id: 6, url: "/photos/volleyball-match.jpg", alt: "Hoạt động cộng đồng", tag: "cong-dong" },
  { id: 7, url: "/photos/volleyball-team-photo.jpg", alt: "Hoạt động tại bãi biển", tag: "cong-dong" },
  { id: 8, url: "/photos/volleyball-team.jpg", alt: "Ăn mừng chiến thắng", tag: "tre" },
]

// LOẠI BỎ logic gridLayouts phức tạp vì đã chuyển sang lưới đồng nhất

export default function PhotoGalleryTeaser() {
  const [activeTab, setActiveTab] = useState(photoTabs[0].slug)

  // Lọc ảnh theo tab đang hoạt động (HIỂN THỊ TỐI ĐA 8 ẢNH)
  const filteredImages = mockImages.filter(img => img.tag === activeTab).slice(0, 8)

  return (
    <section className="w-full md:py-18 bg-white font-body">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Header Section: Tiêu đề, Tabs và Nút Xem thêm */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end px-4 pt-10">
          
          {/* Tiêu đề lớn (Giống bố cục ảnh) */}
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            {/* Thanh màu xanh đậm */}
            <div className="absolute top-0 left-0 h-full w-full bg-primary -skew-x-12 origin-top-left shadow-lg transform -translate-x-10"></div>
            
            <h2 className="relative z-10 text-xl md:text-2xl font-extrabold text-white uppercase p-4 pl-10 tracking-wider">
              Thư viện ảnh
            </h2>
          </div>

          {/* Navigation Tabs */}
          <div className="flex-1 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium uppercase text-gray-700 justify-start md:justify-end">
            {photoTabs.map(tab => (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`py-2 px-2 transition-colors duration-200 border-b-2 
                  ${activeTab === tab.slug 
                    ? 'text-primary border-primary font-bold' 
                    : 'text-gray-500 border-transparent hover:text-primary'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Nút Xem thêm - CHỈ HIỂN THỊ TRÊN DESKTOP */}
          <Link
            href="/gallery"
            className="hidden md:flex absolute top-10 right-4 md:relative md:top-0 ml-6 px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg items-center gap-1 transition-colors shadow-md"
          >
            XEM THÊM <ArrowRight size={16} />
          </Link>
        </div>

        {/* --- Photo Grid mới: Lưới đồng nhất 2x4 trên Desktop --- */}
        <div className="p-4 mt-8">
            <div 
                // Grid 2 cột trên Mobile, 4 cột trên Desktop
                className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-500 ease-in-out`}
            >
                {filteredImages.length > 0 ? (
                    filteredImages.map((photo) => {
                        return (
                            <div 
                                key={photo.id} 
                                // Thiết lập tỷ lệ 4:3 (h-48) hoặc aspect-video để ảnh có chiều cao đồng nhất
                                className={`
                                    relative w-full aspect-[4/3] h-auto overflow-hidden rounded-xl shadow-lg group cursor-pointer 
                                    col-span-1 
                                `}
                            >
                                <Image
                                    src={photo.url}
                                    alt={photo.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 50vw, 25vw"
                                />
                                {/* Overlay thông tin */}
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-end p-4">
                                    <span className="text-white text-sm font-semibold transition-opacity">
                                        {photo.alt}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-full py-10 text-center text-gray-500">
                        Hiện chưa có ảnh cho mục này.
                    </div>
                )}
            </div>
        </div>

        {/* Nút XEM THÊM - CHỈ HIỂN THỊ TRÊN MOBILE */}
        <div className="text-center mt-8 md:hidden px-4">
             <Link
                href="/gallery"
                className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-md"
            >
                XEM THÊM TẤT CẢ <ArrowRight size={20} />
            </Link>
        </div>
        
      </div>
    </section>
  )
}
