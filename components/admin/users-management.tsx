"use client"

import { useState } from "react"
import { Edit2, Trash2, Lock, Unlock } from "lucide-react"

export default function UsersManagement() {
  const [users] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0123456789",
      role: "Admin",
      status: "Hoạt động",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0987654321",
      role: "Người dùng",
      status: "Hoạt động",
      joinDate: "2024-02-20",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0912345678",
      role: "Người dùng",
      status: "Khóa",
      joinDate: "2024-03-10",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Tên</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Điện thoại</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Vai trò</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Ngày tham gia</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        user.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        user.status === "Hoạt động" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(user.joinDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Edit2 size={18} className="text-accent" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        {user.status === "Hoạt động" ? (
                          <Lock size={18} className="text-orange-600" />
                        ) : (
                          <Unlock size={18} className="text-green-600" />
                        )}
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
