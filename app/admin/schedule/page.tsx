import AdminLayout from "@/components/layouts/admin-layout"
import ScheduleManagement from "@/components/admin/schedule-management"

export default function AdminSchedulePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý lịch thi đấu</h1>
          <p className="text-muted-foreground mt-2">Tạo, chỉnh sửa và xóa lịch thi đấu</p>
        </div>

        <ScheduleManagement />
      </div>
    </AdminLayout>
  )
}
