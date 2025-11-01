"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Sample news data - replace with API call later
const newsDatabase = [
  {
    id: "1",
    title:
      'Lãnh đạo LDBC TPDN trao Kỷ niệm chương "Vì sự nghiệp Bóng chuyền Việt Nam" cho các cá nhân có nhiều đóng góp với BBVN',
    excerpt:
      "Ngày 9/10 tại Sân vận động Bình Dương (TP.HCM), trong không khí sôi động của trận đấu giữa Đội tuyển Bóng chuyền Việt Nam gặp U Nepal...",
    content: `Ngày 9/10, tại Sân vận động Bình Dương (TP.HCM), trong không khí sôi động của trận đấu giữa Đội tuyển Bóng chuyền Việt Nam gặp U Nepal (thuộc vòng loại Asian Cup 2027), ông Trần Quốc Tuấn – Ủy viên Ủy ban Tín đạo cấp đối tuyển quốc gia của FIFA, Ủy viên Ban Thường vụ Liên đoàn Bóng chuyền châu Á (AFC), Chủ tịch Liên đoàn Bóng chuyền Việt Nam (LDBC TPDN) đã trao Kỷ niệm chương "Vì sự nghiệp Bóng chuyền Việt Nam" cho các cá nhân: ông Nguyễn Văn Hùng – Chủ tịch Tập đoàn Becamex, ông Vũ Đức Thành – nguyên Chủ tịch LBĐD tỉnh Bình Dương, và ông Cao Văn Chóng – Phó Giám đốc Sở Văn hóa và Thể thao TP.HCM.

Đây là hoạt động ý nghĩa nhằm ghi nhận và biểu dương những cá nhân có nhiều đóng góp quan trọng cho sự phát triển của bóng chuyền Việt Nam. Những phần thưởng này không chỉ là sự công nhận cá nhân mà còn là động lực để tiếp tục phát triển bóng chuyền ở các cấp độ khác nhau.

Liên đoàn Bóng chuyền Việt Nam cam kết sẽ tiếp tục nỗ lực để phát triển bóng chuyền Việt Nam đạt những thành tựu cao hơn trong tương lai.`,
    date: "2024-10-25",
    category: "Sự kiện",
    image: "/news/afc-awards-ceremony-celebration-asia.jpg",
    source: "Baochinhphu.vn",
    views: 2540,
  },
  {
    id: "2",
    title: "Hội thảo Cấp phép CLB bóng chuyền chuyên nghiệp Việt Nam 2025: Nên tăng cho sự phát triển bền vững",
    excerpt:
      "Chiều 8/10, Hội thảo Cấp phép câu lạc bộ bóng chuyền chuyên nghiệp Việt Nam 2025 đã khép lại sau một ngày làm việc tích cực và hiệu quả.",
    content:
      "Chiều 8/10, Hội thảo Cấp phép câu lạc bộ bóng chuyền chuyên nghiệp Việt Nam 2025 đã khép lại sau một ngày làm việc tích cực và hiệu quả. Các đại biểu đã thảo luận sâu rộng về các tiêu chí cấp phép, yêu cầu tài chính, và các điều kiện để các câu lạc bộ có thể phát triển bền vững...",
    date: "2024-10-20",
    category: "Hội thảo",
    image: "/news/afc-chairman-statement-volleyball-community.jpg",
    source: "Baochinhphu.vn",
    views: 1890,
  },
  {
    id: "3",
    title: "Bế giảng Hội thảo Đào tạo Bóng chuyền trẻ Nhật Bản – Việt Nam năm 2025",
    excerpt:
      "Sáng 8/10/2025, tại trụ sở Liên đoàn Bóng chuyền Việt Nam (LDBC TPDN), LDBC TPDN phối hợp với Liên đoàn Bóng chuyền Nhật Bản (JFA)...",
    content:
      "Sáng 8/10/2025, tại trụ sở Liên đoàn Bóng chuyền Việt Nam (LDBC TPDN), LDBC TPDN phối hợp với Liên đoàn Bóng chuyền Nhật Bản (JFA) và Hội động Thể thao Nhật Bản tổ chức Lễ bế giảng Hội thảo Đào tạo Bóng chuyền trẻ Việt Nam năm 2025...",
    date: "2024-10-15",
    category: "Đào tạo",
    image: "/news/afc-conference-meeting-officials.jpg",
    source: "Baochinhphu.vn",
    views: 1560,
  },
  {
    id: "4",
    title: "Tổng Bí thư Tô Lâm dự lễ khởi công xây dựng sân vận động tiền tiên hàng đầu thế giới",
    excerpt:
      "Sáng 19/10, tại Hưng Yên, Bộ Công an tổ chức Lễ khởi công xây dựng Sân vận động PVF có sức chứa 60.000 chỗ ngồi...",
    content:
      "Sáng 19/10, tại Hưng Yên, Bộ Công an tổ chức Lễ khởi công xây dựng Sân vận động PVF có sức chứa 60.000 chỗ ngồi, ứng dụng công nghệ mái vòm hiện đại nhất Việt Nam, tiên tiên hàng đầu thế giới...",
    date: "2024-10-10",
    category: "Công trình",
    image: "/news/stadium-construction-ceremony-inauguration.jpg",
    source: "Baochinhphu.vn",
    views: 3240,
  },
]

interface NewsDetailContentProps {
  newsId: string
}

export default function NewsDetailContent({ newsId }: NewsDetailContentProps) {
  const news = newsDatabase.find((item) => item.id === newsId)
  const [isBookmarked, setIsBookmarked] = useState(false)

  if (!news) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Không tìm thấy bài viết</p>
      </div>
    )
  }

  // Get recent news (excluding current)
  const recentNews = newsDatabase
    .filter((item) => item.id !== newsId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Main Content - Left */}
      <article className="lg:col-span-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Link href="/news" className="hover:text-primary transition-colors">
            Tin tức
          </Link>
          <ChevronRight size={16} />
          <span className="text-foreground font-medium">{news.category}</span>
        </div>

        {/* Article Header */}
        <h1 className="text-4xl font-bold text-primary mb-6 leading-tight">{news.title}</h1>

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{new Date(news.date).toLocaleString("vi-VN")}</span>
            <span>|</span>
            <span>{news.views.toLocaleString("vi-VN")} lượt xem</span>
          </div>
          <span>Nguồn: {news.source}</span>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img src={news.image || "/placeholder.svg"} alt={news.title} className="w-full h-96 object-cover" />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          {news.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-base text-foreground leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Share & Actions */}
        <div className="flex items-center gap-4 py-8 border-t border-border">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              isBookmarked ? "bg-primary text-white border-primary" : "border-border hover:bg-background"
            }`}
          >
            {isBookmarked ? "✓ Đã lưu" : "Lưu bài viết"}
          </button>
          <button className="px-4 py-2 rounded-lg border border-border hover:bg-background transition-colors">
            Chia sẻ
          </button>
        </div>
      </article>

      {/* Sidebar - Right */}
      <aside className="lg:col-span-1">
        {/* Highlight Section */}
        <div className="bg-white border border-border rounded-lg p-6 sticky top-20">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img src="/logo-vfd.png" alt="VFD Logo" className="h-32 w-auto" />
          </div>

          {/* Highlight Title */}
          <h3 className="text-lg font-bold text-primary mb-4">NỘI BẬT</h3>

          {/* Recent News List */}
          <div className="space-y-4">
            {recentNews.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="block group">
                <div className="flex gap-3 mb-3">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(item.date).toLocaleDateString("vi-VN")}
                    </p>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View More Button */}
          <Link
            href="/news"
            className="mt-6 block text-center py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Xem thêm tin tức
          </Link>
        </div>
      </aside>
    </div>
  )
}
