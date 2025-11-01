import UserLayout from "@/components/layouts/user-layout"
import NewsGrid from "@/components/pages/news-grid"

export default function NewsPage() {
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase text-foreground mb-4">Tin tức</h1>
          <p className="text-lg text-muted-foreground">
            Cập nhật những thông tin mới nhất từ Liên đoàn Bóng chuyền TP Đà Nẵng
          </p>
        </div>

        <NewsGrid />
      </div>
    </UserLayout>
  )
}
