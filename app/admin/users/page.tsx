import AdminLayout from "@/components/layouts/admin-layout"
import UsersManagement from "@/components/admin/users-management"

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý người dùng</h1>
          <p className="text-muted-foreground mt-2">Xem, chỉnh sửa và quản lý tài khoản người dùng</p>
        </div>

        <UsersManagement />
      </div>
    </AdminLayout>
  )
}
