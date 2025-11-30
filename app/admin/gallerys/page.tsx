"use client";

import GallerysManagement from "@/components/admin/gallerys/gallerys-management";
import AdminLayout from "@/components/layouts/admin-layout";

export default function AdminGallerysPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý hình ảnh
          </h1>
          <p className="text-muted-foreground mt-2">
            Tải lên, chỉnh sửa và xóa hình ảnh
          </p>
        </div>

        <GallerysManagement />
      </div>
    </AdminLayout>
  );
}
