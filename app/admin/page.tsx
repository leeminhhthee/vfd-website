import AdminLayout from "@/components/layouts/admin-layout"
import DashboardStats from "@/components/admin/dashboard-stats"
import RecentActivity from "@/components/admin/recent-activity"
import QuickActions from "@/components/admin/quick-actions"
import MemberGrowthChart from "@/components/admin/member-growth-chart"
import TournamentStatusChart from "@/components/admin/tournament-status-chart"

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Chào mừng quay lại, Admin!</p>
        </div>

        <DashboardStats />

        <QuickActions />

        {/* chart, chia làm 2 cột, mỗi cột 1 biểu đồ */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="w-full">
            <MemberGrowthChart />
          </div>
          <div className="w-full">
            <TournamentStatusChart />
          </div>
        </div>

        <RecentActivity />
      </div>
    </AdminLayout>
  )
}
