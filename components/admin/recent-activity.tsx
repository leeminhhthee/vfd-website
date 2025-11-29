"use client"

export default function RecentActivity() {
  const activities = [
    { id: 1, action: "Tạo tin tức mới", user: "Admin", time: "2 giờ trước" },
    { id: 2, action: "Duyệt đơn đăng ký", user: "Admin", time: "4 giờ trước" },
    { id: 3, action: "Cập nhật lịch thi đấu", user: "Admin", time: "1 ngày trước" },
  ]

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Hoạt động gần đây</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between pb-4 border-b border-border last:border-b-0"
          >
            <div>
              <p className="font-medium text-foreground">{activity.action}</p>
              <p className="text-sm text-muted-foreground">{activity.user}</p>
            </div>
            <p className="text-sm text-muted-foreground">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
