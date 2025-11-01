import AdminLayout from "@/components/layouts/admin-layout"
import DashboardStats from "@/components/admin/dashboard-stats"
import RecentActivity from "@/components/admin/recent-activity"

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Chào mừng quay lại, Admin!</p>
        </div>

        <DashboardStats />
        <RecentActivity />
      </div>
    </AdminLayout>
  )
}
