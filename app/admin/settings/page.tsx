import AdminLayout from "@/components/layouts/admin-layout"
import SettingsManagement from "@/components/admin/settings-management"

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cài đặt</h1>
          <p className="text-muted-foreground mt-2">Quản lý cài đặt website và thông tin liên hệ</p>
        </div>

        <SettingsManagement />
      </div>
    </AdminLayout>
  )
}
