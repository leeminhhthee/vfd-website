"use client";

import LogsManagement from "@/components/admin/logs/logs-management";
import AdminLayout from "@/components/layouts/admin-layout";

export default function ActivityLogsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Nhật ký hoạt động
          </h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi các thay đổi và tác động vào hệ thống
          </p>
        </div>

        <LogsManagement />
      </div>
    </AdminLayout>
  );
}
