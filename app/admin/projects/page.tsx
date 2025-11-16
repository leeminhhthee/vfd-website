"use client";

import ProjectsManagement from "@/components/admin/projects-management";
import AdminLayout from "@/components/layouts/admin-layout";

export default function AdminProjectsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý dự án</h1>
          <p className="text-muted-foreground mt-2">
            Tạo, chỉnh sửa và xóa dự án
          </p>
        </div>

        <ProjectsManagement />
      </div>
    </AdminLayout>
  );
}
