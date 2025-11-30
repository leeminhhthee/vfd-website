"use client";

import DashboardStats from "@/components/admin/dashboard-stats";
import MemberGrowthChart from "@/components/admin/member-growth-chart";
import QuickActions from "@/components/admin/quick-actions";
import RecentActivity from "@/components/admin/recent-activity";
import TournamentStatusChart from "@/components/admin/tournament-status-chart";
import AdminLayout from "@/components/layouts/admin-layout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6 w-full overflow-x-hidden">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Chào mừng quay lại, Admin!
          </p>
        </div>

        <DashboardStats />

        <QuickActions />

        {/* SỬA LỖI Ở ĐÂY:
           - Bỏ bg-white, border, shadow, p-4 (vì component con đã có sẵn).
           - Bỏ thẻ <h3> tiêu đề thừa (component con đã có tiêu đề riêng).
           - Giữ lại min-w-0 để tránh lỗi vỡ layout của Chart.
        */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="w-full min-w-0">
            <MemberGrowthChart />
          </div>

          <div className="w-full min-w-0">
            <TournamentStatusChart />
          </div>
        </div>

        <RecentActivity />
      </div>
    </AdminLayout>
  );
}
