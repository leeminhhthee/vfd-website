"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from 'next/image'

export default function LatestNews() {
  const news = [
    {
      id: 1,
      title: "Giải vô địch bóng chuyền TP Đà Nẵng 2024",
      excerpt: "Kết quả chung kết giải vô địch bóng chuyền TP Đà Nẵng năm 2024...",
      date: "2024-10-25",
      image: "/volleyball-tournament.jpg",
    },
    {
      id: 2,
      title: "Đội tuyển Đà Nẵng vô địch giải quốc gia",
      excerpt: "Đội tuyển bóng chuyền Đà Nẵng giành chiến thắng tại giải quốc gia...",
      date: "2024-10-20",
      image: "/volleyball-team.jpg",
    },
    {
      id: 3,
      title: "Khai mạc giải bóng chuyền trẻ toàn quốc",
      excerpt: "Giải bóng chuyền trẻ toàn quốc 2024 chính thức khai mạc tại Đà Nẵng...",
      date: "2024-10-15",
      image: "/youth-volleyball.jpg",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-3xl font-black text-foreground mb-2 uppercase">Tin tức mới nhất</h2>
            <p className="text-muted-foreground">Cập nhật những thông tin mới nhất từ Liên đoàn</p>
          </div>
          <Link
            href="/news"
            className="hidden md:flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all hover:underline"
          >
            Xem tất cả <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <article key={item.id} className="bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <Image
                src={item.image || '/placeholder.svg'}
                alt={item.title}
                className="w-full h-48 object-cover"
                priority={true} // Ensure the image loads quickly
                width={500} // Set the desired width for the image
                height={500} // Set the desired height for the image
                quality={100} // Set the desired image quality (0-100)
              />
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">{new Date(item.date).toLocaleDateString("vi-VN")}</p>
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

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all hover:underline"
          >
            Xem tất cả <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
