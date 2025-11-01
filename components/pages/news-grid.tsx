"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 6

export default function NewsGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const allNews = [
    {
      id: 1,
      title:
        "Lãnh đạo LDBĐVN trao Kỷ niệm chương 'Vì sự nghiệp Bóng chuyền Việt Nam' cho các cá nhân có nhiều đóng góp với BBVN",
      excerpt:
        "Ngày 9/10 tại Sân vận động Bình Dương (TP.HCM), trong không khí sôi động của trận đấu giữa Đội tuyển Bóng chuyền Việt Nam gặp U Nepal...",
      date: "2024-10-25",
      category: "Sự kiện",
      image: "/news/volleyball-team-ceremony-award.jpg",
    },
    {
      id: 2,
      title: "Hội thảo Cấp phép CLB bóng chuyền chuyên nghiệp Việt Nam 2025: Nên tăng cho sự phát triển bền vững",
      excerpt:
        "Chiều 8/10, Hội thảo Cấp phép câu lạc bộ bóng chuyền chuyên nghiệp Việt Nam 2025 đã khép lại sau một ngày làm việc tích cực và hiệu quả...",
      date: "2024-10-20",
      category: "Hội thảo",
      image: "/news/conference-seminar-discussion-volleyball.jpg",
    },
    {
      id: 3,
      title: "Bế giảng Hội thảo Đào tạo Bóng chuyền trẻ Nhật Bản – Việt Nam năm 2025",
      excerpt:
        "Sáng 8/10/2025, tại trụ sở Liên đoàn Bóng chuyền Việt Nam (LDBĐVN), LDBĐVN phối hợp với Liên đoàn Bóng chuyền Nhật Bản (JFA)...",
      date: "2024-10-15",
      category: "Đào tạo",
      image: "/news/training-youth-volleyball-ceremony.jpg",
    },
    {
      id: 4,
      title: "Tổng Bí thư Tô Lâm dự lễ khởi công xây dựng sân vận động tiền tiên hàng đầu thế giới",
      excerpt:
        "Sáng 19/10, tại Hưng Yên, Bộ Công an tổ chức Lễ khởi công xây dựng Sân vận động PVF có sức chứa 60.000 chỗ ngồi...",
      date: "2024-10-10",
      category: "Công trình",
      image: "/news/stadium-construction-ceremony-inauguration.jpg",
    },
    {
      id: 5,
      title: "LBĐD Việt Nam tham dự Hội thảo Chủ tịch & Tổng Thư ký các Liên đoàn thành viên AFC 2025",
      excerpt:
        "Liên đoàn Bóng chuyền Việt Nam tham dự hội thảo chủ tịch và tổng thư ký các liên đoàn thành viên AFC 2025...",
      date: "2024-10-08",
      category: "Quốc tế",
      image: "/news/afc-conference-meeting-officials.jpg",
    },
    {
      id: 6,
      title: "Dỡ Hoàng Hẻn: 'Tôi khao khát được góp hiến cho bóng chuyền Việt Nam'",
      excerpt: "Tân Giám đốc kỹ thuật Dỡ Hoàng Hẻn chia sẻ về tầm nhìn phát triển bóng chuyền trẻ Việt Nam...",
      date: "2024-10-05",
      category: "Phỏng vấn",
      image: "/news/official-volleyball-director-interview.jpg",
    },
    {
      id: 7,
      title: "AFC Awards 2025: Đêm vinh danh các cá nhân và tập thể xuất sắc của bóng chuyền châu Á",
      excerpt: "Giải thưởng AFC 2025 ghi nhận những cống hiến xuất sắc của các cầu thủ, huấn luyện viên...",
      date: "2024-10-02",
      category: "Giải thưởng",
      image: "/news/afc-awards-ceremony-celebration-asia.jpg",
    },
    {
      id: 8,
      title: "Chủ tịch AFC kháng định sức mạnh của bóng chuyền trong việc truyền cảm hứng và gắn kết",
      excerpt: "Chủ tịch AFC nhấn mạnh vai trò quan trọng của bóng chuyền trong xây dựng cộng đồng...",
      date: "2024-09-28",
      category: "Tin tức",
      image: "/news/afc-chairman-statement-volleyball-community.jpg",
    },
    {
      id: 9,
      title: "Chuyên gia bóng chuyền quốc tế chia sẻ kinh nghiệm phát triển tài năng trẻ",
      excerpt: "Hội thảo về phát triển tài năng trẻ trong bóng chuyền với sự tham gia của các chuyên gia quốc tế...",
      date: "2024-09-25",
      category: "Đào tạo",
      image: "/news/volleyball-academy-youth-training-expert.jpg",
    },
  ]

  // Filter news by search term
  const filteredNews = allNews.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort by date (newest first)
  const sortedNews = [...filteredNews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Split into featured (first) and remaining news
  const featuredNews = sortedNews[0]
  const remainingNews = sortedNews.slice(1)

  // Paginate remaining news
  const totalPages = Math.ceil(remainingNews.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedNews = remainingNews.slice(startIndex, endIndex)

  // Get 4 items next to featured (first 4 after featured)
  const sideSidebarNews = remainingNews.slice(0, 4)

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
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Featured + Sidebar Section */}
      {featuredNews && (
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Article - Left */}
          <article className="lg:col-span-2 bg-white rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
            <img
              src={featuredNews.image || "/placeholder.svg"}
              alt={featuredNews.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white bg-primary px-3 py-1 rounded-full">
                  {featuredNews.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(featuredNews.date).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{featuredNews.title}</h2>
              <p className="text-muted-foreground text-base mb-4 line-clamp-3">{featuredNews.excerpt}</p>
              <Link
                href={`/news/${featuredNews.id}`}
                className="text-accent font-bold hover:text-accent-light transition-colors inline-flex items-center gap-2"
              >
                Đọc thêm →
              </Link>
            </div>
          </article>

          <aside className="space-y-4">
            {sideSidebarNews.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="flex gap-3 group cursor-pointer">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0 group-hover:opacity-80 transition-opacity"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString("vi-VN")}</p>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </aside>
        </div>
      )}

      {/* Remaining News Grid */}
      {paginatedNews.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedNews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
              >
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white bg-primary px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString("vi-VN")}
                    </span>
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
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentPage === page ? "bg-primary text-white font-bold" : "border border-border hover:bg-background"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Không tìm thấy tin tức nào</p>
        </div>
      )}
    </div>
  )
}
