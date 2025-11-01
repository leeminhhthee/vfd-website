import AdminLayout from "@/components/layouts/admin-layout"
import DocumentsManagement from "@/components/admin/documents-management"

export default function AdminDocumentsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý tài liệu</h1>
          <p className="text-muted-foreground mt-2">Tải lên, chỉnh sửa và xóa tài liệu</p>
        </div>

        <DocumentsManagement />
      </div>
    </AdminLayout>
  )
}
