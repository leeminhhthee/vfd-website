"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

export default function NewsGrid() {
  const [searchTerm, setSearchTerm] = useState("")

  const allNews = [
    {
      id: 1,
      title: "Giải vô địch bóng chuyền TP Đà Nẵng 2024",
      excerpt: "Kết quả chung kết giải vô địch bóng chuyền TP Đà Nẵng năm 2024...",
      date: "2024-10-25",
      category: "Giải đấu",
      image: "/volleyball-tournament.jpg",
    },
    {
      id: 2,
      title: "Đội tuyển Đà Nẵng vô địch giải quốc gia",
      excerpt: "Đội tuyển bóng chuyền Đà Nẵng giành chiến thắng tại giải quốc gia...",
      date: "2024-10-20",
      category: "Thành tích",
      image: "/volleyball-team.jpg",
    },
    {
      id: 3,
      title: "Khai mạc giải bóng chuyền trẻ toàn quốc",
      excerpt: "Giải bóng chuyền trẻ toàn quốc 2024 chính thức khai mạc tại Đà Nẵng...",
      date: "2024-10-15",
      category: "Sự kiện",
      image: "/youth-volleyball.jpg",
    },
    {
      id: 4,
      title: "Tuyển dụng huấn luyện viên bóng chuyền",
      excerpt: "Liên đoàn tuyển dụng huấn luyện viên có kinh nghiệm...",
      date: "2024-10-10",
      category: "Tuyển dụng",
      image: "/placeholder.svg?key=abc123",
    },
  ]

  const filteredNews = allNews.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-3 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
          >
            <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white bg-primary px-3 py-1 rounded-full">{item.category}</span>
                <span className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString("vi-VN")}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.excerpt}</p>
              <Link
                href={`/news/${item.id}`}
                className="text-accent font-bold hover:text-accent-light transition-colors"
              >
                Đọc thêm →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Không tìm thấy tin tức nào</p>
        </div>
      )}
    </div>
  )
}
