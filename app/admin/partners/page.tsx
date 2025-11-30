"use client";

import PartnersManagement from "@/components/admin/partners/partners-management";
import AdminLayout from "@/components/layouts/admin-layout";

export default function AdminPartnersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý đối tác
          </h1>
          <p className="text-muted-foreground mt-2">
            Thêm, chỉnh sửa và xóa đối tác
          </p>
        </div>

        <PartnersManagement />
      </div>
    </AdminLayout>
  );
}
