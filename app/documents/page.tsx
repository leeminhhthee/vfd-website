import UserLayout from "@/components/layouts/user-layout"
import DocumentsList from "@/components/pages/documents-list"

export default function DocumentsPage() {
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Tài liệu</h1>
          <p className="text-lg text-muted-foreground">Các tài liệu, quy định và hướng dẫn từ Liên đoàn</p>
        </div>

        <DocumentsList />
      </div>
    </UserLayout>
  )
}
