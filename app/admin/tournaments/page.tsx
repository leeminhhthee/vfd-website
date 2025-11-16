"use client";

import TournamentsManagement from "@/components/admin/tournaments-management";
import AdminLayout from "@/components/layouts/admin-layout";

export default function AdminTournamentsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý giải đấu
          </h1>
          <p className="text-muted-foreground mt-2">
            Tạo, chỉnh sửa và quản lý các giải đấu
          </p>
        </div>

        <TournamentsManagement />
      </div>
    </AdminLayout>
  );
}
