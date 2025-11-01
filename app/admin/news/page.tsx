import AdminLayout from "@/components/layouts/admin-layout"
import NewsManagement from "@/components/admin/news-management"

export default function AdminNewsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý tin tức</h1>
          <p className="text-muted-foreground mt-2">Tạo, chỉnh sửa và xóa tin tức</p>
        </div>

        <NewsManagement />
      </div>
    </AdminLayout>
  )
}
