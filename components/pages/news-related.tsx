"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

// Sample related news data
const relatedNewsDatabase = [
  {
    id: "2",
    title: "Hội thảo Cấp phép CLB bóng chuyền chuyên nghiệp Việt Nam 2025: Nên tăng cho sự phát triển bền vững",
    date: "2024-10-20",
    category: "Hội thảo",
  },
  {
    id: "3",
    title: "Bế giảng Hội thảo Đào tạo Bóng chuyền trẻ Nhật Bản – Việt Nam năm 2025",
    date: "2024-10-15",
    category: "Đào tạo",
  },
  {
    id: "4",
    title: "Tổng Bí thư Tô Lâm dự lễ khởi công xây dựng sân vận động tiền tiên hàng đầu thế giới",
    date: "2024-10-10",
    category: "Công trình",
  },
  {
    id: "5",
    title: "LBĐD Việt Nam tham dự Hội thảo Chủ tịch & Tổng Thư ký các Liên đoàn thành viên AFC 2025",
    date: "2024-10-08",
    category: "Quốc tế",
  },
  {
    id: "6",
    title: 'Dỡ Hoàng Hẻn: "Tôi khao khát được góp hiến cho bóng chuyền Việt Nam"',
    date: "2024-10-05",
    category: "Phỏng vấn",
  },
]

interface NewsRelatedProps {
  currentNewsId: string
}

export default function NewsRelated({ currentNewsId }: NewsRelatedProps) {
  const related = relatedNewsDatabase.filter((item) => item.id !== currentNewsId)

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-8">Tin liên quan</h2>

      <div className="space-y-4">
        {related.map((item) => (
          <Link key={item.id} href={`/news/${item.id}`} className="group">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-background transition-colors">
              {/* Arrow Icon */}
              <ChevronRight
                size={20}
                className="text-primary flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-white bg-primary px-2 py-1 rounded">{item.category}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString("vi-VN")}
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
  )
}
