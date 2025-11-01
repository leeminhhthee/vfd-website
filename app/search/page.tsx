import UserLayout from "@/components/layouts/user-layout"
import SmartSearch from "@/components/features/smart-search"

export default function SearchPage() {
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Tìm kiếm thông minh</h1>
          <p className="text-lg text-muted-foreground">
            Sử dụng AI để tìm kiếm tin tức, tài liệu và thông tin một cách nhanh chóng
          </p>
        </div>

        <SmartSearch />
      </div>
    </UserLayout>
  )
}
