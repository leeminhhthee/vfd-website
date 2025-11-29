"use client";

import RegistrationsManagement from "@/components/admin/registration/registrations-management";
import AdminLayout from "@/components/layouts/admin-layout";

export default function AdminRegistrationsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý đơn đăng ký
          </h1>
          <p className="text-muted-foreground mt-2">
            Duyệt và xét duyệt các đơn đăng ký giải đấu
          </p>
        </div>

        <RegistrationsManagement />
      </div>
    </AdminLayout>
  );
}
